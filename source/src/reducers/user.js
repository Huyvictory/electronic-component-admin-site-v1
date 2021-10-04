import { actionTypes, reduxUtil } from '../actions/user';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_SHOP_ACCOUNT_LIST,
    GET_USER_ADMIN_LIST,
    SEARCH_USER,
    DELETE_ADMIN,
} = actionTypes;

const initialState = {
    userAdminData: {},
    shopAccountData: {},
    users: [],
    tbUserAdminLoading: false,
    tbCustomerLoading: false,
    searhLoading: false
};

const reducer = createReducer({
    [defineActionLoading(GET_USER_ADMIN_LIST)]: (state) => {
        return {
            ...state,
            tbUserAdminLoading: true
        }
    },
    [defineActionSuccess(GET_USER_ADMIN_LIST)]: (state, { userAdminData }) => {
        return {
            ...state,
            userAdminData,
            tbUserAdminLoading: false
        }
    },
    [defineActionLoading(DELETE_ADMIN)] : (state) =>{
        return {
            ...state,
            tbUserAdminLoading: true,
        }
    },
    [defineActionFailed(DELETE_ADMIN)] : (state) =>{
        return {
            ...state,
            tbUserAdminLoading: false,
        }
    },
    [defineActionLoading(GET_SHOP_ACCOUNT_LIST)]: (state) => {
        return {
            ...state,
            tbCustomerLoading: true
        }
    },
    [defineActionSuccess(GET_SHOP_ACCOUNT_LIST)]: (state, { shopAccountData }) => {
        return {
            ...state,
            shopAccountData,
            tbCustomerLoading: false
        }
    },
    [defineActionLoading(SEARCH_USER)]: (state) => {
        return {
            ...state,
            searchLoading: true
        }
    },
    [defineActionSuccess(SEARCH_USER)]: (state, { users }) => {
        return {
            ...state,
            users,
            searchLoading: false
        }
    },
    initialState
})

export default {
    reducer
};
