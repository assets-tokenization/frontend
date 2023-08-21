import React from 'react';

import evaluate from 'helpers/evaluate';
import capitalizeFirstLetter from 'helpers/capitalizeFirstLetter';

import formElements from 'components/JsonSchema/elements';
import emptyValues from './emptyValues';

class FormElement extends React.Component {
  componentDidMount() {
    const { value, onChange } = this.props;
    if (value === null && this.isRequired() && onChange) {
      onChange(this.getDefaultValue());
    }
  }

  getDefaultValue = () => {
    const { schema } = this.props;

    return schema.defaultValue || emptyValues[schema.type || 'object'];
  };
}

export default FormElement;
