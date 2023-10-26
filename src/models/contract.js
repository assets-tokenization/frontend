const contract = {
  state: {
    contracts: {}
  },
  reducers: {
    SAVE_CONTRACT_DATA: (state, contractData) => {
      const { contracts } = state;
      const { id_real_estate } = contractData;
      contracts[id_real_estate] = contractData;
      return {
        ...state,
        contracts
      };
    }
  }
};

export default contract;
