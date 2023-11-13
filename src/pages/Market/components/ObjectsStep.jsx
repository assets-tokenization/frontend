import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import PageTitle from 'components/PageTitle';
import ListCard from 'components/ListCard';
import ProgressLine from 'components/Preloader/ProgressLine';

const ObjectsStep = ({
  t,
  toDetailsObject,
  toMyObjects,
  classes,
  setPage,
  setCreatingOffer,
  objects,
  loading,
  onSuccess
}) => {
  const mainAction = React.useCallback((item) => {
    setCreatingOffer(item);
    setPage('Selling');
  }, [setCreatingOffer, setPage]);

  const renderStep = React.useMemo(
    () => (
      <Fade in={true}>
        <div>
          <PageTitle>{t('Title')}</PageTitle>

          <ProgressLine loading={loading} />

          {!loading ? (
            <>
              {objects.length ? (
                <>
                  {objects
                    .map((item, index) => (
                      <ListCard
                        item={item}
                        key={item.id + index}
                        finished={item?.finished}
                        openDetails={toDetailsObject}
                        mainAction={mainAction}
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
