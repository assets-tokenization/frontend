const profile = {
  state: {
    userInfo: null
  },
  reducers: {
    GET_PROFILE_DATA_SUCCESS: (state, userInfo) => ({
      ...state,
      userInfo
    })
  }
};

export default profile;
