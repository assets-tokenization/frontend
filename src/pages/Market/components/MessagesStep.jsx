import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import PageTitle from 'components/PageTitle';
import Card from 'components/Card';
import ProgressLine from 'components/Preloader/ProgressLine';

const MessagesStep = ({ t, classes, toPurchase, messages, loading }) => {
  const formatDate = React.useCallback((dateOrigin) => {
    if (!dateOrigin) return null;
    return moment(Number(dateOrigin)).format('DD.MM.YYYY');
  }, []);

  const renderStep = React.useMemo(
    () => (
      <Fade in={true}>
        <div>
          <PageTitle>{t('MessagesTitle')}</PageTitle>

          <ProgressLine loading={loading} />

          {loading ? null : (
            <>
              {messages.length ? (
                <>
                  {messages.map((message, index) => (
                    <Card key={message.title + index} className={classes.messagesCard}>
                      <Typography className={classes.messagesDate}>{formatDate(message?.dealInfo?.DateDeal)}</Typography>
                      <Typography className={classes.messagesTitle}>{t('ListItemTitle')}</Typography>
                      <Typography className={classes.messagesText}>{t('ListItemTitleDescription', { address: message?.address })}</Typography>
                      <div
                        className={classNames({
                          [classes.actions]: true,
                          [classes.alignCenter]: true
                        })}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>{
                            toPurchase(message);
                          }}
                        >
                          {t('GoToPayment')}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </>
              ) : (
                <div className={classes.noResults}>{t('NoMessagesText')}</div>
              )}
            </>
          )}
        </div>
      </Fade>
    ),
    [t, classes, toPurchase, messages, loading, formatDate]
  );

  return renderStep;
};

export default MessagesStep;
