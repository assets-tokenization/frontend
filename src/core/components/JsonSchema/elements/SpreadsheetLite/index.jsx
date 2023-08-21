import React from 'react';
import { useTranslate } from 'react-translate';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import FullScreenDialog from 'components/FullScreenDialog';
import useUndo from 'hooks/useUndo';
import { ChangeEvent } from 'components/JsonSchema';
import ConfirmDialog from 'components/ConfirmDialog';
import { arrayToData } from 'components/JsonSchema/elements/Spreadsheet/dataMapping';
import useColumns from 'components/JsonSchema/elements/SpreadsheetLite/helpers/useColumns';
import DataSheetGridHeaded from './DataSheetGridHeaded';
import ContextMenu from './components/ContextMenu';
import ActionsToolbar from './components/ActionsToolbar';
import ErrorsBlock from './components/ErrorsBlock';

const errorMap = (error) => {
  const regex = /\d+/g;

  const numbersArray = error.path.match(regex);

  if (!numbersArray) return error;

  const rowId = Number(numbersArray[0]);

  return {
    ...error,
    rowId
  };
};

export const SpreadsheetLite = (props) => {
  const {
    path,
    value,
    hidden,
    readOnly,
    schema: { description, items, headers, allowAddRows } = {},
    height = 400,
    onChange,
    actions,
    errors,
    maxItems = null
  } = props;
  const t = useTranslate('Elements');

  const [open, setOpen] = React.useState(false);

  const columns = useColumns(items?.properties, items?.required, path, readOnly);

  const { undo, redo, hasNext, hasPrevious } = useUndo(value, (newValue) => {
    onChange(newValue);
  });

  const [fullScreen, setFullScreen] = React.useState(false);
  const [selectedColumns, setSelectedColumns] = React.useState(() => columns.map(({ id }) => id));

  React.useEffect(() => {
    if (value) return;

    onChange(new ChangeEvent([{}], true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const maxItemsReached = React.useMemo(() => {
    if (!maxItems) return false;

    return value?.length >= maxItems;
  }, [maxItems, value]);

  const handleChange = React.useCallback(
    (changes) => {
      if (readOnly || maxItemsReached) {
        setOpen(maxItemsReached);
        return;
      }
      onChange(changes);
    },
    [onChange, readOnly, maxItemsReached]
  );

  const onImport = React.useCallback(
    (arrayData) => {
      if (maxItems && arrayData.length > maxItems) {
        arrayData = arrayData.slice(0, maxItems);
        setOpen(maxItemsReached);
      }

      onChange(new ChangeEvent(arrayToData(arrayData, items), true, true));
    },
    [onChange, maxItems, items, maxItemsReached]
  );

  const filteredColumns = React.useMemo(
    () => columns.filter(({ id }) => selectedColumns.includes(id)),
    [columns, selectedColumns]
  );

  const errorMapped = React.useMemo(() => errors && errors.map(errorMap), [errors]);

  if (hidden) return null;

  return (
    <>
      <ActionsToolbar
        onChange={onChange}
        actions={actions}
        onImport={onImport}
        readOnly={readOnly}
        setFullScreen={setFullScreen}
        columns={columns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        undo={undo}
        hasPrevious={hasPrevious}
        redo={redo}
        hasNext={hasNext}
        value={value}
        errors={errorMapped}
      />

      <ErrorsBlock errors={errorMapped} items={items} />

      <DataSheetGridHeaded
        headers={headers}
        lockRows={!allowAddRows || readOnly}
        autoAddRow={allowAddRows && !readOnly && !maxItemsReached}
        value={value}
        columns={filteredColumns}
        height={height}
        onChange={handleChange}
        addRowsComponent={null}
        contextMenuComponent={ContextMenu}
        errors={errorMapped}
      />

      <FullScreenDialog
        open={fullScreen}
        title={description}
        disableEscapeKeyDown={true}
        onClose={() => setFullScreen(false)}
      >
        <AutoSizer disableWidth={true}>
          {({ height: containerHeight }) => (
            <DataSheetGridHeaded
              headers={headers}
              lockRows={!allowAddRows || readOnly}
              autoAddRow={allowAddRows && !readOnly && !maxItemsReached}
              value={value}
              columns={filteredColumns}
              height={containerHeight - headers?.length * 40}
              onChange={handleChange}
              addRowsComponent={null}
              contextMenuComponent={ContextMenu}
              errors={errorMapped}
            />
          )}
        </AutoSizer>
      </FullScreenDialog>

      <ConfirmDialog
        open={open}
        title={t('MaxItemsReached')}
        description={t('MaxItemsReachedDescription', { maxItems })}
        handleClose={() => setOpen(false)}
      />
    </>
  );
};

export default SpreadsheetLite;
