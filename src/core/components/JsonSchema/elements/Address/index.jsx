/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import RecordsTreeControl from './components/recordsTree';
import SeparatedRegister from './components/separatedRegisters';

const Address = (props) => {
    const {
        recordsTree,
        template,
        stepName,
        schema,
        withNamedObjects
    } = props;

    if (recordsTree === null) {
        return <RecordsTreeControl {...props} />;
    }

    return (
        <SeparatedRegister
            recordsTree={recordsTree}
            template={template}
            stepName={stepName}
            schema={schema}
            withNamedObjects={withNamedObjects}
        />
    );
};

Address.propTypes = {
    recordsTree: PropTypes.bool,
    template: PropTypes.object,
    stepName: PropTypes.string,
    schema: PropTypes.object,
    withNamedObjects: PropTypes.bool
};

Address.defaultProps = {
    template: {},
    stepName: '',
    schema: {},
    withNamedObjects: null,
    recordsTree: null

};

export default Address;
