/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import DataTable from 'components/DataTable';
import dataTableSettings from './dataTableSettings';
import fileTableSettings from './fileTableSettings';
import FileDataTableToolbar from './components/Toolbar';

class FileDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsSelected: []
    };
  }

  onRowsSelect = (rowsSelected) => this.setState({ rowsSelected });

  renderToolbar = (props) => {
    const { CustomToolbar } = this.props;

    return (
      <>
        <FileDataTableToolbar {...props} />
        {CustomToolbar ? <CustomToolbar {...props} /> : null}
      </>
    );
  };

  getSettings = () => {
    const {
      fileControl,
      t,
      printAction,
      actions,
      fileStorage,
      directDownload,
      handleDownload,
      handleDeleteFile,
      darkTheme,
      admin,
      showCreatedDate
    } = this.props;

    if (fileControl) {
      return fileTableSettings({
        t,
        fileStorage,
        directDownload,
        handleDownload,
        handleDeleteFile
      });
    }

    return dataTableSettings({
      t,
      fileStorage,
      printAction,
      admin,
      showCreatedDate,
      actions: {
        ...actions,
        onRowsSelect: this.onRowsSelect,
        isRowSelectable: (file) => !(file instanceof File)
      },
      darkTheme
    });
  };

  render() {
    const { data, printAction, darkTheme, defaultView } = this.props;
    const { rowsSelected } = this.state;

    const settings = this.getSettings();

    const tableData = Array.isArray(data)
      ? data.map((file) => {
          if (file instanceof File) {
            return file;
          }
          return { ...file, id: file.id || file.fileLink || file.url };
        })
      : data;

    return (
      <DataTable
        {...settings}
        {...this.props}
        view={defaultView}
        darkTheme={darkTheme}
        CustomToolbar={this.renderToolbar}
        rowsSelected={rowsSelected}
        data={tableData}
        actions={settings.actions}
        printAction={printAction}
      />
    );
  }
}

FileDataTable.propTypes = {
  t: PropTypes.func.isRequired,
  actions: PropTypes.object,
  fileStorage: PropTypes.object,
  fileControl: PropTypes.bool,
  handleDownload: PropTypes.func,
  printAction: PropTypes.bool,
  darkTheme: PropTypes.bool,
  defaultView: PropTypes.string
};

FileDataTable.defaultProps = {
  actions: {},
  fileStorage: {},
  fileControl: false,
  handleDownload: null,
  printAction: false,
  darkTheme: false,
  defaultView: 'table'
};

export default translate('FileDataTable')(FileDataTable);
