import { actionTypes, reduxUtil } from '../actions/appCommon';

const { createReducer } = reduxUtil;
const {
    SHOW_FULL_SCREEN_LOADING,
    HIDE_FULL_SCREEN_LOADING
} = actionTypes;

const initialState = {
    fullScreenLoading: false
};

const reducer = createReducer({
    [SHOW_FULL_SCREEN_LOADING]: (state) => {
        return {
            ...state,
            fullScreenLoading: true
        }
    },
    [HIDE_FULL_SCREEN_LOADING]: (state) => {
        return {
            ...state,
            fullScreenLoading: false
        }
    },
    initialState
})

export default {
    reducer
};
