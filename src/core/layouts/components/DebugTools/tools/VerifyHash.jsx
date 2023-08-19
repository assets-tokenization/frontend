import { Button, DialogContent, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback } from 'react';

import edsService from 'services/eds';

const useStyles = makeStyles((theme) => ({
  content: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const VerifyHash = () => {
  const [hash, setHash] = React.useState('');
  const [sign, setSign] = React.useState('');
  const [error, setError] = React.useState(null);
  const [result, setResult] = React.useState('');

  const classes = useStyles();

  const handleClick = useCallback(async () => {
    try {
      setError(null);
      const signer = edsService.getSigner();
      const verifyResult = await signer.execute('VerifyHash', hash, sign);
      setResult(verifyResult);
    } catch (e) {
      setError(e.message);
      setResult('');
    }
  }, [hash, sign]);

  return (
    <DialogContent
      className={classes.content}
    >
      <TextField
        variant="outlined"
        multiline={true}
        rows={10}
        label="Хеш"
        value={hash}
        onChange={({ target: { value } }) => setHash(value)}
      />
      <TextField
        variant="outlined"
        multiline={true}
        rows={10}
        label="Підпис"
        value={sign}
        onChange={({ target: { value } }) => setSign(value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Перевірити
      </Button>
      <TextField
        variant="outlined"
        multiline={true}
        rows={10}
        label="Результат"
        value={result || error || ''}
      />
    </DialogContent>
  );
}

export default VerifyHash;