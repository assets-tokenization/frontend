/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import evaluate from 'helpers/evaluate';

import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import renderHTML from 'helpers/renderHTML';
import styles from 'components/JsonSchema/elements/RadioGroup/components/layout';

import { ElementGroupContainer } from 'components/JsonSchema';



class RadioGroupElement extends React.Component {
    componentDidMount() {
        this.init();
    }

    componentDidUpdate({ path, activeStep }) {
        const { path: newPath, activeStep: newActiveStep } = this.props;

        if (path.join() !== newPath.join() || newActiveStep !== activeStep) {
            this.init();
        }
    }

    init = () => {
        const { onChange, value, defaultValue, type, items, rootDocument } = this.props;

        if (value) {
            const selectedItem = items.find(({ id }) => id === (typeof value === 'object' ? value.id : value));
            if (selectedItem && this.isDisabled(selectedItem)) {
                onChange && onChange(null);
            }
        }

        if (defaultValue && value === null) {
            let defaultValueEvalated = defaultValue;
        
            const result = evaluate(defaultValue, rootDocument.data);

            if (!(result instanceof Error)) defaultValueEvalated = result;

            const newValue = type === 'object' ? items.find(({ id }) => id === defaultValueEvalated) : defaultValueEvalated;
    
            onChange && onChange(newValue);
        }
    }

    handleChange = itemId => () => {
        const { onChange, type, items } = this.props;
        const newValue = type === 'object' ? items.find(({ id }) => id === itemId) : itemId;
        onChange(newValue);
    };

    isDisabled = ({ isDisabled }) => {
        const { rootDocument, value, steps, activeStep } = this.props;
        if (isDisabled && typeof isDisabled === 'string') {
            const result = evaluate(isDisabled, value, rootDocument.data[steps[activeStep]], rootDocument.data);

            if (result instanceof Error) {
                result.commit({ type: 'radio group check disabled' });
                return false;
            }

            return result;
        }

        return isDisabled;
    }

    getSample = (key) => {
        const { rootDocument, value, steps, activeStep } = this.props;
        const { getSample, sample } = key;

        if (getSample && typeof getSample === 'string') {
            const result = evaluate(getSample, value, rootDocument.data[steps[activeStep]], rootDocument.data);

            if (result instanceof Error) {
                result.commit({ type: 'Radio group get sample' });
                return '';
            }

            return result;
        }

        return sample;
    };

    getTitle = (title) => {
        const { rootDocument, value, steps, activeStep } = this.props;
    
        if (!title) return false;
    
        const result = evaluate(title, value, rootDocument.data[steps[activeStep]], rootDocument.data);

        if (result instanceof Error) return title;

        return result;
    };

    renderElement() {
        const { classes, value, items, rowDirection, path, type, readOnly, displayAllSamples } = this.props;
        const valueId = type === 'object' ? (value || {}).id : value;

        return (
            <RadioGroup
                id={path.join('-')}
                row={rowDirection}
                className={
                    classNames({
                        [classes.root]: true,
                        [classes.row]: rowDirection,
                        [classes.distance]: !rowDirection
                    })
                }
            >
                {
                    items.map((key, index) => {
                        const id = (path || []).join('-') + '-discription' + index;
                        return(
                        <div key={key.id}>
                            <FormControlLabel
                                id={id}
                                className={classes.labelSize}
                                disabled={this.isDisabled(key) || readOnly}
                                control={
                                    (
                                        <Radio
                                            id={path.concat(key.id).join('-')}
                                            checked={valueId === key.id}
                                            onChange={this.handleChange(key.id)}
                                            inputProps={{ 'aria-describedby': id }}
                                            className={
                                                    classNames({
                                                    [classes.radioMargin]: rowDirection
                                                })
                                            }
                                        />
                                    )
                                }
                                label={this.getTitle(key.title)}
                            />
                            {
                                !rowDirection && (displayAllSamples ? displayAllSamples : valueId === key.id) ? (
                                    <span>{renderHTML(this.getSample(key) || '')}</span>
                                ) : null
                            }
                        </div>
                    )})
                }
            </RadioGroup>
        );
    }

    render() {
        const { sample, description, required, error, hidden, width, maxWidth, variant, ...rest } = this.props;

        if (hidden) return null;

        return (
            <ElementGroupContainer
                sample={sample}
                description={description}
                required={required}
                error={error}
                variant={variant}
                width={width}
                maxWidth={maxWidth}
                {...rest}
            >
                {this.renderElement()}
            </ElementGroupContainer>
        );
    }
}

RadioGroupElement.propTypes = {
    items: PropTypes.array,
    rowDirection: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    rootDocument: PropTypes.object.isRequired,
    activeStep: PropTypes.number.isRequired,
    steps: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
    path: PropTypes.array,
    readOnly: PropTypes.bool,
    displayAllSamples: PropTypes.bool
};

RadioGroupElement.defaultProps = {
    items: [],
    rowDirection: true,
    value: null,
    path: [],
    readOnly: false,
    variant:  'subtitle1',
    displayAllSamples: false
};

export default withStyles(styles)(RadioGroupElement);
