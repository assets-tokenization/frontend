/* eslint-disable react/jsx-props-no-spreading */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { translate } from 'react-translate';
import Scrollbar from 'components/Scrollbar';

import withStyles from '@mui/styles/withStyles';
import List from '@mui/material/List';

import checkAccess from 'helpers/checkAccess';
import { modules } from 'application';

import CategoryHeader from 'layouts/components/Navigator/CategoryHeader';
import Item from 'layouts/components/Navigator/Item.jsx';

const styles = (theme) => ({
  list: {
    paddingLeft: 15,
    paddingRight: 15
  },
  item: {
    paddingLeft: 0,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 0
  },
  itemCategory: {
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .1)'
    },
    '& svg': {
      fill: '#eee',
      backgroundColor: 'rgba(255, 255, 255, .1)'
    }
  },
  itemActiveItem: {
    color: '#4fc3f7'
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
    '&$textDense': {
      fontSize: theme.typography.fontSize
    }
  },
  divider: {
    marginTop: 16
  },
  icon: {
    position: 'relative',
    top: '-1px',
    '& svg': {
      fontSize: 23
    }
  },
  sidebarWrapper: {
    height: '100%',
    position: 'fixed',
    '& > div': {
      minHeight: '100vh'
    }
  }
});

const prioritySort = (a, b) => {
  const aPriority = a.priority || 0;
  const bPriority = b.priority || 0;

  if (aPriority > bPriority) {
    return -1;
  }
  if (aPriority < bPriority) {
    return 1;
  }
  return 0;
};

class Navigator extends React.Component {
  checkAccess = ({ access }) => {
    const { userUnits, userInfo } = this.props;
    return !access || checkAccess(access, userInfo, userUnits);
  };

  // shouldComponentUpdate(nextProps) {
  //     const { location: { pathname: oldLocation } } = this.props;
  //     const { location: { pathname: newLocation } } = nextProps;

  //     return oldLocation !== newLocation;
  // }

  render() {
    const {
      classes,
      location,
      location: { pathname },
      handleDrawerToggle
    } = this.props;
    const categories = []
      .concat(...modules.map((module) => module.navigation || []))
      .sort(prioritySort);

    return (
      <Scrollbar options={{ suppressScrollX: true }}>
        <List className={classes.list} disablePadding={true}>
          {categories.filter(this.checkAccess).map((category, categoryKey) => {
            const childs = (category.children || []).filter(this.checkAccess);

            return (
              <Fragment key={categoryKey}>
                {category.id ? (
                  <CategoryHeader
                    pathname={pathname}
                    oneChild={childs.length === 1 && !category.renderHeaderAnyway}
                    {...category}
                  >
                    {childs.map((child, childKey) =>
                      child.Component ? (
                        <child.Component key={childKey} location={location} />
                      ) : (
                        <Item key={childKey} menuItem={child} />
                      )
                    )}
                  </CategoryHeader>
                ) : null}
                {category.Component ? (
                  <category.Component location={location} handleDrawerToggle={handleDrawerToggle} />
                ) : null}
              </Fragment>
            );
          })}
        </List>
      </Scrollbar>
    );
  }
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  userUnits: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func
};

Navigator.defaultProps = {
  location: { pathname: '' }
};

const mapStateToProps = ({ auth: { userUnits, info } }) => ({ userUnits, userInfo: info });

const translated = translate('Navigator')(Navigator);
const styled = withStyles(styles)(translated);
export default connect(mapStateToProps)(styled);
