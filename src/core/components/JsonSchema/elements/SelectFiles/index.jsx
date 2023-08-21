import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import queueFactory from 'helpers/queueFactory';
import renderHTML from 'helpers/renderHTML';
import evaluate from 'helpers/evaluate';
import sleep from 'helpers/sleep';
import compressPDF from 'helpers/compressPDF';
import compressImage from 'helpers/compressImage';
import { Typography, FormHelperText, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ChangeEvent from 'components/JsonSchema/ChangeEvent';
import EJVError from 'components/JsonSchema/components/EJVError';
import FileDataTable from 'components/FileDataTable';
import ElementContainer from 'components/JsonSchema/components/ElementContainer';
import SelectFileArea from 'components/JsonSchema/elements/SelectFiles/components/SelectFileArea';
import Preloader from 'components/Preloader';
import DeleteIcon from 'assets/img/ic_trash.svg';
import FileListPreview from './components/FileListPreview';

const styles = () => ({
  root: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%'
  },
  noMargin: {
    margin: 0
  },
  label: {
    marginTop: 60,
    fontSize: 20,
    lineHeight: '24px',
    marginBottom: 15
  },
  modal: {
    zIndex: 9999,
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    '& > *': {
      height: 'auto',
      padding: 0
    }
  },
  simleListItem: {
    borderBottom: '2px solid #000',
    marginBottom: 15,
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center'
  },
  simleListWrapper: {
    marginTop: 10
  },
  description: {
    marginBottom: 10
  }
});

class SelectFiles extends React.Component {
  constructor(props) {
    super(props);
    const { taskId } = props;
    this.state = {
      uploadFileList: [],
      rejected: null,
      loading: false
    };

    this.queue = queueFactory.get(taskId);
    this.queue.on('end', () => {
      this.setState({
        loading: false
      });
    });
  }

  componentDidMount() {
    this.handleRemoveHidden();
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if ((prevProps.value && prevProps.value.length) !== (value && value.length)) {
      this.handleRemoveHidden();
    }
  }

  handleRemoveHidden = () => {
    const { value, hidden } = this.props;

    if (value && hidden) {
      value.forEach((item) => this.handleDeleteFile(item));
    }
  };

  handleDeleteFile = async (attach) => {
    const { actions, value } = this.props;

    actions.setBusy(true);

    this.setState({ rejected: null }, () => {
      const newValue = Object.values(value)
        .filter(Boolean)
        .filter(({ id }) => id !== attach.id);

      this.handleChange(newValue, true, true);

      actions.setBusy(false);

      this.queue.push(async () => actions.handleDeleteFile(attach));
    });
  };

  evaluateFile = (functionForEval, attach) => {
    const { rootDocument, pathIndex, stepName } = this.props;

    return evaluate(
      functionForEval,
      rootDocument.data,
      rootDocument.data[stepName],
      attach,
      pathIndex?.index
    );
  };

  // eslint-disable-next-line no-async-promise-executor
  handleCompressFile = (attach) =>
    new Promise(async (resolve) => {
      const { outputQuality, compressTypes } = this.props;

      if (!outputQuality || !compressTypes || !attach) {
        return resolve(attach);
      }

      const compressing = compressTypes.find((type) => {
        return attach.type.includes(type);
      });

      const compressData = {
        attach,
        outputQuality
      };

      switch (compressing) {
        case 'image':
          return resolve(await compressImage(compressData));
        case 'pdf':
          return resolve(await compressPDF(compressData));
        default:
          return resolve(attach);
      }
    });

