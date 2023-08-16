import React from "react";
import classNames from "classnames";
import { Typography, Button } from "@mui/material";
import Fade from '@mui/material/Fade';
import PageTitle from "components/PageTitle";
import Card from "components/Card";

const MESSAGES = [
  {
    id: 1,
    date: '01.08.2023, 10:34',
    title: 'Ордер на покупку',
    number: '123456789',
    text: 'Вам надійшов ордер на покупку нерухомості за адресою Івано-Франківська обл., м. Івано-Франківськ, вул. Вʼячеслава Чорновола, 15',
  },
  {
    id: 2,
    date: '31.07.2023, 11:20',
    title: 'Ордер на покупку',
    number: '123456789',
    text: 'Вам надійшов ордер на покупку нерухомості за адресою Івано-Франківська обл., c. Старі Богородчани, вул. Старокиївська, 36б',
  }
];

const MessagesStep = ({
  t,
  classes,
  toPurchase
}) => {

  const renderStep = React.useMemo(() => (
    <Fade in={true}>
      <div>
        <PageTitle>
          {t('MessagesTitle')}
        </PageTitle>

        {
          MESSAGES.length ? (
            <>
              {
                MESSAGES.map((message, index) => (
                  <Card
                    key={message.title + index}
                    className={classes.messagesCard}
                  >
                    <Typography className={classes.messagesDate}>
                      {message?.date}
                    </Typography>
                    <Typography className={classes.messagesTitle}>
                      {message?.title}
                    </Typography>
                    <Typography className={classes.messagesText}>
                      {message?.text}
                    </Typography>
                    <div className={classNames({
                      [classes.actions]: true,
                      [classes.alignCenter]: true
                    })}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => toPurchase(message?.number)}
                      >
                        {t('GoToPayment')}
                      </Button>
                    </div>
                  </Card>
                ))
              }
            </>
          ) : (
            <div className={classes.noResults}>
              {t('NoMessagesText')}
            </div>
          )
        }
      </div>
    </Fade>
  ), [t, classes, toPurchase]);

  return renderStep;
};

export default MessagesStep;