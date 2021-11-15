import { call, put, takeLatest } from "redux-saga/effects";

import { sendRequest } from "../services/apiService";
import { actionTypes, reduxUtil } from "../actions/groupPermission";
import apiConfig from "../constants/apiConfig";
import { handleApiResponse } from "../utils/apiHelper";

const {
  defineActionLoading,
  defineActionSuccess,
  defineActionFailed,
} = reduxUtil;

const {
  GET_GROUP_PERMISSION_LIST,
  GET_PERMISSION_LIST,
  GET_GROUP_PERMISSION_BY_ID,
  CREATE_GROUP_PERMISSION,
  UPDATE_GROUP_PERMISSION,
  DELETE_GROUP_PERMISSION,
  SEARCH_GROUP_PERMISSION,
} = actionTypes;

function* getList({ payload: { params } }) {
  const apiParams = apiConfig.groupPermission.getList;
  const searchParams = { page: params.page, size: params.size };
  if (params.search) {
    if (params.search.name) searchParams.name = params.search.name;
  }

  try {
    const result = yield call(sendRequest, apiParams, searchParams);
    yield put({
      type: defineActionSuccess(GET_GROUP_PERMISSION_LIST),
      groupPermissionData: result.responseData.data,
    });
  } catch (error) {
    yield put({ type: defineActionFailed(GET_GROUP_PERMISSION_LIST) });
  }
}

function* searchGroupPermission({ payload: { params } }) {
  const apiParams = apiConfig.groupPermission.getList;

  try {
    const result = yield call(sendRequest, apiParams, params);
    yield put({
      type: defineActionSuccess(SEARCH_GROUP_PERMISSION),
      groupPermissions:
        result.responseData.data && result.responseData.data.data,
    });
  } catch (error) {
    yield put({ type: defineActionFailed(SEARCH_GROUP_PERMISSION) });
  }
}

function* getPermissionList() {
  const apiParams = apiConfig.groupPermission.getPermissionList;
  const params = { page: 0, size: 1000 };
  try {
    const result = yield call(sendRequest, apiParams, params);
    yield put({
      type: defineActionSuccess(GET_PERMISSION_LIST),
      permissions: result.responseData && result.responseData.data,
    });
  } catch (error) {
    yield put({ type: defineActionFailed(GET_PERMISSION_LIST) });
  }
}

function* getById({ payload: { params, onCompleted, onError } }) {
  try {
    const apiParams = {
      ...apiConfig.groupPermission.getById,
      path: `${apiConfig.groupPermission.getById.path}/${params.id}`,
    };
    const result = yield call(sendRequest, apiParams);

    handleApiResponse(result, onCompleted, onError);
  } catch (error) {
    onError(error);
  }
}

function* create({ payload: { params, onCompleted, onError } }) {
  try {
    const result = yield call(
      sendRequest,
      apiConfig.groupPermission.create,
      params
    );
    handleApiResponse(result, onCompleted, onError);
  } catch (error) {
    onError(error);
  }
}

function* update({ payload: { params, onCompleted, onError } }) {
  try {
    const result = yield call(
      sendRequest,
      apiConfig.groupPermission.update,
      params
    );
    handleApiResponse(result, onCompleted, onError);
  } catch (error) {
    onError(error);
  }
}

function* deleteRole({ payload: { params, onCompleted, onError } }) {
  try {
    const apiParams = {
      ...apiConfig.role.delete,
      path: `${apiConfig.role.delete.path}/${params.id}`,
    };
    const result = yield call(sendRequest, apiParams, params);
    handleApiResponse(result, onCompleted, onError);
  } catch (error) {
    onError(error);
  }
}

const sagas = [
  takeLatest(defineActionLoading(GET_GROUP_PERMISSION_LIST), getList),
  takeLatest(defineActionLoading(GET_PERMISSION_LIST), getPermissionList),
  takeLatest(
    defineActionLoading(SEARCH_GROUP_PERMISSION),
    searchGroupPermission
  ),
  takeLatest(GET_GROUP_PERMISSION_BY_ID, getById),
  takeLatest(CREATE_GROUP_PERMISSION, create),
  takeLatest(UPDATE_GROUP_PERMISSION, update),
  takeLatest(DELETE_GROUP_PERMISSION, deleteRole),
];

export default sagas;
