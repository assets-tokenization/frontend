import { Button, DialogContent, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback } from 'react';

import edsService from 'services/eds';

const useStyles = makeStyles((theme) => ({
  content: {
    '& > *': {
      marginBottom: theme.spacing(2)
    }
  }
}));

const HashToInternal = () => {
  const [signedHash, setSignedHash] = React.useState('');
  const [data, setData] = React.useState('');
  const [error, setError] = React.useState(null);
  const [result, setResult] = React.useState('');

  const classes = useStyles();

  const handleClick = useCallback(async () => {
    try {
      setError(null);
      const signer = edsService.getSigner();
      const internalSignature = await signer.execute('HashToInternal', signedHash, data);
      setResult(internalSignature);
    } catch (e) {
      setError(e.message);
      setResult('');
    }
  }, [data, signedHash]);

  return (
    <DialogContent className={classes.content}>
      <TextField
        variant="outlined"
        multiline={true}
        rows={10}
        label="Хеш"
        value={signedHash}
        onChange={({ target: { value } }) => setSignedHash(value)}
      />
      <TextField
        variant="outlined"
        multiline={true}
        rows={10}
        label="Дані"
        value={data}
        onChange={({ target: { value } }) => setData(value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        disabled={!signedHash || !data}
      >
        Перебрати
      </Button>
      <TextField
        variant="outlined"
        multiline={true}
        rows={10}
        label="Результат"
        value={result || error}
      />
    </DialogContent>
  );
};

export default HashToInternal;
