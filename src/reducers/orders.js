import { actionTypes, reduxUtil } from '../actions/orders';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_ORDERS_LIST,
} = actionTypes;

const initialState = { 
    ordersData: [],
    tbordersLoading: false,
};

const reducer = createReducer({
    [defineActionLoading(GET_ORDERS_LIST)]: (state) => {
        return {
            ...state,
            tbordersLoading: true
        }
    },
    [defineActionSuccess(GET_ORDERS_LIST)]: (state, { ordersData }) => {
        return {
            ...state,
            ordersData,
            tbordersLoading: false
        }
    },
    initialState
})

export default {
    reducer
};
