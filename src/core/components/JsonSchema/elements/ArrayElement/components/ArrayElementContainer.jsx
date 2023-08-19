import React from 'react';
import PropTypes from 'prop-types';

import ElementGroupContainer from 'components/JsonSchema/components/ElementGroupContainer';

const ArrayElementContainer = ({
    description,
    sample,
    error,
    required,
    width,
    maxWidth,
    children,
    ...rest
}) => (
    <ElementGroupContainer
        description={description}
        sample={sample}
        error={error}
        required={required}
        width={width}
        maxWidth={maxWidth}
        {...rest}
    >
        {children}
    </ElementGroupContainer>
);

ArrayElementContainer.propTypes = {
    classes: PropTypes.object.isRequired,
    description: PropTypes.string,
    sample: PropTypes.string,
    error: PropTypes.object,
    required: PropTypes.bool,
    width: PropTypes.number,
    maxWidth: PropTypes.number,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    calcMaxElements: PropTypes.number,
    arrayItems: PropTypes.array,
    readOnly: PropTypes.bool,
    handleAddItem: PropTypes.func,
    addItemText: PropTypes.string
};

ArrayElementContainer.defaultProps = {
    description: '',
    sample: '',
    error: null,
    required: false,
    width: null,
    maxWidth: null,
    calcMaxElements: null,
    arrayItems: [],
    readOnly: false,
    handleAddItem: () => null,
    addItemText: ''
};

export default ArrayElementContainer;
