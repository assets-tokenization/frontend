import React from 'react';
import { useTranslate } from 'react-translate';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StatusLabel from 'components/StatusLabel';
import SnackBarWrapper from 'components/Snackbar';
import { ReactComponent as ArrowForwardIcon } from 'assets/images/arrowForwardBlue.svg';
import { deployContract, getAbi, tokenizeAction, getPlatforms, saveP2PSelectedState, denyP2Platform, saveContractData, checkMetaMaskState } from 'actions/contracts';

const styles = (theme) => ({
  card: {
    padding: '16px 24px 16px 24px',
    borderRadius: 4,
    border: '1px solid rgba(233, 235, 241, 1)',
    gap: '24px',
    backgroundColor: '#fff',
    marginBottom: 10,
    maxWidth: 843,
    [theme.breakpoints.down('sm')]: {
      marginLeft: -8,
      marginRight: -8,
      padding: 16,
      marginBottom: 8
    }
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '24px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '21px',
      '& a': {
        textDecoration: 'none',
        color: 'rgba(34, 89, 228, 1)'
      }
    }
  },
  cardNumber: {
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '18px',
    letterSpacing: '0.800000011920929px',
    color: 'rgba(89, 89, 89, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 10,
      fontWeight: 500,
      lineHeight: '14px'
    }
  },
  cardDetails: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  },
  cardDetailsTitle: {
    fontSize: 14,
    lineHeight: '21px',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(89, 89, 89, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      lineHeight: '16px',
      fontWeight: 400
    }
  },
  dot: {
    display: 'block',
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: 'rgba(217, 217, 217, 1)',
    margin: '0 8px'
  },
  divider: {
    marginLeft: -24,
    marginRight: -24,
    height: 1,
    backgroundColor: 'rgba(233, 235, 241, 1)',
    [theme.breakpoints.down('sm')]: {
      marginLeft: -16,
      marginRight: -16
    }
  },
  actions: {
    display: 'flex',
    paddingTop: 16,
    justifyContent: 'space-between'
  },
  actionIcon: {
    marginLeft: 8
  },
  detailsButton: {
    marginLeft: -8
  },
  toTokenButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      alignItems: 'flex-start'
    }
  },
  status: {
    borderRadius: 35,
    color: 'rgba(74, 164, 47, 1)',
    backgroundColor: 'rgba(74, 164, 47, 0.1)',
    border: '1px solid rgba(74, 164, 47, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '0.800000011920929px',
    textTransform: 'uppercase',
    padding: '0 8px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 10,
      lineHeight: '14px',
      marginBottom: 10
    }
  },
  deTokenButton: {
    marginRight: 8,
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginTop: 10
    }
  },
  tokenizedActions: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'flex-start',
      width: '100%',
      '& button': {
        width: '100%'
      }
    }
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: 400,
    lineHeight: '30px',
    marginBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(233, 235, 241, 1)'
  },
  dialogTitle: {
    padding: '7px 16px',
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '27px',
    letterSpacing: '0em',
    backgroundColor: 'rgba(244, 243, 246, 1)',
    border: '1px solid rgba(233, 235, 241, 1)',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 600,
      paddingRight: 0
    }
  },
  dialogContent: {
    padding: 16,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    marginBottom: 10,
    color: 'rgba(0, 0, 0, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px',
      fontWeight: 600
    }
  },
  dialogContentCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  dialogActions: {
    justifyContent: 'flex-start',
    padding: 16,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& button': {
        width: '100%',
        marginLeft: '0!important',
        marginBottom: 10
      }
    }
  },
  dialogContentTitle: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '27px',
    color: 'rgba(0, 0, 0, 1)',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
      lineHeight: '24px'
    }
  },
  dialogContentText: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    color: 'rgba(89, 89, 89, 1)',
    marginBottom: 30,
    marginLeft: 60,
    marginRight: 60,
    maxWidth: 550,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px',
      marginBottom: 15,
      marginLeft: 0,
      marginRight: 0
    }
  },
  removeMargin: {
    margin: 0
  },
  dialogProcessingButton: {
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      marginTop: 5
    }
  },
  successLogo: {
    width: 80,
    height: 80,
    margin: '0 auto',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      width: 56,
      height: 56
    }
  },
  dialogTitleSuccess: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 8,
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  },
  closeIcon: {
    width: 40,
    height: 40,
    [theme.breakpoints.down('sm')]: {
      width: 24,
      height: 24
    }
  },
  circularProgress: {
    color: '#fff',
    marginRight: 8
  },
  circularProgressBlue: {
    marginRight: 8
  },
  mb10: {
    marginBottom: 10
  }
});

