import React from 'react';
import { translate } from 'react-translate';

import { List, ListItem, FormControl, FormHelperText, Typography } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import RefreshIcon from '@mui/icons-material/Refresh';
import ProgressLine from 'components/Preloader/ProgressLine';
import DeviceItem from './DeviceItem';

const styles = {
  updateButton: {
    display: 'flex',
    alignItems: 'center'
  },
  grow: {
    flexGrow: 1
  }
};

const DeviceSelect = ({
  t,
  classes,
  error,
  kmType,
  kmDevice,
  kmTypes,
  updating,
  onUpdate,
  onChange
}) => {
  const list = kmTypes.filter(({ devices }) => devices && devices.length);

  return (
    <>
      <FormControl variant="standard" error={!!error}>
        <List component="div" role="list">
          {list.map((type, key) => (
            <DeviceItem
              key={key}
              type={type}
              kmDevice={kmDevice}
              selected={type.index === kmType}
              onChange={onChange}
            />
          ))}
          {!updating && list && list.length === 0 ? <Typography>{t('NoItems')}</Typography> : null}
          {updating ? null : (
            <ListItem
              button={true}
              divider={true}
              onClick={onUpdate}
              role="listitem"
              className={classes.updateButton}
            >
              <div className={classes.grow} />
              <RefreshIcon />
              <Typography>{t('Refresh')}</Typography>
              <div className={classes.grow} />
            </ListItem>
          )}
        </List>
        {error ? <FormHelperText>{error}</FormHelperText> : null}
      </FormControl>
      <ProgressLine loading={updating} />
    </>
  );
};

const styled = withStyles(styles)(DeviceSelect);
export default translate('SignForm')(styled);
