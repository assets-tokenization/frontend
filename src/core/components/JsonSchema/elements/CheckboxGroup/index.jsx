/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import evaluate from 'helpers/evaluate';
import CheckboxLayout from 'components/JsonSchema/elements/CheckboxGroup/components/layout';
import ChangeEvent from '../../ChangeEvent';

class CheckboxGroup extends React.Component {
    componentDidMount = () => {
        const { value, items, onChange, required, defaultValue } = this.props;

        if (defaultValue && value === null) {
            onChange && onChange(defaultValue);
        } else if (required && !Array.isArray(value)) {
            onChange && onChange([]);
        }
        if (Array.isArray(value)) {
            value.forEach((key) => {
                if (this.isDisabled(items.find(({ id }) => id === key))) {
                    onChange && onChange(value.filter(checkboxKey => key !== checkboxKey));
                }
            });
        }
    }

    handleChange = (keyId) => () => {
        const { value, onChange } = this.props;
        const checkedKeys = value || [];

        const newValue = checkedKeys.includes(keyId)
            ? checkedKeys.filter(item => item !== keyId)
            : checkedKeys.concat(keyId);

        onChange && onChange(new ChangeEvent(newValue.length ? newValue : null, false, true, true));
    };

    isDisabled = (item) => {
        if (!item) return false;
    
        let { isDisabled } = item;

        const { rootDocument, value, steps, activeStep } = this.props;
        if (isDisabled && typeof isDisabled === 'string') {
            isDisabled = evaluate(isDisabled, value, rootDocument.data[steps[activeStep]], rootDocument.data) === true;

            if (isDisabled instanceof Error) {
                isDisabled.commit({ type: 'checkbox group check disabled' });
                isDisabled = false;
            }
        }

        return isDisabled;
    };

    isHidden = (item) => {
        if (!item) return false;
    
        let { hidden } = item;

        const { rootDocument, value, steps, activeStep } = this.props;
        if (hidden && typeof hidden === 'string') {
            hidden = evaluate(hidden, value, rootDocument.data[steps[activeStep]], rootDocument.data) === true;

            if (hidden instanceof Error) {
                hidden.commit({ type: 'Checkbox group hidden' });
                hidden = false;
            }
        }

        return hidden;
    };

    getSample = (key) => {
        const { rootDocument, value, steps, activeStep } = this.props;
        const { getSample, sample } = key;

        if (getSample && typeof getSample === 'string') {
            const result = evaluate(getSample, value, rootDocument.data[steps[activeStep]], rootDocument.data);

            if (result instanceof Error) {
                result.commit({ type: 'Checkbox group sample' });
                return '';
            }

            return result;
        }

        return sample;
    };

    addHeight = ({
        activePosition,
        indexInfoHeight,
        listenError,
        errors,
        withIndex,
        errorTextHeight,
        position,
        isChecked,
        hiddenParent,
        isPopup
    }) => {
        const cloneUncheckedPosition = JSON.parse(JSON.stringify(position));
        const clonePosition = JSON.parse(JSON.stringify(activePosition));

        const parentError = [...listenError].shift();
        const isParentError = !!errors.filter(err => err.path.indexOf(parentError) !== -1).length;
        const isIndexError = !!errors.filter(err => err.path.indexOf(listenError[1]) !== -1).length;

        let updateHeight = 0;
        const erroText = -20;

        const { innerWidth } = window;

        if (!isChecked) {
            updateHeight += hiddenParent && withIndex ? 10 : 0;
            updateHeight -= withIndex && (isIndexError || isParentError) ? erroText : 0;
            updateHeight -= withIndex && (isIndexError && isParentError) ? erroText : 0;

            if (innerWidth > 960) {
                updateHeight += withIndex ? 0 : indexInfoHeight.lg;
                cloneUncheckedPosition.top.lg += updateHeight;
            } else if (innerWidth > 600 && innerWidth < 960) {
                updateHeight += withIndex ? 0 : indexInfoHeight.md;
                updateHeight += hiddenParent ? 50 : 0;
                updateHeight -= isPopup ? indexInfoHeight.md : 0;
                cloneUncheckedPosition.top.md += updateHeight;
            } else if (innerWidth < 600) {
                updateHeight += hiddenParent ? 10 : 0;
                updateHeight += withIndex ? 0 : indexInfoHeight.xs;
                updateHeight -= isPopup ? indexInfoHeight.xs + 29 : 0;
                cloneUncheckedPosition.top.xs += updateHeight;
            }

            return cloneUncheckedPosition;
        }

        if (innerWidth > 960) {
            updateHeight += withIndex ? indexInfoHeight.lg : 40;
            updateHeight += hiddenParent ? 38 : 0;
            updateHeight += isIndexError ? 19 : 0;
            updateHeight += isParentError ? errorTextHeight.lg : 0;
            updateHeight += isParentError && !isIndexError ? erroText : 0;
            updateHeight += isParentError && isIndexError ? erroText : 0;
            clonePosition.top.lg += updateHeight;
        } else if (innerWidth > 600 && innerWidth < 960) {
            updateHeight += withIndex ? indexInfoHeight.md : (isPopup ? indexInfoHeight.md : 0);
            updateHeight += isParentError ? errorTextHeight.md : 0;
            updateHeight -= hiddenParent ? clonePosition.top.md + 40 : 0;
            clonePosition.top.md += updateHeight;
        } else if (innerWidth < 600) {
            updateHeight += withIndex ? indexInfoHeight.xs : 0;
            updateHeight += isParentError ? errorTextHeight.xs : 0;
            updateHeight -= hiddenParent ? clonePosition.top.xs : 0;
            updateHeight += isPopup && innerWidth > 480 ? 11 : 0;
            clonePosition.top.xs += updateHeight;
        }

        return clonePosition;
    };

    render = () => {
        const { value, hidden } = this.props;
        const checkedKeys = (value || []);

        if (hidden) return null;

        return (
            <CheckboxLayout
                {...this.props}
                {...this.state}
                handleChange={this.handleChange}
                isDisabled={this.isDisabled}
                isHidden={this.isHidden}
                getSample={this.getSample}
                addHeight={this.addHeight}
                checkedKeys={checkedKeys}
            />
        );
    };
}

CheckboxGroup.propTypes = {
    hidden: PropTypes.bool,
    value: PropTypes.array
};

CheckboxGroup.defaultProps = {
    hidden: false,
    value: null
};

export default CheckboxGroup;
