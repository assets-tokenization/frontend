import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { List, ListSubheader, Typography } from '@mui/material';

import withStyles from '@mui/styles/withStyles';

import Preloader from 'components/Preloader';
import TreeListItem from 'components/TreeList/TreeListItem';

const style = (theme) => ({
  root: {
    width: '100%',
    paddingTop: 8,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('lg')]: {
      padding: 0
    }
  },
  noOptionsTitle: {
    fontSize: 13,
    padding: 8,
    paddingBottom: 0
  }
});

const TreeList = ({
  t,
  classes,
  subheader,
  items,
  onChange,
  onMenuOpen,
  createLink,
  id,
  registerSelect,
  wrapperStyles,
  listWithAddIcon
}) => {
  if (!items) {
    return <Preloader />;
  }

  return (
    <List
      id={id}
      component="nav"
      subheader={<ListSubheader component="div">{subheader}</ListSubheader>}
      className={wrapperStyles || (!registerSelect ? classes.root : null)}
    >
      {items.length ? (
        (items || []).map((item, key) => (
          <TreeListItem
            key={key}
            id={id + '-' + key}
            item={item}
            onClick={onChange}
            onMenuOpen={onMenuOpen}
            link={!item.items && createLink && createLink(item)}
            createLink={createLink}
            registerSelect={registerSelect}
            listWithAddIcon={listWithAddIcon}
          />
        ))
      ) : (
        <Typography classes={{ root: classes.noOptionsTitle }}>{t('NoOptions')}</Typography>
      )}
    </List>
  );
};

TreeList.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  items: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  registerSelect: PropTypes.bool,
  listWithAddIcon: PropTypes.bool
};

TreeList.defaultProps = {
  items: [],
  subheader: '',
  registerSelect: false,
  listWithAddIcon: false,
  onMenuOpen: () => null,
  id: ''
};

export { default as TreeListItem } from 'components/TreeList/TreeListItem';
export { default as TreeListSelect } from 'components/TreeList/TreeListSelect';
const translated = translate('Elements')(TreeList);
export default withStyles(style)(translated);
