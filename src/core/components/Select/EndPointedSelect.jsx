import React from 'react';

import Select from 'components/Select';
import useTable from 'services/dataTable/useTable';

import { objectArrayUnique } from 'helpers/arrayUnique';

const defaulToOption = (option = {}) => {
    const { id: value, data: { name } = {} } = option;
    return { ...option, label: name, value };
};

const EndPointedSelect = ({
    value,
    onChange,
    endPoint,
    description,
    idProperty = 'id',
    rowsPerPage = 5,
    filters = {},
    toOption = defaulToOption
}) => {
    const [list, setList] = React.useState([]);
    const { data, search, loading, actions, page } = useTable(endPoint, { rowsPerPage, filters });

    React.useEffect(() => {
        if (!loading && !data) {
            actions.load();
        }
    });

    React.useEffect(() => {
        if (!data) {
            return;
        }
        setList(objectArrayUnique(list.concat(data), idProperty));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <Select
            page={page}
            value={value}
            onChange={onChange}
            usePagination={true}
            pagination={data && data.meta}
            description={description}
            options={list && list.map(toOption)}
            onChangePage={newPage => actions.onChangePage(newPage)}
            onInputChange={newSearch => actions.onSearchChange(newSearch, newSearch !== search)}
        />
    );
};

export default EndPointedSelect;