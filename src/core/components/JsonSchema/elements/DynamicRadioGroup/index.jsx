import React from 'react';
import PropTypes from 'prop-types';
import objectPath from 'object-path';
import ElementGroupContainer from 'components/JsonSchema/components/ElementGroupContainer';
import RadioButtons from 'components/JsonSchema/elements/DynamicRadioGroup/components/RadioButtons';
import ChangeEvent from 'components/JsonSchema/ChangeEvent';
import evaluate from 'helpers/evaluate';
import renderHTML from 'helpers/renderHTML';
import Handlebars from 'handlebars';
import withStyles from '@mui/styles/withStyles';
import styles from 'components/JsonSchema/elements/RadioGroup/components/layout';

class DynamicRadioGroup extends React.Component {
  handleChange = (value) => () => {
    const { onChange } = this.props;
    onChange(new ChangeEvent(value, true, false));
  };

  removeUnExistedValues = (valueName, list) => {
    const { onChange } = this.props;

    if (!list || !valueName || !Object.keys(valueName || {}).length) return;

    const exist = list.map(({ id }) => id).includes(valueName.id);

    if (!exist) onChange(null);
  };

  renderTitle = (obj) => {
    if (!obj) return '';

    let string = '';

    Object.keys(obj).forEach((item) => {
      if (item === 'id') return;
      string += ' ' + obj[item];
    });

    return string;
  };

  getLabel = (key) => {
    const { labelKeys } = this.props;

    if (key.displayName) return key.displayName;

    if (labelKeys) { return (labelKeys || []).map((el) => el && key[el] && key[el]).join(' '); }

    return this.renderTitle(key);
  };

  uniq = (array) => {
    if (!array) return [];
    const addId = array.map((item, index) => ({
      ...item,
      id: item?.id || this.renderTitle(item).split(' ').join(`_${index}`).toLowerCase(),
    }));

    const seen = {};

    return addId.filter((item) => {
      // eslint-disable-next-line no-prototype-builtins
      if (seen.hasOwnProperty(item.id)) return null;
      seen[item.id] = true;
      return item;
    });
  };

  getDataPath = () => {
    const { dataPath, rootDocument } = this.props;

    const evaluatePath = evaluate(dataPath, rootDocument.data);

    if (evaluatePath instanceof Error) return dataPath;

    return evaluatePath;
  };

  getControlData = () => {
    const { rootDocument, dataMapping } = this.props;

    const data = this.uniq(
      objectPath.get(rootDocument.data, this.getDataPath())
    );

    if (!dataMapping) return data;

    const mappedData = evaluate(dataMapping, data) || [];

    if (mappedData instanceof Error) return [];

    return this.uniq(mappedData) || [];
  };

  getSample = (item) => {
    const { sample, params, rootDocument } = this.props;

    if (!sample || typeof sample !== 'string') return null;

    if (params) {
      const template = Handlebars.compile(sample);
      const templateData = Object.keys(params).reduce((acc, param) => {
        const dataObject = { ...rootDocument.data, ...item };
        const value =
          typeof params[param] === 'object'
            ? this.transformValue({ dataObject, param, item })
            : objectPath.get(dataObject, params[param]);

        return {
          ...acc,
          [param]: value,
        };
      }, {});

      return renderHTML(template(templateData) || null);
    }
  };

  renderElement() {
    const { value, readOnly, locked } = this.props;

    const list = this.getControlData();

    this.removeUnExistedValues(value, list);

    return (
      <RadioButtons
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
        readOnly={readOnly || locked}
        list={list}
        getLabel={this.getLabel}
        onChange={this.handleChange}
        getSample={this.getSample}
      />
    );
  }

  render() {
    const { classes, description, required, error, hidden, noMargin, path } =
      this.props;

    if (hidden) return null;

    return (
      <ElementGroupContainer
        description={description}
        required={required}
        error={error}
        noMargin={noMargin}
        variant="subtitle1"
        path={path}
        descriptionClassName={classes.groupDescription}
      >
        {this.renderElement()}
      </ElementGroupContainer>
    );
  }
}

DynamicRadioGroup.propTypes = {
  rowDirection: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.object,
  description: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  path: PropTypes.array,
  dataPath: PropTypes.string.isRequired,
  rootDocument: PropTypes.object.isRequired,
  hidden: PropTypes.bool,
  labelKeys: PropTypes.array,
  noMargin: PropTypes.bool,
  locked: PropTypes.bool,
};

DynamicRadioGroup.defaultProps = {
  rowDirection: false,
  value: '',
  onChange: null,
  error: null,
  description: null,
  required: false,
  type: null,
  path: [],
  hidden: false,
  labelKeys: null,
  noMargin: false,
  locked: false,
};

export default withStyles(styles)(DynamicRadioGroup);
