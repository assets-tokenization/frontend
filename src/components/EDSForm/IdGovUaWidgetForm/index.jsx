import React from 'react';
import useIdGovUaWidgetForm from './useIdGovUaWidgetForm';

const IdGovUaWidgetForm = ({ onSelectKey }) => {
  const { containerId } = useIdGovUaWidgetForm({
    onSelectKey,
  });

  return <div id={containerId} />;
}

export default IdGovUaWidgetForm;