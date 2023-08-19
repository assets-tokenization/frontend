import React from 'react';
import TimeLabel from 'components/Label/Time';
import SignatureDetails from 'components/FileDataTable/components/SignatureDetails';
import AttachesActions from './components/AttachesActions';
import FileNameColumn from './components/FileNameColumn';
import DataTableCard from './components/DataTableCard';
import DownloadAllButton from './components/DownloadAllButton';
import DeleteFile from './components/AttachesActions/DeleteFile';

export default ({
  t,
  printAction,
  actions,
  fileStorage,
  darkTheme,
  admin,
  showCreatedDate = false
}) => {
  const columns = [];

  columns.push({
    id: 'fileName',
    name: t('FileName'),
    padding: 'none',
    align: 'left',
    disableTooltip: true,
    render: (value, item) => {
      const fileName = value || item.name || t('Unnamed');
      const customName = item.customName || null;
      const meta = (item.meta && item.meta.description) || null;

      return (
        <FileNameColumn
          name={fileName}
          item={item}
          customName={customName}
          meta={meta}
          cutLine={true}
          extension={fileName.split('.').pop()}
        />
      );
    }
  });

  if (showCreatedDate) {
    columns.push({
      id: 'createdAt',
      name: t('FileDate'),
      width: 160,
      align: 'left',
      padding: 'none',
      render: (value, { updatedAt }) => <TimeLabel date={value || updatedAt} />
    });
  } else {
    columns.push({
      id: 'size',
      name: t('fileSize'),
      align: 'left',
      width: 130,
      render: (_, row) => {
        const { size, fileSize } = row;
  
        const value = size || fileSize;
  
        if (!value) {
          return '';
        }
  
        const bytesString = `(${value} ${t('bytes')})`;
  
        if (value && value < 1024 * 1024) {
          return `${(value / 1024).toFixed(2)} KB ${admin ? bytesString : ''}`;
        }
        
        return `${(value / 1024 / 1024).toFixed(2)} MB ${admin ? bytesString : ''}`;
      }
    });
  }

  columns.push({
    id: t('download'),
    width: 48,
    align: 'left',
    disableClick: true,
    padding: 'none',
    render: (value, item) => (
      <>
        <div style={{ display: 'flex' }}>
          <DownloadAllButton
            printAction={printAction}
            asics={true}
            actions={actions}
            data={[item]}
            rowsSelected={[item.id]}
            isRow={true}
            p7sDownload={false}
            hasP7sSignature={item.hasP7sSignature}
          />
          {admin ? (
            <DownloadAllButton
              printAction={printAction}
              asics={true}
              actions={actions}
              data={[item]}
              rowsSelected={[item.id]}
              isRow={true}
              p7sDownload={true}
              hasP7sSignature={item.hasP7sSignature}
            />
          ) : null}
          {item instanceof File ? null : (
            <AttachesActions
              item={item}
              actions={actions}
              fileStorage={fileStorage}
              darkTheme={darkTheme}
            />
          )}
          {item.signature ? <SignatureDetails item={item} /> : null}
          {item instanceof File ? null : (
            <DeleteFile
              item={item}
              handleDeleteFile={actions?.handleDeleteFile}
            />
          )}
        </div>
      </>
    )
  });

  return {
    actions,
    components: {
      DataTableCard,
    },
    controls: {
      pagination: false,
      toolbar: true,
      search: false,
      header: true,
      refresh: false,
      switchView: true,
      customizateColumns: false,
    },
    checkable: true,
    cellStyle: {
      verticalAlign: 'middle',
    },
    columns
  };
};
