import React from 'react';
import { useTranslate } from 'react-translate';
import { Tooltip, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const ColumnChooser = ({ selectedColumns, columns, setSelectedColumns }) => {
  const t = useTranslate('Elements');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleChooseColumns = (id) => {
    if (selectedColumns.includes(id)) {
      setSelectedColumns(selectedColumns.filter((columnId) => columnId !== id));
    } else {
      setSelectedColumns([...selectedColumns, id]);
    }
  };

  return (
    <>
      <Tooltip title={t('ColumnChooser')}>
        <IconButton size="large" onClick={handleClick}>
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {columns.map(({ id, description }) => {
          return (
            <MenuItem key={id} onClick={() => handleChooseColumns(id)}>
              <ListItemIcon>
                {selectedColumns.includes(id) ? (
                  <CheckBoxIcon fontSize="small" />
                ) : (
                  <CheckBoxOutlineBlankIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>{description}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default ColumnChooser;
