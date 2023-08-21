import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-translate';
import { bindActionCreators } from 'redux';
import { Toolbar, Tabs, Tab, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import CloseIcon from '@mui/icons-material/Close';
import Scrollbar from 'components/Scrollbar';
import { toggleDebugMode } from 'actions/auth';

import tools from './tools';

const styles = {
  root: {
    height: '100%'
  },
  header: {
    padding: 0,
    borderBottom: 'rgb(199, 199, 199) 1px solid',
    background: '#f1f1f1'
  },
  tabs: {
    flexGrow: 1,
    margin: 0,
    minHeight: 'auto'
  },
  tab: {
    minHeight: 31,
    fontSize: 12,
    margin: 0
  },
  toolContainer: {
    height: 'calc(100% - 32px)'
  },
  indicator: {
    display: 'none'
  }
};

class DebugTools extends React.Component {
  constructor(props) {
    super(props);
    const onlyMocsUnit = this.props.userUnits.find((item) => item?.id === 1000000190);
    this.state = {
      activeTool: onlyMocsUnit ? 0 : 2,
      onlyMocsUnit: onlyMocsUnit
    };
  }

  setActiveTool = (event, activeTool) => this.setState({ activeTool });

  getTools = () => {
    const { debugTools } = this.props;
    const { onlyMocsUnit } = this.state;

    const concatTools = {
      AuthTools: tools.AuthTools,
      Curator: tools.Curator,
      ...debugTools,
      CustomInterfaceCheck: tools.CustomInterfaceCheck,
      ExternalReaderMocks: tools.ExternalReaderMocks,
      EDSFormTest: tools.EDSFormTest,
      EDSSignVerify: tools.EDSSignVerify,
      HashToInternal: tools.HashToInternal,
      VerifyHash: tools.VerifyHash
    };

    if (onlyMocsUnit) {
      return { ExternalReaderMocks: tools.ExternalReaderMocks };
    }

    return concatTools;
  };

  render() {
    const { t, classes, actions } = this.props;
    const { activeTool } = this.state;

    const debugTools = this.getTools();
    const activeToolComponent = Object.values(debugTools)[activeTool];

    return (
      <div className={classes.root}>
        <Toolbar className={classes.header}>
          <Tabs
            className={classes.tabs}
            classes={{ indicator: classes.indicator }}
            value={activeTool}
            onChange={this.setActiveTool}
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.keys(debugTools).map((toolName) => (
              <Tab className={classes.tab} key={toolName} label={t(toolName)} />
            ))}
          </Tabs>
          <IconButton className={classes.button} onClick={actions.toggleDebugMode} size="large">
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <div className={classes.toolContainer}>
          <Scrollbar>{activeToolComponent || null}</Scrollbar>
        </div>
      </div>
    );
  }
}

DebugTools.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

DebugTools.defaultProps = {};

const mapStateToProps = ({ auth: { info: userInfo, userUnits } }) => ({
  userInfo,
  userUnits
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    toggleDebugMode: bindActionCreators(toggleDebugMode, dispatch)
  }
});

const styled = withStyles(styles)(DebugTools);
const translated = translate('DebugTools')(styled);

export default connect(mapStateToProps, mapDispatchToProps)(translated);
