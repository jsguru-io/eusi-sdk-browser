const setHeaders = (headers, xhr) => {
    Object.keys(headers).forEach((headerName) => {
        xhr.setRequestHeader(headerName, headers[headerName]);
    });
};

const getResponsePayload = (xhr) => {
    try {
        return JSON.parse(xhr.responseText);
    } catch (err) {
        return {
            message: err
        };
    }
};

const getEncodedParams = (params) => {
    const paramNames = Object.keys(params || {});
    const encodedParams = paramNames.reduce((acc, paramName, index) => {
        const encodedUrl = encodeURI(`${paramName}=${params[paramName]}`);
        const suffix = (index < (paramNames.length - 1)) ? '&' : '';
        return `${acc}${encodedUrl}${suffix}`;
    }, '');

    return encodedParams && `?${encodedParams}`;
};

const isSuccess = statusCode => statusCode >= 200 && statusCode < 300;

const get = (url, {
    params,
    headers
}) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const encodedUrl = `${url}${getEncodedParams(params)}`;
    xhr.open('GET', encodedUrl);
    setHeaders(headers, xhr);
    xhr.addEventListener('load', () => {
        if (isSuccess(xhr.status)) {
            resolve(getResponsePayload(xhr));
        } else {
            reject(getResponsePayload(xhr));
        }
    });
    xhr.send();
});

const toPromise = (method, url, params, headers) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    setHeaders(Object.assign({
        'content-type': 'application/json'
    }, headers), xhr);

    xhr.addEventListener('load', () => {
        if (isSuccess(xhr.status)) {
            resolve(getResponsePayload(xhr));
        } else {
            reject(getResponsePayload(xhr));
        }
    });

    xhr.send(typeof params === 'object' ? JSON.stringify(params) : params);
});


const post = (url, {
    body,
    headers
}) => toPromise('POST', url, body, headers);

export const put = (url, {
    body,
    headers
}) => toPromise('PUT', url, body, headers);

export default {
    get,
    post,
    put
};
