import { actionTypes, reduxUtil } from '../actions/province';

const { createReducer, defineActionSuccess, defineActionLoading, defineActionFailed } = reduxUtil;
const {
    GET_PROVINCE_LIST,
    DELETE_PROVINCE,
    GET_COMMUNE_COMBOBOX_LIST,
    GET_DISTRICT_COMBOBOX_LIST,
    GET_PROVINCE_COMBOBOX_LIST
} = actionTypes;

const initialState = { 
    provinceData: [],
    provinceComboboxList: {},
    districtComboboxList: {},
    communeComboboxList: {},
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
    [defineActionSuccess(GET_PROVINCE_COMBOBOX_LIST,)] : (state, {provinceComboboxList} ) =>{
        return {
            ...state,
            provinceComboboxList,
        }
    },
    [defineActionSuccess(GET_DISTRICT_COMBOBOX_LIST)] : (state, {districtComboboxList} ) =>{
        return {
            ...state,
            districtComboboxList,
        }
    },
    [defineActionSuccess(GET_COMMUNE_COMBOBOX_LIST)] : (state, {communeComboboxList} ) =>{
        return {
            ...state,
            communeComboboxList,
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
