import React, { Fragment } from 'react';
import { translate } from 'react-translate';
import { Tooltip, IconButton } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ConfirmDialog from 'components/ConfirmDialog';

class DeleteFile extends React.Component {
    state = { openConfirmDialog: false };

    handleDelete = () => {
        const { item, handleDeleteFile } = this.props;
        this.setState({ openConfirmDialog: false });
        handleDeleteFile(item);
    };

    render() {
        const { t, handleDeleteFile } = this.props;
        const { openConfirmDialog } = this.state;
        
        if (!handleDeleteFile) return null;

        return (
            <Fragment>
                <Tooltip title={t('DeleteFile')}>
                    <IconButton
                        id="delete-file-btn"
                        onClick={() => this.setState({ openConfirmDialog: true })}
                        size="large">
                        <DeleteOutlineOutlinedIcon />
                    </IconButton>
                </Tooltip>
                <ConfirmDialog
                    fullScreen={false}
                    t={t}
                    open={openConfirmDialog}
                    title={t('DeleteRecordConfirmation')}
                    description={t('DeleteRecordConfirmationText')}
                    handleClose={() => this.setState({ openConfirmDialog: false })}
                    handleConfirm={this.handleDelete}
                />
            </Fragment>
        );
    }
}

export default translate('WorkflowPage')(DeleteFile);
