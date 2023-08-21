import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { ClickAwayListener } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import InputComponent from 'components/DataTable/components/SearchInput/InputComponent';
import FilterChips from 'components/DataTable/components/SearchInput/FilterChips';
import FilterHandlers from 'components/DataTable/components/SearchInput/FilterHandlers';
import waiter from 'helpers/waitForAction';

const styles = {
  root: {
    alignItems: 'center',
    flexGrow: 1,
    maxWidth: '100%',
    flexBasis: 0,
    marginLeft: 10
  },
  searchIcon: {
    padding: '0 8px'
  }
};

const SEARCH_INTERVAL = 1000;

const SearchInput = ({
  t,
  classes,
  search,
  filters,
  filterHandlers,
  actions,
  darkTheme,
  searchPlaceholder,
  updateOnChangeSearch = true
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeFilter, setActiveFilter] = React.useState(null);
  const rootRef = React.useRef(null);

  const handleChange = ({ target: { value } }) => {
    actions.onSearchChange && actions.onSearchChange(value, false);
    updateOnChangeSearch && waiter.addAction('dataTableSearch', actions.load, SEARCH_INTERVAL);
  };

  const onKeyPress = ({ key }) => {
    key === 'Enter' && actions.load();
  };

  const onFocus = ({ currentTarget }) => {
    setAnchorEl(currentTarget);
    setActiveFilter(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveFilter(null);
  };

  const renredPlaceholder = () => {
    if (activeFilter) {
      return filterHandlers?.[activeFilter]()?.props?.label;
    }
    return searchPlaceholder || t('Search');
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClose}>
        <div className={classes.root} ref={rootRef}>
          <InputComponent
            value={search}
            darkTheme={darkTheme}
            placeholder={renredPlaceholder()}
            onChange={handleChange}
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            startAdornment={
              <FilterChips
                filters={filters}
                onClose={handleClose}
                filterHandlers={filterHandlers}
                onFilterChange={actions.onFilterChange}
                onClick={(currentTarget, filterName) => {
                  setAnchorEl(currentTarget);
                  setActiveFilter(filterName);
                }}
              />
            }
          />
          <FilterHandlers
            filters={filters}
            filterHandlers={filterHandlers}
            onFilterChange={actions.onFilterChange}
            onClose={handleClose}
            anchorEl={anchorEl}
            rootRef={rootRef}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            darkTheme={darkTheme}
          />
        </div>
      </ClickAwayListener>
    </>
  );
};

SearchInput.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.string,
  actions: PropTypes.object,
  filters: PropTypes.object,
  filterHandlers: PropTypes.object,
  darkTheme: PropTypes.bool,
  searchPlaceholder: PropTypes.string
};

SearchInput.defaultProps = {
  search: '',
  actions: {},
  filters: {},
  filterHandlers: {},
  darkTheme: false,
  searchPlaceholder: null
};

const styled = withStyles(styles)(SearchInput);
const translated = translate('DataTable')(styled);
export default translated;
