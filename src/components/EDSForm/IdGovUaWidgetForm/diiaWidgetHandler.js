class DiiaWidgetHandler {
  constructor(euSign) {
    this.euSign = euSign;
  }

  execute() {
    // eslint-disable-next-line prefer-rest-params
    const [command, ...args] = arguments;

    if (!(command in this)) {
      throw new Error(`Command ${command} not found`);
    }

    return this[command](...args);
  }

  SignData(data, internal = true) {
    debugger;
    return this.euSign.SignData(
      data,
      !internal,
      true,
      window.EndUser.SignAlgo.DSTU4145WithGOST34311,
      null,
      window.EndUser.SignType.CAdES_X_Long
    );
  }
}

export default DiiaWidgetHandler;
