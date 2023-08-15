import React from "react";
import classNames from "classnames";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Fade from "@mui/material/Fade";
import PageTitle from "components/PageTitle";
import ListCard from "components/ListCard";
import Stepper from "components/Stepper";
import Card from "components/Card";
import LoadingStep from "components/LoadingStep";
import SuccessRegistration from "components/SuccessRegistration";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const data = [
  {
    title:
      "Івано-Франківська обл., м. Івано-Франківськ, вул. Вʼячеслава Чорновола, 15",
    number: "1209141981209",
    tokenized: true,
    type: 'Будинок',
    totalArea: '6 сот',
    livingArea: '140 м2',
    selling: true,
  },
];

const SellingStep = ({
  buyerData,
  classes,
  isSM,
  rnokpp,
  error,
  price,
  formatPrice,
  creatingOffer,
  toDetailsObject,
  setBuyerData,
  setRnokpp,
  setPrice,
  NumberFormatCustom,
  setError,
  setCreatingOffer,
  t,
  activeStep,
  setActiveStep
}) => {

  const renderStep = React.useMemo(
    () => (
      <Fade in={true}>
        <div>
          <PageTitle>
            {t(creatingOffer ? "SellingTitle" : "NoSellingTitle")}
          </PageTitle>
          {creatingOffer ? (
            <>
              <Card
                fullWidth={true}
              >
                <Typography className={classes.briefInfoTitle}>
                  {
                    "Івано-Франківська обл., м. Івано-Франківськ, вул. Вʼячеслава Чорновола, 15"
                  }
                </Typography>

                <div className={classes.cardDetails}>
                  <Typography className={classes.cardDetailsTitle}>
                    {t("BuildType", { value: "Будинок" })}
                    {!isSM ? <span className={classes.dot} /> : null}
                  </Typography>
                  <Typography className={classes.cardDetailsTitle}>
                    {t("BuildArea", { value: "6 сот" })}
                    <span className={classes.dot} />
                  </Typography>
                  <Typography className={classes.cardDetailsTitle}>
                    {t("LivingArea", { value: "140 м2" })}
                  </Typography>
                </div>
              </Card>

              <div className={classes.cardsWrapper}>
                <Card>
                  <Stepper
                    activeStep={activeStep}
                    steps={[
                      {
                        label: t("Step1label"),
                        description: t("Step1description"),
                      },
                      {
                        label: t("Step2label"),
                        description: t("Step2description"),
                      },
                      {
                        label: t("Step3label"),
                        description: t("Step3description"),
                      },
                    ]}
                  />
                </Card>

                <Card>
                  {activeStep === 0 ? (
                    <div className={classes.cardContent}>
                      <Typography className={classes.headline}>
                        {t("UserIpnTitle")}
                      </Typography>

                      <Typography className={classes.subHeadline}>
                        {t("UserIpnDescription")}
                      </Typography>

                      {buyerData ? (
                        <>
                          <Typography className={classes.userNameHeadline}>
                            {buyerData.name}
                          </Typography>

                          <Typography className={classes.rnokppShort}>
                            {t("UserIpnShort")}
                          </Typography>

                          <Typography
                            className={classNames({
                              [classes.fieldHeadline]: true,
                              [classes.fieldHeadlineSM]: true,
                            })}
                          >
                            {buyerData.rkokpp}
                          </Typography>

                          <div className={classes.actions}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setBuyerData(null);
                              }}
                            >
                              <ArrowBackOutlinedIcon />
                              {t("Back")}
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={() => setActiveStep(1)}
                            >
                              {t("Continue")}
                              <ArrowForwardIcon />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Typography className={classes.fieldHeadline}>
                            {t("UserIpn")}
                          </Typography>

                          <TextField
                            value={rnokpp}
                            onChange={(e) => setRnokpp(e.target.value)}
                            error={error}
                            maxLength={10}
                            variant="outlined"
                            margin="normal"
                            placeholder={t("UserIpnPlaceHolder")}
                            className={classes.textfield}
                            inputProps={{
                              maxLength: 10,
                            }}
                          />

                          {error ? (
                            <FormControl variant="standard" error={true}>
                              <FormHelperText>
                                {t("RequiredError")}
                              </FormHelperText>
                            </FormControl>
                          ) : (
                            <Typography className={classes.fieldSample}>
                              {t("UserIpnSample")}
                            </Typography>
                          )}

                          <div className={classes.actions}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setCreatingOffer(false);
                              }}
                            >
                              {t("CancelProcessing")}
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={() => {
                                if (rnokpp.length !== 10) {
                                  setError(true);
                                  return;
                                }

                                setError(false);

                                setBuyerData({
                                  name: "Франко Іван Якович",
                                  rkokpp: "1234567890",
                                });
                              }}
                            >
                              {t("Continue")}
                              <ArrowForwardIcon />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}

                  {activeStep === 1 ? (
                    <>
                      <div className={classes.cardContent}>
                        <Typography className={classes.headline}>
                          {t("InsertSumTitle")}
                        </Typography>

                        <Typography className={classes.subHeadline}>
                          {t("InsertSumDescription")}
                        </Typography>

                        <Typography className={classes.fieldHeadline}>
                          {t("Price")}
                        </Typography>

                        <TextField
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          error={error}
                          variant="outlined"
                          margin="normal"
                          placeholder={t("PricePlaceHolder")}
                          className={classes.textfield}
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                          }}
                        />

                        {error ? (
                          <FormControl variant="standard" error={true}>
                            <FormHelperText>
                              {t("RequiredError")}
                            </FormHelperText>
                          </FormControl>
                        ) : null}

                        <div
                          className={classNames({
                            [classes.actions]: true,
                            [classes.alignLeft]: true,
                          })}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                              if (!price.length) {
                                setError(true);
                                return;
                              }

                              setError(false);

                              setActiveStep(2);
                            }}
                          >
                            {t("Continue")}
                            <ArrowForwardIcon />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : null}

                  {activeStep === 2 ? (
                    <LoadingStep
                      title={t("SellingProcessingTitle")}
                      description={t("SellingProcessingDescription")}
                      actionText={t("CancelProcessing")}
                      onClick={() => setActiveStep(3)}
                    />
                  ) : null}

                  {activeStep === 3 ? (
                    <SuccessRegistration
                      title={t("SellingSuccessTitle")}
                      description={
                        <>
                          {t("SellingSuccessDescription")}
                          <span className={classes.price}>
                            {formatPrice(price)} грн.{" "}
                          </span>
                          {t("SellingSuccessDescription2")}
                        </>
                      }
                      actionText={t("SuccessSelling")}
                      redirectToHomeScreen={() => setCreatingOffer(false)}
                    />
                  ) : null}
                </Card>
              </div>
            </>
          ) : (
            <>
              {data.length ? (
                <>
                  {data.map((item, index) => (
                    <ListCard
                      item={item}
                      key={index}
                      openDetails={toDetailsObject}
                      mainAction={(number) => {
                        console.log("number", number);
                      }}
                      hideSecondaryAction={true}
                      mainActionText={t("CancelSelling")}
                      sellingStatus={item?.selling}
                      detailsLink={`/market/${item.number}`}
                    />
                  ))}
                </>
              ) : (
                <div className={classes.noResults}>{t("NoSellingText")}</div>
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
      rnokpp,
      t,
      error,
      price,
      formatPrice,
      creatingOffer,
      toDetailsObject,
      setActiveStep,
      setBuyerData,
      setRnokpp,
      setPrice,
      setCreatingOffer,
      NumberFormatCustom,
      setError
    ]
  );

  return renderStep;
};

export default SellingStep;
