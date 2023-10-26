import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslate } from 'react-translate';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import EmptyState from 'components/EmptyState';
import ListCard from 'components/ListCard';
import Tokenize from 'components/Tokenize';
import LazyLoad from 'assets/images/lazy_load.png';
import Preloader from 'components/Preloader';
import SnackBarWrapper from 'components/Snackbar';
import ProgressLine from 'components/Preloader/ProgressLine';
import { getRealEstate } from 'actions';

const styles = (theme) => ({
  warningBlock: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(to right, #F5EDFF, #F5EDFF)',
    border: '1px solid rgba(149, 71, 246, 1)',
    borderRadius: 4,
    padding: 11
  },
  icon: {
    marginRight: 10,
    fill: 'rgba(79, 79, 79, 1)'
  },
  wrapper: {
    maxWidth: 845,
    paddingLeft: 60,
    marginBottom: 60,
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px',
      marginBottom: 60
    }
  },
  warningText: {
    fontSize: 14,
    lineHeight: '20px',
    color: 'rgba(31, 31, 31, 1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      lineHeight: '16px'
    }
  },
  searchResult: {
    fontSize: 14,
    lineHeight: '21px',
    marginBottom: 20,
    marginTop: 50,
    color: 'rgba(29, 29, 29, 1)',
    [theme.breakpoints.down('sm')]: {
      marginTop: 24,
      marginBottom: 8
    }
  },
  lazyLoad: {
    animation: '$fadeIn 2s ease-in-out infinite',
    opacity: 1,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 1
    },
    '50%': {
      opacity: 0
    },
    '100%': {
      opacity: 1
    }
  }
});

const useStyles = makeStyles(styles);

const HomeScreen = ({ history }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [tokenize, setTokenize] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  const t = useTranslate('HomeScreen');
  const classes = useStyles();
  const dispatch = useDispatch();

  const isSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const tokenizeProcess = (objectData) => setTokenize(objectData);

  const updateList = React.useCallback(async ({ updating } = {}) => {
    try {
      if (updating) {
        setUpdating(true)
      } else {
        setLoading(true);
      }

      const result = await getRealEstate()(dispatch);

      if (result instanceof Error) {
        setError(true);
        setLoading(false);
        return;
      }

      const onlyWithoutPlatform = result.data.filter((item) => !item.is_selected_p2p);

      setData(onlyWithoutPlatform);
      setLoading(false);
      setUpdating(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
      setUpdating(false);
    }
  }, [dispatch]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        updateList()
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, updateList]);

  const onSuccess = React.useCallback((successMessage) => {
    setSuccess(successMessage);
    updateList({
      updating: true
    });
  });

  const toDetailsObject = React.useCallback((id) => history.push(`/details/${id}`), [history]);

  const toMarket = React.useCallback(() => history.push('/market'), [history]);

  const RenderSuccessMessage = React.useMemo(() => {
    return (
      <SnackBarWrapper
        onClose={() => setSuccess(false)} 
        error={success}
        severity="success"
      />
    )
  }, [success]);

  if (loading) {
    if (isSM) return <Preloader />;

    return <img src={LazyLoad} alt="lazy load table preview" className={classes.lazyLoad} />;
  }

  return (
    <>
      <Header history={history} navigateClick={toMarket} />

      <div className={classes.wrapper}>
        <PageTitle>{t('Title')}</PageTitle>

        {error ? (
          <EmptyState error={true}>{error}</EmptyState>
        ) : (
          <>
            <div className={classes.warningBlock}>
              <ErrorOutlineOutlinedIcon className={classes.icon} />
              <Typography className={classes.warningText}>
                {t('WarningText')}
              </Typography>
            </div>

            <ProgressLine loading={updating} />

            {data.length ? (
              <>
                <Typography className={classes.searchResult}>
                  {t('SearchCount', {
                    count: data.length
                  })}
                </Typography>
                {data.map((item, index) => (
                  <ListCard
                    item={item}
                    key={index}
                    tokenizeProcess={tokenizeProcess}
                    openDetails={toDetailsObject}
                    onSuccess={onSuccess}
                  />
                ))}
              </>
            ) : (
              <EmptyState onClick={toMarket}>
                {t('EmptyState')}
              </EmptyState>
            )}

            <Tokenize
              tokenize={tokenize}
              setTokenize={setTokenize}
              openDetails={toDetailsObject}
              updateList={updateList}
            />

            {RenderSuccessMessage}
          </>
        )}
      </div>
    </>
  );
};

export default HomeScreen;
