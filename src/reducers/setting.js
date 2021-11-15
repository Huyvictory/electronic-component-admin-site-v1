import { actionTypes, reduxUtil } from '../actions/setting';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_SETTINGS_LIST,
    DELETE_SETTING,
} = actionTypes;

const initialState = { 
    settingsData: [],
    tbSettingsLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_SETTINGS_LIST)]: (state) => {
        return {
            ...state,
            tbSettingsLoading: true
        }
    },
    [defineActionSuccess(GET_SETTINGS_LIST)]: (state, { settingsData }) => {
        return {
            ...state,
            settingsData,
            tbSettingsLoading: false
        }
    },
    [defineActionLoading(DELETE_SETTING)] : (state) =>{
        return {
            ...state,
            tbSettingsLoading: true,
        }
    },
    [defineActionFailed(DELETE_SETTING)] : (state) =>{
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
