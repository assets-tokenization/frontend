const LARGE_SCREEN_WIDTH = 600;

const SET_OPEN_SIDEBAR = 'APP/SET_OPEN_SIDEBAR';
const SET_OPEN_DAWER = 'APP/SET_OPEN_DAWER';

const initialState = {
    openSidebar: window.innerWidth > LARGE_SCREEN_WIDTH,
    openDawer: false
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_OPEN_SIDEBAR:
            return { ...state, openSidebar: action.payload };
        case SET_OPEN_DAWER:
            return { ...state, openDawer: action.payload };
        default:
            return state;
    }
};

export default rootReducer;
