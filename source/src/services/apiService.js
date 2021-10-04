import { AppConstants, StorageKeys } from '../constants';
import { showErrorMessage } from './notifyService';

// const apiBodyTemplete = (data) => ({
//     data
// })

const sendRequest = async (options, params = {}, token) => {

    let fetchRequest;
    let infoRequest;
    let userData;
    let fullPath = options.path.startsWith('http') ? options.path : `${AppConstants.apiRootUrl}${options.path}`;
    // const errorPath = window.location.protocol + '//' + window.location.host + '/error';

    if(token) {
        options.headers.Authorization = `Bearer ${token}`;
    }
    else if(window.localStorage.getItem(StorageKeys.userData)) {
        userData = JSON.parse(window.localStorage.getItem(StorageKeys.userData));
        options.headers.Authorization = `Bearer ${userData.token}`;
    }

    if(options.headers['Content-Type'] === 'multipart/form-data') {
        let headers = JSON.parse(JSON.stringify(options.headers));
        const formData = new FormData();
        const fileObjects = params.fileObjects;
        delete headers['Content-Type'];
        Object.keys(params).forEach(key => {
            if(key !== 'fileObjects')
                formData.append(key, params[key]);
        });
        if(fileObjects && Object.keys(fileObjects).length > 0) {
            Object.keys(fileObjects).forEach(key => {
                if(fileObjects[key].length > 0) {
                    fileObjects[key].forEach(file => {
                        formData.append(`${key}[]`, file);
                    });
                }
                else if(fileObjects[key].constructor !== Array) {
                    formData.append(key, fileObjects[key]);
                }
            });
        }

        infoRequest = {
            method: options.method,
            headers,
            body: formData
        };
    }
    else {
        if (options.method === 'GET') {
            let hasDefaultQuery = false;
            if (options.params && Object.keys(options.params).length > 0) {
                hasDefaultQuery = true;
                const defaultQuery = Object.keys(options.params)
                    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(options.params[k]))
                    .join('&');
                fullPath = `${fullPath}?${defaultQuery}`;
            }
            if (Object.keys(params).length > 0) {
                const queryString = Object.keys(params)
                    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                    .join('&');
                fullPath = hasDefaultQuery ? `${fullPath}&${queryString}` : `${fullPath}?${queryString}`;
            }

            infoRequest = {
                method: options.method,
                headers: options.headers
            };
        }
        else {
            
            infoRequest = {
                method: options.method,
                headers: options.headers,
                body: JSON.stringify(params)
            };
        }
    }

    fetchRequest = await fetch(fullPath, infoRequest)
    .catch(error => {
        console.log(error);
        return Promise.reject(error);
        // Redirect to error page
        // window.location.replace(errorPath);
    });

    if(fetchRequest.status === 401 && userData) {
        window.localStorage.removeItem(StorageKeys.userData);
        window.location.replace('/login');
        return { success: false, responseData: {}}
    }
    else if(fetchRequest.status === 403) {
        // window.location.replace('/forbidden');
    }
    else if(fetchRequest.status === 200 || fetchRequest.status === 201) {
        const responseData = await fetchRequest.json();
        return { success: true, responseData }
    }
    else if(fetchRequest.status === 401 || fetchRequest.status === 404) {   //fetchRequest.status === 400 ||
        const responseData = await fetchRequest.json();
        return { success: false, responseData }
    }
    else if (fetchRequest.status === 400)
    {
        showErrorMessage('Lỗi từ phía máy chủ');
        return { success: false, }
    }
    else {
        return Promise.reject(new Error('Lỗi từ phía máy chủ'));
    }
}

export { sendRequest }