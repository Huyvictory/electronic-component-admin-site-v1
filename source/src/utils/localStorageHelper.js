
export const setObjectData = (key, data) => {
    if(window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }
}

export const getObjectData = (key) => {
    if(window.localStorage) {
        const jsonData = window.localStorage.getItem(key);
        if(jsonData) {
            try {
                return JSON.parse(jsonData);
            }
            catch {
                return false;
            }
        }
        return false;
    }
    return false;
}

export const setStringData = (key, value) => {
    if(window.localStorage) {
        window.localStorage.setItem(key, value);
    }
}

export const getStringData = (key) => {
    if(window.localStorage) {
        return window.localStorage.getItem(key);
    }
    return false;
}