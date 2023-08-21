import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import diff from 'deep-diff';
import {
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  CircularProgress,
  Typography
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import CodeEditDialog from 'components/CodeEditDialog';
import { addError } from 'actions/error';
import SaveIcon from '@mui/icons-material/Save';
import jsChevron from 'assets/img/jsChevron.svg';
import evaluate from 'helpers/evaluate';
import ElementContainer from '../components/ElementContainer';

const styles = {
  saveButton: {
    color: '#E2E2E2',
    position: 'absolute',
    right: 50,
    top: 4,
    padding: 4
  },
  disabled: {
    color: '#E2E2E2!important',
    opacity: 0.3
  },
  modelabel: {
    fontWeight: 500,
    fontSize: 12,
    lineHeight: '12px',
    letterSpacing: '-0.09em',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center'
  },
  actionWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    width: 'calc(100% + 17px)',
    position: 'relative',
    left: -8,
    '&:hover': {
      backgroundColor: '#2e2e2e'
    }
  },
  actionLabel: {
    fontWeight: 500,
    lineHeight: '19px',
    color: '#FFFFFF',
    fontSize: 16,
    textTransform: 'initial',
    textAlign: 'left'
  },
  chevronIcon: {
    fill: 'rgba(255, 255, 255, 0.7)'
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      height: 27,
      width: 27
    }
  },
  iconWrapperError: {
    border: '2px solid #f44336',
    borderRadius: '50%',
    padding: 3
  },
  darkThemeHover: {
    '& svg': {
      fill: 'rgba(255, 255, 255, 0.7)'
    },
    '&:hover': {
      backgroundColor: 'rgb(46 46 46)'
    }
  },
  actionButton: {
    marginTop: 10
  }
};

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      validateErrors: [],
      showErrorDialog: false,
      alertOpen: false
    };
  }

  blockNavigate = (open) => {
    if (open) {
      const path = window.location.pathname;

      if (!path || !path.length || !window.history) return;

      window.history.pushState(null, null, path.split('/')[path.length - 1]);
      window.addEventListener('popstate', this.blockNavigate);
      window.onpopstate = () => this.setState({ alertOpen: true });
    } else {
      window.removeEventListener('popstate', this.blockNavigate);
      window.onpopstate = null;
    }
  };

  handleOpen = () => {
    const { value, asJsonObject, defaultValue } = this.props;

    this.blockNavigate(true);

    this.setState({
      open: true,
      value: asJsonObject ? JSON.stringify(value || defaultValue, null, 4) : value || ''
    });
  };

  handleClose = () => {
    const { validate, onChange, asJsonObject, onClose } = this.props;
    const { value, validateErrors } = this.state;

    this.blockNavigate(false);

    if (validate && validateErrors.length) {
      this.setState({
        showErrorDialog: true
      });
      return;
    }

    this.setState(
      {
        open: false,
        alertOpen: false
      },
      () => {
        try {
          const newValue = asJsonObject ? JSON.parse(value) : value;

          const changes = !this.isPristine();

          if (changes) onChange(newValue);

          if (onClose) onClose();
        } catch (e) {
          return null;
        }
      }
    );
  };

  getJsonSchema = () => {
    const { parentValue, tasks } = this.props;
    const parentValueId = parentValue && parentValue.id;

    if (!parentValueId || !tasks.origin) return;

    const entity = tasks.origin[parentValueId];

    if (!entity) return;

    const {
      documentTemplateEntity: { jsonSchema }
    } = entity;

    return jsonSchema;
  };

  handleSaveAction = async () => {
    const { handleSave, onChange, asJsonObject } = this.props;
    const { value } = this.state;

    try {
      const newValue = asJsonObject ? JSON.parse(value) : value;
      await onChange(newValue);
      handleSave(newValue);
    } catch (e) {
      return null;
    }
  };

  onValidate = (validateErrors) =>
    this.setState({
      validateErrors: validateErrors.filter(({ type }) => !['warning', 'info'].includes(type))
    });

  handleChange = (value) => this.setState({ value });

  isPristine = () => {
    const { asJsonObject, value: oldValue, pristineAsJson } = this.props;
    const { value } = this.state;

    try {
      const newValue = asJsonObject ? JSON.parse(value) : value;
      const diffs = diff(newValue || '', oldValue || '');

      if (pristineAsJson) {
        const jsonDiffs = diff(JSON.parse(newValue), JSON.parse(oldValue));
        return !jsonDiffs;
      }

      return !diffs;
    } catch {
      return true;
    }
  };

  handleSaveButton = () => {
    const { busy, classes, handleSave, validate } = this.props;
    const { validateErrors } = this.state;

    if (!handleSave) return null;

    return (
      <IconButton
        disabled={busy || this.isPristine() || (validate && validateErrors.length)}
        onClick={this.handleSaveAction}
        className={classes.saveButton}
        classes={{ disabled: classes.disabled }}
        size="large"
      >
        {busy ? <CircularProgress size={24} /> : <SaveIcon size={24} />}
      </IconButton>
    );
  };

  renderAlert = () => {
    const { t } = this.props;
    const { alertOpen } = this.state;

    return (
      <Dialog open={alertOpen} onClose={() => this.setState({ alertOpen: false })}>
        <DialogTitle>{t('CodeEditorAlertTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('CodeEditorAlertText')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            {t('Yes')}
          </Button>
          <Button
            onClick={() => this.setState({ alertOpen: false })}
            autoFocus={true}
            color="primary"
          >
            {t('No')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  evaluateTitle = () => {
    const { description, parentValue } = this.props;

    let title = evaluate(description, parentValue);

    if (title instanceof Error) {
      title = description;
    }

    return title;
  };

  renderActionButton = () => {
    const { t, description, mode, darkTheme, classes, error } = this.props;

    return (
      <>
        {darkTheme ? (
          <>
            {description ? (
              <Button className={classes.actionWrapper} onClick={this.handleOpen}>
                <Typography className={classes.actionLabel}>{this.evaluateTitle()}</Typography>
                <span className={classes.modelabel}>{this.renderModelabel(mode)}</span>
              </Button>
            ) : (
              <IconButton onClick={this.handleOpen} className={classes.darkThemeHover} size="large">
                <span
                  className={classNames({
                    [classes.iconWrapper]: true,
                    [classes.iconWrapperError]: error
                  })}
                >
                  {this.renderModelabel(mode)}
                </span>
              </IconButton>
            )}
          </>
        ) : (
          <Button variant="outlined" onClick={this.handleOpen} className={classes.actionButton}>
            {t('EditMode', { mode })}
          </Button>
        )}
      </>
    );
  };

  renderModelabel = (mode) => {
    switch (mode) {
      case 'json': {
        return 'JSON';
      }
      case 'html': {
        return 'HTML';
      }
      case 'javascript': {
        return <img src={jsChevron} alt={'js'} />;
      }
      default: {
        return mode;
      }
    }
  };

  componentDidMount = () => {
    const { autoOpen } = this.props;

    if (autoOpen) {
      this.handleOpen();
    }
  };

  render = () => {
    const {
      t,
      description,
      helperText,
      required,
      error,
      mode,
      hidden,
      noMargin,
      notRequiredLabel,
      darkTheme,
      readOnly,
      defaultHtmlValue
    } = this.props;
    const { value, open, showErrorDialog, validateErrors } = this.state;

    if (hidden) return null;

    return (
      <ElementContainer
        error={error}
        required={required}
        helperText={helperText}
        description={darkTheme ? null : description}
        noMargin={noMargin}
        notRequiredLabel={notRequiredLabel}
      >
        {this.renderActionButton()}

        <CodeEditDialog
          open={open}
          value={value || ''}
          mode={mode}
          readOnly={readOnly}
          onClose={this.handleClose}
          onChange={this.handleChange}
          onValidate={this.onValidate}
          description={this.evaluateTitle()}
          schema={this.getJsonSchema()}
          handleSaveButton={this.handleSaveButton}
          defaultHtmlValue={defaultHtmlValue}
        />

        <Dialog open={showErrorDialog} onClose={() => this.setState({ showErrorDialog: false })}>
          <DialogTitle>{t('ValidationErrors')}</DialogTitle>
          <DialogContent>
            <List dense={true}>
              {validateErrors.map((err, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${err.row}:${err.column} ${err.text}`} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ showErrorDialog: false })}
              color="primary"
              autoFocus
            >
              {t('Apply')}
            </Button>
          </DialogActions>
        </Dialog>
        {this.renderAlert()}
      </ElementContainer>
    );
  };
}

CodeEditor.propTypes = {
  t: PropTypes.func.isRequired,
  parentValue: PropTypes.object,
  tasks: PropTypes.object,
  handleSave: PropTypes.func,
  defaultValue: PropTypes.object,
  validate: PropTypes.bool,
  pristineAsJson: PropTypes.bool,
  autoOpen: PropTypes.bool,
  defaultHtmlValue: PropTypes.bool
};

CodeEditor.defaultProps = {
  parentValue: {},
  tasks: {},
  handleSave: null,
  defaultValue: {},
  validate: true,
  pristineAsJson: false,
  autoOpen: false,
  defaultHtmlValue: true
};

const mapStateToProps = ({ tasks }) => ({ tasks });

const mapDispatchToProps = (dispatch) => ({
  actions: {
    addError: bindActionCreators(addError, dispatch)
  }
});

const styled = withStyles(styles)(CodeEditor);

const translated = translate('Elements')(styled);

export default connect(mapStateToProps, mapDispatchToProps)(translated);
