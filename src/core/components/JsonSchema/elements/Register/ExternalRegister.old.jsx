/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Select from 'components/Select';
import { ChangeEvent } from 'components/JsonSchema';
import defaultProps from 'components/JsonSchema/elements/Register/defaultProps';
import ElementContainer from 'components/JsonSchema/components/ElementContainer';
import FieldLabel from 'components/JsonSchema/components/FieldLabel';

import sleep from 'helpers/sleep';
import equilPath from 'helpers/equilPath';
import queueFactory from 'helpers/queueFactory';
import { uniqbyValue as uniq } from 'helpers/arrayUnique';
import evaluate from 'helpers/evaluate';

import processList from 'services/processList';

import { loadTask } from 'application/actions/task';
import { requestExternalData } from 'application/actions/externalReader';


const toOption = option => ({ ...option, value: option.id, label: option.name });

class ExternalRegister extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: null,
            optionsArray: null,
            search: '',
            page: 0,
            loading: false
        };

        console.log('constructor');

        const { taskId, useOwnContainer, actions, setDefined, readOnly, usedInTable } = props;
        this.queue = queueFactory.get(taskId + '-registers');
        this.listened_diffs = [];

        !usedInTable && this.toggleBusy(true);

        this.queue.removeAllListeners('end');

        this.queue.on('end', async () => {
            if (setDefined && this.state.options) {
                await actions.handleStore();
                !useOwnContainer && this.toggleBusy(true);
                await actions.loadTask();
            }
            !useOwnContainer && this.toggleBusy(false);
        });

        if (readOnly) {
            this.toggleBusy(false);
        }

        if (!this.queue.length) {
            this.queue.push(() => sleep(10));
        }

        this.queue.push(this.init);
    }

    componentWillUnmount = () => {
        const jobIndex = this.queue.indexOf(this.init);
        if (jobIndex >= 0) {
            this.queue.slice(jobIndex, jobIndex);
        }
        this.queue.removeAllListeners('end')
    };

    init = async () => {
        const {
            actions,
            registerActions,
            setDefined,
            originDocument,
            usedInTable,
            autocomplete,
            service,
            method
        } = this.props;
        const { optionsArray: savedOptions } = this.state;

        const filterData = this.getFilters();
        
        const externalReaderRequestData = {
            service,
            method,
            filters: filterData || {}
        };

        this.setState({ loading: true });

        !usedInTable && this.toggleBusy(true);

        await actions.handleStore();

        !usedInTable && this.toggleBusy(true);

        const options = !originDocument.isFinal ? await processList.hasOrSet('requestExternalData', registerActions.requestExternalData, externalReaderRequestData) : [];

        if (options instanceof Error) {
            this.setState({ loading: false });
            !usedInTable && this.toggleBusy(false);
            return;
        }

        if (setDefined) await actions.handleStore();

        !usedInTable && this.toggleBusy(true);

        const optionsArray = autocomplete ? uniq((savedOptions || []).concat(options.map(toOption))) : options.map(toOption);

        this.setState({ options, optionsArray, loading: false });

        !usedInTable && this.toggleBusy(false);
    };

    toggleBusy = bool => {
        const { actions } = this.props;
        actions && actions.setBusy && actions.setBusy(bool);
    };

    normalizeFilterPath = (value) => {
        const { path, stepName } = this.props;
        const parts = value.split('.');
        const elementPathParts = ['data'].concat(stepName, path);

        return parts.map((part, index) => (part === 'X' ? elementPathParts[index] : part));
    }

    getFilters = () => {
        const { rootDocument, value, steps, activeStep, filters } = this.props;
        if (!filters) return null;

        const filterData = filters.reduce((data, item) => {
            const result = evaluate(item.value, value, rootDocument.data[steps[activeStep]], rootDocument.data);

            if (result instanceof Error) {
                result.commit({ type: 'external filters error' });
                return data;
            }

            return {...data, [item.key]: result};
        }, {});

        return filterData;
    };

    handleChange = async (selected) => {
        const { optionsArray } = this.state;
        const { onChange, multiple } = this.props;

        const selectedOptionsIds = [].concat(selected).filter(Boolean).map(({ id }) => id);
        const selectedOptions = (optionsArray || []).filter(({ id }) => selectedOptionsIds.includes(id));
        const newValue = multiple ? selectedOptions : selectedOptions.shift();

        onChange && (await onChange(new ChangeEvent(newValue, true, true, true)));
    };

    handleChangePage = (newPage) => {
        const { page } = this.state;
        if (page !== newPage) {
            this.setState({ page: newPage });
            this.queue.push(this.init);
        }
    }

    handleSearch = value => {
        const { search } = this.state;

        if (search === value) return;

        this.setState({
            search: value,
            page: 0
        }, () => {
            const { autocomplete } = this.props;

            if (!autocomplete) return;

            clearTimeout(this.handleSearchTimeout);

            this.handleSearchTimeout = setTimeout(() => {
                this.setState({ optionsArray: [] });
                this.queue.push(this.init);
            }, 500);
        });
    };

    render = () => {
        const {
            t,
            stepName,
            description,
            sample,
            required,
            error,
            outlined,
            path,
            noMargin,
            width,
            maxWidth,
            hidden,
            autocomplete,
            readOnly,
            useOwnContainer,
            value,
            multiple,
            triggerExternalPath,
            externalReaderMessage,
            notRequiredLabel,
            ...props
        } = this.props;
        const { options, search, loading, page, optionsArray } = this.state;

        if (hidden) return null;

        const selected = [].concat(value).filter(Boolean).map(toOption);
        const inputValue = multiple ? selected : selected.shift();

        return (
            <ElementContainer
                sample={sample}
                required={required}
                error={error}
                bottomSample={true}
                width={width}
                maxWidth={maxWidth}
                onSelectResetsInput={false}
                onBlurResetsInput={false}
                noMargin={noMargin}
            >
                <Select
                    {...props}
                    error={error}
                    multiple={multiple}
                    readOnly={readOnly}
                    id={path.join('-')}
                    inputValue={search}
                    isLoading={loading}
                    description={description ? <FieldLabel description={description} required={required} notRequiredLabel={notRequiredLabel} /> : ''}
                    loadingMessage={() => t('Loading')}
                    onChange={this.handleChange}
                    onChangePage={this.handleChangePage}
                    onInputChange={this.handleSearch}
                    usePagination={autocomplete}
                    pagination={options && options.meta}
                    page={page}
                    useOwnContainer={useOwnContainer}
                    value={inputValue}
                    options={optionsArray}
                />
                {equilPath(triggerExternalPath, [stepName].concat(path)) ? externalReaderMessage : null}
            </ElementContainer>
        );
    };
}

ExternalRegister.propTypes = {
    actions: PropTypes.object.isRequired,
    properties: PropTypes.object,
    description: PropTypes.string,
    sample: PropTypes.string,
    outlined: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    error: PropTypes.object,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    path: PropTypes.array,
    originDocument: PropTypes.object,
    useOwnContainer: PropTypes.bool,
    readOnly: PropTypes.bool,
    notRequiredLabel: PropTypes.string
};

ExternalRegister.defaultProps = defaultProps;

const mapStateToProps = ({ externalReader }) => ({ externalReader });

const mapDispatchToProps = dispatch => ({
    registerActions: {
        loadTask: bindActionCreators(loadTask, dispatch),
        requestExternalData: bindActionCreators(requestExternalData, dispatch)
    }
});
const translated = translate('Elements')(ExternalRegister);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
