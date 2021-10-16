import { actionTypes, reduxUtil } from '../actions/category';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_CATEGORY_LIST,
    DELETE_CATEGORY,
} = actionTypes;

const initialState = { 
    categoryData: [],
    tbCategoryLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_CATEGORY_LIST)]: (state) => {
        return {
            ...state,
            tbCategoryLoading: true
        }
    },
    [defineActionSuccess(GET_CATEGORY_LIST)]: (state, { settingsData }) => {
        return {
            ...state,
            settingsData,
            tbCategoryLoading: false
        }
    },
    [defineActionLoading(DELETE_CATEGORY)] : (state) =>{
        return {
            ...state,
            tbCategoryLoading: true,
        }
    },
    [defineActionFailed(DELETE_CATEGORY)] : (state) =>{
        return {
            ...state,
            tbCategoryLoading: false,
        }
    },
    initialState
})

export default {
    reducer
};
