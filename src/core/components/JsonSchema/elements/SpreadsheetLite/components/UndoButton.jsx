import React from 'react';
import { useTranslate } from 'react-translate';
import { Tooltip, IconButton } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';

const UndoButton = ({ undo, disabled }) => {
  const t = useTranslate('Elements');

  return (
    <>
      <Tooltip title={t('Undo')}>
        <IconButton onClick={undo} disabled={disabled} size="large">
          <UndoIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default UndoButton;
