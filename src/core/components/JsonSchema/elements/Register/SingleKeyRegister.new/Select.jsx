import React from 'react';

import Select from 'components/Select';

import useTable from 'services/dataTable/useTable';
import endPoint from 'components/JsonSchema/elements/Register/SingleKeyRegister/endPoint';
import toOption from 'components/JsonSchema/elements/Register/SingleKeyRegister/toOption';

import formElement from 'components/JsonSchema/components/formElement';

const SingleKeyRegisterSelect = ({
    t,
    path,
    value,
    error,
    keyId,
    hidden,
    stepName,
    multiple,
    readOnly,
    description,
    autocomplete,
    useOwnContainer,
    rootDocument: { id: rootDocumentId },
    originDocument: { id: originDocumentId }
}) => {
    const { data, search, loading, actions } = useTable(endPoint, {
        rowsPerPage: autocomplete ? 5 : 5000,
        filters: {
            keyId,
            strict: true,
            control: [].concat('documents', rootDocumentId || originDocumentId, stepName, path).join('.')
        }
    });

    const handleChange = async () => { };

    return hidden ? null : (
        <Select
            error={error}
            multiple={multiple}
            readOnly={readOnly}
            id={path.join('-')}
            inputValue={search}
            isLoading={loading}
            description={description}
            loadingMessage={() => t('Loading')}
            onChange={handleChange}
            onChangePage={(e, page) => actions.onChangePage(page)}
            onInputChange={newSearch => actions.onSearchChange(newSearch, newSearch !== search)}
            usePagination={autocomplete}
            pagination={data && data.meta}
            useOwnContainer={useOwnContainer}
            value={value}
            options={data && data.map(toOption)}
        />
    );
};

export default formElement(SingleKeyRegisterSelect);
