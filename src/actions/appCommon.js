import reduxHelper from '../utils/redux';

export const reduxUtil = reduxHelper('APP_COMMON');

const { defineAction, createAction } = reduxUtil;

export const actionTypes = {
    SHOW_FULL_SCREEN_LOADING: defineAction('SHOW_FULL_SCREEN_LOADING'),
    HIDE_FULL_SCREEN_LOADING: defineAction('HIDE_FULL_SCREEN_LOADING'),
    UPLOAD_FILE: defineAction('UPLOAD_FILE'),
}

export const actions = {
    showFullScreenLoading: createAction(actionTypes.SHOW_FULL_SCREEN_LOADING),
    hideFullScreenLoading: createAction(actionTypes.HIDE_FULL_SCREEN_LOADING),
    uploadFile: createAction(actionTypes.UPLOAD_FILE),
}