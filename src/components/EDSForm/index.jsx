import React from 'react';
import PropTypes from 'prop-types';
import setComponentsId from 'helpers/setComponentsId';
import classNames from 'classnames';
import { translate } from 'react-translate';

import { Tabs, Tab } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

import config from 'config';

import DiiaSignForm from './DiiaSignForm';
import FileKeySignForm from './FileKeySignForm';
import IdGovUaWidgetForm from './IdGovUaWidgetForm';
import HardwareKeySignForm from './HardwareKeySignForm';

const { eds: { idGovUaWidget = {} } = {} } = config;

const styles = (theme) => ({
  tab: {
    fontSize: 14,
    lineHeight: '20px',
    textTransform: 'initial',
    [theme.breakpoints.down('md')]: {
      fontSize: 14,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      margin: 0
    }
  },
  tabsRoot: {
    [theme.breakpoints.down('md')]: {
      margin: '0!important'
    }
  },
  containerXs: {
    [theme.breakpoints.down('md')]: {
      padding: '0!important',
      justifyContent: 'space-between'
    }
  },
  tabsWrapper: {
    marginBottom: 10
  },
  tabSelected: {
    backgroundColor: 'rgba(34, 89, 228, 0.05)'
  }
});

const EDSForm = ({ t, classes, setId, diiaSign, ...rest }) => {
  const [tab, setTab] = React.useState(0);
  const [busy, setBusy] = React.useState(false);

  const forms = React.useMemo(() => {
    const forms = [];
    if (rest.onSelectKey) {
      forms.push({
        id: 'file-key',
        name: t('FileKeySignMethod'),
        component: FileKeySignForm
      });
      forms.push({
        id: 'hardware-key',
        name: t('HardwareKeySignMethod'),
        component: HardwareKeySignForm
      });
    }
    if (diiaSign) {
      forms.push({
        id: 'diia-sign',
        name: t('DiiaSignMethod'),
        component: DiiaSignForm
      });
    }
    if (idGovUaWidget.enabled) {
      forms.push({
        id: 'id-gov-ua-widget-sign',
        name: t('IdGovUaWidgetSignMethod'),
        component: IdGovUaWidgetForm
      });
    }
    return forms;
  }, [diiaSign, rest.onSelectKey, t]);

  const selectedForm = forms[tab];

  return (
    <>
      <Tabs
        value={tab}
        disabled={busy}
        onChange={(event, value) => setTab(value)}
        indicatorColor="primary"
        textColor="primary"
        id={setId('tabs')}
        className={classes.tabsWrapper}
        classes={{
          flexContainer: classNames(classes.tabsContainer, classes.containerXs),
          root: classes.tabsRoot
        }}
      >
        {forms.map((form, index) => (
          <Tab
            key={form.id}
            disabled={busy}
            label={form.name}
            id={setId(`tab-${form.id}`)}
            className={classNames(classes.tab, classes.tabButton)}
            classes={{
              root: classes.tab,
              selected: classes.tabSelected
            }}
          />
        ))}
      </Tabs>

      {selectedForm.component ? (
        <selectedForm.component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
          busy={busy}
          setBusy={setBusy}
          setId={(elementName) => setId(`${selectedForm.id}-${elementName}`)}
        />
      ) : null}
    </>
  );
};

EDSForm.propTypes = {
  setId: PropTypes.func,
  t: PropTypes.func.isRequired,
  onSelectKey: PropTypes.func.isRequired
};

EDSForm.defaultProps = {
  setId: setComponentsId('sign-form')
};

const styled = withStyles(styles)(EDSForm);
export default translate('SignForm')(styled);
