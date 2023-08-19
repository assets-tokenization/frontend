import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

import moment from 'moment';

import { Tooltip, LinearProgress } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

const styles = {
    container: {
        padding: 0
    },
    colorPrimary: {
        backgroundColor: '#4caf50'
    },
    barColorPrimary: {
        backgroundColor: '#f44336'
    }
};

const Deadline = ({ t, classes, start, end }) => {
    if (!end || !start) {
        return null;
    }

    const now = moment();

    const startDate = moment(start);
    const endDate = moment(end);
    const diffEstimate = endDate.diff(startDate);
    const diffFromStart = now.diff(startDate);

    const spend = (diffFromStart * 100) / diffEstimate;

    const dateDiff = moment.duration(endDate.diff(now)).humanize();
    const tooltip = now.diff(end) < 0
        ? t('DueDate', { date: dateDiff })
        : t('Expired', { date: dateDiff });

    return (
        <Tooltip title={tooltip}>
            <div className={classes.container}>
                <LinearProgress
                    classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                    variant="determinate"
                    value={Math.min(spend, 100)}
                />
            </div>
        </Tooltip>
    );
};

Deadline.propTypes = {
    start: PropTypes.string.isRequired,
    end: PropTypes.string
};

Deadline.defaultProps = {
    end: null
};

const translated = translate('Labels')(Deadline);
export default withStyles(styles)(translated);
