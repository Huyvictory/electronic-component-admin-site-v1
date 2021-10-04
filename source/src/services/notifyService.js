import { notification } from 'antd';

const showSucsessMessage = (content) => {
    notification.success({
        message: 'Thành công',
        description: content
    });
}

const showErrorMessage = (content) => {
    notification.error({
        message: 'Lỗi',
        description: content
    });
}

const showWarningMessage = (content) => {
    notification.warning({
        message: 'Thông tin lỗi',
        description: content
    });
}

export {
    showErrorMessage,
    showWarningMessage,
    showSucsessMessage,
}