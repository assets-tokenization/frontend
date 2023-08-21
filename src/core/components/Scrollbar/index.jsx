/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactResizeDetector from 'react-resize-detector';
import withStyles from '@mui/styles/withStyles';
import MobileDetect from 'mobile-detect';

const styles = {
  hideDefaultScroll: {
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    scrollbarWidth: 'none'
  }
};

const md = new MobileDetect(window.navigator.userAgent);

class Scrollbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: !!md.mobile()
    };
  }

  onResize = () => this.scrollBarRef && this.scrollBarRef.updateScroll();

  updateScrollOnSafari = () => {
    const isSafari =
      (window.navigator.userAgent || '').toLowerCase().indexOf('safari') !== -1 || false;
    const { isMobile } = this.state;

    if (!isSafari || isMobile) return;

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => this.scrollBarRef && this.scrollBarRef.updateScroll(), 200);
  };

  render() {
    const { children, classes, options, ...rest } = this.props;

    return (
      <PerfectScrollbar
        className={classes.hideDefaultScroll}
        ref={(ref) => {
          this.scrollBarRef = ref;
        }}
        onYReachEnd={this.updateScrollOnSafari}
        options={{ minScrollbarLength: 50, ...options }}
        {...rest}
      >
        {children}
        <ReactResizeDetector handleHeight={true} onResize={this.onResize} />
      </PerfectScrollbar>
    );
  }
}

Scrollbar.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  classes: PropTypes.object.isRequired
};
const styled = withStyles(styles)(Scrollbar);
export default styled;
