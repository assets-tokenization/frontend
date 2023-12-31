import React from 'react';
import { useTranslate } from 'react-translate';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from 'components/Header';
import LazyLoad from 'assets/images/lazy_load_market.png';
import SidebarMenu from 'components/SidebarMenu';
import ObjectScreen from 'pages/ObjectScreen';
import Preloader from 'components/Preloader';
import EmptyState from 'components/EmptyState';
import SnackBarWrapper from 'components/Snackbar';
import ProgressLine from 'components/Preloader/ProgressLine';
import ObjectsStep from './components/ObjectsStep';
import SellingStep from './components/SellingStep';
import MessagesStep from './components/MessagesStep';
import PurchasesStep from './components/PurchasesStep';
import { getObjects } from 'actions';
import { getOffers, getObjectInfoByContract, getDeal } from 'actions/contracts';

const styles = (theme) => ({
  wrapper: {
    paddingLeft: 60,
    paddingRight: 60,
    marginBottom: 60,
    [theme.breakpoints.down('sm')]: {
      padding: '16px 8px',
      marginBottom: 60,
      paddingTop: 0
    }
  },
  objectWrapper: {
    padding: 0
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
  },
  layout: {
    display: 'flex',
    minHeight: '100vh'
  },
  rightSide: {
    width: '100%'
  },
  noResults: {
    color: '#595959',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '24px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px',
      marginLeft: 8
    }
  },
  briefInfoTitle: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px'
  },
  cardDetails: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
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
  cardsWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    '& > div:first-child': {
      flex: 1,
      marginRight: 24
    },
    '& > div:last-child': {
      flex: 2,
      paddingBottom: 40
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'inherit',
      '& > div:first-child': {
        marginRight: 0
      },
      '& > div:last-child': {
        paddingBottom: 16
      }
    }
  },
  price: {
    color: '#4AA42F'
  },
  headline: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '27px',
    marginBottom: 8
  },
  subHeadline: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
    marginBottom: 32,
    color: '#595959',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 24
    }
  },
  fieldHeadline: {
    fontSize: 14,
    fontWeight: 400,
    color: '#1A1A1A',
    marginBottom: 8,
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      lineHeight: '16px'
    }
  },
  fieldSample: {
    fontSize: 11,
    fontWeight: 400,
    color: '#595959'
  },
  textfield: {
    width: '100%'
  },
  cardContent: {
    width: 328,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  actions: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom: 18
    },
    '& > button': {
      justifyContent: 'space-around'
    },
    '& > button:first-child': {
      minWidth: 132,
      [theme.breakpoints.down('sm')]: {
        minWidth: 'unset'
      }
    },
    '& > button:last-child': {
      minWidth: 182,
      marginLeft: 16,
      [theme.breakpoints.down('sm')]: {
        minWidth: 'unset',
        marginLeft: 'unset'
      }
    }
  },
  rnokppShort: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
    marginBottom: 4,
    color: '#595959'
  },
  userNameHeadline: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    marginBottom: 16
  },
  fieldHeadlineSM: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '20px'
    }
  },
  alignLeft: {
    justifyContent: 'flex-start',
    '& > button:last-child': {
      marginLeft: 0
    }
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    marginBottom: 32,
    color: '#595959',
    maxWidth: 618,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px'
    }
  },
  messagesDate: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '21px',
    marginBottom: 12,
    color: '#595959',
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      lineHeight: '16px'
    }
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '27px',
    marginBottom: 16,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px'
    }
  },
  messagesText: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '24px',
    marginBottom: 24,
    color: '#595959',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '21px'
    }
  },
  alignCenter: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginBottom: 0
    }
  },
  tab: {
    fontSize: 14,
    lineHeight: '20px',
    textTransform: 'initial',
    [theme.breakpoints.down('md')]: {
      fontSize: 14,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      margin: 0
    }
  },
  containerXs: {
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-between'
    }
  },
  tabsWrapper: {
    marginBottom: 32,
    borderBottom: '1px solid rgb(34 89 228 / 10%)',
    maxWidth: 843,
    [theme.breakpoints.down('md')]: {
      padding: '0px 8px'
    }
  },
  tabSelected: {
    backgroundColor: 'rgba(34, 89, 228, 0.05)'
  },
  mb32: {
    marginBottom: 32,
    [theme.breakpoints.down('md')]: {
      marginBottom: 24
    }
  },
  mb16Sm: {
    [theme.breakpoints.down('md')]: {
      marginBottom: 16
    }
  },
  maxWidth: {
    maxWidth: 465
  },
  ml16: {
    marginLeft: 16
  },
  mr16: {
    marginRight: 16,
    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    }
  },
  relative: {
    position: 'relative'
  },
  lockIcon: {
    position: 'absolute',
    top: 20,
    right: -22,
    width: 16,
    height: 16,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  disabledTextField: {
    background: '#F4F4F4',
    color: '#000000'
  },
  alignCenterSm: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      '& > button': {
        justifyContent: 'center'
      },
      '& > button:last-child': {
        marginBottom: 8
      }
    }
  },
  cutTextByDots: {
    '& input': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  },
  messagesCard: {
    marginBottom: 16
  },
  actionIcon: {
    marginLeft: 10
  }
});

