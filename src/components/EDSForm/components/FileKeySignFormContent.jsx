import React from "react";
import MobileDetect from "mobile-detect";
import {
  Button,
  FormControl,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FileInputField from "components/CustomInput/FileInputField";
import edsService from "services/eds";
import config from "config";
import ProxySettings from "components/EDSForm/ProxySettings";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const { useProxySettings } = (config && config.eds) || {};
const md = new MobileDetect(window.navigator.userAgent);
const isIOS = md.is("iPhone") || md.os() === "iPadOS";
const isIPadOS =
  window.navigator.userAgent.match(/Mac/) &&
  window.navigator.maxTouchPoints &&
  window.navigator.maxTouchPoints > 2;

const styles = (theme) => ({
  content: {
    padding: "0 !important",
    marginBottom: 40,
  },
  grow: {
    flexGrow: 1,
  },
  menuItem: {
    "@media screen and (max-width: 767px)": {
      display: "block",
      fontSize: "12px",
      overflow: "hidden",
      whiteSpace: "unset",
      minHeight: "unset",
      textOverflow: "ellipsis",
    },
  },
  actions: {
    marginTop: 10,
    padding: 0,
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 0,
      paddingRight: 0
    },
  },
  progress: {
    marginRight: 4,
  },
  progressText: {
    marginBottom: 10,
  },
  buttons: {
    textTransform: "initial",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: 20,
    }
  },
  actionIcon: {
    marginLeft: 10,
  },
  fieldHeadline: {
    fontSize: 14,
    color: 'rgba(26, 26, 26, 1)',
    fontWeight: 400,
    lineHeight: '17px',
    marginBottom: 10,
    marginTop: 20,
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
      fontWeight: 400,
      lineHeight: '16px',
      marginBottom: 5,
      marginTop: 10,
    }
  }
});

const FileKeySignFormContent = ({
  t,
  classes,
  setId,
  onClose,
  readPrivateKeyText,
  busy,
  signProgress,
  signProgressText,
  server,
  keyFile,
  password,
  errors,
  signingError,
  showErrorDialog,
  keys,
  selectedKey,
  showServerSelect,
  showPassword,
  handleKeyChange,
  handleChange,
  handleClose,
  handleSelectKey,
  tryToSubmit,
  passwordRef,
  toggleShowPassword,
}) => {
  const serverList = edsService.getServerList();
  return (
    <>
      <DialogContent className={classes.content}>
        <FormControl
          variant="standard" fullWidth={true} id={setId("form")}
          className="eds-form-dropzone"
        >
          <FileInputField
            t={t}
            id={setId("file")}
            label={t("Key")}
            error={!!errors.key}
            value={keyFile}
            margin="normal"
            disabled={busy}
            helperText={errors.key}
            accept={isIOS || isIPadOS ? null : ".dat,.pfx,.pk8,.zs2,.jks,zs2"}
            onChange={handleKeyChange}
          />
  
          {errors.server || showServerSelect ? (
            <>
              

              <Typography className={classes.fieldHeadline}>
                {t("ACSKServer")}
              </Typography>

              <TextField
                variant="outlined"
                id={setId("server")}
                select={true}
                value={server || 0}
                error={!!errors.server}
                onChange={handleChange("server")}
                margin="normal"
                disabled={busy}
                helperText={errors.server}
                SelectProps={{ MenuProps: { className: classes.menu } }}
              >
                <MenuItem
                  value={0}
                  id={setId("server-autodetect")}
                  className={classes.menuItem}
                >
                  {t("ACSKAutoDetect")}
                </MenuItem>
                {serverList &&
                  serverList.map((option, index) => {
                    const name = option.issuerCNs[0];
                    return (
                      <MenuItem
                        key={index}
                        value={index + 1}
                        id={setId(`server-${name}`)}
                        className={classes.menuItem}
                      >
                        {name}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </>
          ) : null}

          {Object.keys(keys).length > 1 ? (
            <>
              <TextField
                variant="outlined"
                id={setId("key")}
                select={true}
                label={t("SelectedKey")}
                value={selectedKey}
                onChange={handleChange("selectedKey")}
                margin="normal"
                disabled={busy}
                SelectProps={{ MenuProps: { className: classes.menu } }}
              >
                {Object.keys(keys).map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    id={setId(`server-${option}`)}
                    className={classes.menuItem}
                  >
                    {t(option)}
                    {keys[option] ? ` (${keys[option].subjCN})` : null}
                  </MenuItem>
                ))}
              </TextField>
            </>
          ) : null}

          <Typography className={classes.fieldHeadline}>
            {t("Password")}
          </Typography>

          <TextField
            variant="outlined"
            inputRef={passwordRef}
            id={setId("password")}
            value={password || ""}
            error={!!errors.password}
            onKeyPress={tryToSubmit}
            onChange={handleChange("password")}
            margin="normal"
            type={showPassword ? "text" : "password"}
            disabled={busy}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    size="large"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        {useProxySettings ? (
          <ProxySettings signer={edsService.getSigner()} busy={busy} />
        ) : null}
      </DialogContent>
      {busy ? (
        <>
          {signProgressText ? (
            <Typography className={classes.progressText}>
              {signProgress ? (
                <CircularProgress size={12} className={classes.progress} />
              ) : null}
              {signProgressText}
            </Typography>
          ) : null}
          <LinearProgress
            value={signProgress}
            variant={signProgress ? "determinate" : "indeterminate"}
          />
        </>
      ) : null}
      <DialogActions className={classes.actions}>
        {onClose ? (
          <Button
            size="large"
            onClick={onClose}
            disabled={busy}
            id={setId("cancel-button")}
            setId={(elementName) => setId(`cancel-${elementName}`)}
            className={classes.buttons}
          >
            {t("Cancel")}
          </Button>
        ) : null}
        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={handleSelectKey}
          disabled={busy}
          id={setId("sign-button")}
          setId={(elementName) => setId(`sign-${elementName}`)}
          className={classes.buttons}
        >
          {readPrivateKeyText || t("Sign")}
          <ArrowForwardIcon className={classes.actionIcon} />
        </Button>
      </DialogActions>
      <Dialog
        open={showErrorDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id={setId("dialog")}
        className={classes.dialog}
      >
        <DialogTitle
          id={setId("dialog alert-dialog-title")}
          className={classes.dialogContentWrappers}
        >
          {t("SigningDataError")}
        </DialogTitle>
        <DialogContent className={classes.dialogContentWrappers}>
          <DialogContentText id={setId("dialog alert-dialog-description")}>
            {signingError}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogContentWrappers}>
          <Button
            color="primary"
            onClick={handleClose}
            autoFocus={true}
            id={setId("close-button")}
            setId={(elementName) => setId(`close-${elementName}`)}
          >
            {t("CloseDialog2")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const styled = withStyles(styles)(FileKeySignFormContent);
export default styled;
