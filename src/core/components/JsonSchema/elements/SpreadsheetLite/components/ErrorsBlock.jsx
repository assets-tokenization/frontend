import React from 'react';
import classNames from 'classnames';
import { useTranslate } from 'react-translate';
import makeStyles from '@mui/styles/makeStyles';
import ErrorIcon from '@mui/icons-material/Error';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';

const styles = {
  errorWrapper: {
    backgroundColor: 'rgba(202, 0, 0, 0.1)',
    borderRadius: 5,
    marginBottom: 10,
    maxWidth: 828,
  },
  errorTitle: {
    fontWeight: 700,
  },
  errorText: {
    fontSize: 13,
    lineHeight: '18px',
    color: 'rgba(185, 10, 10, 1)',
  },
  errorIcon: {
    color: 'rgba(185, 10, 10, 1)'
  },
  borderBottom: {
    cursor: 'pointer',
    '& span': {
      fontSize: 13,
      lineHeight: '18px',
      borderBottom: '1px solid rgba(0, 0, 0, 1)',
    }
  },
  listItemRoot: {
    alignItems: 'start',
  },
  listItemTextRoot: {
    marginTop: 0
  }
};

const useStyles = makeStyles(styles);
const ERRORS_LIMIT = 3;
const PROPERTY_POSITION = 1;

const ErrorsBlock = ({
  errors,
  items: { properties }
}) => {
  const [open, setOpen] = React.useState(false);
  const t = useTranslate('Elements');
  const classes = useStyles();

  if (!errors || !Array.isArray(errors) || !errors.length) {
    return null;
  }

  const toggleErrorList = () => setOpen(!open);

  const RenderListItem = ({
    error
  }) => {
    const {
      path,
      rowId,
      errorText,
      message
    } = error;

    const pathArray = path.split('.');

    const propertyData = pathArray[pathArray.length - PROPERTY_POSITION];

    const property = properties[propertyData]?.description || propertyData;

    return (
      <ListItem
        className={classNames(classes.error, classes.errorBlock)}
        classes={{
          root: classes.listItemRoot
        }}
      >
        <ListItemIcon>
          <ErrorIcon className={classes.errorIcon} />
        </ListItemIcon>

        <ListItemText
          classes={{
            root: classes.listItemTextRoot
          }}
          primary={(
            <>
              <Typography
                className={classNames(classes.errorText, classes.errorTitle)}
              >
                {t('Line', { line: rowId + 1 })}
                {', '}
                {t('Column', { column: property })}
              </Typography>
              <Typography
                className={classes.errorText}
              >
                {errorText || message}
              </Typography>
            </>
          )}
        />
      </ListItem>
    );
  };

  return (
    <List
      className={classes.errorWrapper}
    >
      {
        errors.filter((_, index) => index < ERRORS_LIMIT).map((error, index) => (
          <RenderListItem
            key={index}
            error={error}
          />
        ))
      }

      {
        errors.length > ERRORS_LIMIT ? (
          <>
            {
              open ? (
                <>
                  {
                    errors.filter((_, index) => index > ERRORS_LIMIT).map((error, index) => (
                      <RenderListItem
                        key={index}
                        error={error}
                      />
                    ))
                  }
                </>
              ) : null
            }
            <ListItem
              className={classNames(classes.error, classes.errorBlock)}
            >
              <ListItemIcon />

              <ListItemText
                primary={(
                  <Typography
                    className={classes.borderBottom}
                    onClick={toggleErrorList}
                  >
                    <span>
                      {t(open ? 'HideLastErrors' : 'ShowLastErrors', {
                        count: errors.length - ERRORS_LIMIT
                      })}
                    </span>
                  </Typography>
                )}
              />
            </ListItem>
          </>
        ) : null
      }
    </List>
  );
};

export default ErrorsBlock;

