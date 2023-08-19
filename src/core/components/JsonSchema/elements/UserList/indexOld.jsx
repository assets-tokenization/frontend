import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Tooltip, IconButton, TextField, Typography, Select, MenuItem, Toolbar } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import AddIcon from '@mui/icons-material/AddOutlined';
// import CheckIcon from '@mui/icons-material/CheckOutlined';
import FaceIcon from '@mui/icons-material/Face';
import CloseIcon from '@mui/icons-material/Close';

import { DataTableStated } from 'components/DataTable';
import Preloader from 'components/Preloader';

import waiter from 'helpers/waitForAction';
import { searchUsers } from 'actions/users';

import ElementGroupContainer from '../components/ElementGroupContainer';
import ChangeEvent from '../ChangeEvent';

const SEARCH_INTERVAL = 500;

const styles = {
    toolbar: {
        padding: '0 4px'
    }
};

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchUserMode: true,
            searching: false,
            search: '',
            searchBy: 'name',
            searchResults: [],
            isIncreasing: false
        };
    }

    getValue = () => {
        const { value } = this.props;
        return Object.values(value || []).filter(Boolean);
    };

    async componentDidMount() {
        const { users, actions } = this.props;

        const notListedUsers = this.getValue().filter(userId => !users[userId]);

        if (notListedUsers.length) {
            let searchResults = await actions.searchUsers({ ids: notListedUsers });
            if (searchResults instanceof Error) searchResults = [];
            const notStoredUsers = notListedUsers.filter(id => !searchResults.find(({ userId }) => userId === id));
            notStoredUsers.forEach(userId => this.handleToggleUser({ userId }));
        }
    }

    handleChangeSearchBy = ({ target: { value } }) => this.setState({ searchBy: value }, this.handleSearch);

    handleChangeSearch = ({ target: { value } }) => this.setState({ search: value }, this.handleSearch);

    handleSearch = () => {
        if (!this.state.search) {
            this.setState({ searchResults: [], searching: false });
            waiter.removeAction('user-list-search');
            return;
        }

        this.setState({ searching: true });
        waiter.addAction('user-list-search', async () => {
            const { actions } = this.props;
            const { search, searchBy } = this.state;

            if (!search) {
                this.setState({ searchResults: [], searching: false });
                return;
            }

            const searchParams = {};

            switch (searchBy) {
                case 'ID':
                    searchParams.ids = [search];
                    break;
                case 'IPN':
                    searchParams.code = search;
                    break;
                default:
                    searchParams.search = search;
                    break;
            }

            const searchResults = await actions.searchUsers(searchParams);

            if (searchResults instanceof Error) {
                this.setState({ searchResults: [], searching: false });
                return;
            }

            this.setState({ searchResults: (searchResults || []).filter(Boolean), searching: false });
        }, SEARCH_INTERVAL);
    };

    handleToggleUser = ({ userId }) => {
        const { onChange } = this.props;
        const users = this.getValue();

        if (users.includes(userId)) {
            users.splice(users.indexOf(userId), 1);
            this.setState({ isIncreasing: false });
        } else {
            users.unshift(userId);
            this.setState({ isIncreasing: true });
        }

        onChange && onChange(new ChangeEvent(users, true, true));
    };

    reserIsIncreasing = () => this.setState({ isIncreasing: false });

    tableColumns = () => {
        const { searchUserMode } = this.state;

        return [{
            id: 'userId',
            width: 16,
            padding: 'checkbox',
            render: (userId) => {
                if (!this.getValue().includes(userId)) {
                    return <AddIcon />;
                }

                return searchUserMode ? <CloseIcon /> : <FaceIcon />;
            }
        }, {
            id: 'name',
            render: (name, { userId, ipn }) => `${name} (${userId}, ${ipn})`
        }];
    };

    renderToolbar = () => {
        const { t, classes } = this.props;
        const { searchUserMode, search, searchBy } = this.state;

        return (
            <Toolbar className={classes.toolbar}>
                {searchUserMode
                    ? (
                        <>
                            <TextField
                                variant="standard"
                                id="standard-name"
                                placeholder={t('Search')}
                                margin="none"
                                value={search}
                                onChange={this.handleChangeSearch} />
                            <Select variant="standard" value={searchBy} onChange={this.handleChangeSearchBy}>
                                <MenuItem value="name">{t('SearchByName')}</MenuItem>
                                <MenuItem value="IPN">{t('SearchByIPN')}</MenuItem>
                                <MenuItem value="ID">{t('SearchByID')}</MenuItem>
                            </Select>
                        </>
                    )
                    : (
                        <Tooltip title={t('AddUsers')}>
                            <IconButton onClick={() => this.setState({ searchUserMode: true })} size="large">
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    )}
            </Toolbar>
        );
    };

    renderDataTable = () => {
        const { searchUserMode, isIncreasing } = this.state;
        const { t, users } = this.props;

        const value = this.getValue();
        const notListedUsers = value.filter(userId => !users[userId]);

        if (notListedUsers.length) {
            return <Preloader nopadding={true} size="32" />;
        }

        const tableData = value.map(userId => users[userId]);

        return (
            <DataTableStated
                isIncreasing={isIncreasing}
                emptyDataText={t('EmptySelectedUsers')}
                data={tableData}
                columns={this.tableColumns()}
                controls={
                    {
                        pagination: false,
                        toolbar: false,
                        search: false,
                        header: false,
                        refresh: false,
                        switchView: false
                    }
                }
                reserIsIncreasing={this.reserIsIncreasing}
                onRowClick={searchUserMode && this.handleToggleUser}
            />
        );
    };

    renderSearchResults = () => {
        const { t } = this.props;
        const { searchResults, searching, search } = this.state;

        if (searching) {
            return <Preloader nopadding={true} size="32" />;
        }

        if (!search) {
            return null;
        }

        const value = this.getValue();

        return (
            <>
                <DataTableStated
                    emptyDataText={t('EmptySearchResults')}
                    data={searchResults.filter(({ userId }) => !value.includes(userId))}
                    columns={this.tableColumns()}
                    controls={
                        {
                            pagination: false,
                            toolbar: true,
                            search: false,
                            header: false,
                            refresh: false,
                            switchView: false
                        }
                    }
                    CustomToolbar={
                        () => (
                            <Typography style={{ marginTop: 4 }} variant="caption" display="block" gutterBottom={true}>
                                {t('SearchResults')}
                            </Typography>
                        )
                    }
                    onRowClick={this.handleToggleUser}
                />
            </>
        );
    };

    render = () => {
        const {
            sample,
            description,
            error,
            required,
            hidden,
            ...rest
        } = this.props;

        const { searchUserMode } = this.state;

        if (hidden) return null;

        return (
            <ElementGroupContainer
                description={description}
                sample={sample}
                error={error}
                required={required}
                {...rest}
            >
                {this.renderToolbar()}
                {searchUserMode ? this.renderSearchResults() : null}
                {this.renderDataTable()}
            </ElementGroupContainer>
        );
    };
}

UserList.propTypes = {
    t: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired,
    value: PropTypes.array,
    sample: PropTypes.string,
    description: PropTypes.string,
    error: PropTypes.object,
    required: PropTypes.bool,
    hidden: PropTypes.bool,
    users: PropTypes.object,
    onChange: PropTypes.func
};

UserList.defaultProps = {
    value: [],
    sample: '',
    description: '',
    error: null,
    required: false,
    hidden: false,
    users: {},
    onChange: () => null
};

const mapStateToProps = ({ users }) => ({ users });

const mapDispatchToProps = dispatch => ({
    actions: {
        searchUsers: bindActionCreators(searchUsers, dispatch)
    }
});

const styled = withStyles(styles)(UserList);
const translated = translate('Elements')(styled);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
