/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import objectPath from 'object-path';
import { Dialog, Toolbar, Paper, ListItem, IconButton, Typography, Tabs, Tab } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import FunctionEditor from 'components/JsonSchema/editor/components/ElementDesktop/components/CodeEditor/components/FunctionEditor';
import useSelection from 'components/JsonSchema/editor/components/ElementDesktop/components/CodeEditor/hooks/useSelection';
import SplitPane from 'react-split-pane';
import AceEditor from 'react-ace';
import highlightCyrillic from 'components/CodeEditDialog/helpers/highlightCyrillic';
import useJson5Validator from 'components/CodeEditDialog/hooks/useJson5Validator';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-twilight';
import HTMLEditor from './editors/HTMLEditor';

export const defaultHtml = (defaultHtmlValue) =>
  defaultHtmlValue
    ? `<!DOCTYPE html>
<html lang="uk">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <style>
      body {
        font-size: 12px;
        margin: 0;
        font-family: 'e-Ukraine', Arial, Helvetica, sans-serif;
        line-height: 1;
        padding-right: 20px;
        padding-left: 20px;
        letter-spacing: -0.02em;
      }
      @font-face {
        font-family: uaFontReg;
        src: url(https://my.diia.gov.ua/fonts/e-Ukraine-Regular.woff);
      }
    </style>
  </head>
  <body style="font-family: uaFontReg">
    
  </body>
</html>`
    : '';

const styles = (theme) => ({
  header: {
    padding: 0,
    backgroundColor: '#232323',
    minHeight: 32
  },
  title: {
    flexGrow: 1,
    color: '#E2E2E2',
    padding: '0 10px'
  },
  button: {
    color: '#E2E2E2!important'
  },
  dialog: {
    display: 'flex',
    '& .ace_editor': {
      flex: 1
    }
  },
  paper: {
    position: 'fixed',
    background: '#fff',
    zIndex: 1000,
    maxHeight: 300,
    overflow: 'auto'
  },
  editor: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  tabs: {
    backgroundColor: '#232323',
    margin: 0
  },
  tab: {
    color: '#fff'
  },
  codeButton: {
    position: 'absolute',
    color: '#ffffff'
  },
  editorContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  suggestText: {
    color: '#fff',
    background: theme?.header?.background,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7
    }
  }
});

const editors = {
  html: HTMLEditor
};

