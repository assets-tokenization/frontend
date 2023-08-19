import React from 'react';
import Handlebars from 'handlebars';

import renderHTML from 'helpers/renderHTML';

const HtmlTemplate = ({template, data}) => {
    const html = React.useMemo(() => Handlebars.compile(template)(data), [data, template]);
    return renderHTML(html);
}

export default HtmlTemplate;
