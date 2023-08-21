/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { translate } from 'react-translate';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Badge, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

const styles = (theme) => ({
  categoryWrapper: {
    display: 'block',
    marginLeft: -15,
    marginRight: -15,
    '&.active': {
      backgroundColor: theme.categoryWrapperActive,
      '& + a': {
        backgroundColor: theme.categoryWrapperActive,
        '&.active': {
          backgroundColor: theme.navLinkActive
        },
        '&:hover': {
          backgroundColor: theme.navLinkActive,
          color: '#fff'
        },
        '& ~ a': {
          backgroundColor: theme.categoryWrapperActive,
          '&.active': {
            backgroundColor: theme.navLinkActive
          },
          '&:hover': {
            backgroundColor: theme.navLinkActive,
            color: '#fff'
          }
        }
      }
    }
  },
  categoryHeader: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 0,
    '& svg': {
      fill: '#eee'
    }
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
  icon: {
    position: 'relative',
    minWidth: 40,
    top: '-1px',
    '& svg': {
      fontSize: 23,
      backgroundColor: 'transparent'
    }
  },
  categoryHeaderPrimary: {
    color: theme.categoryHeaderPrimary || 'inherit'
  },
  anchor: {
    textDecoration: 'none',
    color: theme.palette.common.white
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    '&.active > div': {
      backgroundColor: theme.navLinkActive,
      color: theme.navLinkActiveText || theme.palette.common.white
    },
    '&.active svg': {
      fill: theme.navLinkActiveText || theme.palette.common.white
    }
  },
  badge: {
    left: -4,
    height: 16,
    backgroundColor: '#a40000',
    padding: 4,
    minWidth: '25px'
  },
  emptyChildren: {
    display: 'none'
  }
});

const hightlight = (pathName, id) => pathName.indexOf(id.toLowerCase()) !== -1 && 'active';

const CategoryHeader = ({
  t,
  classes,
  pathname,
  id,
  title,
  path,
  icon,
  badge,
  oneChild,
  children
}) => {
  const [hidden, setHidden] = React.useState(true);
  const childrenContainerRef = React.useCallback(
    (node) => {
      if (!node) {
        return;
      }
      setHidden(!path && !node.childElementCount);
    },
    [path]
  );

  return (
    <div
      className={classNames(classes.categoryWrapper, hightlight(pathname, id), {
        [classes.emptyChildren]: hidden
      })}
    >
      {oneChild ? null : (
        <ListItem
          button={!!path}
          className={classNames(classes.categoryHeader, path && classes.itemActionable)}
        >
          {icon ? <ListItemIcon className={classes.icon}>{icon}</ListItemIcon> : null}
          <ListItemText
            classes={{
              primary: classes.categoryHeaderPrimary
            }}
          >
            {t(title || id)}
            {badge && Number.isInteger(badge) ? (
              <Badge
                badgeContent={badge}
                color="secondary"
                classes={{
                  badge: classes.badge
                }}
              >
                <span />
              </Badge>
            ) : null}
          </ListItemText>
        </ListItem>
      )}
      <div ref={childrenContainerRef}>{children}</div>
    </div>
  );
};

CategoryHeader.propTypes = {
  classes: PropTypes.object.isRequired
};

const isExternal = (url) => {
  const { location } = window;
  // eslint-disable-next-line no-useless-escape
  const match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
  if (
    typeof match[1] === 'string' &&
    match[1].length > 0 &&
    match[1].toLowerCase() !== location.protocol
  )
    return true;
  if (
    typeof match[2] === 'string' &&
    match[2].length > 0 &&
    match[2].replace(
      new RegExp(':(' + { 'http:': 80, 'https:': 443 }[location.protocol] + ')?$'),
      ''
    ) !== location.host
  )
    return true;
  return false;
};

const CategoryHeaderContainer = (props) => {
  const { classes, path, handleDrawerToggle, id } = props;

  const categoryHeader = <CategoryHeader {...props} />;

  if (path && isExternal(path)) {
    return (
      <a href={path} target="_blank" rel="noopener noreferrer" className={classes.anchor}>
        {categoryHeader}
      </a>
    );
  }

  return path ? (
    <NavLink
      exact={true}
      to={path || ''}
      target={isExternal(path) ? '_blank' : ''}
      onClick={handleDrawerToggle}
      activeClassName="active"
      className={classes.navLink}
      id={id}
    >
      {categoryHeader}
    </NavLink>
  ) : (
    categoryHeader
  );
};

CategoryHeaderContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  path: PropTypes.string,
  id: PropTypes.string.isRequired,
  handleDrawerToggle: PropTypes.func
};

const styled = withStyles(styles)(CategoryHeaderContainer);
export default translate('Navigator')(styled);