const useStyles = makeStyles(styles);

const MarketScreen = ({
  history,
  match: {
    params: { objectId }
  }
}) => {
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState('Objects');
  const [objects, setData] = React.useState([]);
  const [walletToSell, setWalletToSell] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [buyerData, setBuyerData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [creatingOffer, setCreatingOffer] = React.useState(false);
  const [purchase, setPurchase] = React.useState(null);
  const [activeSellingStep, setActiveSellingStep] = React.useState(0);
  const [activeBuyStep, setActiveBuyStep] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [myOffers, setMyOffers] = React.useState([]);

  const dispatch = useDispatch();

  const t = useTranslate('MarketScreen');
  const classes = useStyles();
  const isSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const getOffersAction = React.useCallback(async () => {
    try {
      const result = await getOffers();

      if (!result || !result.length) return;

      const offersArray = [];

      for (let i = 0; i < result.length; i++) {
        const item = result[i];

        const objectInfo = await getObjectInfoByContract(item)(dispatch);

        if (!objectInfo) return;

        if (!Object.keys(objectInfo?.data).length) continue;

        const dealInfo = await getDeal(item);

        if (dealInfo.Status === true) continue;

        offersArray.push({
          ...objectInfo?.data,
          dealAddress: item,
          dealInfo
        });
      }

      setMyOffers(offersArray);
    }
    catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  const updateList = React.useCallback(async ({ updating } = {}) => {
    try {
      if (updating) {
        setUpdating(true);
        await getOffersAction();

      } else {
        setLoading(true);
      }

      const result = await getObjects()(dispatch);

      if (result instanceof Error) {
        setLoading(false);
        setErrorMessage(result?.message);
        return;
      }

      const onlyWithPlatform = result.data.filter((item) => item.is_selected_p2p);

      setData(onlyWithPlatform);

      setLoading(false);
      setUpdating(false);
    } catch (e) {
      setErrorMessage(e?.message);
      setLoading(false);
      setUpdating(false);
    }
  }, [dispatch]);

  React.useEffect(() => getOffersAction(), [getOffersAction]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        updateList();
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, updateList]);

  const objectsList = React.useMemo(() => {
    if (!objects.length) return [];
    return objects.filter((item) => !item?.selling && !item?.purchase);
  }, [objects]);

  const sellingList = React.useMemo(() => {
    if (!objects.length) return [];
    return objects.filter((item) => item?.selling);
  }, [objects]);

  const purchaseList = React.useMemo(() => {
    if (!myOffers.length) return [];
    return myOffers;
  }, [myOffers]);

  const toDetailsObject = React.useCallback(
    (number) => {
      history.push(`/market/${number}`);
    },
    [history]
  );

  const toMyObjects = React.useCallback(() => {
    history.replace('/');
  }, [history]);

  const toPurchase = React.useCallback((number) => {
    setPage('Purchases');
    setPurchase(number);
  }, []);

  const formatPrice = React.useCallback((value) => {
    if (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    return '';
  }, []);

  const onSuccess = React.useCallback((successMessage) => {
    if (successMessage) {
      setSuccess(successMessage);
    }
    updateList({
      updating: true
    });
  });

  const RenderSuccessMessage = React.useMemo(() => {
    return (
      <SnackBarWrapper
        onClose={() => setSuccess(false)} 
        error={success}
        severity="success"
      />
    )
  }, [success]);

  const handleChangePage = React.useCallback((data) => {
    if (objectId) {
      history.push('/market');
    }
    setPage(data);
    setCreatingOffer(false);
    setPurchase(null);
    setActiveSellingStep(0);
    setActiveBuyStep(0);

    window.scrollTo(0, 0);
  }, [history, objectId]);

  if (loading) {
    if (isSM) return <Preloader />;

    return <img src={LazyLoad} alt="lazy load table preview" className={classes.lazyLoad} />;
  }

  return (
    <div className={classes.layout}>
      <SidebarMenu
        onChange={handleChangePage}
        page={page}
        history={history}
        messages={purchaseList}
      />

      <div className={classes.rightSide}>
        <Header
          navigateClick={toMyObjects}
          navigateText={t('NavigateText')}
          title={t('HeaderTitle')}
          hideLogo={!isSM}
          hideSMbutton={true}
          history={history}
        />

        {errorMessage ? (
          <div
            className={classNames({
              [classes.wrapper]: true
            })}
          >
            <EmptyState error={true}>{errorMessage}</EmptyState>
          </div>
        ) : (
          <div
            className={classNames({
              [classes.wrapper]: true,
              [classes.objectWrapper]: objectId
            })}
          >
            {objectId ? (
              <ObjectScreen
                hideHeader={true}
                readOnly={true}
                handleClickBack={() => history.push('/market')}
                onSuccess={onSuccess}
              />
            ) : (
              <>
                <ProgressLine loading={updating} />

                {page === 'Objects' ? (
                  <ObjectsStep
                    t={t}
                    toDetailsObject={toDetailsObject}
                    toMyObjects={toMyObjects}
                    classes={classes}
                    setPage={setPage}
                    setCreatingOffer={setCreatingOffer}
                    objects={objectsList}
                    loading={loading}
                    onSuccess={onSuccess}
                  />
                ) : null}

                {page === 'Selling' ? (
                  <SellingStep
                    buyerData={buyerData}
                    classes={classes}
                    isSM={isSM}
                    walletToSell={walletToSell}
                    error={error}
                    price={price}
                    formatPrice={formatPrice}
                    creatingOffer={creatingOffer}
                    toDetailsObject={toDetailsObject}
                    setBuyerData={setBuyerData}
                    setWalletToSell={setWalletToSell}
                    setPrice={setPrice}
                    setError={setError}
                    setCreatingOffer={setCreatingOffer}
                    t={t}
                    activeStep={activeSellingStep}
                    setActiveStep={setActiveSellingStep}
                    objects={sellingList}
                    onSuccess={onSuccess}
                  />
                ) : null}

                {page === 'Purchases' ? (
                  <PurchasesStep
                    t={t}
                    classes={classes}
                    toDetailsObject={toDetailsObject}
                    purchase={purchase}
                    setPurchase={setPurchase}
                    isSM={isSM}
                    activeStep={activeBuyStep}
                    setActiveStep={setActiveBuyStep}
                    objects={purchaseList}
                    onSuccess={onSuccess}
                  />
                ) : null}

                {page === 'Messages' ? (
                  <MessagesStep
                    t={t}
                    classes={classes}
                    toPurchase={toPurchase}
                    messages={purchaseList}
                    onSuccess={onSuccess}
                  />
                ) : null}
              </>
            )}
          </div>
        )}

        {RenderSuccessMessage}
      </div>
    </div>
  );
};

export default MarketScreen;
