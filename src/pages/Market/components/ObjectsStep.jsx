import React from "react";
import classNames from "classnames";
import { Typography, Button, Tabs, Tab } from "@mui/material";
import Fade from "@mui/material/Fade";
import PageTitle from "components/PageTitle";
import ListCard from "components/ListCard";

const data = [
  {
    title:
      "Івано-Франківська обл., м. Івано-Франківськ, вул. Вʼячеслава Чорновола, 15",
    number: "1209141981209",
    tokenized: true,
    type: 'Будинок',
    totalArea: '6 сот',
    livingArea: '140 м2',
    finished: true,
  },
];

const ObjectsStep = ({
  t,
  toDetailsObject,
  toMyObjects,
  classes,
  tab,
  setTab,
  setPage,
  setCreatingOffer,
}) => {
  const renderStep = React.useMemo(
    () => (
      <Fade in={true}>
        <div>
          <PageTitle>
            {t("Title")}
          </PageTitle>

          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            indicatorColor="primary"
            textColor="primary"
            className={classes.tabsWrapper}
            classes={{
              root: classes.tabsRoot,
            }}
          >
            <Tab
              label={t("ObjectsTab")}
              className={classNames(classes.tab, classes.tabButton)}
              classes={{
                root: classes.tab,
                selected: classes.tabSelected,
              }}
            />
            <Tab
              label={t("ArchiveTab")}
              className={classNames(classes.tab, classes.tabButton)}
              classes={{
                root: classes.tab,
                selected: classes.tabSelected,
              }}
            />
          </Tabs>
          {data.length ? (
            <>
              {data.map((item, index) => (
                <ListCard
                  item={item}
                  key={index}
                  finished={item?.finished}
                  openDetails={toDetailsObject}
                  mainAction={(number) => {
                    setCreatingOffer(number);
                    setPage("Selling");
                  }}
                  secondaryActionText={t("MoveToMyObjects")}
                  mainActionText={t("CreateOrder")}
                  detailsLink={`/market/${item.number}`}
                />
              ))}
            </>
          ) : (
            <>
              <Typography className={classes.emptyStateText}>
                {t("EmptyState")}
              </Typography>
              <Button variant="contained" onClick={toMyObjects}>
                {t("NavigateText")}
              </Button>
            </>
          )}
        </div>
      </Fade>
    ),
    [
      t,
      toDetailsObject,
      toMyObjects,
      classes,
      tab,
      setTab,
      setPage,
      setCreatingOffer,
    ]
  );

  return renderStep;
};

export default ObjectsStep;
