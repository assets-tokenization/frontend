import React, { Fragment } from 'react';

import {
    IconButton
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/SaveOutlined';

const SignerTableToolbar = ({ editMode, actions }) => (
    <Fragment>
        <IconButton onClick={actions.toggleEditMode} size="large">
            {editMode ? <SaveIcon /> : <AddIcon />}
        </IconButton>
    </Fragment>
);

export default SignerTableToolbar;