  uploadFile = (file, labels, fileIndex) => () =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve) => {
      const { uploadFileList } = this.state;
      const {
        value,
        contestName,
        actions: { uploadDocumentAttach, loadTaskAction, setBusy },
        metaData,
        stepName,
        path,
        changeName
      } = this.props;

      const fileList = Object.values(value || {});

      let meta = {};

      const attachObject = {
        path: file.path,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        labels,
        contestName
      };

      let fileName = file.name;

      if (changeName) {
        fileName = this.evaluateFile(changeName, attachObject);

        if (fileName instanceof Error) {
          fileName.commit({ type: 'select files changeName' });
          fileName = file.name;
        }
      }

      if (metaData) {
        meta = this.evaluateFile(metaData, attachObject);

        if (meta instanceof Error) {
          meta.commit({ type: 'select files metaData' });
          meta = undefined;
        }
      }

      setBusy(true);

      const compressesFile = await this.handleCompressFile(file);

      const uploadedFile = await uploadDocumentAttach(
        compressesFile,
        labels,
        [].concat(stepName, path, fileIndex).join('.'),
        meta
      );

      await loadTaskAction();

      setBusy(false);

      if (!(uploadedFile instanceof Error)) {
        fileList[fileIndex] = {
          ...uploadedFile,
          name: fileName,
          labels,
          contestName,
          metaData: meta,
          size: uploadedFile?.size
        };

        this.handleChange(fileList, true, true);
      }

      this.setState(
        {
          uploadFileList: uploadFileList.slice(1)
        },
        async () => {
          await sleep(10);
          resolve();
        }
      );
    });

  handleChange = async (data, force = false, hard = false) => {
    const { onChange } = this.props;
    return onChange && onChange(new ChangeEvent(data, force, hard, false));
  };

  onDropRejected = (rejected) => {
    const { t } = this.props;

    if (!rejected) return;

    this.setState({
      rejected: {
        message: t('FileSizeLimitReached')
      }
    });
  };

  onDrop = (labels) => async (acceptedFiles) => {
    const { uploadFileList } = this.state;
    const { value, demo, actions } = this.props;
    const fileList = Object.values(value || {});

    if (uploadFileList.length) {
      return;
    }

    this.setState({ rejected: null });

    if (!acceptedFiles || !acceptedFiles.length) {
      return;
    }

    this.setState(
      {
        loading: true,
        uploadFileList: uploadFileList.concat(
          acceptedFiles.map((file) => {
            file.labels = labels;
            return file;
          })
        )
      },
      async () => {
        if (!demo) {
          await actions.handleStore();
          acceptedFiles.forEach((file, index) =>
            this.queue.push(this.uploadFile(file, labels, index + fileList.length))
          );
        }
      }
    );
  };

  renderDataTableList = ({ list, dragEvents }) => {
    const { view, labels, actions, readOnly, fileStorage, simpleList, classes } = this.props;
    const { uploadFileList, loading } = this.state;

    if (!list || !list.length) return null;

    if (simpleList) {
      return (
        <div className={classes.simleListWrapper}>
          {list.map((attach) => (
            <div className={classes.simleListItem} key={attach?.id}>
              <span>{attach?.name}</span>
              <IconButton
                onClick={() =>
                  readOnly || uploadFileList.length ? null : this.handleDeleteFile(attach)
                }
                size="large"
              >
                <img src={DeleteIcon} alt="DeleteIcon" />
              </IconButton>
            </div>
          ))}
        </div>
      );
    }

    return (
      <FileDataTable
        dragEvents={dragEvents}
        view={view}
        data={list}
        fileStorage={fileStorage}
        groupBy={labels ? 'labels' : undefined}
        actions={{
          handleDeleteFile: readOnly || uploadFileList.length ? null : this.handleDeleteFile,
          handleDownloadFile: actions.handleDownloadFile
        }}
        loading={loading}
      />
    );
  };

  render = () => {
    const {
      path,
      name,
      error,
      accept,
      hidden,
      labels,
      value,
      sample,
      classes,
      maxSize,
      minSize,
      readOnly,
      noMargin,
      description,
      maxLength,
      multiple,
      width,
      maxWidth
    } = this.props;

    const { uploadFileList, rejected, loading } = this.state;

    if (hidden) return null;

    const fileList = [].concat(Object.values(value || {}), uploadFileList).filter(Boolean);

    const renderDataTable = (dragEvents) =>
      this.renderDataTableList({
        list: fileList,
        dragEvents
      });

    const limitReached = maxLength && maxLength === fileList.length;

    return (
      <ElementContainer
        id={(path || []).join('-')}
        width={width}
        maxWidth={maxWidth}
        noMargin={noMargin}
      >
        {description ? (
          <Typography variant="h5" className={classes.description}>
            {description}
          </Typography>
        ) : null}
        {sample ? <div className={classes.raw}>{renderHTML(sample)}</div> : null}
        {labels && labels.length ? (
          <>
            {labels.map((label) => (
              <div key={label}>
                <Typography variant="h5" className={classes.label}>
                  {label}
                </Typography>

                {this.renderDataTableList({
                  list: (() => {
                    if (!fileList || !fileList.length) return null;
                    const filesByLabel = fileList.filter(({ labels }) => label === labels[0]);
                    if (!filesByLabel.length) return null;
                    return filesByLabel;
                  })()
                })}

                <SelectFileArea
                  path={path}
                  name={name}
                  sample={sample}
                  maxSize={maxSize}
                  minSize={minSize}
                  accept={accept}
                  labels={labels}
                  multiple={multiple}
                  readOnly={readOnly || uploadFileList.length || limitReached}
                  onSelect={this.onDrop([label])}
                  onDropRejected={this.onDropRejected}
                />
              </div>
            ))}
          </>
        ) : (
          <SelectFileArea
            path={path}
            name={name}
            sample={sample}
            maxSize={maxSize}
            minSize={minSize}
            accept={accept}
            readOnly={readOnly || uploadFileList.length || limitReached}
            multiple={multiple}
            onSelect={this.onDrop([])}
            onDropRejected={this.onDropRejected}
            renderContent={renderDataTable}
          />
        )}
        {error ? (
          <FormHelperText error={!!error}>
            <EJVError error={error} />
          </FormHelperText>
        ) : null}
        {rejected ? (
          <FormHelperText error={!!rejected}>
            <EJVError error={rejected} />
          </FormHelperText>
        ) : null}
        {loading ? (
          <div className={classes.modal}>
            <Preloader />
          </div>
        ) : null}
      </ElementContainer>
    );
  };
}

SelectFiles.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object,
  sample: PropTypes.string,
  accept: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  maxLength: PropTypes.number,
  path: PropTypes.array,
  hidden: PropTypes.bool,
  simpleList: PropTypes.bool,
  multiple: PropTypes.bool,
  width: PropTypes.string,
  compressTypes: PropTypes.array,
  outputQuality: PropTypes.number
};

SelectFiles.defaultProps = {
  sample: '',
  accept: '',
  actions: {},
  maxSize: null,
  minSize: 1,
  value: null,
  path: [],
  hidden: false,
  simpleList: false,
  maxLength: 0,
  multiple: true,
  width: null,
  compressTypes: null,
  outputQuality: 1
};

const styled = withStyles(styles)(SelectFiles);
const translated = translate('Elements')(styled);

translated.Preview = FileListPreview;

export default translated;
