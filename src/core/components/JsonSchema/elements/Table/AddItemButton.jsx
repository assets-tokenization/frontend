import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import AddCirleImage from '@mui/icons-material/AddCircleOutline';

const AddItemButton = ({ t, actions, readOnly, classes }) => (
  <Button onClick={actions.addItem} disabled={readOnly} className={classes.button}>
    <AddCirleImage className={classes.icon} />
    <Typography>{t('AddNewRow')}</Typography>
  </Button>
);

const styles = () => ({
  button: {
    padding: 0,
    marginTop: 5,
    '&:hover': {
      backgroundColor: '#fff'
    }
  },
  icon: {
    marginRight: 5
  }
});

AddItemButton.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object,
  readOnly: PropTypes.bool
};

AddItemButton.defaultProps = {
  actions: {},
  readOnly: false
};

export default withStyles(styles)(AddItemButton);
