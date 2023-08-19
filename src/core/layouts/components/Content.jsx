import React from 'react';

import withStyles from '@mui/styles/withStyles';

import classNames from 'classnames';

const styles = theme => ({
    mainContent: {
        padding: '0 20px',
        [theme.breakpoints.up('sm')]: {
            padding: '0 32px'
        }
        // backgroundColor: theme.palette.background.default
    },
    smallPadding: {
        padding: '0 16px 16px'
    }
});

export default withStyles(styles)(({ children, className, classes, small }) => (
    <main className={classNames(classes.mainContent, className, {
        [classes.smallPadding]: small
    })}
    >
        {children}
    </main>
));
