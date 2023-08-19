/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Tooltip } from '@mui/material';
import { DynamicDataSheetGrid } from 'react-datasheet-grid';
import makeStyles from '@mui/styles/makeStyles';
import 'react-datasheet-grid/dist/style.css';
import useHeaders from './helpers/useHeaders';
import useTooltip from './helpers/useTooltip';

const styles = {
  errorCell: {
    backgroundColor: '#E27D7D',
  },
  errorRow: {
    backgroundColor: '#F5E1E1',
  }
};

const useStyles = makeStyles(styles);

const DataSheetGridHeaded = ({
  headers,
  errors,
  ...props
}) => {
  const className = useHeaders(headers);
  const tooltipProps = useTooltip(className);
  const classes = useStyles();

  return (
    <>
      <Tooltip {...tooltipProps} placement="top" arrow><span /></Tooltip>
      <DynamicDataSheetGrid
        {...props}
        className={className}
        cellClassName={({ rowIndex, columnId }) => {
          if (!errors || !errors.length) return null;

          const rowErrors = errors.filter(({ rowId }) => rowId === rowIndex);

          const error = rowErrors.find(({ path }) => path.indexOf(columnId) !== -1);

          if (rowErrors.length > 1 && !error) return classes.errorRow;

          const { path } = error;

          if (path.indexOf(columnId) !== -1) {
            return classes.errorCell;
          }

          return null;
        }}
      />
    </>
  );
}

export default DataSheetGridHeaded;