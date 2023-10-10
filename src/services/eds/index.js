import Signer from 'services/eds/signer';
import HardwareSigner from 'services/eds/hardwareSigner';
// import CAs from 'services/eds/CAs.json';
// import testACSK from 'services/eds/CA-TEST.json';
// import config from 'config';

// const { eds } = config;

class EDSService {
  /**
   * Constructor of electron digital signature service
   */
  constructor() {
    this.hardwareSigner = new HardwareSigner();
    this.signer = new Signer();
    // this.signer.init();
    setTimeout(
      () =>
        this.hardwareSigner.init().catch(() => {
          // nothing to do
        }),
      2000
    );
  }

  getSigner = () => [this.hardwareSigner, this.signer].filter((signer) => signer.inited).shift();

  getFileKeySigner = () => this.signer;

  getServerList = () => this.signer.getServerList();
}

const service = new EDSService();

// export const serverList = eds.useTestACSK ? testACSK.concat(CAs) : CAs;

export default service;
