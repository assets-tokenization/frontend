import React from 'react';
import { translate } from 'react-translate';

import { DialogContent, TextField, Button, Grid } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import edsService from 'services/eds';
import useStickyState from 'helpers/useStickyState';

function keyToUint8Array(input) {
  const keyLength = Object.values(input).length;
  const key = new Uint8Array(keyLength);
  for (let i = 0; i < keyLength; i++) {
    key[i] = input[i];
  }
  return key;
}

const styles = {};

const EDSSignVerify = () => {
  const [sign, setSign] = useStickyState('', 'EDSSignVerify-sign');
  const [data, setData] = React.useState('');
  const [error, setError] = React.useState(null);
  const [signInfo, setSignInfo] = React.useState('');

  const getSignData = async () => {
    try {
      setError(null);
      const signer = edsService.getSigner();

      const {
        ownerInfo,
        data: singData,
        timeInfo
      } = await signer.execute('VerifyDataInternal', sign);

      setData(new TextDecoder('utf-8').decode(keyToUint8Array(singData)));

      // const signerInfo = await signer.execute('GetSignerInfo', 0, sign);
      setSignInfo(JSON.stringify({ ownerInfo, timeInfo }, null, 4));
    } catch (e) {
      setError(e);
      setSignInfo('');
    }
  };

  return (
    <DialogContent>
      <Grid container>
        <Grid item xs={6}>
          <TextField
            variant="standard"
            multiline={true}
            rows={21}
            label="Дані підпису"
            value={sign}
            onChange={({ target: { value } }) => setSign(value)}
          />
          <Button variant="contained" color="primary" onClick={getSignData}>
            Розшифрувати
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="standard"
            multiline={true}
            error={!!error}
            rows={10}
            label="Розшифровані дані"
            value={(error && error.message) || data}
          />
          <TextField
            variant="standard"
            multiline={true}
            error={!!error}
            rows={10}
            label="Підписант"
            value={signInfo}
          />
        </Grid>
      </Grid>
    </DialogContent>
  );
};

EDSSignVerify.propTypes = {};

EDSSignVerify.defaultProps = {};

const styled = withStyles(styles)(EDSSignVerify);
export default translate('EDSSignVerify')(styled);
