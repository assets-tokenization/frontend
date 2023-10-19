import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import Fade from '@mui/material/Fade';
import { Typography, TextField, Button } from '@mui/material';
import PageTitle from 'components/PageTitle';
import ListCard from 'components/ListCard';
import Card from 'components/Card';
import Stepper from 'components/Stepper';
import SuccessRegistration from 'components/SuccessRegistration';
import { ReactComponent as ArrowForwardIcon } from 'assets/images/arrowForwardWhite.svg';
import { ReactComponent as LockIcon } from 'assets/images/lock_icon.svg';

const PurchasesStep = ({
  t,
  classes,
  toDetailsObject,
  purchase,
  setPurchase,
  isSM,
  NumberFormatCustom,
  activeStep,
  setActiveStep,
  objects
}) => {
  const wallet = useSelector((state) => state?.profile?.userInfo?.wallet);

  const renderStep = React.useMemo(
    () => (
      <Fade in={true}>
        <div>
          {purchase ? (
            <>
              <PageTitle>{t('PurchasesObjectTitle')}</PageTitle>

              <Card fullWidth={true}>
                <Typography className={classes.briefInfoTitle}>
                  {'Івано-Франківська обл., м. Івано-Франківськ, вул. Вʼячеслава Чорновола, 15'}
                </Typography>

                <div className={classes.cardDetails}>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('BuildType', { value: 'Будинок' })}
                    {!isSM ? <span className={classes.dot} /> : null}
                  </Typography>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('BuildArea', { value: '6 сот' })}
                    <span className={classes.dot} />
                  </Typography>
                  <Typography className={classes.cardDetailsTitle}>
                    {t('LivingArea', { value: '140 м2' })}
                  </Typography>
                </div>
              </Card>

              <div className={classes.cardsWrapper}>
                <Card>
                  <Stepper
                    activeStep={activeStep}
                    steps={[
                      {
                        label: t('PurchasesStep1label'),
                        description: t('PurchasesStep1description')
                      },
                      {
                        label: t('PurchasesStep2label'),
                        description: t('PurchasesStep2description')
                      }
                    ]}
                  />
                </Card>

                <Card>
                  {activeStep === 0 ? (
                    <>
                      <Typography
                        className={classNames({
                          [classes.headline]: true,
                          [classes.mb32]: true
                        })}
                      >
                        {t('ObjectPaymentTitle')}
                      </Typography>

                      <Typography className={classes.fieldHeadline}>{t('WalletTitle')}</Typography>

                      <div
                        className={classNames({
                          [classes.relative]: true,
                          [classes.maxWidth]: true
                        })}
                      >
                        <TextField
                          value={wallet}
                          variant="outlined"
                          margin="normal"
                          placeholder={t('PricePlaceHolder')}
                          disabled={true}
                          className={classNames({
                            [classes.textfield]: true,
                            [classes.mb32]: true,
                            [classes.mb16Sm]: true,
                            [classes.disabledTextField]: true
                          })}
                        />
                        <LockIcon className={classes.lockIcon} />
                      </div>

                      <Typography className={classes.fieldHeadline}>{t('SumToPay')}</Typography>

                      <div
                        className={classNames({
                          [classes.relative]: true,
                          [classes.maxWidth]: true
                        })}
                      >
                        <TextField
                          value={'2 000 345,00'}
                          variant="outlined"
                          margin="normal"
                          placeholder={t('PricePlaceHolder')}
                          disabled={true}
                          className={classNames({
                            [classes.textfield]: true,
                            [classes.disabledTextField]: true
                          })}
                          InputProps={{
                            inputComponent: NumberFormatCustom
                          }}
                        />

                        <LockIcon className={classes.lockIcon} />
                      </div>

                      <Typography
                        className={classNames({
                          [classes.fieldSample]: true,
                          [classes.mb32]: true,
                          [classes.mb16Sm]: true
                        })}
                      >
                        {t('SumToPaySample')}
                      </Typography>

                      <div
                        className={classNames({
                          [classes.actions]: true,
                          [classes.alignLeft]: true,
                          [classes.alignCenterSm]: true
                        })}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setPurchase(false);
                          }}
                          className={classNames({
                            [classes.mr16]: true
                          })}
                        >
                          {t('CancelProcessing')}
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setActiveStep(2);
                          }}
                        >
                          {t('ToPayment')}
                          <ArrowForwardIcon className={classes.actionIcon} />
                        </Button>
                      </div>
                    </>
                  ) : null}
                  {activeStep === 2 ? (
                    <SuccessRegistration
                      title={t('PurchasesSuccessTitle')}
                      description={t('PurchasesSuccessDescription')}
                      actionText={t('PurchasesSuccess')}
                      redirectToHomeScreen={() => {
                        setPurchase(false);
                        setActiveStep(0);
                      }}
                    />
                  ) : null}
                </Card>
              </div>
            </>
          ) : (
            <>
              <PageTitle>{t('PurchasesTitle')}</PageTitle>

              <>
                {objects.length ? (
                  <>
                    {objects.map((item, index) => (
                      <ListCard
                        item={item}
                        key={index}
                        openDetails={toDetailsObject}
                        price={item?.price}
                        mainAction={(number) => {
                          setPurchase(number);
                        }}
                        hideSecondaryAction={true}
                        mainActionText={t('StartPurchase')}
                        detailsLink={`/market/${item.number}`}
                      />
                    ))}
                  </>
                ) : (
                  <div className={classes.noResults}>{t('NoPurchasesText')}</div>
                )}
              </>
            </>
          )}
        </div>
      </Fade>
    ),
    [
      t,
      classes,
      toDetailsObject,
      purchase,
      setPurchase,
      isSM,
      NumberFormatCustom,
      activeStep,
      setActiveStep,
      objects,
      wallet
    ]
  );

  return renderStep;
};

export default PurchasesStep;
