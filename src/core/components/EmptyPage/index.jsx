import React from 'react';
import { Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    wrap: {
        maxWidth: 800,
        marginTop: 120,
        paddingLeft: 100,
        textAlign: 'left',
        [theme.breakpoints.down('lg')]: {
            width: '100%',
            marginTop: 50,
            paddingLeft: 0
        }
    },
    title: {
        padding: '0 12px',
        marginTop: 15,
        marginBottom: 22,
        fontSize: 30,
        fontWeight: 'bold',
        lineHeight: 'normal'
    },
    subtitle: {
        padding: '0 12px',
        textTransform: 'inherit',
        fontSize: 16,
        lineHeight: 'normal',
        marginBottom: 50
    },
    childrenWrap: {
        padding: '0 12px',
        maxWidth: 230
    }
});

const EmptyPage = ({
    title,
    description,
    classes,
    children
}) => (
    <div className={classes.wrap}>
        <Typography
            className={classes.title}
            variant="h5"
            gutterBottom={true}
        >
            {title}
        </Typography>
        <Typography
            className={classes.subtitle}
            variant="body1"
            gutterBottom={true}
        >
            {description}
        </Typography>
        <div className={classes.childrenWrap}>
            {children}
        </div>
    </div>
);

EmptyPage.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node
};

EmptyPage.defaultProps = {
    title: '',
    description: '',
    children: <div />
};

export default withStyles(styles)(EmptyPage);
