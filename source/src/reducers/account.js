import { actionTypes, reduxUtil } from '../actions/account';

const initialState = {
    data: {},
    loading: false
};

const reducer = reduxUtil.createReducer({
    [reduxUtil.defineActionSuccess(actionTypes.GET_PROFILE)]: (state, { data }) => {
        return {
            ...state,
            data
        }
    },
    [actionTypes.CLEAR_PROFILE]: (state) => {
        return {
            ...state,
            data: {}
        }
    },
    initialState
})

export default {
    reducer
};
