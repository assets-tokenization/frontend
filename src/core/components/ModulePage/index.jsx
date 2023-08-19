import { Component } from 'react';

import config from 'config.json';

export default class ModulePage extends Component {
    componentDidMount() {
        this.updatePageTitle();
    }

    componentDidUpdate() {
        this.updatePageTitle();
    }

    updatePageTitle() {
        const { t, title } = this.props;
        let documentTitle;

        if (t && title) {
            documentTitle = t(title);
        }

        if (this.componentGetTitle) {
            documentTitle = this.componentGetTitle({
                returnTitle: true
            });
        }

        if (!documentTitle) {
            return;
        }

        if (typeof documentTitle !== 'string') return;

        document.title = [documentTitle, config.application.name].filter(Boolean).join(' - ');
    }
}
