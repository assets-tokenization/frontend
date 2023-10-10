
const rootReducer = (state, action) => {
  switch (action.type) {
    case 'profile/GET_PROFILE_DATA':
      return { ...state, TEST: [] };
    default:
      return state;
  }
};
export default rootReducer;
