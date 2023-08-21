import React from 'react';
import AceEditor from 'react-ace';
import { useDrop } from 'react-dnd';
import { useTranslate } from 'react-translate';
import objectPath from 'object-path';
import { IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SplitPane from 'react-split-pane';
import { withEditor } from 'components/JsonSchema/editor/JsonSchemaProvider';
import ElementIdDialog from 'components/JsonSchema/editor/components/ElementDesktop/components/VisualEditor/components/ElementIdDialog';
import SnippetList from 'components/JsonSchema/editor/components/ElementDesktop/components/CodeEditor/components/SnippetList';
import FunctionEditor from 'components/JsonSchema/editor/components/ElementDesktop/components/CodeEditor/components/FunctionEditor';
import BpmnAi from 'components/JsonSchema/editor/components/ElementDesktop/components/CodeEditor/components/BpmnAi';
import useSelection from 'components/JsonSchema/editor/components/ElementDesktop/components/CodeEditor/hooks/useSelection';
import useSuggestions from 'components/JsonSchema/editor/components/ElementDesktop/components/CodeEditor/hooks/useSuggestions';
import CodeIcon from '@mui/icons-material/Code';
import highlightCyrillic from 'components/CodeEditDialog/helpers/highlightCyrillic';
import highlightReadonlyFields from 'components/CodeEditDialog/helpers/highlightReadonlyFields';
import useJson5Validator from 'components/CodeEditDialog/hooks/useJson5Validator';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-twilight';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex'
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    height: '100%',
    position: 'relative'
  },
  editorContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  button: {
    position: 'absolute',
    color: '#ffffff'
  }
}));

const defaultSchema = (t) => ({
  title: t('taskTitle'),
  pdfRequired: false,
  signRequired: false,
  checkActive: '(documentData) => { return true; }',
  finalScreen: {
    title: t('finalScreenTitle'),
    subtitle: t('finalScreenSubtitle')
  },
  calcTriggers: [],
  properties: {}
});

