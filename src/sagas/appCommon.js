import { call, takeLatest } from 'redux-saga/effects';

import { sendRequest } from '../services/apiService';
import { actionTypes } from '../actions/appCommon';
import apiConfig from '../constants/apiConfig';
import { handleApiResponse } from '../utils/apiHelper';

function* _uploadFile({ payload: { params, onCompleted, onError } }) {
    try {
        const result = yield call(sendRequest,apiConfig.file.upload,params);
        handleApiResponse(result, onCompleted, onError);
    }
    catch(error) {
        onError(error);
    }
}

const sagas = [
    takeLatest(actionTypes.UPLOAD_FILE, _uploadFile)
]

export default sagas;