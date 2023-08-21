import React from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';
import { updateTaskDocumentValues } from 'application/actions/task';
import RenderTextField from './renderTextField';
import RenderDateFormat from './renderDateFormat';
import RenderRadioFormat from './renderRadioFormat';
import RenderAddressFormat from './renderAddressFormat';
import RenderPassportFormat from './renderPassportFormat';

const months = (t) => [
  {
    id: '01',
    name: t('January')
  },
  {
    id: '02',
    name: t('February')
  },
  {
    id: '03',
    name: t('March')
  },
  {
    id: '04',
    name: t('April')
  },
  {
    id: '05',
    name: t('May')
  },
  {
    id: '06',
    name: t('June')
  },
  {
    id: '07',
    name: t('July')
  },
  {
    id: '08',
    name: t('August')
  },
  {
    id: '09',
    name: t('September')
  },
  {
    id: '10',
    name: t('October')
  },
  {
    id: '11',
    name: t('November')
  },
  {
    id: '12',
    name: t('December')
  }
];

let timeout = null;

const UserInputFields = ({
  t,
  errors,
  fields,
  value,
  path,
  taskId,
  handleStore,
  getSavingInterval,
  classes,
  actions
}) => {
  const dispatch = useDispatch();

  const handleUpdateField = async (name, value) => {
    clearTimeout(timeout);

    await dispatch(updateTaskDocumentValues(taskId, path.concat(name), value));

    timeout = setTimeout(() => {
      handleStore();
    }, getSavingInterval());
  };

  const Headline = () => {
    const personalDataFields = ['birthday', 'gender', 'address', 'unzr', 'phone', 'email'];

    return (
      <>
        {fields.some((field) => personalDataFields.includes(field)) ? (
          <div className={classes.infoBlockHeadline}>{t('personalData')}</div>
        ) : null}
      </>
    );
  };

  return (
    <>
      <Headline />

      <RenderTextField
        t={t}
        name="unzr"
        fields={fields}
        errors={errors}
        value={value}
        handleUpdateField={handleUpdateField}
      />

      <RenderDateFormat
        name="birthday"
        fields={fields}
        errors={errors}
        value={value}
        handleUpdateField={handleUpdateField}
        months={months(t)}
      />

      <RenderRadioFormat
        name={'gender'}
        fields={fields}
        errors={errors}
        value={value}
        handleUpdateField={handleUpdateField}
      />

      <RenderAddressFormat
        name="address"
        fields={fields}
        errors={errors}
        value={value}
        handleUpdateField={handleUpdateField}
        actions={actions}
        path={path}
      />

      <RenderTextField
        name="phone"
        fields={fields}
        errors={errors}
        value={value}
        handleUpdateField={handleUpdateField}
      />

      <RenderTextField
        name="email"
        fields={fields}
        errors={errors}
        value={value}
        handleUpdateField={handleUpdateField}
      />

      <RenderPassportFormat
        name="passport"
        classes={classes}
        fields={fields}
        errors={errors}
        value={value}
        handleUpdateField={handleUpdateField}
        months={months(t)}
      />
    </>
  );
};

UserInputFields.propTypes = {
  t: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
  path: PropTypes.array.isRequired,
  taskId: PropTypes.string.isRequired,
  getSavingInterval: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  errors: PropTypes.array,
  actions: PropTypes.object.isRequired
};

UserInputFields.defaultProps = {
  errors: []
};

export default UserInputFields;
