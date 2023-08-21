import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import objectPath from 'object-path';
import evaluate from 'helpers/evaluate';
import renderHTML from 'helpers/renderHTML';
import { addMessage } from 'actions/error';
import { requestRegisterKeyRecords } from 'actions/registry';
import TextBlock from 'components/JsonSchema/elements/TextBlock';
import ProgressLine from 'components/Preloader/ProgressLine';
import Pagination from './components/pagination';
import RenderFilters from './components/renderFilters';

const RegisterList = ({
  hidden,
  rootDocument,
  listTemplate,
  actions,
  keyId,
  filters: filtersProps,
  defaultSort,
  emptyList,
  dataMapping
}) => {
  const [list, setList] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [count, setCount] = React.useState(false);
  const [limit, setLimit] = React.useState(10);
  const [requestFilters, onFilterChange] = React.useState(() => {
    if (!filtersProps) return;

    const defaultFilters = {};

    Object.keys(filtersProps).forEach((key) => {
      if (!filtersProps[key]?.value) return;

      let filterValue = evaluate(filtersProps[key].value, rootDocument.data);

      if (filterValue instanceof Error) {
        filterValue = objectPath.get(rootDocument.data, filtersProps[key].value);
      }

      defaultFilters[`${key}`] = filterValue;
    });

    return defaultFilters;
  });
  const [sort, setSort] = React.useState(defaultSort?.sort);
  const [sortDirection, setSortDirection] = React.useState(defaultSort?.direction);

  const handleChangePagination = (page) => setOffset(page * limit);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const getFilters = () => {
        const filters = {
          offset,
          limit
        };

        Object.keys(requestFilters).forEach((key) => {
          const isDataFilter = evaluate(filtersProps[key].isDataLikeRequest, rootDocument.data);
          const filterName = isDataFilter === false ? 'data' : 'data_like';
          filters[`${filterName}[${key}]`] = requestFilters[key];
        });

        if (sort) {
          filters[`sort[${sort}]`] = sortDirection;
        }

        const filtered = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));

        return filtered;
      };

      if (!keyId) return null;

      const result = await actions.requestRegisterKeyRecords(keyId, getFilters());

      const mapData = (result || []).map(({ data, updatedAt, createdAt }) => ({
        ...data,
        updatedAt,
        createdAt
      }));

      setCount(result?.meta?.count);

      setList(mapData);

      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, keyId, limit, offset, requestFilters, sort, sortDirection]);

  if (hidden) return null;

  return (
    <>
      <RenderFilters
        filters={filtersProps}
        requestFilters={requestFilters}
        onFilterChange={onFilterChange}
        sort={sort}
        setSort={setSort}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        rootDocument={rootDocument}
      />

      <ProgressLine loading={loading} />

      {(list || []).map((option) => (
        <TextBlock
          key={_.uniqueId()}
          dataMapping={dataMapping}
          htmlBlock={listTemplate?.htmlBlock}
          params={listTemplate?.params}
          parentValue={rootDocument?.data}
          rootDocument={{ data: option } || rootDocument}
          pure={true}
        />
      ))}

      {!(list || []).length && emptyList && !loading ? <>{renderHTML(emptyList)}</> : null}

      {!list || !(list || []).length ? null : (
        <Pagination
          count={count}
          limit={limit}
          setLimit={setLimit}
          offset={offset}
          handleChangePagination={handleChangePagination}
          loading={loading}
        />
      )}
    </>
  );
};

RegisterList.propTypes = {
  hidden: PropTypes.bool,
  listTemplate: PropTypes.object,
  rootDocument: PropTypes.object,
  actions: PropTypes.object,
  keyId: PropTypes.number,
  filters: PropTypes.object,
  defaultSort: PropTypes.object,
  emptyList: PropTypes.string,
  dataMapping: PropTypes.string
};

RegisterList.defaultProps = {
  hidden: false,
  listTemplate: {
    htmlBlock: '',
    params: {}
  },
  rootDocument: {},
  actions: {},
  keyId: null,
  filters: null,
  defaultSort: {
    sort: false,
    direction: ''
  },
  emptyList: null,
  dataMapping: null
};

const mapDispatch = (dispatch) => ({
  actions: {
    requestRegisterKeyRecords: bindActionCreators(requestRegisterKeyRecords, dispatch),
    addMessage: bindActionCreators(addMessage, dispatch)
  }
});

export default connect(null, mapDispatch)(RegisterList);
