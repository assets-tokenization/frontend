import React from 'react';
import { useTranslate } from 'react-translate';
import classNames from 'classnames';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Button, IconButton } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import headline_logo from 'assets/images/headline_logo.svg';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import storage from 'helpers/storage';
import getUserShortName from 'helpers/getUserShortName';
import { history } from 'store';

const styles = (theme) => ({
  headline: {
    display: 'flex',
    fontSize: 18,
    fontWeight: 800,
    lineHeight: '22px',
    letterSpacing: '1px',
    textAlign: 'left',
    textTransform: 'uppercase',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      fontWeight: 800,
      lineHeight: '16px'
    }
  },
  logo: {
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      width: 14
    }
  },
  header: {
    display: 'flex',
    backgroundColor: '#fff',
    padding: '20px 60px',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      padding: '4px 16px'
    }
  },
  actionsBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 500,
    marginLeft: 20
  },
  toP2PButtonWrapper: {
    background:
      'radial-gradient(100% 176.6% at 100% 100%, rgba(222, 227, 245, 0.8) 0%, rgba(208, 217, 251, 0.4) 99.88%)',
    position: 'fixed',
    bottom: 0,
    left: 0,
    minHeight: 64,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    zIndex: 9999,
    '& button': {
      boxShadow: '1px 6px 33px 0px rgba(34,89,228,0.54)',
      backgroundColor: '#fff'
    }
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    [theme.breakpoints.down('sm')]: {
      display: 'flex'
    }
  }
});

const useStyles = makeStyles(styles);

const Header = ({ navigateClick, navigateText, title, hideLogo, hideSMbutton }) => {
  const [open, setOpen] = React.useState(false);
  const [token] = React.useState(storage.getItem('token'));
  const anchorRef = React.useRef(null);

  const t = useTranslate('Header');
  const classes = useStyles();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    storage.removeItem('token');
    window.location.reload();
  };

  const handleRedirectProfile = () => {
    history.replace('/profile');
  };

  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const isSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const getUserName = (token) => {
    try {
      const jwtDecode = () => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );

        return JSON.parse(jsonPayload);
      };

      const decodedToken = jwtDecode(token);

      const names = decodedToken.signer.commonName.split(' ');
      const firstName = names[0];
      const lastName = names[1];
      const middleName = names[2];

      return getUserShortName({
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={classes.header}>
      {hideLogo ? (
        <div />
      ) : (
        <a href="/" className={classes.link}>
          <Typography className={classes.headline}>
            <img src={headline_logo} alt="headline_logo" className={classes.logo} />
            {title || t('Title')}
          </Typography>
        </a>
      )}

      <div className={classes.actionsBlock}>
        {hideSMbutton && isSM ? null : (
          <div
            className={classNames({
              [classes.toP2PButtonWrapper]: isSM
            })}
          >
            <Button variant="outlined" onClick={navigateClick}>
              {navigateText || t('GoToP2P')}
            </Button>
          </div>
        )}

        <Typography className={classes.userName}>
          <IconButton
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? 'composition-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <AccountCircleOutlinedIcon />
          </IconButton>
          {!isSM ? getUserName(token) : null}
        </Typography>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleRedirectProfile}>{t('Profile')}</MenuItem>
                    <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

export default Header;
