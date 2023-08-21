/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, FormControl, InputAdornment, IconButton, Tooltip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { translate } from 'react-translate';
import TextField from '@mui/material/TextField';
import renderHTML from 'helpers/renderHTML';
import evaluate from 'helpers/evaluate';
import equilPath from 'helpers/equilPath';
import classNames from 'classnames';
import MobileDetect from 'mobile-detect';
import Masked from 'components/JsonSchema/elements/StringElement/components/mask';
import EJVError from 'components/JsonSchema/components/EJVError';
import FieldLabel from 'components/JsonSchema/components/FieldLabel';
import FormControlMessage from 'components/JsonSchema/components/FormControlMessage';
import uuid from 'uuid-random';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ClearIcon from '@mui/icons-material/Clear';
import { getTextWidth, getFont } from 'components/Select/components/ListboxComponent';

const UPPERCASE_INFLUENCE = 20;

const style = (theme) => ({
  formControl: {
    marginBottom: 40,
    maxWidth: 640,
    [theme.breakpoints.down('md')]: {
      marginBottom: 10,
      minWidth: '40px!important',
      '&>div>label': {
        paddingRight: 20
      }
    }
  },
  noMargin: {
    margin: 0
  },
  menuItem: {
    [theme.breakpoints.down('md')]: {
      lineHeight: '18px'
    }
  },
  textField: {
    '& p': {
      whiteSpace: 'normal'
    },
    '& label': {
      '&.MuiInputLabel-shrink': {
        maxWidth: 'calc(100% + 40px)',
        [theme.breakpoints.down('md')]: {
          maxWidth: '100%'
        }
      }
    }
  },
  fullDecsription: {
    '& label': {
      '&.MuiInputLabel-shrink': {
        maxWidth: 'calc(100% + 200px)',
        [theme.breakpoints.down('md')]: {
          maxWidth: (window.innerWidth - 40) * 1.35
        }
      }
    }
  },
  formControlDisabled: {
    '& label': {
      color: 'rgba(0, 0, 0, 0.38)'
    }
  },
  startAdornment: {
    '& p': {
      whiteSpace: 'nowrap',
      [theme.breakpoints.down('md')]: {
        fontSize: 13
      }
    }
  },
  placeHolderRoot: {
    fontSize: 16,
    lineHeight: '20px'
  },
  placeHolderRootSelect: {
    paddingRight: 15
  },
  select: {
    '&.MuiSelect-select': {
      paddingRight: 40
    },
    '&:focus': {
      background: 'transparent'
    },
    [theme.breakpoints.down('md')]: {
      lineHeight: '18px',
      minHeight: 22,
      display: 'flex',
      alignItems: 'center'
    }
  },
  multiline: {
    '& label': {
      background: '#fafafa',
      top: -5,
      padding: '0 5px'
    }
  },
  chevronIcon: {
    transform: 'rotate(-90deg)',
    padding: 0,
    marginRight: 0
  },
  darkThemeLabel: {
    '& fieldset': {
      borderColor: 'transparent'
    },
    '& legend': {
      maxWidth: 0.01
    },
    '& label': {
      color: '#fff',
      top: 0,
      padding: 0,
      backgroundColor: 'transparent'
    }
  },
  darkThemeInput: {
    backgroundColor: '#2e2e2e',
    borderRadius: '4px 4px 0px 0px'
  },
  darkThemeSelect: {
    backgroundColor: '#2e2e2e'
  },
  darkThemePaper: {
    background:
      'linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)), #121212',
    boxShadow:
      '0px 8px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    '& li': {
      color: 'rgba(255, 255, 255, 0.87)',
      paddingTop: 10,
      paddingBottom: 10,
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.12)'
      }
    }
  },
  darkThemeChevronIcon: {
    fill: 'rgba(255, 255, 255, 0.7)'
  },
  clearIcon: {
    position: 'absolute',
    right: 22,
    padding: 2,
    '& svg': {
      fontSize: 20,
      fill: 'rgba(0, 0, 0, 0.54)'
    }
  },
  formLabel: {
    fontSize: 13,
    opacity: 1
  }
});

