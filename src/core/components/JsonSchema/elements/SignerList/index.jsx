import React from 'react';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchUsers } from 'actions/users';
import { putTaskSigners } from 'application/actions/task';
import evaluate from 'helpers/evaluate';
// import DataTable from 'components/DataTable';
// import Table from 'components/JsonSchema/elements/Table';
// import dataTableSettings from './dataTableSettings';
// import ChangeEvent from '../../ChangeEvent';

class SignerList extends React.Component {
    //  state = { editMode: false, users: [], search: '' };
    listenSignersData = () => {
        const { shouldInit, calcSigners, handleStore, originDocument, rootDocument } = this.props;

        if (shouldInit) return;

        const originArray = evaluate(calcSigners, originDocument);
        const rootArray = evaluate(calcSigners, rootDocument);

        if (originArray instanceof Error || rootArray instanceof Error) return;

        if (JSON.stringify(originArray) === JSON.stringify(rootArray)) return;

        clearTimeout(this.timeout);

        this.timeout = setTimeout(async() => {
            handleStore && (await handleStore());
            this.initSigners();
        }, 50);
    };

    initSigners = () => {
        // const { getUserList, filters } = this.props;
        // getUserList(filters).then(users => this.setState({ users }));
        const { path, stepName, actions, taskId, rootDocument: { isFinal }, demo } = this.props;
        const schemaPath = [stepName].concat(path).join('.properties.');
        // console.log('SIGNERS', calcSigners, path, schemaPath);
        if (!isFinal && !demo) {
            actions.putTaskSigners(taskId, schemaPath);
        }
    };

    componentDidMount = () => this.initSigners();

    componentDidUpdate = () => this.listenSignersData();

    // toggleEditMode = () => this.setState({ editMode: !this.state.editMode });

    // onSearchChange = search => this.setState({ search });

    handleChange = () => {
        // const { users } = this.state;
        // const { onChange, actions } = this.props;
        // const values = users.filter(({ id }) => value.includes(id));
        // onChange && onChange(new ChangeEvent(values, true, true));
        // actions.setTaskSigners(values.map(({ id }) => id));
    };

    render = () => {
        // const { t, value, hidden } = this.props;
        // const { editMode, users, search } = this.state;
        // const { hidden } = this.props;

        // if (hidden) return null;

        // return (
        // <DataTable
        //     actions={{
        //         toggleEditMode: this.toggleEditMode,
        //         onRowsSelect: this.handleChange,
        //         onSearchChange: this.onSearchChange
        //     }}
        //     {...dataTableSettings({ t, editMode, value, users, search })}
        // />
        // );
        return null;
    }
}

const mapsStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    actions: {
        getUserList: bindActionCreators(searchUsers, dispatch),
        putTaskSigners: bindActionCreators(putTaskSigners, dispatch)
    }
});

const translated = translate('SignerListComponent')(SignerList);
export default connect(mapsStateToProps, mapDispatchToProps)(translated);
