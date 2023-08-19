import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import hotkeys from 'hotkeys-js';
import { Drawer, CssBaseline } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import SplitPane from 'react-split-pane';
import Snackbars from 'components/Snackbars';
import ProgressLine from 'components/Preloader/ProgressLine';
import { setOpenSidebar } from 'actions/app';
import { closeError } from 'actions/error';
import { toggleDebugMode } from 'actions/auth';
import Header from 'layouts/components/Header';
import Navigator from 'layouts/components/Navigator';
import DebugTools from 'layouts/components/DebugTools';
import checkAccess from 'helpers/checkAccess';

const drawerWidth = 256;
const LARGE_SCREEN_WIDTH = 600;

const styles = (theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
    },
    sidebarWrapper: {
        width: drawerWidth,
        flexShrink: 0,
        '& .scrollbar-container::-webkit-scrollbar': {
            display: 'none'
        },
        '& .scrollbar-container': {
            scrollbarWidth: 'none'
        }
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.leftSidebarBg,
        position: 'inherit'
    },
    appContent: {
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            flexDirection: 'column'
        },
        flex: 1,
        overflowY: 'auto',
        marginLeft: -drawerWidth,
        transition: 'margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms'
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0,
        overflowX: 'hidden'
    },
    toolbar: {
        backgroundColor: theme.leftSidebarBg,
        padding: 6
    },
    collapseButton: {
        padding: 5,
        minWidth: 5
    },
    flexContent: {
        display: 'flex',
        flexDirection: 'column'
    }
});

const Layout = ({
    classes,
    location,
    actions,
    openSidebar,
    title,
    noTitle,
    children,
    flexContent,
    onboardingTaskId,
    backButton,
    debugMode,
    userInfo,
    userUnits,
    debugTools,
    errors,
    loading
}) => {
    const handleDrawerToggle = () => actions.setOpenSidebar(!openSidebar);

    const renderNavigation = () => (
        <Drawer
            className={classes.sidebarWrapper}
            variant="persistent"
            open={openSidebar}
            onClose={handleDrawerToggle}
            classes={
                {
                    paper: classes.drawerPaper
                }
            }
        >
            <Navigator
                location={location}
            />
        </Drawer>
    );

    const renderMainPane = () => {
        if (onboardingTaskId) {
            return <div id="main-container">{children}</div>;
        }

        return (
            <div
                id="main-container"
                className={classNames(classes.root, 'root-layout')}
            >
                {renderNavigation()}
                <div
                    className={
                        classNames(classes.appContent, {
                            [classes.contentShift]: openSidebar,
                            [classes.flexContent]: flexContent
                        })
                    }
                >
                    {noTitle ? null : (
                        <Header
                            title={title}
                            open={openSidebar}
                            backButton={backButton}
                            onDrawerToggle={handleDrawerToggle}
                        />
                    )}
                    {children}
                </div>
            </div>
        );
    };

    const renderPanes = () => {
        const debugModeEnabledInUnit = userUnits.find(({ menuConfig }) => menuConfig?.debugMode === true);

        const userIsAdmin = checkAccess({ userIsAdmin: true }, userInfo, userUnits);

        const useDebugPane = debugModeEnabledInUnit && userIsAdmin && debugMode;

        const mainPane = renderMainPane();

        if (!useDebugPane) {
            return mainPane;
        }

        return (
            <SplitPane
                split="horizontal"
                minSize="calc(100% - 400px)"
            >
                {mainPane}
                <DebugTools debugTools={debugTools} />
            </SplitPane>
        );
    };

    React.useEffect(() => {
        if (openSidebar === null) {
            actions.setOpenSidebar(window.innerWidth > LARGE_SCREEN_WIDTH);
        }
    }, [actions, openSidebar]);

    React.useEffect(() => {
        const updateWindowDimensions = () => {
            const open = window.innerWidth > LARGE_SCREEN_WIDTH;

            if (open !== openSidebar) {
                actions.setOpenSidebar(window.innerWidth > LARGE_SCREEN_WIDTH);
            }
        };

        window.addEventListener('resize', updateWindowDimensions);

        hotkeys('ctrl+x', actions.toggleDebugMode);

        return () => {
            const open = window.innerWidth > LARGE_SCREEN_WIDTH;

            if (openSidebar && !open) actions.setOpenSidebar(open);

            window.removeEventListener('resize', updateWindowDimensions);

            hotkeys.unbind('ctrl+x');
        };
    }, [actions, openSidebar]);

    return (
        <>
            <CssBaseline />
            <ProgressLine loading={loading} />
            <Snackbars
                errors={errors}
                onClose={errorIndex => () => actions.closeError(errorIndex)}
            />
            {renderPanes()}
        </>
    );
};

Layout.propTypes = {
    classes: PropTypes.object.isRequired,
    disableScrolls: PropTypes.bool,
    openSidebar: PropTypes.bool,
    actions: PropTypes.object.isRequired
};

Layout.defaultProps = {
    disableScrolls: false,
    openSidebar: null
};

const mapStateToProps = ({
    app: { openSidebar },
    errors: { list },
    auth: {
        debugMode,
        userUnits,
        info,
        info: {
            onboardingTaskId 
        }
    }
}) => ({
    errors: list,
    openSidebar,
    debugMode,
    userUnits,
    userInfo: info,
    onboardingTaskId
});

const mapDispatchToProps = dispatch => ({
    actions: {
        closeError: bindActionCreators(closeError, dispatch),
        setOpenSidebar: bindActionCreators(setOpenSidebar, dispatch),
        toggleDebugMode: bindActionCreators(toggleDebugMode, dispatch)
    }
});

const styled = withStyles(styles)(Layout);

export { default as Content } from 'layouts/components/Content';
export { default as DrawerContent } from 'layouts/components/DrawerContent';

export { drawerWidth };

export default connect(mapStateToProps, mapDispatchToProps)(styled);
