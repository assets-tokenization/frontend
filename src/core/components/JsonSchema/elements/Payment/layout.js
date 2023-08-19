/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { Button, FormControl, InputAdornment, CircularProgress } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ElementContainer from 'components/JsonSchema/components/ElementContainer';
import StringElement from 'components/JsonSchema/elements/StringElement';

const styles = () => ({
    groupWrapper: {
        marginTop: 10
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8
    },
    flex: {
        flex: 2
    },
    field: {
        position: 'relative',
        marginRight: 15,
        '&>div': {
            marginBottom: 0
        }
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    icon: {
        color: 'green'
    }
});

const PaymentLayout = ({
    t,
    classes,
    error,
    required,
    description,
    paymentValue,
    loading,
    loadingValue,
    paymentAction,
    isSuccess,
    noMargin,
    ...rest
}) => (
    <FormControl variant="standard" margin={'dense'}>
        <ElementContainer
            description={description}
            required={required}
            error={error}
            bottomSample={true}
            className={classes.groupWrapper}
            noMargin={noMargin}
        >
            <div className={classes.wrapper}>
                <span className={classNames(classes.field, classes.flex)}>
                    <StringElement
                        {...rest}
                        description={''}
                        readOnly={'true'}
                        required={true}
                        value={String(paymentValue)}
                        InputProps={
                            {
                                endAdornment: <InputAdornment>{t('Currency')}</InputAdornment>
                            }
                        }
                    />
                    {loadingValue && <CircularProgress size={24} className={classes.buttonProgress}/>}
                </span>
                <Button
                    onClick={paymentAction}
                    size="large"
                    color="primary"
                    variant="contained"
                    className={classes.flex}
                    disabled={loadingValue || loading || isSuccess}
                >
                    {isSuccess ? t('Paid') : t('MakePayment')}
                    {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                </Button>
                {isSuccess && <CheckRoundedIcon className={classes.icon} />}
            </div>
        </ElementContainer>
    </FormControl>
);

PaymentLayout.propTypes = {
    t: PropTypes.func.isRequired,
    paymentAction: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isSuccess: PropTypes.bool,
    description: PropTypes.string,
    hidden: PropTypes.bool,
    loadingValue: PropTypes.bool,
    loading: PropTypes.bool,
    paymentValue: PropTypes.string,
    error: PropTypes.object,
    required: PropTypes.bool,
    sample: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

PaymentLayout.defaultProps = {
    isSuccess: false,
    description: '',
    hidden: false,
    error: null,
    required: false,
    loadingValue: false,
    loading: false,
    sample: '',
    paymentValue: 0
};

const translated = translate('Elements')(PaymentLayout);
const styled = withStyles(styles)(translated);
export default styled;
