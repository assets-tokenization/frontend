import React from 'react';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import { Tooltip, IconButton, CircularProgress } from '@mui/material';
import FileViewerDialog from 'components/FileViewerDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'assets/css/pg.viewer.css';

const ShowPreview = (props) => {
  const {
    item,
    itemId,
    fileStorage,
    handleDownloadFile,
    darkTheme,
    t,
    previewIcon
  } = props;

  const [showPreview, setShowPreview] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const getFile = () => {
    if (itemId) return fileStorage[itemId];
    return (
      (fileStorage || {})[item.id] || (fileStorage || {})[item.downloadToken]
    );
  };

  const showPreviewDialog = async () => {
    if (loading) return;

    if (getFile()) {
      setShowPreview(true);
      return;
    }

    setLoading(true);

    await handleDownloadFile(item);

    setLoading(false);
    setShowPreview(true);
  };

  const file = getFile();

  const fileName = item.fileName || item.name || '';
  const extension = fileName.split('.').pop().toLowerCase();
  const icon = loading ? (
    <CircularProgress size={24} />
  ) : (
    previewIcon || (item.previewIcon || <VisibilityIcon />)
  );

  const error = file instanceof Error ? file : null;

  return (
    <>
      <Tooltip title={t('ShowPreview')}>
        <IconButton
          onClick={showPreviewDialog}
          id="show-preview-btn"
          size="large"
        >
          {icon}
        </IconButton>
      </Tooltip>
      <FileViewerDialog
        darkTheme={darkTheme}
        file={file}
        fileName={fileName}
        open={!!(showPreview && file && !error)}
        extension={extension}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

ShowPreview.propTypes = {
  t: PropTypes.func.isRequired,
  handleDownloadFile: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  itemId: PropTypes.string.isRequired,
  fileStorage: PropTypes.object.isRequired,
  darkTheme: PropTypes.bool,
  previewIcon: PropTypes.node,
};

ShowPreview.defaultProps = {
  darkTheme: false,
  previewIcon: null,
};

export default translate('WorkflowPage')(ShowPreview);
