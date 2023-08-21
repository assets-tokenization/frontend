import React from 'react';
import AceEditor from 'react-ace';
import { minify } from 'terser';
import beautify from 'js-beautify/js';
import prettifyHtml from 'html-prettify';
import { useTranslate } from 'react-translate';
import { Button, DialogActions, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import useSuggestions from 'components/JsonSchema/editor/components/ElementDesktop/components/CodeEditor/hooks/useSuggestions';

const useStyles = makeStyles({
  root: {
    flex: 1
  },
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#141414'
  },
  title: {
    padding: '10px 10px 10px 24px',
    '& > h2': {
      display: 'flex',
      alignItems: 'center',
      color: '#ffffff'
    }
  },
  closeBtn: {
    color: '#ffffff'
  }
});

const minifyOptions = {
  parse: false,
  compress: false,
  mangle: false,
  ecma: 6,
  enclose: false,
  keep_classnames: true,
  keep_fnames: true,
  ie8: false,
  module: false,
  nameCache: null,
  safari10: false,
  toplevel: false,
  output: { quote_style: 1 }
};

const funcPrefix = 'const func=';

const FunctionEditor = ({
  functionBody,
  functionName,
  functionRow,
  onChange,
  onClose,
  isHtmlEditor,
  readOnly,
  onSchemaChange,
  schemaValue
}) => {
  const t = useTranslate('Elements');
  const classes = useStyles();
  const [value, setValue] = React.useState(beautify(functionBody));
  const [errors, setErrors] = React.useState();
  const aceRef = React.useRef(null);

  const validationErrors = React.useMemo(
    () => errors && errors.filter(({ type }) => !['info', 'warning'].includes(type)),
    [errors]
  );

  const { showSuggestionHandler, Suggester } = useSuggestions({
    aceRef,
    onSchemaChange,
    value: schemaValue
  });

  React.useEffect(() => {
    setValue(isHtmlEditor ? prettifyHtml(functionBody) : beautify(functionBody));
  }, [functionBody, isHtmlEditor]);

  const handleSave = async () => {
    if (validationErrors && validationErrors.length) {
      return;
    }

    if (isHtmlEditor) {
      onChange({
        functionRow,
        functionName,
        functionBody: value.replace(/\n/gm, '')
      });

      onClose();
      return;
    }

    try {
      const { code } = await minify(funcPrefix + value, minifyOptions);
      const beautyfied = beautify(code);
      const minified = beautyfied
        .replace(funcPrefix, '')
        .replace('const func = ', '') // magic
        .replace(/(\r\n|\n|\r|\t)/gm, '')
        .replace(/ {4}/gm, '');

      // onChange(code.replace(funcPrefix, '').replace(/\\u([\d\w]{4})/gi, (m, g) => String.fromCharCode(parseInt(g, 16))));
      onChange({
        functionRow,
        functionName,
        functionBody: minified
      });

      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  const mode = isHtmlEditor ? 'html' : 'javascript';

  return (
    <div className={classes.wrapper}>
      <DialogTitle className={classes.title}>
        {functionName}
        <div style={{ flexGrow: 1 }} />
        <Button className={classes.closeBtn} onClick={onClose}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <AceEditor
        ref={aceRef}
        mode={mode}
        theme="twilight"
        fontSize={14}
        width="100%"
        height="100%"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        wrapEnabled={true}
        value={value || ''}
        onValidate={setErrors}
        onChange={(newValue) => newValue && setValue(newValue)}
        onCursorChange={showSuggestionHandler}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          useSoftTabs: true,
          highlightActiveLine: true
        }}
      />
      <Suggester headerHeight={100} />
      {!readOnly ? (
        <DialogActions>
          <Button className={classes.closeBtn} onClick={onClose}>
            {t('Close')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={validationErrors?.length}
          >
            {t('Save')}
          </Button>
        </DialogActions>
      ) : null}
    </div>
  );
};

export default FunctionEditor;
