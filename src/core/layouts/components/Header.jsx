import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MobileDetect from 'mobile-detect';

import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import checkAccess from 'helpers/checkAccess';
import { modules } from 'application';

const styles = (theme) => ({
    menuButton: {
        marginLeft: '-8px',
        [theme.breakpoints.down('md')]: {
            color: '#fff'
        }
    },
    header: {
        color: '#000',
        padding: 16,
        paddingRight: 10,
        backgroundColor: theme.headerBg,
        [theme.breakpoints.down('md')]: {
            padding: 8,
            backgroundColor: theme.leftSidebarBg,
            color: '#fff'
        }
    },
    toolbar: {
        padding: '0 4px',
        minHeight: 'auto',
        alignItems: 'center',
        '& > *': {
            marginRight: 4
        },
        '&:last-child': {
            marginRight: 0
        }
    },
    flex: {
        display: 'flex'
    },
    whiteSm: {
        flexGrow: 1,
        lineHeight: 1.5,
        [theme.breakpoints.down('md')]: {
            color: '#fff'
        }
    },
    userInfo: {
        justifyContent: 'flex-end'
    },
    iconButtonRoot: {
        width: 40,
        height: 40
    },
    backLink: {
        color: 'rgba(0, 0, 0, 0.54)',
        [theme.breakpoints.down('md')]: {
            color: '#fff'
        }
    }
});

const Header = ({ classes, title, onDrawerToggle, hideMenuButton, backButton, openSidebar, userUnits, userInfo }) => {
    const md = new MobileDetect(window.navigator.userAgent);
    const widgets = [].concat(...modules.map(module => module.appbar || []));
    const checkAccessAction = ({ access }) => !access || checkAccess(access, userInfo, userUnits);

    return (
        <AppBar className={classes.header} position="relative" elevation={1}>
            <Toolbar className={classes.toolbar}>
                {
                    backButton ? (
                        <IconButton
                            classes={
                                {
                                    root: classes.iconButtonRoot
                                }
                            }
                            size="large">
                            <Link to={backButton} className={classes.backLink}>
                                <ArrowBackIcon />
                            </Link>
                        </IconButton>
                    ) : (
                            <>
                                {
                                    !hideMenuButton && !!md.mobile() ? (
                                        <IconButton
                                            aria-label="Open drawer"
                                            onClick={onDrawerToggle}
                                            className={classes.menuButton}
                                            size="large">
                                            {openSidebar ? <ChevronLeftIcon /> : <MenuIcon />}
                                        </IconButton>
                                    ) : null
                                }
                            </>
                        )
                }
                <Typography className={classes.whiteSm} variant="h5">{title}</Typography>
                {
                    widgets.filter(checkAccessAction).map((widget, key) => (
                        <widget.component key={key} />
                    ))
                }
            </Toolbar>
        </AppBar>
    );
};

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    onDrawerToggle: PropTypes.func.isRequired,
    hideMenuButton: PropTypes.bool
};

Header.defaultProps = {
    hideMenuButton: false
};

const mapStateToProps = ({
    app: { openSidebar },
    auth: { userUnits, info }
}) => ({
    openSidebar,
    userUnits,
    userInfo: info
});

const translated = translate('Navigator')(Header);
const connected = connect(mapStateToProps)(translated);
export default withStyles(styles)(connected);
