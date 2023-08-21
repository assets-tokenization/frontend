import React from 'react';
import { NavLink } from 'react-router-dom';

import { ListItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';

import TreeList from 'components/TreeList';

export const styles = (theme) => ({
  nested: {
    paddingLeft: 32,
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0
    }
  },
  item: {
    border: '#efefef 1px solid',
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#efefef',
    [theme.breakpoints.down('md')]: {
      marginBottom: 0,
      borderRadius: 0
    }
  },
  mobileIcon: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  navlink: {
    textDecoration: 'none',
    color: '#000'
  },
  error: {
    border: '#f44336 1px solid'
  }
});

class TreeListItem extends React.Component {
  state = { open: false };

  handleClick = () => {
    const { item, onClick, onMenuOpen } = this.props;
    const { open } = this.state;

    if (item.items) {
      return this.setState({ open: !open }, onMenuOpen);
    }

    return onClick && onClick(item);
  };

  renderItem() {
    const { classes, item, link, id } = this.props;
    const { open } = this.state;

    const { description, name, items, stringified } = item;

    if (link) {
      return (
        <NavLink id={id + '-item'} to={link} className={classes.navlink}>
          <ListItem className={classes.item} button>
            <ListItemIcon className={classes.mobileIcon}>
              <InsertDriveFile />
            </ListItemIcon>
            <ListItemText primary={description || name || stringified} />
          </ListItem>
        </NavLink>
      );
    }

    return (
      <ListItem id={id + '-item'} className={classes.item} button onClick={this.handleClick}>
        <ListItemIcon className={classes.mobileIcon}>
          {items ? <FolderIcon /> : <InsertDriveFile />}
        </ListItemIcon>
        <ListItemText primary={description || name || stringified} />
        {items ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItem>
    );
  }

  render() {
    const { open } = this.state;
    const { classes, item, onClick, onMenuOpen, createLink, id } = this.props;

    const { items } = item;

    return (
      <>
        {this.renderItem()}
        {items ? (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.nested}>
              <TreeList
                id={id}
                items={items}
                onChange={onClick}
                onMenuOpen={onMenuOpen}
                createLink={createLink}
              />
            </div>
          </Collapse>
        ) : null}
      </>
    );
  }
}

export default withStyles(styles)(TreeListItem);
