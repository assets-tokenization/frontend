import React from 'react';
import withStyles from '@mui/styles/withStyles';

import svgIcon from 'assets/img/gear-loading-icon.svg';

import classNames from 'classnames';
import { Typography } from '@mui/material';

const styles = {
    container: {
        textAlign: 'center',
        padding: '20px 20px 10px',
        display: 'flex'
    },
    nopadding: {
        padding: 0
    },
    wrapper: {
        flex: 1
    },
    flex: {
        flex: 1,
        alignItems: 'center'
    },
    image: {
        flex: 1,
        height: 80,
        width: 80
    }
};

const Preloader = ({ size, nopadding = false, flex = false, classes, className, label }) => (
    <div className={classNames(classes.container, className, { [classes.nopadding]: nopadding, [classes.flex]: flex })}>
        <div className={classes.wrapper}>
            <img className={classes.image} src={svgIcon} alt="Loading..." width={size} />
            {label ? (
                <Typography color="textSecondary">{label}</Typography>
            ) : null}
        </div>
    </div>
);

export { default as PreloaderModal } from 'components/Preloader/PreloaderModal';
export default withStyles(styles)(Preloader);
