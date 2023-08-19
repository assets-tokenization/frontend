import React from 'react';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AceEditor from 'react-ace';
import ReactResizeDetector from 'react-resize-detector';
import SplitPane from 'react-split-pane';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import {
  Dialog,
  Toolbar,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import evaluate from 'helpers/evaluate';
import { setCheckHiddenFunc } from 'actions/debugTools';
import propertiesEach from 'components/JsonSchema/helpers/propertiesEach';

const styles = {
  root: {
    display: 'flex',
    height: '100%',
    '& > div': {
      flex: '.5',
    },
  },
  rightContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    paddingLeft: 2,
  },
  funcContainer: {
    flex: 1,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    minHeight: 40,
  },
  iconButton: {
    width: 26,
    height: 26,
    padding: 1,
  },
};

const editorOptions = {
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
  showLineNumbers: true,
  tabSize: 4,
};

const CheckHiddenFunction = ({ t, classes, customInterface }) => {
  const [controls, setControls] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [element, setElement] = React.useState(null);
  const [func, setFunc] = React.useState(false);

  const aceComponentInput = React.useRef(null);
  const aceComponentOutput = React.useRef(null);
  const aceComponentOriginData = React.useRef(null);

  React.useEffect(() => {
    const getControls = () => {
      const controlsArray = [];

      if (!customInterface) return;

      propertiesEach(
        customInterface.schema,
        customInterface.data,
        (schema, data, path, parentSchema, parentData, key) => {
          if (!key) return;

          if (schema.hidden) {
            controlsArray.push({
              schema,
              data,
              path,
              parentSchema,
              parentData,
              funcType: 'hidden',
              key: `${key} - hidden`,
            });
          }
          if (schema.checkRequired) {
            controlsArray.push({
              schema,
              data,
              path,
              parentSchema,
              parentData,
              funcType: 'checkRequired',
              key: `${key} - checkRequired`,
            });
          }
        }
      );

      setControls(controlsArray);
    };

    getControls();
  }, [customInterface]);

  if (!customInterface) return null;

  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  const onResize = () => {
    aceComponentInput.current.editor.resize();
    aceComponentOutput.current.editor.resize();
    aceComponentOriginData.current.editor.resize();
  };

  const handleSelectControl = ({ target: { value } }) => {
    const chosenControl = controls.find(({ key }) => key === value);

    setElement(chosenControl);

    if (chosenControl.funcType === 'hidden') {
      setFunc(chosenControl.schema.hidden);
    } else {
      setFunc(chosenControl.schema.checkRequired);
    }
  };

  const handleCheckFunc = () => {
    if (!func) return '';

    let result = '';

    switch (element?.funcType) {
      case 'hidden': {
        result = evaluate(
          func,
          customInterface?.data,
          element?.data,
          element?.parentValue
        );
        break;
      }
      case 'checkRequired': {
        result = evaluate(
          func,
          element?.data,
          customInterface?.data,
          customInterface?.data,
          element?.parentValue
        );
        break;
      }
      default: {
        result = evaluate(func, customInterface?.data);
        break;
      }
    }

    if (result instanceof Error) {
      return result.message;
    }

    return result;
  };

  const renderControls = () => {
    if (!controls.length) return null;

    return (
      <FormControl variant="standard" fullWidth={true}>
        <InputLabel>{t('SelectElement')}</InputLabel>
        <Select
          variant="standard"
          value={element?.key || ''}
          onChange={handleSelectControl}
        >
          {controls.map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {[item.key, item.schema.description].filter(Boolean).join(' - ')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <div className={classes.root}>
      <SplitPane split="vertical" minSize="50%">
        <AceEditor
          ref={aceComponentOriginData}
          mode="json"
          theme="twilight"
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={JSON.stringify(customInterface?.data, null, 4)}
          width="100%"
          height="100%"
          readOnly={true}
          setOptions={editorOptions}
        />
        <div className={classes.rightContainer}>
          <ReactResizeDetector handleHeight={true} onResize={onResize} />
          <div className={classes.funcContainer}>
            {renderControls()}

            {t('Function')}
            <IconButton
              onClick={openModal}
              className={classes.iconButton}
              size="large"
            >
              <FullscreenIcon />
            </IconButton>
            <AceEditor
              ref={aceComponentInput}
              mode="javascript"
              theme="twilight"
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={func || ''}
              width="100%"
              height="calc(100% - 24px)"
              readOnly={false}
              onChange={setFunc}
              wrapEnabled={true}
              setOptions={editorOptions}
            />
          </div>
          <div className={classes.funcContainer}>
            {t('Result')}
            <AceEditor
              ref={aceComponentOutput}
              mode="json"
              theme="twilight"
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={JSON.stringify(handleCheckFunc(), null, 4)}
              width="100%"
              height="calc(100% - 18px)"
              readOnly={false}
              setOptions={editorOptions}
            />
          </div>
        </div>
      </SplitPane>
      <Dialog open={open} fullScreen={true} fullWidth={true}>
        <Toolbar className={classes.toolbar}>
          <IconButton onClick={closeModal} size="large">
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <AceEditor
          mode="javascript"
          theme="twilight"
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={func || ''}
          width="100%"
          height="calc(100% - 18px)"
          readOnly={false}
          onChange={setFunc}
          wrapEnabled={true}
          setOptions={editorOptions}
        />
      </Dialog>
    </div>
  );
};

const mapStateToProps = ({
  debugTools: { checkHiddenFuncs, customInterface },
}) => ({
  checkHiddenFuncs,
  customInterface,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    setCheckHiddenFunc: bindActionCreators(setCheckHiddenFunc, dispatch),
  },
});

const styled = withStyles(styles)(CheckHiddenFunction);
const translated = translate('DebugTools')(styled);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
