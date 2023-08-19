import React from 'react';
import PropTypes from 'prop-types';
import {
    Checkbox,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import ElementContainer from 'components/JsonSchema/components/ElementContainer';

const CheckboxLayout = ({
    getSample,
    description,
    required,
    readOnly,
    rowDirection,
    error,
    path,
    list,
    checkedKeys,
    onChange,
    getLabel,
    noMargin
}) => (
    <ElementContainer
        description={description}
        required={required}
        error={error}
        noMargin={noMargin}
    >
        <FormGroup row={rowDirection}>
            {
                list && list.map((key, index) => {
                    if (!key.id) return null;
                    return (
                        <>
                            <FormControlLabel
                                key={index}
                                control={
                                    (
                                        <Checkbox
                                            id={path.concat(index).join('-')}
                                            disabled={readOnly}
                                            checked={!!checkedKeys.find(({ id }) => id === key.id)}
                                            onChange={() => onChange(checkedKeys, key, key.id)}
                                        />
                                    )
                                }
                                label={getLabel(key)}
                            />
                            {getSample(key)}
                        </>
                    );
                })
            }
        </FormGroup>
    </ElementContainer>
);

CheckboxLayout.propTypes = {
    rowDirection: PropTypes.bool,
    onChange: PropTypes.func,
    getLabel: PropTypes.func,
    getSample: PropTypes.func,
    error: PropTypes.object,
    description: PropTypes.string,
    required: PropTypes.array,
    list: PropTypes.array,
    checkedKeys: PropTypes.array,
    readOnly: PropTypes.array,
    path: PropTypes.array
};

CheckboxLayout.defaultProps = {
    rowDirection: false,
    onChange: null,
    getLabel: null,
    getSample: null,
    checkedKeys: [],
    list: [],
    error: null,
    description: null,
    required: false,
    readOnly: false,
    path: []
};

export default CheckboxLayout;
