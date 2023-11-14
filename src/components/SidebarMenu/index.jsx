import React from 'react';
import { useTranslate } from 'react-translate';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import classNames from 'classnames';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';

import { ReactComponent as HeaderLogo } from 'assets/images/headline_logo.svg';

import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import Badge from '@mui/material/Badge';

import { ReactComponent as HomeIcon } from 'assets/images/home.svg';
import { ReactComponent as SellingIcon } from 'assets/images/selling.svg';
import { ReactComponent as PurchasesIcon } from 'assets/images/purchases.svg';
import { ReactComponent as MessagesIcon } from 'assets/images/messages.svg';

import { ReactComponent as HomeIcon_b } from 'assets/images/home_b.svg';
import { ReactComponent as SellingIcon_b } from 'assets/images/selling_b.svg';
import { ReactComponent as PurchasesIcon_b } from 'assets/images/purchases_b.svg';
import { ReactComponent as MessagesIcon_b } from 'assets/images/messages_b.svg';

const styles = (theme) => ({
  headline: {
    display: 'flex',
    fontSize: 14,
    fontWeight: 800,
    lineHeight: '18px',
    letterSpacing: '1px',
    textAlign: 'left',
    textTransform: 'uppercase',
    alignItems: 'center',
    padding: '20px 28px',
    paddingRight: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  logo: {
    marginRight: 8,
    width: 20,
    [theme.breakpoints.down('sm')]: {
      width: 14
    }
  },
  sidebar: {
    width: 256,
    backgroundColor: '#fff',
    borderRight: '1px solid #E9EBF1',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
      background: '#fff',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'row'
    }
  },
  icon: {
    width: 24,
    minWidth: 'unset',
    marginRight: 16,
    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    }
  },
  itemText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 8,
      fontWeight: 600,
      lineHeight: '16px',
      color: '#595959'
    }
  },
  itemButton: {
    borderRadius: 40,
    padding: '8px 12px 8px 16px',
    '& > div svg:last-child': {
      display: 'none'
    },
    '&:hover': {
      '& > div svg:first-child': {
        display: 'none'
      },
      '& > div svg:last-child': {
        display: 'block'
      }
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      borderRadius: 0
    }
  },
  active: {
    backgroundColor: '#3F6FE814',
    fill: '#2259E4',
    '& > div svg:first-child': {
      display: 'none'
    },
    '& > div svg:last-child': {
      display: 'block'
    },
    [theme.breakpoints.down('sm')]: {
      backgroundColor: '#fff!important'
    }
  },
  badge: {
    position: 'relative',
    right: 10,
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 7
    }
  },
  badgeInner: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 10,
      minWidth: 'unset',
      width: 12,
      height: 12
    }
  },
  listItem: {
    padding: '6px 12px',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      width: 64
    }
  },
  list: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      padding: 0,
      height: 64,
      justifyContent: 'space-between',
      width: '100%'
    }
  },
  indicator: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      height: 2,
      width: 64,
      backgroundColor: '#2259E4',
      position: 'absolute',
      top: -8,
      left: 0
    }
  }
});

const MENU_ITEMS = [
  {
    label: 'Objects',
    icon: <HomeIcon />,
    iconActive: <HomeIcon_b />
  },
  {
    label: 'Selling',
    icon: <SellingIcon />,
    iconActive: <SellingIcon_b />
  },
  {
    label: 'Purchases',
    icon: <PurchasesIcon />,
    iconActive: <PurchasesIcon_b />
  },
  {
    label: 'Messages',
    icon: <MessagesIcon />,
    iconActive: <MessagesIcon_b />
  }
];

const useStyles = makeStyles(styles);

const SidebarMenu = ({ onChange, page, history, messages }) => {
  const t = useTranslate('SidebarMenu');
  const classes = useStyles();

  const handleToggle = (value) => () => {
    onChange(value);
  };

  const isSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <div className={classes.sidebar}>
      <Typography className={classes.headline}>
        <HeaderLogo className={classes.logo} />
        {t('Title')}
      </Typography>

      <List
        classes={{
          root: classes.list
        }}
      >
        {MENU_ITEMS.map(({ label, icon, iconActive }) => {
          return (
            <ListItem
              key={label}
              classes={{
                root: classNames({
                  [classes.listItem]: true
                })
              }}
            >
              <ListItemButton
                role={undefined}
                onClick={handleToggle(label)}
                dense
                classes={{
                  root: classNames({
                    [classes.itemButton]: true,
                    [classes.active]: page === label
                  })
                }}
              >
                {page === label ? <div className={classes.indicator} /> : null}

                <ListItemIcon
                  classes={{
                    root: classes.icon
                  }}
                >
                  {icon}
                  {iconActive}
                </ListItemIcon>
                <ListItemText
                  id={label}
                  primary={t(label)}
                  classes={{
                    primary: classes.itemText
                  }}
                />
                {label === 'Messages' ? (
                  <Badge
                    badgeContent={messages.length}
                    color="error"
                    className={classes.badge}
                    classes={{
                      badge: classes.badgeInner
                    }}
                  />
                ) : null}
              </ListItemButton>
            </ListItem>
          );
        })}

        {isSM ? (
          <ListItem
            classes={{
              root: classNames({
                [classes.listItem]: true
              })
            }}
          >
            <ListItemButton
              role={undefined}
              onClick={() => {
                history.push('/');
              }}
              dense
              classes={{
                root: classNames({
                  [classes.itemButton]: true
                })
              }}
            >
              <ListItemIcon
                classes={{
                  root: classes.icon
                }}
              >
                <HomeWorkOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                id={'label'}
                primary={t('ToHome')}
                classes={{
                  primary: classes.itemText
                }}
              />
            </ListItemButton>
          </ListItem>
        ) : null}
      </List>
    </div>
  );
};

export default SidebarMenu;
