import React from 'react';
import { useTranslate } from 'react-translate';
import { Tooltip, IconButton } from '@mui/material';
import RedoIcon from '@mui/icons-material/Redo';

const RedoButton = ({
  redo,
  disabled,
}) => {
  const t = useTranslate('Elements');

  return (
    <>
      <Tooltip title={t('Redo')}>
        <IconButton
          onClick={redo}
          disabled={disabled}
          size="large"
        >
          <RedoIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default RedoButton;
