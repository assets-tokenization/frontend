import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import objectPath from 'object-path';
import { useTranslate } from 'react-translate';
import useRS from 'radioactive-state';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { addMessage } from 'actions/error';
import Message from 'components/Snackbars/Message';
import { IconButton, CircularProgress } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import SaveIcon from '@mui/icons-material/Save';
import config from 'config';
import * as elements from './elements';

const sessionLifeTime = config.sessionLifeTime || 480;

const { Provider, Consumer } = React.createContext();

const styles = {
  root: {
    display: 'flex',
    height: '100%',
    color: '#e2e2e2',
    background: '#232323'
  },
  saveButton: {
    color: '#E2E2E2',
    position: 'absolute',
    right: 50,
    top: 4
  },
  disabled: {
    color: '#E2E2E2!important',
    opacity: 0.3
  },
  progress: {
    color: '#E2E2E2'
  }
};

const initialState = (rootValue) => ({
  rootValue,
  newValue: rootValue,
  editPath: [],
  errors: [],
  selection: []
});

const intervalTimeout = 60000;
let interval = null;

const insertCode = ({ schema, path, element }) => {
  const isFunction = element.type === 'function';

  const getCode = () => {
    const parsedCode = JSON.parse(element.data).code;
    if (isFunction) {
      return parsedCode;
    }
    return JSON.parse(parsedCode);
  };
  const code = getCode();

  if (!code) return schema;

  objectPath.set(schema, path, code);

  return schema;
};

const insertTriggers = ({ schema, element }) => {
  const json = JSON.parse(JSON.parse(element.data).json);

  if (!json) return schema;

  const triggers = (schema.calcTriggers || []).concat(json);

  schema.calcTriggers = triggers;

  return schema;
};

const insertAddition = ({ schema, element }) => {
  const innerJson = JSON.parse(JSON.parse(element.data).innerJson);

  if (!innerJson) return schema;

  Object.keys(innerJson).forEach((key) => {
    const prevValue = objectPath.get(schema, key);
    const newValue = innerJson[key];

    if (prevValue) {
      if (Array.isArray(prevValue)) {
        objectPath.set(schema, key, prevValue.concat(newValue));
      } else if (typeof prevValue === 'object') {
        objectPath.set(schema, key, {
          ...prevValue,
          ...newValue
        });
      }
    }
  });

  return schema;
};

const JsonSchemaProvider = ({
  actions,
  classes,
  children,
  value = {},
  onChange,
  onValidate,
  busy,
  setBusy,
  handleSave
}) => {
  const state = useRS(initialState(value));
  const t = useTranslate('Errors');

  React.useEffect(() => {
    const parsed = jwtDecode(localStorage.getItem('token'));

    interval = setInterval(() => {
      const startTime = moment(parsed.iat * 1000);

      const currentTime = moment().minutes() + moment().hours() * 60;
      const expireTime = startTime.minutes() + startTime.hours() * 60 + sessionLifeTime;
      const diff = expireTime - currentTime;

      if (diff < 5) {
        actions.addMessage(new Message(`${t('TokenExpiring', { diff })}`, 'warning'));
      }
    }, intervalTimeout);

    return () => clearInterval(interval);
  }, [t, actions]);

  const disabled =
    JSON.stringify(state.newValue) === JSON.stringify(state.rootValue) ||
    state.errors.length ||
    busy;

  const getParsedSchema = (schema) => {
    try {
      return JSON.parse(schema);
    } catch (e) {
      return {};
    }
  };

  const providerData = {
    elements,
    errors: state.errors,
    rootValue: state.rootValue,
    newValue: state.newValue,
    editPath: state.editPath,
    selection: state.selection,
    onSchemaChange: (newValue) => {
      state.newValue = newValue;
    },
    handleSave: () => {
      const hasError = state.errors.length;
      if (hasError || disabled) return;
      setBusy && setBusy(true);
      state.rootValue = JSON.parse(JSON.stringify(state.newValue));
      providerData.onSave();
      onValidate && onValidate([]);
    },
    onSave: async () => {
      await onChange(state.rootValue);
      handleSave && handleSave();
    },
    onChange: (rootValue) => {
      state.rootValue = rootValue;
      onChange(state.rootValue);
    },
    onValidate: (errors) => {
      state.errors = errors.filter((e) => e.type !== 'warning');

      if (!disabled) {
        onValidate &&
          onValidate([
            {
              error: 'unSavedError',
              saveCallback: providerData.handleSave
            }
          ]);
      } else {
        onValidate && onValidate(errors);
      }
    },
    setEditPath: (editPath) => {
      state.editPath = editPath;
    },
    setSelection: (selection) => {
      state.selection = selection;
    },
    moveElementTo: (sourcePath, targetPath) => {
      const source = objectPath.get(
        getParsedSchema(state.rootValue),
        'properties.' + sourcePath.join('.properties.')
      );

      const target = objectPath.get(
        getParsedSchema(state.rootValue),
        'properties.' + targetPath.join('.properties.')
      );

      console.log('moveElementTo', source, target);
    },
    createElementAt: ({ defaultData, snippet }, targetPath, elementId) => {
      const component = JSON.parse(
        JSON.stringify({
          ...defaultData,
          snippet
        })
      );

      const propertyPath = targetPath.length
        ? 'properties.' + targetPath.join('.properties.') + '.properties'
        : 'properties';

      const parsedValue = getParsedSchema(state.rootValue);

      objectPath.ensureExists(parsedValue, propertyPath, {});

      const updatedCode = insertCode({
        schema: parsedValue,
        path: 'properties.' + targetPath.concat(elementId).join('.properties.'),
        element: component
      });

      const updatedTriggers = insertTriggers({
        schema: updatedCode,
        element: component
      });

      const updatedAddition = insertAddition({
        schema: updatedTriggers,
        element: component
      });

      state.newValue = JSON.stringify(updatedAddition, null, 4);
    },
    deleteElementAt: (targetPath) => {
      const parsedValue = getParsedSchema(state.newValue);

      objectPath.del(parsedValue, 'properties.' + targetPath.join('.properties.'));

      state.newValue = JSON.stringify(parsedValue, null, 4);

      state.selection = [];
    },
    isElementExists: (elementId, targetPath) => {
      const parsedValue = getParsedSchema(state.rootValue);

      return !!objectPath.get(
        parsedValue,
        'properties.' + targetPath.concat(elementId).join('.properties.')
      );
    },
    onChangeProperty: (path, newValue) => {
      const parsedValue = getParsedSchema(state.newValue);

      objectPath.set(parsedValue, path, newValue);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Provider value={providerData}>
        <div className={classes.root}>
          <IconButton
            disabled={disabled}
            onClick={providerData.handleSave}
            className={classes.saveButton}
            classes={{ disabled: classes.disabled }}
            size="large"
          >
            {busy ? (
              <CircularProgress size={24} className={classes.progress} />
            ) : (
              <SaveIcon size={24} />
            )}
          </IconButton>
          {children}
        </div>
      </Provider>
    </DndProvider>
  );
};

const withEditor = (EditorComponent) => (props) => (
  <Consumer>{(context) => <EditorComponent {...props} {...context} />}</Consumer>
);

const mapDispatch = (dispatch) => ({
  actions: {
    addMessage: bindActionCreators(addMessage, dispatch)
  }
});

const connected = connect(null, mapDispatch)(JsonSchemaProvider);
const Editor = withStyles(styles)(connected);
export { Editor, Consumer, withEditor };
