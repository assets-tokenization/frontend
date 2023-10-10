
const profile = {
  state: {
    TEST: null,
  },
  reducers: {
    'profile/GET_PROFILE_DATA': (state) => {
      console.log('GET_PROFILE_DATA');
      return {
        ...state,
        inited: true
      }
    }
  }
};

export default profile;