const CodeEditor = ({ newValue, onSchemaChange, onValidate, handleSave }) => {
  const t = useTranslate('Elements');
  const classes = useStyles();
  const [markers, setMarkers] = React.useState([]);

  const initValue = newValue || JSON.stringify(defaultSchema(t), null, 4);

  const [folds, setFolds] = React.useState(null);
  const [value, setValue] = React.useState(initValue);
  const [functionEditorData, setFunctionEditorData] = React.useState();
  const [newElement, setNewElement] = React.useState(null);

  const aceRef = React.useRef(null);

  const {
    functionRow,
    functionName,
    functionBody,
    setSelection,
    cursorPosition,
    onFunctionChange,
    saveEditorScrollTop
  } = useSelection(aceRef.current);

  const { showSuggestionHandler, Suggester } = useSuggestions({
    aceRef,
    onSchemaChange,
    value,
    folds
  });

  React.useEffect(() => {
    if (!value) return;
    highlightCyrillic(aceRef, setMarkers);
    highlightReadonlyFields(t, aceRef);
  }, [value, t]);

  React.useEffect(() => {
    const { editor } = aceRef.current;

    if (!editor) return;

    editor.commands.addCommand({
      name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
      exec: () => handleSave()
    });
  });

  const updateState = async (controlName) => {
    try {
      const { editor } = aceRef.current;
      const position = editor.getCursorPosition();

      const insertCode = () => {
        const isFunction = newElement.type === 'function';

        const getCode = () => {
          const parsedCode = JSON.parse(newElement.defaultData.data).code;
          if (isFunction) {
            return parsedCode;
          }
          return JSON.parse(parsedCode);
        };
        const code = getCode();

        if (!code) return;

        const stringifiedCode = JSON.stringify(code, null, 4);

        const replacedNewLine = stringifiedCode.replace(/\\n/g, '').replace(/ {4}/g, ' ');

        let insertData = `"${controlName}": ${replacedNewLine}`;

        const prevSymbol = editor.session.getLine(position.row)[position.column - 1];

        const nextSymbol = editor.session.getLine(position.row)[position.column];

        if (prevSymbol === '}') insertData = ',' + insertData;
        if (nextSymbol === '"') insertData = insertData + ',';
        if (prevSymbol === ',') insertData = insertData + ',';
        if (nextSymbol === undefined) insertData = insertData + ',';

        editor.session.insert(position, insertData.replace(/,,/g, ','));
      };

      const insertTriggers = () => {
        const json = JSON.parse(JSON.parse(newElement.defaultData.data).json);

        if (!json) return;

        const schemaValue = JSON.parse(editor.session.getValue());
        const triggers = (schemaValue.calcTriggers || []).concat(json);

        schemaValue.calcTriggers = triggers;

        editor.session.setValue(JSON.stringify(schemaValue, null, 4));
      };

      const insertAddition = () => {
        const innerJson = JSON.parse(JSON.parse(newElement.defaultData.data).innerJson);

        if (!innerJson) return;

        const schemaValue = JSON.parse(editor.session.getValue());

        Object.keys(innerJson).forEach((key) => {
          const prevValue = objectPath.get(schemaValue, key);
          const newValue = innerJson[key];

          if (prevValue) {
            if (Array.isArray(prevValue)) {
              objectPath.set(schemaValue, key, prevValue.concat(newValue));
            } else if (typeof prevValue === 'object') {
              objectPath.set(schemaValue, key, {
                ...prevValue,
                ...newValue
              });
            }
          }
        });

        editor.session.setValue(JSON.stringify(schemaValue, null, 4));
      };

      insertCode();

      insertTriggers();

      insertAddition();

      const droppedState = editor.session.getValue();

      try {
        const parsed = JSON.parse(droppedState);
        editor.session.setValue(JSON.stringify(parsed, null, 4));
        onSchemaChange(parsed);
        folds.forEach(({ start }) => editor.session.$toggleFoldWidget(start.row, {}));
      } catch (e) {
        console.log('parse error', e);
      }
    } catch (e) {
      console.log('parse error', e);
    }
  };

  const onCursorChangeHandler = (event) => {
    setSelection(event);
    showSuggestionHandler(event);
  };

  const [, drop] = useDrop({
    accept: ['function', 'control', 'container'],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop || !monitor.isOver({ shallow: true })) return;
      const { editor } = aceRef.current;
      setFolds(Array.from(editor.session.$foldData) || []);
      setNewElement(item);
    }
  });

  useJson5Validator(aceRef, [value]);

  const editorContainer = (
    <div className={classes.editorContainer}>
      <AceEditor
        ref={aceRef}
        mode="json5"
        theme="twilight"
        fontSize={14}
        width="100%"
        height="100%"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        wrapEnabled={true}
        value={value}
        onValidate={onValidate}
        onChange={(changed) => {
          setValue(changed);
          onSchemaChange(changed);
        }}
        onCursorChange={onCursorChangeHandler}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          useSoftTabs: true,
          highlightActiveLine: true
        }}
        markers={markers}
      />
      {functionBody ? (
        <IconButton
          size="large"
          className={classes.button}
          onClick={() => {
            saveEditorScrollTop();
            setFunctionEditorData({
              functionRow,
              functionName,
              functionBody
            });
          }}
          style={
            cursorPosition && {
              top: cursorPosition.top - 42,
              left: cursorPosition.left + 42
            }
          }
        >
          <CodeIcon />
        </IconButton>
      ) : null}
      <Suggester />
    </div>
  );

  return (
    <div className={classes.root}>
      <SnippetList />
      <div className={classes.wrapper} ref={drop}>
        {functionEditorData ? (
          <SplitPane minSize="50%">
            {editorContainer}
            <FunctionEditor
              {...functionEditorData}
              schemaValue={value}
              classes={classes}
              onChange={onFunctionChange}
              onSchemaChange={onSchemaChange}
              onClose={() => {
                saveEditorScrollTop();
                setFunctionEditorData();
              }}
            />
          </SplitPane>
        ) : (
          editorContainer
        )}
        <ElementIdDialog
          open={!!newElement}
          variant="outlined"
          readOnly={true}
          onClose={() => setNewElement(null)}
          onSave={(elementId) => {
            updateState(elementId);
            setNewElement(null);
          }}
        />
      </div>
      <BpmnAi functionEditorData={functionEditorData} />
    </div>
  );
};

export default withEditor(CodeEditor);
