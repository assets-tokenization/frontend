import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import setComponentsId from 'helpers/setComponentsId';
import cx from 'classnames';
import { Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import { HeaderLinks } from 'components';
import Scrollbar from 'components/Scrollbar';

import { translate } from 'react-translate';
import Handlebars from 'handlebars';
import sidebarStyle from 'variables/styles/sidebarStyle.jsx';

const getCount = (classes, rest, { showingList, showingListFilter }) => {
  if (!rest[showingList] || !rest[showingList].length) {
    return null;
  }
  const list = showingListFilter ? rest[showingList].filter(showingListFilter) : rest[showingList];
  if (!list || !list.length) {
    return null;
  }
  const count = list.length;
  const label = count > 99 ? '99+' : count;
  return <Chip label={label} color="secondary" className={classes.chip} />;
};

const Sidebar = ({
  t,
  classes,
  auth,
  color,
  logo,
  image,
  routes,
  location: { pathname },
  open,
  handleDrawerToggle,
  setId,
  state,
  ...rest
}) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return pathname.indexOf(routeName) > -1 || pathname.split('/')[1] === routeName.split('/')[1];
  }

  if (!auth.info || !auth.info.role) {
    return <div id={setId('auth-error')} />;
  }

  const courtIdUserScopes = auth.info.courtIdUserScopes || [];
  const filteredRoutes = routes
    .filter((prop) => prop.navbar)
    .filter(
      ({ accessRoles }) =>
        (accessRoles || []).filter((role) => courtIdUserScopes.includes(role)).length > 0
    );

  const links = (
    <List className={classes.list} id={setId('list')}>
      {filteredRoutes.map((prop, key) => {
        if (prop.redirect) return null;
        const listItemClasses = cx({
          [' ' + classes[color]]: activeRoute(prop.path)
        });
        const whiteFontClasses = cx({
          [' ' + classes.whiteFont]: activeRoute(prop.path)
        });

        const template = Handlebars.compile(prop.path);

        if (prop.external) {
          return (
            <a
              key={key}
              href={!prop.handler ? template(state) : undefined}
              onClick={prop.handler && prop.handler(state)}
              target={!prop.handler ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={classes.item}
              id={setId(`link-${key}`)}
            >
              <ListItem
                button={true}
                className={classes.itemLink + listItemClasses}
                id={setId(`link-button-${key}`)}
              >
                {prop.icon ? (
                  <ListItemIcon
                    className={classes.itemIcon + whiteFontClasses}
                    id={setId(`link-icon-${key}`)}
                  >
                    <prop.icon />
                  </ListItemIcon>
                ) : null}
                <ListItemText
                  primary={t(prop.title)}
                  className={classes.itemText + whiteFontClasses}
                  disableTypography={true}
                  id={setId(`link-text-${key}`)}
                />
              </ListItem>
            </a>
          );
        }

        return (
          <NavLink
            to={prop.path}
            onClick={handleDrawerToggle}
            className={classes.item}
            activeClassName="active"
            key={key}
            id={setId(`link-${key}`)}
          >
            <ListItem
              button={true}
              className={classes.itemLink + listItemClasses}
              id={setId(`link-button-${key}`)}
            >
              <ListItemIcon
                className={classes.itemIcon + whiteFontClasses}
                id={setId(`link-icon-${key}`)}
              >
                <prop.icon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <span>
                    {t(prop.title)}
                    {getCount(classes, rest, prop)}
                  </span>
                }
                className={classes.itemText + whiteFontClasses}
                disableTypography={true}
                id={setId(`link-text-${key}`)}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  const brand = (
    <div className={classes.logo} id={setId('logo')} onClick={handleDrawerToggle}>
      <Link to="/" className={classes.logoLink} id={setId('link-logo')}>
        <div className={classes.logoImage} id={setId('img-logo')}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {/* <Typography component="h1">{logoText}</Typography>
                 <Typography component="h2">{logoHint}</Typography> */}
      </Link>
    </div>
  );
  return (
    <div id={setId('wrap')}>
      <Hidden mdUp={true}>
        <Drawer
          variant="temporary"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <Scrollbar className={classes.scrollBar} options={{ suppressScrollX: true }}>
            <div
              className={classes.sidebarWrapper}
              id={setId('wrapper')}
              style={{ height: filteredRoutes.length * 50 + 450 }}
            >
              <HeaderLinks setId={setId} handleDrawerToggle={handleDrawerToggle} />
              {links}
            </div>
            {image && (
              <div
                className={classes.background}
                id={setId('background')}
                // style={{backgroundImage: "url(" + image + ")"}}
              />
            )}
          </Scrollbar>
        </Drawer>
      </Hidden>
      <Hidden lgDown={true}>
        <Drawer
          anchor="left"
          variant="permanent"
          open={true}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {brand}
          <Scrollbar className={classes.scrollBar} options={{ suppressScrollX: true }}>
            <div className={classes.sidebarWrapper} id={setId('wrapper-2')}>
              {links}
            </div>
            {image ? <div className={classes.background} id={setId('background-2')} /> : null}
          </Scrollbar>
        </Drawer>
      </Hidden>
    </div>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  setId: PropTypes.func,
  color: PropTypes.string,
  logo: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.array,
  location: PropTypes.object.isRequired,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

Sidebar.defaultProps = {
  setId: setComponentsId('sidebar'),
  color: 'yellow',
  logo: '',
  image: '',
  routes: [],
  open: false
};

const styled = withStyles(sidebarStyle)(translate('Sidebar')(Sidebar));

function mapStateToProps(state) {
  return { auth: state.authorization, state };
}

export default connect(mapStateToProps)(styled);
