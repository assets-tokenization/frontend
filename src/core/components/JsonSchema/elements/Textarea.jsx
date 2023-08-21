/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React from 'react';
import { translate } from 'react-translate';
import ReactQuill from 'react-quill';
import renderHTML from 'helpers/renderHTML';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  Typography,
  DialogContent,
  DialogTitle
} from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { quillFormats } from './quill/settings';
import ElementContainer from '../components/ElementContainer';
import 'assets/css/quill.theme.css';

const style = {
  hint: {
    marginBottom: 8,
    color: 'rgba(0, 0, 0, 0.8)',
    lineHeight: '1.5em'
  },
  link: {
    color: '#1b69b6',
    cursor: 'pointer'
  },
  quill: {
    minHeight: 200,
    position: 'relative',
    '& .ql-container': {
      background: '#aaaaaa',
      height: 'calc(100% - 42px)',
      position: 'absolute',
      width: '100%'
    },
    '& .ql-editor': {
      margin: 'auto',
      background: '#ffffff'
    }
  },
  quillErrored: {
    '& .ql-toolbar, .ql-container': {
      borderColor: '#f44336'
    }
  },
  elementHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textArea: {
    marginBottom: 40
  },
  textAreaDescription: {
    color: '#000000'
  }
};

class Textarea extends React.Component {
  constructor(props) {
    super(props);

    const { value } = props;

    this.state = { showSample: false, value };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps({ value }) {
    const { value: propsValue } = this.props;
    const { value: stateValue } = this.state;
    if (value !== propsValue && value !== stateValue) {
      this.setState({ value });
    }
  }

  toggleSampleDialog = () => {
    const { showSample } = this.state;
    this.setState({ showSample: !showSample });
  };

  handleTextChange = (content) => {
    const { onChange } = this.props;
    if (!content.replace(/<\/?[^>]+>/g, '')) {
      content = '';
    }
    this.setState({ value: content }, () => onChange && onChange(content));
  };

  renderSampleDialog() {
    const { t, classes, hint, path } = this.props;
    const { showSample } = this.state;
    return (
      <Dialog
        open={showSample}
        onClose={this.toggleSampleDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id={path.concat('dialog').join('-')}
        className={classes.dialog}
      >
        <DialogTitle
          className={classes.dialogContentWrappers}
          id={path.concat('dialog-title alert-dialog-title').join('-')}
        >
          {t('SAMPLE_EXPAND')}
        </DialogTitle>
        <DialogContent
          className={classes.dialogContentWrappers}
          id={path.concat('dialog-content').join('-')}
        >
          <div>{renderHTML(hint)}</div>
        </DialogContent>
        <DialogActions
          className={classes.dialogContentWrappers}
          id={path.concat('dialog-actions').join('-')}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={this.toggleSampleDialog}
            id={path.concat('close-button').join('-')}
          >
            {t('CLOSE')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderCounter = () => {
    const { t, htmlMaxLength } = this.props;
    const { value } = this.state;

    const replaceTags = (value || '').replace(/<\/?[^>]+>/g, '');
    const limitReached = replaceTags.length > Number(htmlMaxLength);

    return (
      <Typography
        variant="body2"
        align="right"
        color={limitReached ? 'error' : 'initial'}
        style={{
          margin: '8px 0 4px'
        }}
        tabIndex="0"
        aria-label={t('SYMBOLS_COUNT', {
          num: replaceTags.length,
          max: htmlMaxLength ? `${t('FROM')} ${htmlMaxLength}` : ''
        })}
      >
        {t('SYMBOLS_COUNT', {
          num: replaceTags.length,
          max: htmlMaxLength ? `${t('FROM')} ${htmlMaxLength}` : ''
        })}
      </Typography>
    );
  };

  setId = () => {
    const { path } = this.props;
    return (path || []).join('.').replace(/\./gi, '-');
  };

  customToolbar() {
    const { t } = this.props;
    const id = this.setId();
    return (
      <div id={`toolbar-custom-${id}`}>
        <div className="ql-formats">
          <select
            className="ql-header"
            defaultValue={''}
            onChange={(e) => e.persist()}
            aria-label={t('EditorBtnLabelTypeOfText')}
            role="button"
          >
            <option value="1" />
            <option value="2" />
            <option value="3" />
            <option value="4" />
            <option value="5" />
            <option value="6" />
            <option selected />
          </select>
        </div>
        <div className="ql-formats">
          <button className="ql-bold" aria-label={t('EditorBtnLabelBold')} />
          <button className="ql-italic" aria-label={t('EditorBtnLabelItalic')} />
          <button className="ql-underline" aria-label={t('EditorBtnLabelUnderline')} />
          <button className="ql-strike" aria-label={t('EditorBtnLabelStrike')} />
          <button className="ql-link" aria-label={t('EditorBtnLabelLink')} />
        </div>
        <div className="ql-formats">
          <button className="ql-align" value="" aria-label={t('EditorBtnLabelAlignTextLeft')} />
          <button
            className="ql-align"
            value="center"
            aria-label={t('EditorBtnLabelAlignTextCenter')}
          />
          <button
            className="ql-align"
            value="right"
            aria-label={t('EditorBtnLabelAlignTextRight')}
          />
        </div>
        <div className="ql-formats">
          <button className="ql-list" value="ordered" aria-label={t('EditorBtnLabelOlList')} />
          <button className="ql-list" value="bullet" aria-label={t('EditorBtnLabelUlList')} />
        </div>
        <div className="ql-formats">
          <button className="ql-indent" value="-1" aria-label={t('EditorBtnLabelRemoveIndent')} />
          <button className="ql-indent" value="+1" aria-label={t('EditorBtnLabelAddIndent')} />
        </div>
        <div className="ql-formats">
          <select className="ql-color" aria-label={t('EditorBtnLabelColor')} role="button" />
          <select
            className="ql-background"
            aria-label={t('EditorBtnLabelBackground')}
            role="button"
          />
        </div>
        <div className="ql-formats">
          <button className="ql-clean" aria-label={t('EditorBtnLabelClean')} />
        </div>
      </div>
    );
  }

  renderElement() {
    const { classes, error, readOnly, path, height } = this.props;
    const { value } = this.state;

    const id = this.setId();
    const quillModulesCustom = {
      toolbar: { container: `#toolbar-custom-${id}` }
    };

    return (
      <div className="text-editor">
        {this.customToolbar()}
        <ReactQuill
          readOnly={readOnly}
          modules={quillModulesCustom}
          formats={quillFormats}
          value={value || ''}
          className={[classes.quill, error && classes.quillErrored].filter(Boolean).join(' ')}
          onChange={this.handleTextChange}
          id={path.join('-')}
          style={{
            height: height || 'unset'
          }}
        />
      </div>
    );
  }

  render() {
    const {
      t,
      classes,
      sample,
      hint,
      errors,
      path,
      required,
      description,
      error,
      hidden,
      width,
      maxWidth,
      noMargin
    } = this.props;

    if (hidden) return null;

    return (
      <ElementContainer
        required={required}
        description={description}
        className={classes.textArea}
        noMargin={noMargin}
        error={error}
        bottomError={true}
        sample={
          <div className={classes.elementHead}>
            <span>
              {sample}
              &nbsp;
              {hint ? (
                <span
                  className={classes.link}
                  onClick={this.toggleSampleDialog}
                  id={path.concat('open-dialog-button').join('-')}
                >
                  {t('SHOW_SAMPLE_DIALOG')}
                  {this.renderSampleDialog()}
                </span>
              ) : null}
            </span>
            {this.renderCounter()}
          </div>
        }
        errors={errors}
        width={width}
        maxWidth={maxWidth}
        descriptionClassName={classes.textAreaDescription}
      >
        {this.renderElement()}
      </ElementContainer>
    );
  }
}

Textarea.propTypes = {
  onChange: PropTypes.func,
  sample: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  classes: PropTypes.object.isRequired,
  path: PropTypes.array,
  readOnly: PropTypes.bool,
  t: PropTypes.func.isRequired,
  hint: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.number
};

Textarea.defaultProps = {
  onChange: undefined,
  sample: '',
  error: null,
  readOnly: false,
  path: [],
  value: '',
  hint: '',
  height: null
};

const styled = withStyles(style)(Textarea);
export default translate('Elements')(styled);
