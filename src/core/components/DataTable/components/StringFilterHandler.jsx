import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import classNames from 'classnames';
import { TextField, Paper, IconButton, InputAdornment } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import FilterHandler from 'components/DataTable/components/FilterHandler';
import InputIcon from '@mui/icons-material/Input';
import TextFormatIcon from '@mui/icons-material/TextFormat';

const styles = (theme) => ({
  root: {
    display: 'flex',
    padding: 8
  },
  darkThemeRoot: {
    padding: 17,
    ...theme.listBackground
  },
  darkThemeLabel: {
    width: '100%',
    '& label': {
      color: '#fff'
    },
    '& input': {
      color: '#fff'
    }
  }
});

class StringFilterHandler extends FilterHandler {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  renderIcon = () => {
    const { IconComponent } = this.props;

    if (IconComponent) {
      return <IconComponent />;
    }

    return <TextFormatIcon />;
  };

  renderChip = () => {
    const { name, value, chipLabel } = this.props;

    return [chipLabel || name, value].join(': ');
  };

  replaceSpaces = (string) => (string || '').replace(/ "/g, '"').replace(/": /g, '"');

  handleChangeWrapper = (value) => {
    const { replaceSpaces, onChange } = this.props;
    const checkValue = replaceSpaces ? this.replaceSpaces(value) : value;
    onChange(checkValue);
  };

  componentDidMount = () => {
    const { filterValue, onChange } = this.props;
    filterValue && onChange(filterValue);
  };

  renderHandler = () => {
    const { classes, type, darkTheme, variant } = this.props;
    const { value } = this.state;

    const InputProps = {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={() => this.handleChangeWrapper(value)} size="large">
            <InputIcon
              className={classNames({
                [classes.fillIcon]: darkTheme
              })}
            />
          </IconButton>
        </InputAdornment>
      )
    };

    return (
      <Paper
        elevation={0}
        className={classNames({
          [classes.root]: true,
          [classes.darkThemeRoot]: darkTheme
        })}
      >
        <TextField
          autoFocus={true}
          value={value}
          onChange={({ target: { value: newValue } }) => this.setState({ value: newValue })}
          onKeyPress={({ key }) => key === 'Enter' && this.handleChangeWrapper(value)}
          type={type}
          className={classNames({
            [classes.darkThemeLabel]: darkTheme
          })}
          variant={variant}
          InputProps={!darkTheme ? InputProps : null}
        />
      </Paper>
    );
  };
}

StringFilterHandler.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  filterValue: PropTypes.string.isRequired,
  chipLabel: PropTypes.string,
  replaceSpaces: PropTypes.bool
};

StringFilterHandler.defaultProps = {
  name: '',
  value: '',
  type: null,
  filterValue: null,
  onChange: () => null,
  chipLabel: null,
  replaceSpaces: false
};

const styled = withStyles(styles)(StringFilterHandler);
export default translate('StringFilterHandler')(styled);