const Layout = ({
  t,
  classes,
  sample,
  schema,
  error,
  description,
  formControlProps,
  readOnly,
  InputProps,
  mask,
  required,
  path,
  select,
  options,
  helperText,
  multiline,
  startAdornment,
  endAdornment,
  value,
  parentValue,
  rootDocument,
  maxLength,
  width,
  widthMobile,
  maxWidth,
  hidden,
  formatChars,
  checkRequired,
  handleChange,
  renderChildren,
  useTrim,
  onFocus,
  onBlur,
  noMargin,
  onInput,
  className,
  changeOnBlur,
  wrapperClass,
  externalReaderMessage,
  triggerExternalPath,
  stepName,
  notRequiredLabel,
  messageList: [message] = [],
  inlineDisplay,
  darkTheme,
  deleteIcon,
  variant,
  chipsValue,
  ...rest
}) => {
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || '');
  let [timeout] = React.useState(null);
  const md = new MobileDetect(window.navigator.userAgent);
  const isMobile = !!md.mobile();
  const ref = React.useRef(null);
  const id = (path || []).join('-');

  React.useEffect(() => {
    setInputValue(value);
    if (multiline) {
      const textField = ref.current;
      const textarea = textField?.querySelector('textarea:last-of-type');
      if (textField && textarea) {
        const hasAriaLabelledBy = textarea.hasAttribute('aria-labelledby');
        if (!hasAriaLabelledBy) {
          textarea.setAttribute('aria-labelledby', id);
        }
      }
    }
  }, [value]);

  const onMouseOver = () => {
    clearTimeout(timeout);
    setHovered(true);
  };

  const onMouseOut = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => setHovered(false), 100);
  };

  const InputPropsOptions = {
    ...InputProps,
    classes: {
      root: classNames({
        [classes.darkThemeInput]: darkTheme
      }),
      input: classNames({
        [classes.darkThemeInput]: darkTheme
      })
    }
  };

  if (!multiline && mask.length) {
    InputPropsOptions.inputComponent = Masked;
  }

  if (startAdornment) {
    if (typeof startAdornment === 'string') {
      InputPropsOptions.startAdornment = (
        <InputAdornment className={classes.adornment} position="start">
          {startAdornment}
        </InputAdornment>
      );
    } else {
      InputPropsOptions.startAdornment = (
        <InputAdornment
          {...startAdornment.props}
          className={classNames(classes.startAdornment, startAdornment?.props?.className)}
          position="start"
        >
          {startAdornment?.props?.children ? startAdornment?.props?.children : null}
        </InputAdornment>
      );
    }
  }

  if (endAdornment) {
    if (typeof endAdornment === 'string') {
      InputPropsOptions.endAdornment = (
        <InputAdornment position="end">{endAdornment}</InputAdornment>
      );
    } else {
      InputPropsOptions.endAdornment = (
        <InputAdornment
          {...endAdornment.props}
          className={classNames(endAdornment?.props?.className)}
          position="end"
        >
          {endAdornment?.props?.children ? endAdornment?.props?.children : null}
        </InputAdornment>
      );
    }
  }

  if (message) {
    InputPropsOptions.endAdornment = (
      <FormControlMessage message={message}>{InputPropsOptions.endAdornment}</FormControlMessage>
    );
  }

  const sampleElement =
    (helperText || sample || (schema && schema.sample)) &&
    renderHTML(helperText || sample || (schema && schema.sample));
  const errorText = error && <EJVError error={error} />;
  const randomLabelId = uuid();

  const formWidth = isMobile && widthMobile ? widthMobile : width;

  if (hidden) return null;

  const getChildSize = () => {
    const itemWidth = ref?.current?.offsetWidth - UPPERCASE_INFLUENCE;
    const textWidth = getTextWidth(inputValue, `400 16px ${getFont()}`);
    const checkTextWidth = textWidth > itemWidth;
    return checkTextWidth;
  };

  const textOverflowCheck = getChildSize();

  const renderTextField = () => {
    return (
      <>
        {isMobile ? (
          <FormLabel
            component="legend"
            classes={{
              root: classes.formLabel
            }}
          >
            <FieldLabel
              description={description}
              required={required}
              notRequiredLabel={notRequiredLabel}
            />
          </FormLabel>
        ) : null}
        {isMobile ? chipsValue : null}
        <TextField
          {...rest}
          variant={variant}
          ref={ref}
          className={classNames(
            {
              [classes.textField]: true,
              [classes.formControlDisabled]: readOnly,
              [classes.fullDecsription]: !inlineDisplay,
              [classes.multiline]: multiline && (focused || !!value)
            },
            wrapperClass
          )}
          select={select || !!options}
          label={
            description && !isMobile ? (
              <FieldLabel
                description={description}
                required={required}
                notRequiredLabel={notRequiredLabel}
              />
            ) : null
          }
          onChange={(e) => {
            setInputValue(e.target.value);

            if (mask && !!error) {
              return;
            }

            if (!changeOnBlur) {
              handleChange(e);
            }
          }}
          disabled={readOnly}
          helperText={sampleElement && errorText ? errorText : sampleElement || errorText}
          error={!!error}
          multiline={multiline}
          InputProps={InputPropsOptions}
          inputProps={{
            maxLength,
            mask,
            formatChars,
            ...(!multiline ? { style: { height: 'auto', 'text-overflow': 'ellipsis' } } : {}),
            'aria-labelledby': id
          }}
          InputLabelProps={{
            shrink: !!value || focused || startAdornment,
            ...(select || !!options ? { htmlFor: randomLabelId } : {}),
            classes: {
              root: classNames({
                [classes.placeHolderRoot]: true,
                [classes.placeHolderRootSelect]: options
              })
            }
          }}
          SelectProps={{
            classes: {
              select: classNames({
                [classes.select]: true,
                [classes.darkThemeSelect]: darkTheme
              })
            },
            inputProps: {
              id: randomLabelId,
              title: description,
              'aria-labelledby': id
            },
            MenuProps: {
              MenuListProps: {
                style: {
                  maxWidth: '640px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                },
                'aria-labelledby': id
              },
              classes: {
                paper: classNames({
                  [classes.darkThemePaper]: darkTheme
                })
              }
            },
            IconComponent: (props) => (
              <>
                {value && deleteIcon && (hovered || isMobile) && !readOnly ? (
                  <IconButton
                    className={classes.clearIcon}
                    onClick={() => {
                      setInputValue('');
                      handleChange({ target: { value: '' } });
                    }}
                    size="large"
                  >
                    <ClearIcon />
                  </IconButton>
                ) : null}
                <IconButton
                  {...props}
                  classes={{
                    root: classes.chevronIcon
                  }}
                  aria-label={t('Select')}
                  disabled={readOnly}
                  size="large"
                >
                  <ChevronLeftIcon
                    alt={t('Select')}
                    className={classNames({
                      [classes.darkThemeChevronIcon]: darkTheme
                    })}
                  />
                </IconButton>
              </>
            )
          }}
          id={path.join('-')}
          value={inputValue}
          onFocus={(event) => {
            setFocused(true);
            onFocus && onFocus(event);
          }}
          onBlur={(event) => {
            const { target } = event;
            if (mask || changeOnBlur || useTrim) {
              handleChange({
                target: {
                  ...target,
                  value: useTrim ? inputValue.trim() : inputValue
                }
              });
            }
            setFocused(false);
            onBlur && onBlur(event);
          }}
          onInput={(e) => {
            if (onInput) {
              try {
                const { selectionStart } = e.target;
                const oldLength = e.target.value.length;
                e.target.value = evaluate(onInput, e.target.value);
                const newLength = e.target.value.length;

                const cursorPosition = selectionStart + (newLength - oldLength);

                e.target.selectionStart = cursorPosition;
                e.target.selectionEnd = cursorPosition;
              } catch (err) {
                // Nothing to do
              }
            }
          }}
        >
          {renderChildren()}
        </TextField>
      </>
    );
  };

  return (
    <FormControl
      variant="standard"
      fullWidth={true}
      {...formControlProps}
      className={classNames(className && className, {
        [classes.formControl]: true,
        [classes.noMargin]: !!noMargin,
        [classes.darkThemeLabel]: darkTheme
      })}
      style={{ width: formWidth, maxWidth }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {textOverflowCheck && !focused && !multiline ? (
        <Tooltip title={inputValue} placement="bottom-start" aria-label={id}>
          {renderTextField()}
        </Tooltip>
      ) : (
        renderTextField()
      )}

      {equilPath(triggerExternalPath, [stepName].concat(path)) ? externalReaderMessage : null}
    </FormControl>
  );
};

Layout.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.node,
  enum: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  type: PropTypes.string,
  placeholder: PropTypes.string,
  select: PropTypes.bool,
  sample: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  error: PropTypes.object,
  formControlProps: PropTypes.object,
  description: PropTypes.string,
  classes: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  InputProps: PropTypes.object,
  SelectProps: PropTypes.object,
  mask: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helperText: PropTypes.string,
  path: PropTypes.array,
  useTrim: PropTypes.bool,
  changeCase: PropTypes.string,
  checkRequired: PropTypes.string,
  wrapperClass: PropTypes.string,
  notRequiredLabel: PropTypes.string,
  inlineDisplay: PropTypes.bool,
  darkTheme: PropTypes.bool,
  width: PropTypes.string,
  widthMobile: PropTypes.string,
  deleteIcon: PropTypes.bool,
  variant: PropTypes.string,
  chipsValue: PropTypes.node
};

Layout.defaultProps = {
  children: '',
  enum: null,
  type: 'string',
  placeholder: '',
  select: false,
  onChange: undefined,
  sample: '',
  formControlProps: {},
  error: null,
  description: '',
  readOnly: false,
  InputProps: {},
  SelectProps: {},
  mask: '',
  multiline: false,
  required: false,
  value: '',
  helperText: '',
  path: [],
  width: null,
  widthMobile: null,
  useTrim: false,
  changeCase: null,
  checkRequired: null,
  wrapperClass: null,
  notRequiredLabel: null,
  inlineDisplay: false,
  darkTheme: false,
  deleteIcon: true,
  variant: 'standard',
  chipsValue: null
};

const styled = withStyles(style)(Layout);
export default translate('JsonSchemaEditor')(styled);
