import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Router, Switch } from 'react-router-dom';

import modules from 'modules';
import plugins from 'plugins';
import { history } from 'store';

import BlockScreen from 'components/BlockScreen';
import PrivateRoute from 'components/PrivateRoute';

const routesFilter = onboardingTaskId => ({ isOnboarding }) => (onboardingTaskId ? isOnboarding : !isOnboarding);

const AppRouter = ({ onboardingTaskId }) => {
    const routes = [].concat(...([].concat(plugins, modules)).map(module => module.routes || []))
        .filter(routesFilter(onboardingTaskId));

    return (
        <Router history={history}>
            <Suspense fallback={<BlockScreen open={true} transparentBackground={true} />}>
                <Switch>
                    {routes.map((route, key) => <PrivateRoute exact={true} key={key} {...route} />)}
                </Switch>
            </Suspense>
        </Router>
    );
};

AppRouter.propTypes = {
    onboardingTaskId: PropTypes.string
};

AppRouter.defaultProps = {
    onboardingTaskId: null
};

const mapStateToProps = ({ auth: { info: { onboardingTaskId } } }) => ({ onboardingTaskId });
export default connect(mapStateToProps)(AppRouter);
