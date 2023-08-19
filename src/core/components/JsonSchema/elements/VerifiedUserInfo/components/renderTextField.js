import React from 'react';
import { useTranslate } from 'react-translate';
import { SchemaForm } from 'components/JsonSchema';

const RenderTextField = ({
  name,
  noMargin = false,
  fields,
  errors,
  value,
  handleUpdateField
}) => {
  const t = useTranslate('VerifiedUserInfo');

  return (
    <>
      {fields?.includes(name) ? (
        <SchemaForm
          schema={{
            type: 'object',
            properties: {
              [name]: {
                type: 'string',
                description: t(name),
                maxLength: 255,
                notRequiredLabel: ''
              }
            }
          }}
          noMargin={noMargin}
          errors={errors}
          value={{
            [name]: value?.[name]?.value || ''
          }}
          onChange={(_, value) => handleUpdateField(name, { value })}
        />
      ) : null}
    </>
  );
};

export default RenderTextField;
