import { saveAs } from "file-saver";
import edsService from "services/eds";
import { readAsUint8Array } from "helpers/readFileList";
import fileName from "helpers/fileName";

const sign = {
  state: {
    file: null,
    signedData: null,
    list: [],
  },
  reducers: {
    setFile: (state, file) => ({ ...state, file }),
    setList: (state, list) => ({ ...state, list }),
    setSignedData: (state, signedData) => ({ ...state, signedData }),
    resetProcess: () => ({
      file: null,
      source: null,
      signedData: null,
      list: [],
    }),
  },
  effects: (dispatch) => ({
    readSourceFile: async (file) => {
      const signer = edsService.getSigner();
      const fileAsUint8Array = await readAsUint8Array(file);

      const { list } = await signer.execute("GetSigns", fileAsUint8Array);

      dispatch.sign.setList(list);
      dispatch.sign.setFile(file);

      return !!list.length;
    },
    downloadSource: async (file) => {
      const signer = edsService.getSigner();
      const fileAsUint8Array = await readAsUint8Array(file);

      const { source } = await signer.execute("GetSigns", fileAsUint8Array);

      var blob = new Blob([source], { type: "application/octet-stream" });
      saveAs(blob, fileName(file));
    },
    signFile: async (file) => {
      const signer = edsService.getSigner();
      const fileAsUint8Array = await readAsUint8Array(file);

      const signedData = await signer.execute(
        "SignData",
        fileAsUint8Array,
        true
      );
      dispatch.sign.setSignedData(signedData);

      return signedData;
    },
  }),
};

export default sign;
