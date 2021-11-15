import { actionTypes, reduxUtil } from '../actions/province';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_PROVINCE_LIST,
    DELETE_PROVINCE
} = actionTypes;

const initialState = { 
    provinceData: [],
    tbprovinceLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_PROVINCE_LIST)]: (state) => {
        return {
            ...state,
            tbprovinceLoading: true
        }
    },
    [defineActionSuccess(GET_PROVINCE_LIST)]: (state, { provinceData }) => {
        return {
            ...state,
            provinceData,
            tbprovinceLoading: false
        }
    },
    [defineActionLoading(DELETE_PROVINCE)] : (state) =>{
        return {
            ...state,
            tbprovinceLoading: true,
        }
    },
    [defineActionFailed(DELETE_PROVINCE)] : (state) =>{
        return {
            ...state,
            tbprovinceLoading: false,
        }
    },
    initialState
})

export default {
    reducer
};
