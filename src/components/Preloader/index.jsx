import React from "react";
import withStyles from "@mui/styles/withStyles";
import classNames from "classnames";
import svgIcon from "assets/img/emblem-loader.svg";

const styles = () => ({
  "@keyframes rotate": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  container: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    padding: "20px 20px 10px",
    height: "100vh",
  },
  nopadding: {
    padding: 10,
  },
  box: {
    position: "relative",
    width: "136px",
    height: "136px",
    borderRadius: "30%",
    overflow: "hidden",
    margin: "0 auto",
  },
  content: {
    background: "#fff",
    position: "absolute",
    top: "2px",
    bottom: "2px",
    left: "2px",
    right: "2px",
    margin: "auto",
    borderRadius: "30%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "6",
  },
  blackUnderlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    background: "#000",
    borderRadius: "30%",
    overflow: "hidden",
    zIndex: 4,
  },
  rotator: {
    display: "block",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    borderRadius: "50%",
    animationName: "$rotate",
    animationDuration: "2s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  border: {
    position: "absolute",
    width: "75px",
    height: "75px",
    top: "-28px",
    left: 0,
    right: 0,
    margin: "auto",
    borderRadius: "50%",
    background: "linear-gradient(90deg, #8edacb 0, #7abace 100%)",
    zIndex: 5,
  },
});

const Preloader = ({
  size,
  nopadding = false,
  classes,
  className,
  background,
}) => (
  <div
    className={classNames(classes.container, className, {
      [classes.nopadding]: nopadding,
    })}
  >
    <div className={classes.box}>
      <div
        style={{
          background: background || "#fff",
        }}
        className={classes.content}
      >
        <img src={svgIcon} alt="Loading..." width={size} />
      </div>
      <div className={classes.blackUnderlay}>
        <div className={classes.rotator}>
          <div className={classes.border} />
        </div>
      </div>
    </div>
  </div>
);

export { default as PreloaderModal } from "components/Preloader/PreloaderModal";
export default withStyles(styles)(Preloader);
