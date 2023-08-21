import React from 'react';
import classNames from 'classnames';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import PageTitle from 'components/PageTitle';
import Card from 'components/Card';
import ProgressLine from 'components/Preloader/ProgressLine';

const MessagesStep = ({ t, classes, toPurchase, messages, loading }) => {
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
                      <Typography className={classes.messagesDate}>{message?.date}</Typography>
                      <Typography className={classes.messagesTitle}>{message?.title}</Typography>
                      <Typography className={classes.messagesText}>{message?.text}</Typography>
                      <div
                        className={classNames({
                          [classes.actions]: true,
                          [classes.alignCenter]: true
                        })}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => toPurchase(message?.number)}
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
    [t, classes, toPurchase, messages, loading]
  );

  return renderStep;
};

export default MessagesStep;
