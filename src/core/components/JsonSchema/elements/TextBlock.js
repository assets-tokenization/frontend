/* eslint-disable prefer-rest-params */
/* eslint-disable no-template-curly-in-string */
import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'helpers/renderHTML';
import evaluate from 'helpers/evaluate';
import Handlebars from 'handlebars';
import objectPath from 'object-path';
import moment from 'moment';
import withStyles from '@mui/styles/withStyles';
import { Fade } from '@mui/material';
import ElementContainer from '../components/ElementContainer';

const styles = (theme) => ({
  visibility: {
    maxWidth: 1000,
    color: '#000',
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.5em',
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
      lineHeight: '18px',
      marginBottom: 10,
      marginTop: 10
    }
  },
  container: {
    marginBottom: 0,
    marginTop: 0
  }
});

/*
 *  https://gitlab.com/KitSoft/bpmn/bpmn-task/-/blob/dev/services/file_generator/index.js
 */

Handlebars.registerHelper({
  and() {
    return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  },
  eq(v1, v2) {
    return v1 === v2;
  },
  ne(v1, v2) {
    return v1 !== v2;
  },
  includes(array, value) {
    return array.includes(value);
  },
  contains(needle, haystack, options) {
    needle = Handlebars.escapeExpression(needle);
    haystack = Handlebars.escapeExpression(haystack);
    return haystack.indexOf(needle) > -1 ? options.fn(this) : options.inverse(this);
  },
  increment(index) {
    index++;
    return index;
  },
  dateFormat(date, format) {
    return moment(date).format(format);
  },
  formatNumberFinancial(number, afterPoint) {
    const fractionalPartLength = +afterPoint || 0;
    const n = 10 ** fractionalPartLength;
    const roundedNumber = (Math.round(+number * n) / n).toFixed(fractionalPartLength);

    const [p1, p2] = `${roundedNumber}`.split('.');

    const formatedPart = Intl.NumberFormat('uk-UA').format(p1);
    const floatPart = p2 ? `,${p2}` : '';

    return `${formatedPart}${floatPart}`;
  }
});

const TextBlock = ({
  noMargin,
  htmlBlock,
  value,
  classes,
  pure,
  params,
  useParentData,
  parentValue,
  hidden,
  rootDocument,
  row,
  pathIndex,
  dataMapping,
  stepName
}) => {
  if (hidden) return null;

  const getDataToEval = () => {
    if (typeof dataMapping === 'string') {
      const mappedData = evaluate(
        dataMapping,
        rootDocument.data[stepName],
        rootDocument.data,
        parentValue
      );
      if (!(mappedData instanceof Error)) return mappedData;
    }
    return useParentData ? parentValue : rootDocument.data;
  };

  if (params) {
    const template = Handlebars.compile(htmlBlock);

    const templateData = Object.keys(params).reduce((acc, param) => {
      const paramPath = pathIndex
        ? (params[param] || '').replace('${index}', pathIndex.index)
        : params[param];
      return {
        ...acc,
        [param]: objectPath.get(getDataToEval(), paramPath)
      };
    }, {});

    htmlBlock = template(templateData);
  }

  return pure ? (
    renderHTML(htmlBlock || value)
  ) : (
    <ElementContainer className={classes.container} row={row} noMargin={noMargin}>
      <Fade in={true}>
        <div className={classes.visibility}>{renderHTML(htmlBlock || value)}</div>
      </Fade>
    </ElementContainer>
  );
};

TextBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  rootDocument: PropTypes.object.isRequired,
  htmlBlock: PropTypes.string,
  value: PropTypes.string,
  pure: PropTypes.bool,
  row: PropTypes.bool,
  hidden: PropTypes.bool,
  useParentData: PropTypes.bool,
  parentValue: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  noMargin: PropTypes.bool,
  pathIndex: PropTypes.object,
  params: PropTypes.object,
  dataMapping: PropTypes.string,
  stepName: PropTypes.string
};

TextBlock.defaultProps = {
  htmlBlock: '',
  value: '',
  pure: false,
  hidden: false,
  row: false,
  useParentData: false,
  parentValue: false,
  noMargin: false,
  pathIndex: null,
  params: null,
  dataMapping: null,
  stepName: ''
};

export default withStyles(styles)(TextBlock);
