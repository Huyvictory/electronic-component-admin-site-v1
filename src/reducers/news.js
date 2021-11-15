import { actionTypes, reduxUtil } from '../actions/news';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_NEWS_LIST,
    DELETE_NEWS,
    GET_CATEGORY_TYPE
} = actionTypes;

const initialState = { 
    newsData: [],
    newsCategoryType: [],
    tbnewsLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_NEWS_LIST)]: (state) => {
        return {
            ...state,
            tbnewsLoading: true
        }
    },
    [defineActionSuccess(GET_NEWS_LIST)]: (state, { newsData }) => {
        return {
            ...state,
            newsData,
            tbnewsLoading: false
        }
    },
    [defineActionLoading(GET_CATEGORY_TYPE)]: (state) => {
        return {
            ...state,
            tbnewsLoading: true
        }
    },
    [defineActionSuccess(GET_CATEGORY_TYPE)]: (state, {newsCategoryType}) => {
        return {
            ...state,
            newsCategoryType,
            tbnewsLoading: false,            
        }
    },
    [defineActionLoading(DELETE_NEWS)] : (state) =>{
        return {
            ...state,
            tbnewsLoading: true,
        }
    },
    [defineActionFailed(DELETE_NEWS)] : (state) =>{
        return {
            ...state,
            tbnewsLoading: false,
        }
    },
    initialState
})

export default {
    reducer
};
