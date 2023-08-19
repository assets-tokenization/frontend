import React from 'react';
import PropTypes from 'prop-types';

import { List } from '@mui/material';
import Preloader from 'components/Preloader';

import Pagination from 'components/DataList/Pagination';

const DataList = ({
    data,
    page,
    count,
    rowsPerPage,
    ItemTemplate,
    controls,
    actions,
    classNamePreloader
}) => {
    if (data === null) {
        return <Preloader className={classNamePreloader}/>;
    }

    return (
        <List aria-live="polite">
            <div>
                {data.map((row, index) => <ItemTemplate {...row} key={index} actions={actions} />)}
            </div>
            {controls.pagination ? (
                <Pagination
                    page={page}
                    count={count}
                    rowsPerPage={rowsPerPage}
                    onChangePage={actions.onChangePage}
                    onChangeRowsPerPage={actions.onChangeRowsPerPage}
                />
            ) : null}
        </List>
    );
};

DataList.propTypes = {
    data: PropTypes.array,
    ItemTemplate: PropTypes.oneOfType([PropTypes.instanceOf(React.Component), PropTypes.func]).isRequired,
    page: PropTypes.number,
    count: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number,
    actions: PropTypes.object,
    controls: PropTypes.object,
    classNamePreloader: PropTypes.string
};

DataList.defaultProps = {
    data: null,
    page: 1,
    rowsPerPage: 10,
    actions: {},
    controls: {
        pagination: false
    },
    classNamePreloader: ''
};

export default DataList;
