import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import {
    Paper,
    IconButton,
    Tooltip,
    Avatar,
    Popover,
    MenuList,
    MenuItem,
    Switch,
    FormControlLabel,
    ClickAwayListener,
} from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import UserName from 'components/Auth/UserName';
import { logout, toggleDebugMode } from 'actions/auth';
import checkAccess from 'helpers/checkAccess';

import avatar from 'assets/img/user-image.svg';

import config from 'config.json';

const { application: { type: applicationType }, cabinetUrl, adminPanelUrl } = config;
const { origin } = window.location;
const isAdmin = origin === adminPanelUrl;
const isCabinet = origin === cabinetUrl;

const styles = theme => ({
    root: {
        display: 'flex',
        backgroundColor: '#e1e1e1',
        color: '#333',
        borderRadius: 50
    },
    link: {
        display: 'none',
        padding: '0 7px 0 16px',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        [theme.breakpoints.up('sm')]: {
            display: 'flex'
        }
    },
    subTitle: {
        fontSize: 10,
        maxWidth: '135px',
        display: 'block',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    iconButtonAvatar: {
        padding: 0
    },
    avatar: {
        width: 41,
        height: 41,
        backgroundColor: '#e1e1e1'
    },
    menuLink: {
        textDecoration: 'none'
    },
    outerLinkRoot: {
        padding: 0
    },
    outerLink: {
        color: 'rgba(0, 0, 0, 0.87)',
        textDecoration: 'none',
        width: '100%',
        height: '100%',
        padding: '6px 16px'
    }
});

class ProfileAppbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { anchorEl: null };
    }

    handleMenuOpen = ({ currentTarget }) => this.setState({ anchorEl: currentTarget });

    handleMenuClose = () => this.setState({ anchorEl: null });

    handleLogout = () => {
        const { actions } = this.props;
        this.handleMenuClose();
        actions.logout(true);
    };

    renderOuterLink = (url, title) => {
        const { classes } = this.props;

        return (
            <MenuItem
                classes={
                    {
                        root: classes.outerLinkRoot
                    }
                }
            >
                <a
                    href={url}
                    className={classes.outerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {title}
                </a>
            </MenuItem>
        );
    }

    render() {
        const { anchorEl } = this.state;
        const { t, classes, userInfo, userUnits, debugMode, actions } = this.props;

        const userUnit = (userUnits || [])
            .map(({ name }) => name)
            .filter(key => !['based', 'Базовий юніт'].includes(key) )
            .join(', ');
        const userIsGod = checkAccess({ userIsGod: true }, userInfo, userUnits);
        const userIsAdmin = checkAccess({ userIsAdmin: true }, userInfo, userUnits);

        return <>
            <div className={classes.root}>
                <div className={classes.link}>
                    <div><UserName {...userInfo} /></div>
                    <Tooltip title={userUnit}>
                        <div className={classes.subTitle}>{userUnit}</div>
                    </Tooltip>
                </div>
                <IconButton
                    id="avatar-btn"
                    color="inherit"
                    className={classes.iconButtonAvatar}
                    onClick={this.handleMenuOpen}
                    size="large">
                    <Avatar className={classes.avatar} src={avatar} />
                </IconButton>
            </div>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={this.handleMenuClose}
                anchorOrigin={
                    {
                        vertical: 'bottom',
                        horizontal: 'center'
                    }
                }
                transformOrigin={
                    {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                }
            >
                <ClickAwayListener onClickAway={this.handleMenuClose}>
                    <Paper>
                        <MenuList>
                            {
                                applicationType !== 'adminpanel' ? (
                                    <Link to="/profile" className={classes.menuLink}>
                                        <MenuItem onClick={this.handleMenuClose} id="profile-btn">
                                            {t('MyProfile')}
                                        </MenuItem>
                                    </Link>
                                ) : null
                            }
                            {
                                userIsGod && userIsAdmin ? (
                                    <>
                                        {isAdmin ? this.renderOuterLink(cabinetUrl, t('ToCabinet')) : null}
                                        {isCabinet ? this.renderOuterLink(adminPanelUrl, t('ToAdminPanel')) : null}
                                        <MenuItem id="toggle-debug-mode">
                                            <FormControlLabel
                                                control={
                                                    (
                                                        <Switch
                                                            checked={debugMode}
                                                            onChange={actions.toggleDebugMode}
                                                        />
                                                    )
                                                }
                                                label={t('DebugMode')}
                                            />
                                        </MenuItem>
                                    </>
                                ) : null
                            }
                            <MenuItem onClick={this.handleLogout} id="logout-btn">
                                {t('Logout')}
                            </MenuItem>
                        </MenuList>
                    </Paper>
                </ClickAwayListener>
            </Popover>
        </>;
    }
}

ProfileAppbar.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    userInfo: PropTypes.object,
    userUnits: PropTypes.array
};

ProfileAppbar.defaultProps = {
    userInfo: {},
    userUnits: []
};

const mapStateToProps = ({ auth: { info: userInfo, userUnits, debugMode } }) => ({ userInfo, userUnits, debugMode });
const mapDispatchToProps = dispatch => ({
    actions: {
        logout: bindActionCreators(logout, dispatch),
        toggleDebugMode: bindActionCreators(toggleDebugMode, dispatch)
    }
});

const styled = withStyles(styles)(ProfileAppbar);
const translated = translate('Navigator')(styled);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
