const app = {
  state: {
    widgetOrigin: null,
  },
  reducers: {
    setWidgetOrigin: (state, widgetOrigin) => ({ ...state, widgetOrigin }),
  },
  effects: (dispatch) => ({}),
};

export default app;
