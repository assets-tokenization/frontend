import React from 'react';

import SingleKeyRegisterPreview from 'components/JsonSchema/elements/Register/SingleKeyRegister/Preview';
import SingleKeyRegisterSelect from 'components/JsonSchema/elements/Register/SingleKeyRegister/Select';

const SingleKeyRegister = (props) => {
    const [edit, setEdit] = React.useState(false);

    const { readOnly, hidden } = props;

    const Component = ((edit && !readOnly) || hidden) ? SingleKeyRegisterSelect : SingleKeyRegisterPreview;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component {...props} setEdit={setEdit} />;
};

export default SingleKeyRegister;
