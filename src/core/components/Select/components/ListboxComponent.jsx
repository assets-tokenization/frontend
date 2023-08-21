/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import ProgressLine from 'components/Preloader/ProgressLine';
import theme from 'theme';

const LISTBOX_PADDING = 8;
const FULL_WIDTH = 640;
const LINE_HEIGHT = 20;
const UPPERCACE_INFLUENCE = 10;
const CRITIC_SIZE = 3000;

const renderRow = (props) => {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING
    }
  });
};

const useResetCache = (data) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
};

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const OuterElementContext = React.createContext({});

const getTextWidth = (text, font) => {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

const getFont = () => {
  try {
    return theme?.typography?.fontFamily;
  } catch {
    return 'Roboto';
  }
};

const ListboxComponent = React.forwardRef((props) => {
  const { children, hasNextPage, decrementPage, isLoading, containerWidth, ...other } = props;

  const itemData = React.Children.toArray(children);
  const itemCount = itemData.length;

  /**
   * style: lineHeight: '24px', padding: 8px;
   * 24+8*2 = 40
   */

  const itemSize = 40;

  const getChildSize = (child) => {
    const itemWidth = (containerWidth || FULL_WIDTH) - UPPERCACE_INFLUENCE;
    const textWidth = getTextWidth(child.props.children, `400 16px ${getFont()}`);
    const checkTextWidth = textWidth > CRITIC_SIZE ? textWidth + itemWidth * 2 : textWidth;
    const rowHeight = Number(Math.ceil(Number(checkTextWidth) / itemWidth));
    return Number(itemSize) + Number(rowHeight >= 2 ? rowHeight * LINE_HEIGHT : rowHeight);
  };

  const getHeight = () => {
    if (itemCount > 8) return 8 * itemSize;
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  const loadMoreItems = () => {};

  const isItemLoaded = (index) => !hasNextPage || index < itemCount;

  return (
    <OuterElementContext.Provider value={other}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered }) => (
          <VariableSizeList
            onItemsRendered={onItemsRendered}
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="div"
            itemSize={(i) => getChildSize(itemData[i])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        )}
      </InfiniteLoader>
      <ProgressLine loading={isLoading} style={{ position: 'relative', top: -2 }} />
    </OuterElementContext.Provider>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default ListboxComponent;

export { getTextWidth, getFont };
