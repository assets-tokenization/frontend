/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
  chipWrap: {
    marginBottom: 16,
    [theme.breakpoints.down('md')]: {
      marginBottom: 10
    }
  },
  chipRoot: {
    height: 'unset',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    borderRadius: 50
  },
  chipLabel: {
    whiteSpace: 'initial',
    paddingLeft: 28,
    fontSize: 18,
    lineHeight: '20px',
    overflow: 'initial',
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
      lineHeight: '18px',
      padding: '6px 20px'
    }
  },
  deleteIcon: {
    width: 'unset',
    height: 'unset',
    position: 'relative',
    right: -3,
    margin: 0
  }
});

const RegisterChip = ({ classes, label, onDelete, disabled, t }) => (
  <div className={classes.chipWrap}>
    <Chip
      label={label}
      onDelete={onDelete}
      disabled={disabled}
      deleteIcon={
        <IconButton size="large" aria-label={t('Delete')}>
          <ClearIcon style={{ color: '#000' }} />
        </IconButton>
      }
      classes={{
        root: classes.chipRoot,
        label: classes.chipLabel,
        deleteIcon: classes.deleteIcon
      }}
    />
  </div>
);

RegisterChip.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

const translated = translate('Elements')(RegisterChip);

const styled = withStyles(styles)(translated);

export default styled;
