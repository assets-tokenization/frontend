import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import MobileDetect from 'mobile-detect';
import { Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getTextWidth } from 'components/Select/components/ListboxComponent';

const styles = () => ({
  cutText: {
    wordBreak: 'break-all',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  lineClamp1: {
    '-webkit-line-clamp': 1
  },
  lineClamp2: {
    '-webkit-line-clamp': 2
  },
  lineClamp3: {
    '-webkit-line-clamp': 3
  }
});

const useStyles = makeStyles(styles);

const getTextLines = (title = '', containerWidth, textParams) => {
  try {
    const textWidth = getTextWidth((title + '').toUpperCase(), textParams);
    const rowHeight = Number(Math.ceil(Number(textWidth) / containerWidth));
    return rowHeight;
  } catch {
    return 1;
  }
};

const getText = (title) => {
  try {
    const componenetText = title.props.children || title?._owner?.child?.ref?.current?.innerText;

    if (!componenetText || typeof componenetText !== 'string') return '';

    return componenetText;
  } catch {
    return title;
  }
};

const CELL_MIN_WIDTH = 150;

const RenderOneLine = ({
  title,
  textParams,
  disableTooltip,
  minWidthDefault,
  maxTextRows,
  minWidthCustom
}) => {
  const classes = useStyles();
  const wrapper = React.useRef(null);
  const [titleLines, setTitleLines] = React.useState(1);
  const md = new MobileDetect(window.navigator.userAgent);
  const isMobile = !!md.mobile();

  React.useEffect(() => {
    if (!wrapper?.current) return;

    const containerWidth = wrapper?.current?.offsetWidth;

    const lines = getTextLines(getText(title) || '', containerWidth, textParams);

    setTitleLines(lines);
  }, [title, textParams]);

  const minWidth =
    minWidthCustom || Math.max(...[CELL_MIN_WIDTH, minWidthDefault, wrapper?.current?.offsetWidth]);

  const showTooltip = titleLines > maxTextRows && !disableTooltip && !isMobile;

  return (
    <div ref={wrapper}>
      {showTooltip ? (
        <Tooltip title={title}>
          <span
            className={classNames({
              [classes.cutText]: true,
              [classes['lineClamp' + maxTextRows]]: true
            })}
            style={{ minWidth }}
          >
            {title}
          </span>
        </Tooltip>
      ) : (
        <span
          style={{
            minWidth: title ? minWidth : 'unset'
          }}
        >
          {title}
        </span>
      )}
    </div>
  );
};

RenderOneLine.propTypes = {
  title: PropTypes.string,
  textParams: PropTypes.string,
  disableTooltip: PropTypes.bool,
  minWidthDefault: PropTypes.string,
  maxTextRows: PropTypes.number
};

RenderOneLine.defaultProps = {
  title: '',
  textParams: '400 15px Roboto',
  disableTooltip: false,
  minWidthDefault: '0px',
  maxTextRows: 1
};

export default connect(null, null)(RenderOneLine);
