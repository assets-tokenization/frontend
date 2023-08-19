import React from 'react';

import config from 'config';

export const useModulePage = ({ t, title }) => {
    const [pageTitle, setPageTitle] = React.useState();

    React.useEffect(() => {
        if (!t || !title) {
            return;
        }
        document.title = [t(title), config?.application?.name].filter(Boolean).join(' - ');
        setPageTitle(t(title));
    }, [t, title]);

    return { pageTitle };
};

export default ModulePage => props => {
    const { pageTitle } = useModulePage(props);
    return <ModulePage {...props} pageTitle={pageTitle} />;
};