const useStyles = makeStyles(styles);

const ListCard = ({
  item,
  item: {
    title,
    tokenized,
    type,
    totalArea,
    livingArea,
    id,
    id_real_estate,
    description
  },
  tokenizeProcess,
  sellingStatus,
  openDetails,
  secondaryActionText,
  mainAction,
  mainActionText,
  hideSecondaryAction,
  finished,
  price,
  detailsLink,
  onSuccess
}) => {
  const t = useTranslate('HomeScreen');
  const [platforms, setPlatforms] = React.useState(null);
  const [platform, setPlatform] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingRemoving, setLoadingRemoving] = React.useState(false);

  const [error, setError] = React.useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  const isSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const savedContracts = useSelector((state) => state?.contract?.contracts);

  const handleTokenize = React.useCallback((event) => {
    if (mainAction) {
      mainAction(event);
    } else {
      tokenizeProcess(event);
    }
  }, [tokenizeProcess, mainAction]);

  const handleClose = React.useCallback(() => {
    setPlatforms(null);
  });

  const handleGetPlatforms = React.useCallback(async () => {
    setLoading(true);

    const platforms = await getPlatforms()(dispatch);

    setPlatforms(platforms);

    setPlatform(platforms[0].address);

    setLoading(false);
  }, [dispatch]);

  const getContractData = React.useCallback(async () => {
    if (savedContracts[id_real_estate]) {
      const { contract, abi } = savedContracts[id_real_estate];

      return {
        contract,
        abi
      };
    };

    const result = await deployContract({
      data: {
        name_contract: title,
        symbol: 'ETH',
        id_real_estate: id_real_estate,
        description: description
      }
    })(dispatch);

    const { contract } = result;

    const abi = (await getAbi()(dispatch)).data;

    saveContractData({
      contract,
      abi,
      id_real_estate
    })(dispatch);
  
    return {
      contract,
      abi
    };
  }, [dispatch, item, savedContracts]);

  const addToP2PPlatform = React.useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);

      const metamaskState = await checkMetaMaskState();

      if (metamaskState !== 'connected') {
        setLoading(false);
        setError(t(metamaskState));
        return;
      }

      const { contract, abi } = await getContractData();

      await tokenizeAction({
        contract,
        abi,
        platform
      });
  
      await saveP2PSelectedState(`${id}?state=true`)(dispatch);

      handleClose();

      setLoading(false);
      
      onSuccess(t('AddPlatformSuccess'));
    } catch (error) {
      setError(t(error.message));
      setLoading(false);
    }
  }, [loading, id, dispatch, platform, handleClose, onSuccess]);

  const removeP2PPlatform = React.useCallback(async () => {
    if (loadingRemoving) return;

    try {
      setLoadingRemoving(true);

      const metamaskState = await checkMetaMaskState();

      if (metamaskState !== 'connected') {
        setLoading(false);
        setError(t(metamaskState));
        return;
      }

      const { contract, abi } = await getContractData();

      await denyP2Platform({
        contract,
        abi
      });

      await saveP2PSelectedState(`${id}?state=false`)(dispatch);

      setLoadingRemoving(false);

      onSuccess(t('RemovePlatformSuccess'));
    } catch (error) {
      setError(t(error.message));
      setLoadingRemoving(false);
    }
  }, [loadingRemoving, dispatch, id, onSuccess]);

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <Typography className={classes.cardNumber}>
          {t('Number', { number: id_real_estate })}
        </Typography>

        <div>
          {tokenized && ![sellingStatus, finished].includes(true) ? (
            <StatusLabel>{t('Tokenized')}</StatusLabel>
          ) : null}
          {sellingStatus ? <StatusLabel pending={true}>{t('Selling')}</StatusLabel> : null}
          {finished ? <StatusLabel finished={true}>{t('Archived')}</StatusLabel> : null}
        </div>
      </div>

      {price ? <Typography className={classes.cardPrice}>{price}</Typography> : null}

      {isSM ? (
        <Typography className={classes.cardTitle}>
          <a href={`${detailsLink || 'details'}/${id}`}>{title}</a>
        </Typography>
      ) : (
        <Typography className={classes.cardTitle}>{title}</Typography>
      )}

      <div className={classes.cardDetails}>
        <Typography className={classes.cardDetailsTitle}>
          {t('BuildType', { value: type })}
          {!isSM ? <span className={classes.dot} /> : null}
        </Typography>
        <Typography className={classes.cardDetailsTitle}>
          {t('BuildArea', { value: totalArea })}
          <span className={classes.dot} />
        </Typography>
        <Typography className={classes.cardDetailsTitle}>
          {t('LivingArea', { value: livingArea })}
        </Typography>
      </div>

      {!isSM || !finished ? <div className={classes.divider} /> : null}

      <div className={classes.actions}>
        {!isSM ? (
          <Button className={classes.detailsButton} onClick={() => openDetails(id)}>
            {t('ObjectDetails')}
            <ArrowForwardIcon className={classes.actionIcon} />
          </Button>
        ) : null}

        {!finished ? (
          <>
            {tokenized && !hideSecondaryAction ? (
              <div className={classes.tokenizedActions}>
                <Button
                  color={!secondaryActionText ? 'error' : 'primary'}
                  className={classes.deTokenButton}
                  onClick={secondaryActionText ? removeP2PPlatform : null}
                >
                  {
                    loadingRemoving ? (
                      <CircularProgress
                        size={16}
                        className={classes.circularProgressBlue}
                      />
                    ) : null
                  }
                  {secondaryActionText || t('DeToken')}
                </Button>
                <Button
                  variant="contained"
                  className={classes.toTokenButton} 
                  onClick={mainActionText ? null : handleGetPlatforms}
                  >
                  {
                    loading ? (
                      <CircularProgress
                        size={16}
                        className={classes.circularProgress}
                      />
                    ) : null
                  }
                  {mainActionText || t('ToP2P')}
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                className={classes.toTokenButton}
                onClick={() => handleTokenize(item)}
              >
                {mainActionText || t('ToToken')}
              </Button>
            )}
          </>
        ) : null}
      </div>

      <Dialog open={!!platforms}>
        <DialogTitle
          classes={{
            root: classes.dialogTitle
          }}
        >
          {t('SelectPlatformTitle')}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          classes={{
            root: classes.dialogContent
          }}
        >
          <DialogContentText
            classes={{
              root: classNames({
                [classes.dialogContentText]: true,
                [classes.removeMargin]: true,
                [classes.mb10]: true
              })
            }}
          >
            {t('SelectPlatformText')}
          </DialogContentText>

          <FormControl component="fieldset">
            <RadioGroup
              aria-label="platform"
              name="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {(platforms || []).map(({ name, address }) => (
                <FormControlLabel
                  key={name}
                  value={address}
                  control={<Radio />}
                  label={name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <div className={classes.divider} />

        <DialogActions
          classes={{
            root: classes.dialogActions
          }}
        >
          <Button variant="contained" onClick={addToP2PPlatform}>
            {
              loading ? (
                <CircularProgress
                  size={16}
                  className={classes.circularProgress}
                />
              ) : null
            }
            {t('Continue')}
          </Button>
          <Button onClick={handleClose}>{t('Cancel')}</Button>
        </DialogActions>
      </Dialog>

      <SnackBarWrapper
        onClose={() => setError(false)} 
        error={error}
      />
    </div>
  );
};

export default ListCard;
