import React from 'react';
import { useTranslate } from 'react-translate';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Button, CircularProgress } from '@mui/material';
import { ReactComponent as ArrowForwardIcon } from 'assets/images/arrowForwardBlue.svg';
import StatusLabel from 'components/StatusLabel';
import SnackBarWrapper from 'components/Snackbar';

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
  circularProgress: {
    color: '#fff',
    marginRight: 8
  }
});

const useStyles = makeStyles(styles);

const ListCard = ({
  item,
  item: { title, number, tokenized, type, totalArea, livingArea, id },
  tokenizeProcess,
  sellingStatus,
  openDetails,
  secondaryActionText,
  mainAction,
  mainActionText,
  hideSecondaryAction,
  finished,
  price,
  detailsLink
}) => {
  const t = useTranslate('HomeScreen');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const classes = useStyles();

  const isSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleTokenize = (event) => {
    if (mainAction) {
      mainAction(event);
    } else {
      tokenizeProcess(event);
    }
  };

  const addToP2PPlatform = async () => {
    if (loading) return;

    try {
      setLoading(true);

  
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <Typography className={classes.cardNumber}>{t('Number', { number })}</Typography>

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
                >
                  {secondaryActionText || t('DeToken')}
                </Button>
                <Button
                  variant="contained"
                  className={classes.toTokenButton} 
                  onClick={addToP2PPlatform}
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

      <SnackBarWrapper
        onClose={() => setError(false)} 
        error={error}
      />
    </div>
  );
};

export default ListCard;
