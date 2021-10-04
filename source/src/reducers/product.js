import { actionTypes, reduxUtil } from '../actions/product';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_PRODUCT_LIST,
    DELETE_PRODUCT,
    GET_PRODUCT_CATEGORY_AUTO_COMPLETE,
} = actionTypes;

const initialState = { 
    productData: {},
    tbProductLoading: false,
    categoryAutoComplete: [],
};

const reducer = createReducer({
    [defineActionLoading(GET_PRODUCT_LIST)]: (state) => {
        return {
            ...state,
            tbProductLoading: true
        }
    },
    [defineActionSuccess(GET_PRODUCT_LIST)]: (state, { productData }) => {
        return {
            ...state,
            productData,
            tbProductLoading: false
        }
    },
    [defineActionLoading(DELETE_PRODUCT)] : (state) =>{
        return {
            ...state,
            tbProductLoading: true,
        }
    },
    [defineActionFailed(DELETE_PRODUCT)] : (state) =>{
        return {
            ...state,
            tbProductLoading: false,
        }
    },
    [defineActionSuccess(GET_PRODUCT_CATEGORY_AUTO_COMPLETE)]: (state, { categoryAutoComplete }) => {
        return {
            ...state,
            categoryAutoComplete,
        }
    },
    initialState
})

export default {
    reducer
};
