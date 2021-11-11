import { actionTypes, reduxUtil } from '../actions/product';
import {actions} from '../actions/account';
import Utils from '../utils/index'

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_PRODUCT_LIST,
    DELETE_PRODUCT,
    GET_CATEGORY_TYPE
} = actionTypes;

const initialState = { 
    productData: [],
    productCategoryType: [],
    tbproductLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_PRODUCT_LIST)]: (state) => {
        return {
            ...state,
            tbproductLoading: true
        }
    },
    [defineActionSuccess(GET_PRODUCT_LIST)]: (state, { productData }) => {

        // let settingObject = actions.getUserData();
        // let newproductDataArray = productData.data.map((el) => {
        //     return {
        //         ...el,
        //         productPrice: Utils.formatMoney(el.productPrice, settingObject.settings)
        //     }
        // });
        // productData.data = newproductDataArray;

        return {
            ...state,
            productData,
            tbproductLoading: false
        }
    },
    [defineActionLoading(GET_CATEGORY_TYPE)]: (state) => {
        return {
            ...state,
            tbproductLoading: true
        }
    },
    [defineActionSuccess(GET_CATEGORY_TYPE)]: (state, {productCategoryType}) => {
        return {
            ...state,
            productCategoryType,
            tbproductLoading: false,            
        }
    },
    [defineActionLoading(DELETE_PRODUCT)] : (state) =>{
        return {
            ...state,
            tbproductLoading: true,
        }
    },
    [defineActionFailed(DELETE_PRODUCT)] : (state) =>{
        return {
            ...state,
            tbproductLoading: false,
        }
    },
    initialState
})

export default {
    reducer
};
