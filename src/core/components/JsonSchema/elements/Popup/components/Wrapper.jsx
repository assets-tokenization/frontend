import React, { useState } from 'react';
import { translate } from 'react-translate';
import classNames from 'classnames';
import { Button, Typography, IconButton, Tooltip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import Edit from 'assets/img/ic_edit.svg';
import TrashIcon from 'assets/img/ic_trash.svg';
import PropTypes from 'prop-types';
import TextBlock from 'components/JsonSchema/elements/TextBlock';
import ProgressLine from 'components/Preloader/ProgressLine';

const styles = (theme) => ({
  blockWrapper: {
    border: '2px solid #000',
    maxWidth: 640,
    padding: 30,
    [theme.breakpoints.down('lg')]: {
      padding: 16
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 15
    }
  },
  blockHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
      alignItems: 'end'
    }
  },
  values: {
    marginTop: 15
  },
  removeMargin: {
    margin: 0,
    marginTop: -5
  },
  editButton: {
    '&>span': {
      fontSize: 13
    },
    [theme.breakpoints.down('lg')]: {
      justifyContent: 'flex-end',
      padding: 0
    }
  },
  editImg: {
    color: '#000'
  },
  editText: {
    [theme.breakpoints.down('lg')]: {
      display: 'none'
    }
  },
  title: {
    paddingRight: 15,
    [theme.breakpoints.down('lg')]: {
      fontSize: 16
    }
  },
  flex: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  dynamicTitleButton: {
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  withoutPadding: {
    padding: '0 8px',
    minWidth: 125,
    justifyContent: 'start',
    marginBottom: 5,
    [theme.breakpoints.down('lg')]: {
      minWidth: 73
    }
  },
  popupActionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  editBtn: {
    position: 'absolute',
    top: 10,
    right: 10
  }
});

const EditTooltip = ({ t, open, setOpen, handleClickOpen, editText }) => (
  <Tooltip title={editText || t('Edit')} open={open}>
    <IconButton
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(false)}
      onClick={handleClickOpen}
      size="large"
    >
      <img src={Edit} alt="Edit" />
    </IconButton>
  </Tooltip>
);

EditTooltip.propTypes = {
  t: PropTypes.func.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.object
};

EditTooltip.defaultProps = {
  open: false
};

const RenderValues = ({
  htmlBlock,
  params,
  value,
  rootDocument,
  properties,
  renderDataItem,
  useParentData
}) => (
  <div>
    {htmlBlock ? (
      <TextBlock
        htmlBlock={htmlBlock}
        params={params}
        parentValue={value}
        rootDocument={rootDocument}
        useParentData={useParentData}
      />
    ) : (
      Object.keys(properties || {}).map((item, index) => renderDataItem(item, index))
    )}
  </div>
);

RenderValues.propTypes = {
  renderDataItem: PropTypes.func.isRequired,
  htmlBlock: PropTypes.string,
  params: PropTypes.object,
  rootDocument: PropTypes.object,
  properties: PropTypes.object,
  useParentData: PropTypes.bool
};

RenderValues.defaultProps = {
  htmlBlock: null,
  params: null,
  rootDocument: null,
  properties: null,
  useParentData: false
};

const Wrapper = ({
  t,
  classes,
  description,
  handleClickOpen,
  renderDataItem,
  properties,
  htmlBlock,
  params,
  useOwnParams,
  rootDocument,
  editTooltip,
  value,
  dynamicTitle,
  useParentData,
  style,
  popupDeleteArrayItem,
  deleteItemAction,
  handleClose,
  editText,
  readOnly
}) => {
  const [open, setOpen] = useState(false);
  const [deleting, toggleDeleting] = useState(false);

  const handleDelete = async () => {
    toggleDeleting(true);

    await deleteItemAction();

    handleClose(true);

    toggleDeleting(false);
  };

  if (deleting) return <ProgressLine loading={true} />;

  return (
    <div className={classNames(classes.blockWrapper, style && style.wrapper)}>
      {description ? (
        <div className={classNames(classes.blockHead, style && style.header)}>
          <Typography
            variant={'subtitle1'}
            className={classNames(classes.title, style && style.title)}
          >
            {description}
          </Typography>

          {readOnly ? null : (
            <>
              {editTooltip ? (
                <EditTooltip
                  t={t}
                  open={open}
                  setOpen={setOpen}
                  handleClickOpen={handleClickOpen}
                  editText={editText}
                />
              ) : (
                <Button
                  onClick={handleClickOpen}
                  className={classNames(
                    classes.editButton,
                    classes.withoutPadding,
                    style && style.editButton
                  )}
                >
                  <img src={Edit} alt="Edit" className={classes.editImg} />
                  <span className={classes.editText}>{editText || t('Edit')}</span>
                </Button>
              )}
            </>
          )}
        </div>
      ) : null}

      <div
        className={classNames(
          classes.values,
          !description && classes.flex,
          !description && classes.removeMargin,
          dynamicTitle && classes.dynamicTitleButton
        )}
      >
        <RenderValues
          htmlBlock={htmlBlock}
          params={params}
          value={value}
          rootDocument={useOwnParams ? value : rootDocument}
          properties={properties}
          renderDataItem={renderDataItem}
          useParentData={useParentData}
        />

        <div className={classes.popupActionsWrapper}>
          {!description && !dynamicTitle && !readOnly ? (
            <>
              {editText ? (
                <Button
                  onClick={handleClickOpen}
                  className={classes.editBtn}
                  startIcon={<img src={Edit} alt="Edit" className={classes.editImg} />}
                >
                  {editText}
                </Button>
              ) : (
                <span className={classes.fixTop}>
                  <EditTooltip
                    t={t}
                    open={open}
                    setOpen={setOpen}
                    handleClickOpen={handleClickOpen}
                    editText={editText}
                  />
                </span>
              )}
            </>
          ) : null}

          {dynamicTitle && !description && !readOnly ? (
            <>
              {editText ? (
                <Button
                  onClick={handleClickOpen}
                  className={classes.editBtn}
                  startIcon={<img src={Edit} alt="Edit" className={classes.editImg} />}
                >
                  {editText}
                </Button>
              ) : (
                <EditTooltip
                  t={t}
                  open={open}
                  setOpen={setOpen}
                  handleClickOpen={handleClickOpen}
                  editText={editText}
                />
              )}
            </>
          ) : null}

          {popupDeleteArrayItem && !readOnly ? (
            <Tooltip title={t('Delete')}>
              <IconButton onClick={handleDelete} size="large">
                <img src={TrashIcon} alt="Delete" className={classes.editImg} />
              </IconButton>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </div>
  );
};

Wrapper.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  renderDataItem: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  rootDocument: PropTypes.object.isRequired,
  description: PropTypes.string,
  htmlBlock: PropTypes.string,
  params: PropTypes.object,
  editTooltip: PropTypes.bool,
  useOwnParams: PropTypes.bool,
  value: PropTypes.object,
  dynamicTitle: PropTypes.bool,
  style: PropTypes.object,
  useParentData: PropTypes.bool,
  readOnly: PropTypes.bool
};

Wrapper.defaultProps = {
  value: {},
  editTooltip: false,
  dynamicTitle: false,
  useOwnParams: false,
  description: null,
  htmlBlock: null,
  params: null,
  style: null,
  useParentData: false,
  readOnly: false
};

const translated = translate('Elements')(Wrapper);
const styled = withStyles(styles)(translated);
export default styled;
