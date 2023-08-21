import React, { Fragment } from 'react';
import { translate } from 'react-translate';

import { Tooltip, IconButton, CircularProgress } from '@mui/material';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDialog from 'components/ConfirmDialog';

import promiseChain from 'helpers/promiseChain';

class DeleteAllButton extends React.Component {
  state = { openConfirmDialog: false };

  handleDelete = async () => {
    const { actions, rowsSelected, data } = this.props;

    this.setState({ openConfirmDialog: false });

    const files = data.filter(({ id }) => rowsSelected.includes(id));
    await promiseChain(files.map((file) => () => actions.handleDeleteFile(file)));
    actions.onRowsSelect([]);
  };

  render() {
    const { t, loading } = this.props;
    const { openConfirmDialog } = this.state;

    return (
      <Fragment>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Tooltip title={t('DeleteFile')}>
            <IconButton
              id="delete-file-btn"
              onClick={() => this.setState({ openConfirmDialog: true })}
              size="large"
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}

        <ConfirmDialog
          fullScreen={false}
          t={t}
          open={openConfirmDialog}
          acceptButtonText={t('Delete')}
          title={t('DeleteRecordConfirmation')}
          description={t('DeleteRecordConfirmationText')}
          handleClose={() => this.setState({ openConfirmDialog: false })}
          handleConfirm={this.handleDelete}
        />
      </Fragment>
    );
  }
}

export default translate('WorkflowPage')(DeleteAllButton);
