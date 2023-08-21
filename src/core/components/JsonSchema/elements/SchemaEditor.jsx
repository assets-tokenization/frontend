import React from 'react';
import { translate } from 'react-translate';
import { Button, Typography } from '@mui/material';

import { makeStyles } from '@mui/styles';

import ElementContainer from 'components/JsonSchema/components/ElementContainer';
import JsonSchemaEditor from 'components/JsonSchema/editor';

import ConfirmDialog from 'components/ConfirmDialog';
import FullScreenDialog from 'components/FullScreenDialog';

const useStyles = makeStyles(() => ({
  modelabel: {
    fontWeight: 500,
    fontSize: 12,
    lineHeight: '12px',
    letterSpacing: '-0.09em',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center'
  },
  actionWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    width: 'calc(100% + 17px)',
    position: 'relative',
    left: -8,
    '&:hover': {
      backgroundColor: '#2e2e2e'
    }
  },
  actionLabel: {
    fontWeight: 500,
    lineHeight: '19px',
    color: '#FFFFFF',
    fontSize: 16,
    textTransform: 'initial',
    textAlign: 'left'
  },
  chevronIcon: {
    fill: 'rgba(255, 255, 255, 0.7)'
  }
}));

const SchemaEditor = ({
  t,
  error,
  required,
  helperText,
  description,
  noMargin,
  value,
  onChange,
  busy,
  setBusy,
  handleSave,
  darkTheme,
  additionDescription
}) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [unSavedOpen, setUnSavedOpen] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);

  const renderActionButton = () => (
    <>
      {darkTheme ? (
        <>
          <Button className={classes.actionWrapper} onClick={() => setOpen(true)}>
            <Typography className={classes.actionLabel}>{description}</Typography>
            <span className={classes.modelabel}>{'JSON5'}</span>
          </Button>
        </>
      ) : (
        <Button size="small" variant="outlined" fullWidth={true} onClick={() => setOpen(true)}>
          {t('OpenEditor')}
        </Button>
      )}
    </>
  );

  return (
    <ElementContainer
      error={error}
      required={required}
      helperText={helperText}
      description={darkTheme ? null : description}
      noMargin={noMargin}
    >
      {renderActionButton()}

      <FullScreenDialog
        open={open}
        title={description + additionDescription}
        disableEscapeKeyDown={true}
        disableScrollBody={true}
        onClose={() => {
          if (errors.length && errors[0].error === 'unSavedError') {
            setUnSavedOpen(true);
            return;
          }

          if (errors.filter((e) => e.type !== 'warning').length) {
            setOpenErrorDialog(true);
            return;
          }
          setOpen(false);
        }}
      >
        <JsonSchemaEditor
          value={value}
          busy={busy}
          onChange={onChange}
          handleSave={handleSave}
          setBusy={setBusy}
          onValidate={setErrors}
        />

        <ConfirmDialog
          open={openErrorDialog}
          darkTheme={darkTheme}
          title={t('ResolveErrors')}
          description={t('ResolveErrorsPrompt')}
          handleClose={() => setOpenErrorDialog(false)}
        />

        <ConfirmDialog
          open={unSavedOpen}
          darkTheme={darkTheme}
          title={t('UnsavedErrors')}
          cancelButtonText={t('Exit')}
          description={t('ResolveUnsavedPrompt')}
          handleClose={() => {
            setUnSavedOpen(false);
            setOpen(false);
          }}
          handleConfirm={() => {
            errors[0].saveCallback();
            setUnSavedOpen(false);
            setOpen(false);
          }}
        />
      </FullScreenDialog>
    </ElementContainer>
  );
};

export default translate('Elements')(SchemaEditor);
