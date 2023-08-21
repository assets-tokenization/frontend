import React from 'react';

import { Radio, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const DeviceItem = ({ onChange, selected, type }) => (
  <ListItem
    button
    divider
    onClick={() => {
      onChange('kmType')({ target: { value: type.index } });
      onChange('kmDevice')({
        target: {
          value: type.devices.length === 1 ? type.devices[0].index : ''
        }
      });
    }}
    role="listitem"
  >
    <ListItemIcon>
      <Radio edge="start" checked={selected} tabIndex={-1} disableRipple />
    </ListItemIcon>
    <ListItemText primary={type.name} />
  </ListItem>
);

export default DeviceItem;
