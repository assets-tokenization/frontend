import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';

import withStyles from '@mui/styles/withStyles';

const styles = {
};

const SearchFilterChips = ({
    filterHandlers,
    filters,
    onClick,
    onFilterChange,
    onClose,
}) => {
    const handleDelete = (filterName) => () => {
        const value = Object.keys(filters)
            .filter(fName => fName !== filterName)
            .reduce((acc, fName) => ({
                ...acc,
                [fName]: filters[fName]
            }), {});

        onFilterChange(value);
        onClose();
    };

    return (
        <>
            {Object.keys(filterHandlers).map((filterName) => {
                const FilterHandler = filterHandlers[filterName];

                if (!filters[filterName]) {
                    return null;
                }

                return (
                    <FilterHandler
                        key={filterName}
                        type="chip"
                        value={filters[filterName]}
                        onClick={({ currentTarget }) => onClick(currentTarget, filterName)}
                        onDelete={handleDelete(filterName)}
                    />
                );
            })}
        </>
    );
};

SearchFilterChips.propTypes = {
    classes: PropTypes.object.isRequired,
    filters: PropTypes.object,
    filterHandlers: PropTypes.object,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    onFilterChange: PropTypes.func
};

SearchFilterChips.defaultProps = {
    filters: {},
    filterHandlers: {},
    onClick: () => null,
    onClose: () => null,
    onFilterChange: () => null
};

const styled = withStyles(styles)(SearchFilterChips);
export default translate('DataTable')(styled);
