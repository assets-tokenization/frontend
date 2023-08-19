import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Hidden, Button, Toolbar } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';

import { setOpenDawer } from 'actions/app';
import Scrollbar from 'components/Scrollbar';

const styles = theme => ({
    root: {
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#eeeeee',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            overflow: 'hidden'
        }
    },
    dawerContent: {
        overflowY: 'auto'
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden'
    },
    drawer: {
        background: '#eeeeee',
        flexShrink: 0,
        overflow: 'hidden',
        display: 'none',
        [theme.breakpoints.up('md')]: {
            maxWidth: 320,
            display: 'flex',
            flexDirection: 'column'
        }
    },
    drawerPaper: {
        position: 'relative',
        backgroundColor: '#eeeeee',
        borderRight: 'none',
        overflow: 'hidden'
    },
    toolbar: {
        paddingLeft: 6,
        paddingRight: 6,
        flexDirection: 'row-reverse'
    },
    toolbarAbsolute: {
        paddingRight: 6,
        position: 'absolute',
        right: 0
    },
    collapseButton: {
        padding: 5,
        minWidth: 5
    }
});

class DrawerContent extends React.Component {
    renderCollapseButton = () => {
        const { classes, actions, openDawer } = this.props;

        return (
            <Toolbar className={classes.toolbar}>
                <Button
                    variant="outlined"
                    className={classes.collapseButton}
                    onClick={() => actions.setOpenDawer(!openDawer)}
                >
                    {openDawer ? <ArrowRightIcon /> : <ArrowLeftIcon />}
                </Button>
            </Toolbar>
        );
    };

    renderDawer = () => {
        const { classes, collapseButton, drawer, openDawer } = this.props;

        if (!drawer) {
            return null;
        }

        return (
            <div
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={true}
                classes={
                    {
                        paper: classes.drawerPaper
                    }
                }
            >
                {collapseButton ? this.renderCollapseButton() : null}
                {
                    openDawer ? (
                        <Scrollbar>
                            <div className={classes.dawerContent}>
                                {drawer}
                            </div>
                        </Scrollbar>
                    ) : null
                }
            </div>
        );
    };

    render() {
        const { classes, className, children, drawer, drawerPosition, disableScrolls } = this.props;

        const content = (
            <>
                <Hidden mdUp={true} implementation="css">{drawer}</Hidden>
                {children}
            </>
        );

        return (
            <div className={classNames(classes.root, className)}>
                {(drawer && drawerPosition === 'left') ? this.renderDawer() : null}
                <div className={classes.content}>
                    {disableScrolls ? content : <Scrollbar>{content}</Scrollbar>}
                </div>
                {(drawer && drawerPosition === 'right') ? this.renderDawer() : null}
            </div>
        );
    }
}

DrawerContent.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    drawer: PropTypes.node,
    drawerPosition: PropTypes.string,
    collapseButton: PropTypes.bool,
    actions: PropTypes.object.isRequired,
    openDawer: PropTypes.bool.isRequired
};
DrawerContent.defaultProps = {
    children: null,
    drawer: null,
    drawerPosition: 'right',
    collapseButton: true
};

const mapStateToProps = ({ app: { openDawer } }) => ({ openDawer });
const mapDispatchToProps = dispatch => ({
    actions: {
        setOpenDawer: bindActionCreators(setOpenDawer, dispatch)
    }
});

const styled = withStyles(styles)(DrawerContent);

export default connect(mapStateToProps, mapDispatchToProps)(styled);
