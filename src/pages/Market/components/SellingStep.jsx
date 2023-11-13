import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Typography, TextField, Button, FormControl, FormHelperText } from '@mui/material';
import Fade from '@mui/material/Fade';
import PageTitle from 'components/PageTitle';
import ListCard from 'components/ListCard';
import Stepper from 'components/Stepper';
import Card from 'components/Card';
import LoadingStep from 'components/LoadingStep';
import SnackBarWrapper from 'components/Snackbar';
import SuccessRegistration from 'components/SuccessRegistration';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { createOffer, checkMetaMaskState } from 'actions/contracts';

const SellingStep = ({
  buyerData,
  classes,
  isSM,
  walletToSell,
  error,
  price,
  formatPrice,
  creatingOffer,
  toDetailsObject,
  setBuyerData,
  setWalletToSell,
  setPrice,
  setError,
  setCreatingOffer,
  t,
  activeStep,
  setActiveStep,
  objects
}) => {
  const [offerError, setOfferError] = React.useState(null);
  const walletPlaceholder = useSelector((state) => state?.profile?.userInfo?.wallet);

  const handleCreateOffer = React.useCallback(async () => {
    try {
      const metamaskState = await checkMetaMaskState();

      if (metamaskState !== 'connected') {
        setLoading(false);
        setOfferError(t(metamaskState));
        return;
      }

      const tx = await createOffer({
        price,
        contract: creatingOffer.address_contract,
        walletToSell
      });

      return tx;
    } catch (error) {
      setActiveStep(1);
      setOfferError(t(error.message));
    }
  }, [setOfferError, t, creatingOffer, price, walletToSell, setActiveStep]);

  const handleCreateOfferActions = React.useCallback(async () => {
    if (!price.length) {
      setError(true);
      return;
    }

    setError(false);

    const tx = handleCreateOffer();

    if (!tx) return;

    setActiveStep(2);
  }, [setActiveStep, setError, price, handleCreateOffer]);

  const renderStep = React.useMemo(
    () => (
      <Fade in={true}>
        <div>
          <PageTitle>{t(creatingOffer ? 'SellingTitle' : 'NoSellingTitle')}</PageTitle>
          {creatingOffer ? (
            <>
              <Card fullWidth={true}>
                <Typography className={classes.briefInfoTitle}>{creatingOffer?.address}</Typography>

                <div className={classes.cardDetails}>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('BuildType', { value: creatingOffer?.type })}
                    {!isSM ? <span className={classes.dot} /> : null}
                  </Typography>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('BuildArea', { value: creatingOffer?.totalArea })}
                    <span className={classes.dot} />
                  </Typography>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('LivingArea', { value: creatingOffer?.livingArea })}
                  </Typography>
                </div>
              </Card>

              <div className={classes.cardsWrapper}>
                <Card>
                  <Stepper
                    activeStep={activeStep}
                    steps={[
                      {
                        label: t('Step1label'),
                        description: t('Step1description')
                      },
                      {
                        label: t('Step2label'),
                        description: t('Step2description')
                      },
                      {
                        label: t('Step3label'),
                        description: t('Step3description')
                      }
                    ]}
                  />
                </Card>

                <Card>
                  {activeStep === 0 ? (
                    <div className={classes.cardContent}>
                      <Typography className={classes.headline}>{t('UserIpnTitle')}</Typography>

                      <Typography className={classes.subHeadline}>
                        {t('UserIpnDescription')}
                      </Typography>

                      {buyerData ? (
                        <>
                          <Typography className={classes.userNameHeadline}>
                            {t('buyerDataHeadLine')}
                          </Typography>

                          <Typography className={classes.rnokppShort}>
                            {t('UserIpnShort')}
                          </Typography>

                          <Typography
                            className={classNames({
                              [classes.fieldHeadline]: true,
                              [classes.fieldHeadlineSM]: true
                            })}>
                            {buyerData}
                          </Typography>

                          <div className={classes.actions}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setBuyerData(null);
                              }}>
                              <ArrowBackOutlinedIcon />
                              {t('Back')}
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={() => setActiveStep(1)}>
                              {t('Continue')}
                              <ArrowForwardIcon />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Typography className={classes.fieldHeadline}>{t('UserIpn')}</Typography>

                          <TextField
                            value={walletToSell}
                            onChange={(e) => setWalletToSell(e.target.value)}
                            error={!!error}
                            maxLength={10}
                            variant="outlined"
                            margin="normal"
                            placeholder={t('UserIpnPlaceHolder', {
                              value: walletPlaceholder
                            })}
                            className={classes.textfield}
                            inputProps={{
                              maxLength: 42
                            }}
                          />

                          {error ? (
                            <FormControl variant="standard" error={true}>
                              <FormHelperText>{t('RequiredError')}</FormHelperText>
                            </FormControl>
                          ) : null}

                          <div className={classes.actions}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setCreatingOffer(false);
                              }}>
                              {t('CancelProcessing')}
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={() => {
                                if (walletToSell.length !== 42) {
                                  setError(true);
                                  return;
                                }

                                setError(false);

                                setBuyerData(walletToSell);
                              }}>
                              {t('Continue')}
                              <ArrowForwardIcon />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}

                  {activeStep === 1 ? (
                    <div className={classes.cardContent}>
                      <Typography className={classes.headline}>{t('InsertSumTitle')}</Typography>

                      <Typography className={classes.subHeadline}>
                        {t('InsertSumDescription')}
                      </Typography>

                      <Typography className={classes.fieldHeadline}>{t('Price')}</Typography>

                      <TextField
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        error={error}
                        variant="outlined"
                        margin="normal"
                        placeholder={t('PricePlaceHolder')}
                        className={classes.textfield}
                      />

                      {error ? (
                        <FormControl variant="standard" error={true}>
                          <FormHelperText>{t('RequiredError')}</FormHelperText>
                        </FormControl>
                      ) : null}

                      <div
                        className={classNames({
                          [classes.actions]: true,
                          [classes.alignLeft]: true
                        })}>
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={handleCreateOfferActions}
                        >
                          {t('Continue')}
                          <ArrowForwardIcon />
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {activeStep === 2 ? (
                    <LoadingStep
                      title={t('SellingProcessingTitle')}
                      description={t('SellingProcessingDescription')}
                      actionText={t('CancelProcessing')}
                      onClick={() => setActiveStep(1)}
                    />
                  ) : null}

                  {activeStep === 3 ? (
                    <SuccessRegistration
                      title={t('SellingSuccessTitle')}
                      description={
                        <>
                          {t('SellingSuccessDescription')}
                          <span className={classes.price}>{formatPrice(price)} грн. </span>
                          {t('SellingSuccessDescription2')}
                        </>
                      }
                      actionText={t('SuccessSelling')}
                      redirectToHomeScreen={() => setCreatingOffer(false)}
                    />
                  ) : null}
                </Card>
              </div>
            </>
          ) : (
            <>
              {objects.length ? (
                <>
                  {objects.map((item, index) => (
                    <ListCard
                      item={item}
                      key={index}
                      openDetails={toDetailsObject}
                      mainAction={(number) => {
                        console.log('number', number);
                      }}
                      hideSecondaryAction={true}
                      mainActionText={t('CancelSelling')}
                      sellingStatus={item?.selling}
                      detailsLink={`/market/${item.id}`}
                    />
                  ))}
                </>
              ) : (
                <div className={classes.noResults}>{t('NoSellingText')}</div>
              )}
            </>
          )}
        </div>
      </Fade>
    ),
    [
      activeStep,
      buyerData,
      classes,
      isSM,
      walletToSell,
      t,
      error,
      price,
      formatPrice,
      creatingOffer,
      toDetailsObject,
      setActiveStep,
      setBuyerData,
      setWalletToSell,
      setPrice,
      setCreatingOffer,
      setError,
      objects,
      handleCreateOffer,
      handleCreateOfferActions
    ]
  );

  return (
    <>
      {renderStep}
      <SnackBarWrapper onClose={() => setOfferError(false)} error={offerError} />
    </>
  );
};

export default SellingStep;
