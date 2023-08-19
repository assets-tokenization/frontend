import React from 'react';
import { useTranslate } from 'react-translate';
import classNames from 'classnames';
import { IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import makeStyles from '@mui/styles/makeStyles';
import ClearDataButton from './ClearDataButton';
import RedoButton from './RedoButton';
import UndoButton from './UndoButton';
import ImportButton from './ImportButton';
import ColumnChooser from './ColumnChooser';

const styles = {
  countWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 30,
  },
  countLabel: {
    fontSize: 13
  },
  count: {
    color: '#fff',
    backgroundColor: '#0066B3',
    paddingLeft: 4,
    paddingRight: 4,
    display: 'inline-block',
    borderRadius: 15,
    fontSize: 11,
    letterSpacing: '0.5px',
    marginLeft: 10
  },
  errorCount: {
    backgroundColor: '#B3261E',
  }
};

const useStyles = makeStyles(styles);

export const ActionsToolbar = ({
  onChange,
  actions,
  onImport,
  readOnly,
  setFullScreen,
  columns,
  selectedColumns,
  setSelectedColumns,
  undo,
  hasPrevious,
  redo,
  hasNext,
  value,
  errors
}) => {
  const t = useTranslate('Elements');
  const classes = useStyles();

  return (
    <Toolbar disableGutters>
      <Tooltip title={t('ToggleFullscreen')}>
        <IconButton
          onClick={() => setFullScreen(true)}
          size="large"
        >
          <FullscreenIcon />
        </IconButton>
      </Tooltip>

      <ImportButton
        onImport={onImport}
        disabled={readOnly}
      />

      <ColumnChooser
        columns={columns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />

      <ClearDataButton
        onChange={onChange}
        actions={actions}
        disabled={readOnly}
      />

      <UndoButton
        undo={undo}
        disabled={!hasPrevious || readOnly}
      />

      <RedoButton
        redo={redo}
        disabled={!hasNext || readOnly}
      />

      {
        value?.length > 0 ? (
          <div className={classes.countWrapper}>
            <Typography className={classes.countLabel}>
              {t('LinesCount')}
            </Typography>
            <span className={classes.count}>
              {value.length}
            </span>
          </div>
        ) : null
      }

      {
        errors?.length > 0 ? (
          <div className={classes.countWrapper}>
            <Typography className={classes.countLabel}>
              {t('ErrorCount')}
            </Typography>
            <span
              className={
                classNames({
                  [classes.count]: true,
                  [classes.errorCount]: true
                })
              }
            >
              {errors.length}
            </span>
          </div>
        ) : null
      }
    </Toolbar>
  );
}

export default ActionsToolbar;