const CodeEditDialog = (props) => {
  const {
    schema,
    t,
    mode,
    classes,
    open,
    onClose,
    description,
    value,
    onChange,
    handleSaveButton,
    readOnly,
    defaultHtmlValue,
    ...rest
  } = props;

  const [showSuggestion, setShowSuggestion] = React.useState([]);
  const [markers, setMarkers] = React.useState([]);
  const [suggest, setSuggest] = React.useState('');
  const [activeEditor, setActiveEditor] = React.useState(0);
  const [functionEditorData, setFunctionEditorData] = React.useState(null);

  const aceRef = React.useRef(null);
  useJson5Validator(aceRef);

  const {
    functionRow,
    functionName,
    functionBody,
    setSelection,
    cursorPosition,
    onFunctionChange,
    saveEditorScrollTop
  } = useSelection(aceRef.current);

  const insertSuggestion = (suggested) => {
    const { editor } = aceRef.current;

    const position = editor.getCursorPosition();

    if (!suggest.length) {
      editor.session.insert(position, suggested);
    } else {
      const { row } = position;

      const rangeProps = {
        wrap: true,
        caseSensitive: true,
        wholeWord: true,
        regExp: false,
        preventScroll: true
      };

      const range = editor.find(suggest, rangeProps);

      range && range.start.row === row && editor.session.replace(range, suggested);
    }
  };

  const loopSuggestions = (suggestOrigin) => {
    const path = suggestOrigin.split('.');
    const lastPosition = path.length - 1;
    const suggest = path[lastPosition];

    const firstLevel = Object.keys(schema?.properties || {}) || [];

    const pathComputed = path
      .filter((el, i) => el.length && i !== path.length - 1)
      .map((el) => el + '.properties')
      .join('.');

    const pathInSchema = objectPath.get(schema?.properties, pathComputed);

    const showSuggestion = (
      path.length === 1 ? firstLevel : Object.keys(pathInSchema || {}) || []
    ).filter((item) => item.indexOf(suggest) !== -1 && suggest !== item);

    setSuggest(suggest);
    setShowSuggestion(showSuggestion);
  };

  const showSuggestionHandler = ({ cursor: { row, column } }) => {
    setShowSuggestion([]);

    const getKeyWordPositions = (string, start, end) => {
      let posStart = string.indexOf(start);
      let posEnd = string.indexOf(end);

      while (posStart >= 0 && posEnd >= 0) {
        if (column >= posStart + start.length && column <= posEnd) {
          const keyWord = string.slice(posStart + 2, posEnd);
          loopSuggestions(keyWord);
        }
        posStart = string.indexOf(start, posStart + 1);
        posEnd = string.indexOf(end, posEnd + 1);
      }
    };

    const { editor } = aceRef.current;
    const line = editor.session.getLine(row);
    getKeyWordPositions(line, '{{', '}}');
  };

  const onCursorChangeHandler = (event) => {
    setSelection(event);
    showSuggestionHandler(event);
  };

  const setDefaultValue = (value, mode) => {
    return (mode === 'html' && !value.length ? defaultHtml(defaultHtmlValue) : value) || '';
  };

  const renderSuggestion = () => {
    if (!showSuggestion.length) return null;

    const { editor } = aceRef.current;

    const { row, column } = editor.getCursorPosition();

    const styles = {
      top: row * 19 + 90,
      left: column * 10 + 40
    };

    return (
      <Paper className={classes.paper} style={styles}>
        {(showSuggestion || []).map((suggest, index) => (
          <ListItem
            key={index}
            onClick={() => insertSuggestion(suggest)}
            className={classes.suggestText}
          >
            <Typography>{suggest}</Typography>
          </ListItem>
        ))}
      </Paper>
    );
  };

  const renderEditorTabs = () => {
    const editor = editors[mode];

    if (!editor) return null;

    return (
      <Tabs
        className={classes.tabs}
        value={activeEditor}
        onChange={(e, newActiveEditor) => setActiveEditor(newActiveEditor)}
      >
        <Tab className={classes.tab} label={t('Code')} />
        <Tab className={classes.tab} label={t('Editor')} />
      </Tabs>
    );
  };

  React.useEffect(() => {
    if (!value) return;

    highlightCyrillic(aceRef, setMarkers);
  }, [value]);

  const Editor = editors[mode];

  const editorContainer = (
    <div className={classes.editorContainer}>
      {renderEditorTabs()}
      {Editor && activeEditor === 1 ? (
        <div className={classes.editor}>
          <Editor value={setDefaultValue(value, mode)} onChange={onChange} />
        </div>
      ) : (
        <AceEditor
          {...rest}
          readOnly={readOnly}
          mode={mode}
          onChange={onChange}
          value={setDefaultValue(value, mode)}
          ref={aceRef}
          theme="twilight"
          enableSnippets={true}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          wrapEnabled={true}
          width="100%"
          height="100%"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 4,
            highlightActiveLine: true
          }}
          onCursorChange={onCursorChangeHandler}
          markers={markers}
        />
      )}
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={true}
      fullWidth={true}
      classes={{ paper: classes.dialog }}
    >
      <Toolbar className={classes.header}>
        <Typography variant="subtitle1" className={classes.title}>
          {description}
        </Typography>

        {handleSaveButton()}

        <IconButton className={classes.button} onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </Toolbar>

      {functionEditorData ? (
        <SplitPane minSize="50%">
          {editorContainer}
          <FunctionEditor
            {...functionEditorData}
            readOnly={readOnly}
            onChange={onFunctionChange}
            onClose={() => {
              saveEditorScrollTop();
              setFunctionEditorData();
            }}
          />
        </SplitPane>
      ) : (
        editorContainer
      )}

      {renderSuggestion()}

      {functionBody ? (
        <IconButton
          className={classes.codeButton}
          onClick={() => {
            saveEditorScrollTop();
            setFunctionEditorData({ functionRow, functionName, functionBody });
          }}
          style={
            cursorPosition && {
              top: cursorPosition.top + (Editor ? 40 : 0),
              left: cursorPosition.left
            }
          }
          size="large"
        >
          <CodeIcon />
        </IconButton>
      ) : null}
    </Dialog>
  );
};

CodeEditDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  value: PropTypes.string,
  description: PropTypes.string,
  mode: PropTypes.string,
  schema: PropTypes.object,
  handleSaveButton: PropTypes.func,
  readOnly: PropTypes.bool,
  defaultHtmlValue: PropTypes.bool
};

CodeEditDialog.defaultProps = {
  open: false,
  onClose: () => null,
  onChange: () => null,
  onValidate: () => null,
  value: '',
  description: '',
  mode: 'json5',
  schema: null,
  handleSaveButton: () => null,
  readOnly: false,
  defaultHtmlValue: true
};

const styled = withStyles(styles)(CodeEditDialog);

export default translate('Elements')(styled);
