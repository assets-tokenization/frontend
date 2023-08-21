import serverList from './../variables/CAs';

const eds = {
  state: {
    encryptedKey: null,
    serverList: serverList.map((option) => ({
      ...option,
      name: option.issuerCNs.shift()
    })),
    kmTypes: [],
    inited: false,
    error: null
  },
  reducers: {
    setEncryptedKey(state, encryptedKey) {
      return {
        ...state,
        encryptedKey
      };
    },
    clearTypes: (state) => ({
      ...state,
      kmTypes: []
    }),
    addKmType: (state, { type, index }) => {
      const { kmTypes } = state;
      kmTypes[index] = { name: type, index, devices: [] };
      return {
        ...state,
        kmTypes
      };
    },
    addKmDevice: (state, { device, typeIndex, deviceIndex }) => ({
      ...state,
      kmTypes: state.kmTypes.map((type, index) =>
        index === typeIndex
          ? {
              ...type,
              devices: (type.devices || []).concat({
                index: deviceIndex,
                name: device
              })
            }
          : type
      )
    }),
    libraryInitSuccess: (state) => ({
      ...state,
      inited: true
    }),
    libraryInitFailed: (state, error) => ({
      ...state,
      inited: true,
      error
    })
  },
  effects: (dispatch) => ({
    // setEncryptedKey: (payload) => {
    //     console.log('dispatch.eds', dispatch.eds);
    //     dispatch.eds.setEncryptedKey(payload);
    // }
  })
};

export default eds;
