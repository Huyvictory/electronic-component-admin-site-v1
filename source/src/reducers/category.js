import { actionTypes, reduxUtil } from '../actions/category';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_CATEGORY_LIST,
    DELETE_CATEGORY,
} = actionTypes;

const initialState = { 
    settingsData: [],
    tbSettingsLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_CATEGORY_LIST)]: (state) => {
        return {
            ...state,
            tbSettingsLoading: true
        }
    },
    [defineActionSuccess(GET_CATEGORY_LIST)]: (state, { settingsData }) => {
        return {
            ...state,
            settingsData,
            tbSettingsLoading: false
        }
    },
    [defineActionLoading(DELETE_CATEGORY)] : (state) =>{
        return {
            ...state,
            tbSettingsLoading: true,
        }
    },
    [defineActionFailed(DELETE_CATEGORY)] : (state) =>{
        return {
            ...state,
            tbSettingsLoading: false,
        }
    },
    initialState
})

export default {
    reducer
};
