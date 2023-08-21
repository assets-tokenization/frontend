import React from 'react';
import config from 'config';

export default class WebChat extends React.Component {
  componentDidMount() {
    if (!config.webChat) {
      return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', config.webChat.dataUrl);
    script.setAttribute('channelId', config.webChat.channelId);
    script.setAttribute('id', config.webChat.id);

    document.body.appendChild(script);
  }

  render() {
    return null;
  }
}
