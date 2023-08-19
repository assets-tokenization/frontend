import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Dialog, DialogContent, TextField, Select, MenuItem, Toolbar } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import FaceIcon from '@mui/icons-material/Face';

import Preloader from 'components/Preloader';
import DataTable from 'components/DataTable';

import { searchUsers } from 'actions/users';

import waiter from 'helpers/waitForAction';

const SEARCH_INTERVAL = 500;

const styles = {
    toolbar: {
        padding: 0
    },
    rawContent: {
        paddingLeft: 20,
        paddingRight: 20
    }
};

class SelectUserDialog extends React.Component {
    state = { search: '', searchBy: 'name', searchResults: [], searching: false };

    handleChangeSearchBy = ({ target: { value } }) => {
        const { searchBy } = this.state;

        if (searchBy === value) {
            return;
        }

        this.setState({ searchBy: value }, this.handleSearch)
    };

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
                    searchParams.userIds = [search];
                    break;
                case 'IPN':
                    searchParams.code = search;
                    break;
                default:
                    searchParams.search = search;
                    break;
            }

            const searchResults = await actions.searchUsers(searchParams);

            this.setState({ searchResults: (searchResults || []).filter(Boolean), searching: false });
        }, SEARCH_INTERVAL);
    };

    renderToolbar = () => {
        const { search, searchBy } = this.state;
        const { t, classes } = this.props;

        return (
            <Toolbar className={classes.toolbar}>
                <TextField
                    variant="standard"
                    id="standard-name"
                    placeholder={t('Search')}
                    margin="none"
                    value={search}
                    onChange={this.handleChangeSearch}
                />
                <Select variant="standard" value={searchBy} onChange={this.handleChangeSearchBy}>
                    <MenuItem value="name">{t('SearchByName')}</MenuItem>
                    <MenuItem value="IPN">{t('SearchByIPN')}</MenuItem>
                    <MenuItem value="ID">{t('SearchByID')}</MenuItem>
                </Select>
            </Toolbar>
        );
    }

    renderSearchTable = () => {
        const { t, onUserSelect, userInfo } = this.props;
        const { searchResults, searching } = this.state;

        if (searching) {
            return <Preloader nopadding={true} size="32" />;
        }

        return (
            <DataTable
                emptyDataText={t('EmptySearchResults')}
                data={searchResults.filter(({ userId }) => userId !== userInfo.userId)}
                columns={[{
                    id: 'userId',
                    width: 16,
                    padding: 'checkbox',
                    render: () => <FaceIcon />
                }, {
                    id: 'name',
                    padding: 'none',
                    render: (name, { userId }) => `${name} (${userId})`
                }]}
                controls={{
                    pagination: false,
                    toolbar: true,
                    search: false,
                    header: false,
                    refresh: false,
                    switchView: false
                }}
                onRowClick={onUserSelect}
            />
        );
    }

    render() {
        const { classes, open, onClose, isDialog } = this.props;

        if (isDialog) {
            return (
                <Dialog onClose={onClose} open={open} fullWidth={true} maxWidth="md">
                    <DialogContent>
                        {this.renderToolbar()}
                        {this.renderSearchTable()}
                    </DialogContent>
                </Dialog>
            );
        }

        return (
            <div className={classes.rawContent}>
                {this.renderToolbar()}
                {this.renderSearchTable()}
            </div>
        );
    }
}

SelectUserDialog.propTypes = {
    isDialog: PropTypes.bool
};

SelectUserDialog.defaultProps = {
    isDialog: true
};

const mapStateToProps = ({ auth: { info } }) => ({ userInfo: info });
const mapDispatchToProps = dispatch => ({
    actions: {
        searchUsers: bindActionCreators(searchUsers, dispatch)
    }
});

const styled = withStyles(styles)(SelectUserDialog);
const translated = translate('SelectUserDialog')(styled);
export default connect(mapStateToProps, mapDispatchToProps)(translated);
