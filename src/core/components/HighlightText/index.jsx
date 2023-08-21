import React from 'react';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';

const styles = {
  highlight: {
    background: 'yellow'
  }
};

const HighlightText = ({ classes, text, highlight }) => {
  if (!text || !highlight || typeof text !== 'string') {
    return text;
  }

  const phrases = highlight
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '')
    .split(' ')
    .filter(Boolean)
    .map((phrase) => phrase.toLowerCase());

  const parts = text.split(new RegExp(`(${phrases.join('|')})`, 'gi'));
  return parts.map((part) =>
    phrases.includes(part.toLowerCase()) ? <b className={classes.highlight}>{part}</b> : part
  );
};

HighlightText.propTypes = {
  text: PropTypes.string,
  highlight: PropTypes.string
};

HighlightText.defaultProps = {
  text: '',
  highlight: ''
};

export default withStyles(styles)(HighlightText);
