import React from 'react';
import classNames from 'classnames';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Fade from '@mui/material/Fade';
import PageTitle from 'components/PageTitle';
import ListCard from 'components/ListCard';
import ProgressLine from 'components/Preloader/ProgressLine';

const ObjectsStep = ({
  t,
  toDetailsObject,
  toMyObjects,
  classes,
  tab,
  setTab,
  setPage,
  setCreatingOffer,
  objects,
  loading,
  onSuccess
}) => {
  const renderStep = React.useMemo(
    () => (
      <Fade in={true}>
        <div>
          <PageTitle>{t('Title')}</PageTitle>

          <ProgressLine loading={loading} />

          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            indicatorColor="primary"
            textColor="primary"
            className={classes.tabsWrapper}
            classes={{
              root: classes.tabsRoot
            }}
          >
            <Tab
              label={t('ObjectsTab')}
              className={classNames(classes.tab, classes.tabButton)}
              classes={{
                root: classes.tab,
                selected: classes.tabSelected
              }}
            />
            <Tab
              label={t('ArchiveTab')}
              className={classNames(classes.tab, classes.tabButton)}
              classes={{
                root: classes.tab,
                selected: classes.tabSelected
              }}
            />
          </Tabs>

          {!loading ? (
            <>
              {objects.length ? (
                <>
                  {objects
                    .filter((item) => (tab === 0 ? !item?.finished : item?.finished))
                    .map((item, index) => (
                      <ListCard
                        item={item}
                        key={item.id + index}
                        finished={item?.finished}
                        openDetails={toDetailsObject}
                        mainAction={(number) => {
                          setCreatingOffer(number);
                          setPage('Selling');
                        }}
                        onSuccess={onSuccess}
                        secondaryActionText={t('MoveToMyObjects')}
                        mainActionText={t('CreateOrder')}
                        detailsLink={`/market/${item.id}`}
                      />
                    ))}
                </>
              ) : (
                <>
                  <Typography className={classes.emptyStateText}>{t('EmptyState')}</Typography>
                  <Button variant="contained" onClick={toMyObjects}>
                    {t('NavigateText')}
                  </Button>
                </>
              )}
            </>
          ) : null}
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
      loading,
      objects,
      onSuccess
    ]
  );

  return renderStep;
};

export default ObjectsStep;
