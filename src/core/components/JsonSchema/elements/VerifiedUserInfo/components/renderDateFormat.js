import React from 'react';
import { useTranslate } from 'react-translate';
import { SchemaForm } from 'components/JsonSchema';
import parseDate from 'helpers/parseDate';

const RenderDateFormat = ({
  name,
  fields,
  errors,
  value,
  handleUpdateField,
  months: options
}) => {
  const t = useTranslate('VerifiedUserInfo');

  const dateObject = parseDate(value?.[name]?.date, 'DD.MM.YYYY') || {};

  const handleChangeDate = (_, changing, value) => {
    dateObject[changing] = value;

    const updatedDate = `${dateObject?.day || ''}.${
      dateObject?.month || ''
    }.${dateObject?.year || ''}`;

    handleUpdateField(`${name}.date`, updatedDate);
  };

  return (
    <>
      {fields?.includes(name) ? (
        <SchemaForm
          schema={{
            type: 'object',
            properties: {
              birthday: {
                control: 'form.group',
                blockDisplay: false,
                outlined: false,
                sample: `<div style="margin-top: 15px;"><span style="opacity: 0.5;">${t(
                  name
                )}</span></div>`,
                notRequiredLabel: '',
                properties: {
                  day: {
                    type: 'string',
                    pattern: '^0*([1-9]|[12][0-9]|3[01])$',
                    width: 65,
                    mask: '99',
                    notRequiredLabel: ''
                  },
                  month: {
                    type: 'string',
                    width: 200,
                    notRequiredLabel: '',
                    options
                  },
                  year: {
                    type: 'string',
                    width: 65,
                    pattern: '([1-2]\\d{3})',
                    mask: '9999',
                    notRequiredLabel: ''
                  }
                }
              }
            }
          }}
          errors={errors}
          value={{
            [name]: dateObject
          }}
          onChange={handleChangeDate}
        />
      ) : null}
    </>
  );
};

export default RenderDateFormat;
