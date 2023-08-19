/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { translate } from 'react-translate';
import PropTypes from 'prop-types';
import evaluate from 'helpers/evaluate';

import emptyValues from 'components/JsonSchema/emptyValues';
import ChangeEvent from 'components/JsonSchema/ChangeEvent';

import ArrayElementContainer from 'components/JsonSchema/elements/ArrayElement/components/ArrayElementContainer';
import ArrayElementItem from 'components/JsonSchema/elements/ArrayElement/components/ArrayElementItem';
import ArrayElementAddBtn from 'components/JsonSchema/elements/ArrayElement/components/ArrayElementAddBtn';

class ArrayElement extends React.Component {
    componentDidMount() {
        const { value, onChange, allowEmpty } = this.props;
        if (!value && !allowEmpty) {
            onChange && onChange(this.getItems());
        }
    }

    handleAddItem = () => {
        const { onChange, items } = this.props;
        onChange && onChange(this.getItems().concat([emptyValues[items.type || 'object']]));
    };

    handleDeleteItem = index => () => {
        const { onChange, value, allowEmpty, items, /*actions*/ } = this.props;
        const arr = Object.values(value);

        arr.splice(index, 1);

        if (!allowEmpty && !arr.length) {
            arr.push(emptyValues[items.type || 'object']);
        }

        onChange && onChange(new ChangeEvent(arr, false, true));
    };

    getItems = () => {
        const { value, items, allowEmpty } = this.props;
        const data = Object.values(value || {});
        return (data.length || allowEmpty) ? data : [].concat(emptyValues[(items || {}).type || 'object']);
    }

    allowAdd = () => {
        const { rootDocument, value, steps, activeStep, allowAdd } = this.props;

        if (allowAdd && typeof allowAdd === 'string') {
            const result = evaluate(allowAdd, value, rootDocument.data[steps[activeStep]], rootDocument.data);

            if (result instanceof Error) {
                result.commit({ type: 'allowAdd check' });
                return true;
            }

            return result;
        }

        return allowAdd;
    }

    allowDelete = () => {
        const { rootDocument, value, steps, activeStep, allowDelete } = this.props;

        if (allowDelete && typeof allowDelete === 'string') {
            const result = evaluate(allowDelete, value, rootDocument.data[steps[activeStep]], rootDocument.data);

            if (result instanceof Error) {
                result.commit({ type: 'allowDelete check' });
                return true;
            }

            return result;
        }

        return allowDelete;
    }

    renderElement = (values, index) => {
        const {
            task,
            taskId,
            customControls,
            steps,
            actions,
            rootDocument,
            originDocument,
            template,
            stepName,
            errors,
            path,
            allowEmpty,
            items = {},
            readOnly,
            onChange,
            active,
            locked,
            activeStep,
            clearWhenEmpty,
            disableBoxShadow,
            staticState,
            fileStorage,
            hideDeleteButton,
            darkTheme,
            handleSave
        } = this.props;
        const arrayItems = this.getItems();

        return (
            <ArrayElementItem
                key={index}
                error={errors.find(err => err.path === path.concat(index).join('.'))}
                path={path.concat(index)}
                deleteAllowed={this.allowDelete() && !readOnly && (allowEmpty || arrayItems.length > 1)}
                handleDeleteItem={this.handleDeleteItem(index)}
                disableBoxShadow={disableBoxShadow}
                staticState={staticState}
                hideDeleteButton={hideDeleteButton}
                darkTheme={darkTheme}
                schemaProps={
                    {
                        active,
                        locked,
                        fileStorage,
                        customControls,
                        task,
                        taskId,
                        steps,
                        rootDocument,
                        originDocument,
                        stepName,
                        activeStep,
                        actions,
                        errors,
                        template,
                        pathIndex: {
                            index
                        },
                        path: path.concat(index),
                        schema: {
                            ...items,
                            type: items.type || 'object',
                            required: items.required || [],
                            clearWhenEmpty,
                            handleDeleteItem: this.handleDeleteItem(index)
                        },
                        name: index,
                        value: values,
                        readOnly: readOnly || items.readOnly,
                        onChange: onChange.bind(null, index),
                        handleSave,
                        allowDelete: this.allowDelete()
                    }
                }
            />
        );
    };

    render() {
        const {
            t,
            locked,
            addItem,
            rootDocument,
            maxElements,
            hidden,
            allowEmpty,
            readOnly,
            staticState,
            ...rest
        } = this.props;

        if (hidden) {
            return null;
        }

        const arrayItems = this.getItems();
        let calcMaxElements = 0;

        if (maxElements) {
            calcMaxElements = maxElements;
            if (typeof maxElements === 'string') {
                calcMaxElements = evaluate(maxElements, rootDocument.data);

                if (calcMaxElements instanceof Error) {
                    calcMaxElements.commit({ type: 'array element maxElements' });
                    calcMaxElements = undefined;
                }
            }
        }

        const allowAdding = (!calcMaxElements || arrayItems.length < calcMaxElements) && !readOnly;

        return (
            <ArrayElementContainer
                handleAddItem={this.handleAddItem}
                {...rest}
            >
                {arrayItems.map(this.renderElement)}
                {
                    this.allowAdd() && allowAdding && !staticState ? (
                        <ArrayElementAddBtn
                            addItemText={(addItem && addItem.text) || t('AddArrayItem')}
                            handleAddItem={this.handleAddItem}
                            arrayItems={arrayItems}
                            disabled={locked}
                        />
                    ) : null
                }
            </ArrayElementContainer>
        );
    }
}

ArrayElement.propTypes = {
    t: PropTypes.func.isRequired,
    errors: PropTypes.array,
    value: PropTypes.array,
    allowEmpty: PropTypes.bool,
    path: PropTypes.array,
    clearWhenEmpty: PropTypes.bool,
    staticState: PropTypes.bool,
    hideDeleteButton: PropTypes.bool,
    allowAdd: PropTypes.bool,
    allowDelete: PropTypes.bool,
    locked: PropTypes.bool,
    darkTheme: PropTypes.bool,
};

ArrayElement.defaultProps = {
    errors: [],
    value: [],
    allowEmpty: false,
    path: [],
    clearWhenEmpty: false,
    staticState: false,
    allowAdd: true,
    allowDelete: true,
    hideDeleteButton: false,
    locked: false,
    darkTheme: false,
};

export default translate('Elements')(ArrayElement);
