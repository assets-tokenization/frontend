import React from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';

const styles = theme => ({
    wrapp: {
        display: 'inline-block',
        padding: '10px 17px',
        borderRadius: 50,
        backgroundColor: '#F1F1F1',
        marginBottom: 15,
        [theme.breakpoints.down('md')]: {
            fontSize: 13,
            lineHeight: '18px',
            padding: '6px 20px'
        }
    }
});

const FieldWithBackGround = ({children, classes}) => (
    <div className={classes.wrapp}>
        {children}
    </div>
);

FieldWithBackGround.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
};

const styled = withStyles(styles)(FieldWithBackGround);
export default styled;
