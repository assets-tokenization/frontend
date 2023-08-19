import React from 'react';
import { Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import _ from 'lodash';
import renderHTML from 'helpers/renderHTML';
import StringElement from 'components/JsonSchema/elements/StringElement';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from '@mui/icons-material/Check';
import evaluate from 'helpers/evaluate';

const styles = () => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    marginBottom: 40,
  },
  filterItem: {
    marginRight: 27,
  },
  noBorder: {
    border: 'none',
    '&>svg': {
      fontSize: 20,
      opacity: 0.5,
    },
    '&:after': {
      display: 'none',
    },
    '&:before': {
      display: 'none',
    },
  },
  selectMenu: {
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
    '& ul': {
      padding: 0,
    },
  },
  selectRoot: {
    fontSize: 13,
    paddingRight: '10px!important',
    '& svg': {
      display: 'none',
    },
  },
  dropArrow: {
    fontSize: 20,
    opacity: 0.5,
    top: -2,
    cursor: 'pointer',
    position: 'relative',
  },
  menuItem: {
    fontSize: 13,
    lineHeight: '32px',
    paddingLeft: 46,
    paddingTop: 4,
    paddingBottom: 4,
    '& svg': {
      position: 'absolute',
      left: 17,
      top: 7,
    },
  },
  checkboxLabel: {
    fontSize: 13,
  },
});

const RenderFilters = ({
  classes,
  filters,
  onFilterChange,
  requestFilters,
  sort,
  setSort,
  sortDirection,
  setSortDirection,
  rootDocument,
}) => {
  let [timeout] = React.useState(null);

  if (!filters) return null;

  const keys = Object.keys(filters);

  const FilterWrapper = ({ filter, children }) => (
    <div
      className={classes.filterItem}
      style={{
        width: filter?.width,
      }}
      key={_.uniqueId()}
    >
      {children}
    </div>
  );

  const getOptions = (item) => {
    let options = null;

    if (typeof item?.options === 'string') {
      options = evaluate(item?.options, rootDocument.data);
    } else {
      options = item?.options;
    }

    return options;
  };

  return (
    <div className={classes.wrapper}>
      {keys.map((key) => {
        const filter = filters[key];

        if (filter.hidden) return null;

        if (filter.type === 'string') {
          return (
            <FilterWrapper filter={filter} key={_.uniqueId()}>
              <StringElement
                description={filter?.description}
                value={requestFilters[key]}
                required={true}
                options={getOptions(filter)}
                noMargin={true}
                path={[key, _.uniqueId()]}
                startAdornment={(
                  <>
                    {filter?.startAdornment ? (
                      <img
                        src={renderHTML(filter?.startAdornment)}
                        alt={'filter icon'}
                      />
                    ) : null}
                  </>
                )}
                onChange={(value) => {
                  clearTimeout(timeout);
                  timeout = setTimeout(
                    () => {
                      onFilterChange({
                        ...requestFilters,
                        [key]: value,
                      });
                    },
                    filter?.options ? 50 : 1000
                  );
                }}
              />
            </FilterWrapper>
          );
        }

        if (filter.type === 'checkbox') {
          return (
            <FilterWrapper filter={filter} key={_.uniqueId()}>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={requestFilters[key]}
                    onChange={() =>
                      onFilterChange({
                        ...requestFilters,
                        [key]: requestFilters[key] === true ? '' : true,
                      })
                    }
                    name={key}
                    color="primary"
                  />
                )}
                label={filter?.description}
                classes={{
                  label: classes.checkboxLabel,
                }}
              />
            </FilterWrapper>
          );
        }

        if (filter.type === 'sort') {
          return (
            <FilterWrapper filter={filter} key={_.uniqueId()}>
              <Select
                variant="standard"
                value={sort}
                onChange={({ target: { value } }) => setSort(value)}
                IconComponent={() => (
                  <>
                    {sortDirection === 'desc' ? (
                      <ArrowDownwardIcon
                        onClick={() => setSortDirection('asc')}
                        className={classes.dropArrow}
                      />
                    ) : (
                      <ArrowUpwardIcon
                        onClick={() => setSortDirection('desc')}
                        className={classes.dropArrow}
                      />
                    )}
                  </>
                )}
                classes={{
                  root: classes.selectRoot,
                }}
                className={classes.noBorder}
                MenuProps={{
                  classes: {
                    paper: classes.selectMenu,
                  },
                }}
              >
                {filter?.options.map(({ id, name }) => (
                  <MenuItem
                    key={_.uniqueId()}
                    value={id}
                    classes={{
                      root: classes.menuItem,
                    }}
                  >
                    {sort === id ? <CheckIcon /> : null}
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FilterWrapper>
          );
        }

        return null;
      })}
    </div>
  );
};

const styled = withStyles(styles)(RenderFilters);

export default styled;
