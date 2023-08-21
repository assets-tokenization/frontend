import React from 'react';
import { translate } from 'react-translate';
import printJS from 'print-js';
import PropTypes from 'prop-types';
import { Tooltip, IconButton } from '@mui/material';
import { humanDateTimeFormat } from 'helpers/humanDateFormat';
import KeyIcon from '@mui/icons-material/VpnKey';

class SignatureDetails extends React.Component {
  print = () => {
    const {
      item: {
        signature: {
          signer: { organizationName, commonName },
          issuer,
          serial,
          signTime
        },
        signatures,
        fileName,
        documentId
      }
    } = this.props;

    if (signatures?.length) {
      const result = signatures.map(
        ({ signer: { organizationName, commonName }, issuer, serial, signTime }) => {
          const printData = {
            commonName,
            organizationName: organizationName || '',
            signTime: humanDateTimeFormat(signTime),
            issuer: issuer.commonName,
            serial: serial.toUpperCase(),
            fileName,
            documentId
          };

          return printData;
        }
      );

      printJS({
        printable: result,
        properties: [
          'commonName',
          'organizationName',
          'signTime',
          'issuer',
          'serial',
          'fileName',
          'documentId'
        ],
        type: 'json',
        // style: 'padding: 5px; justify-content: center; ',
        gridHeaderStyle: 'opacity: 0;',
        //gridStyle: 'border: none; padding-bottom: 10px;',
        documentTitle: ''
      });

      return;
    }

    const printData = [
      {
        info: commonName
      },
      {
        info: organizationName || ''
      },
      {
        info: humanDateTimeFormat(signTime)
      },
      {
        info: issuer.commonName
      },
      {
        info: (serial || '').toUpperCase()
      },
      {
        info: fileName
      },
      {
        info: documentId
      }
    ];

    printJS({
      printable: printData,
      properties: ['info'],
      type: 'json',
      gridHeaderStyle: 'opacity: 0;',
      gridStyle: 'border: none;',
      documentTitle: ''
    });
  };

  render = () => {
    const { t } = this.props;

    return (
      <>
        <Tooltip title={t('Signature')}>
          <IconButton onClick={this.print} size="large">
            <KeyIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };
}

SignatureDetails.propTypes = {
  t: PropTypes.func.isRequired,
  signature: PropTypes.object.isRequired
};

SignatureDetails.defaultProps = {
  signature: {}
};

export default translate('FileDataTable')(SignatureDetails);
