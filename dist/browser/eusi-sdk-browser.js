(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('eusi-sdk-core')) :
	typeof define === 'function' && define.amd ? define(['eusi-sdk-core'], factory) :
	(global.eusiBrowser = factory(global.eusiCore));
}(this, (function (eusiCore) { 'use strict';

eusiCore = eusiCore && eusiCore.hasOwnProperty('default') ? eusiCore['default'] : eusiCore;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var setHeaders = function setHeaders(headers, xhr) {
    Object.keys(headers).forEach(function (headerName) {
        xhr.setRequestHeader(headerName, headers[headerName]);
    });
};

var getResponsePayload = function getResponsePayload(xhr) {
    try {
        return JSON.parse(xhr.responseText);
    } catch (err) {
        return {
            message: err
        };
    }
};

var getEncodedParams = function getEncodedParams(params) {
    var paramNames = Object.keys(params || {});
    var encodedParams = paramNames.reduce(function (acc, paramName, index) {
        var encodedUrl = encodeURI(paramName + '=' + params[paramName]);
        var suffix = index < paramNames.length - 1 ? '&' : '';
        return '' + acc + encodedUrl + suffix;
    }, '');

    return encodedParams && '?' + encodedParams;
};

var isSuccess = function isSuccess(statusCode) {
    return statusCode >= 200 && statusCode < 300;
};

var get$1 = function get$$1(url, _ref) {
    var params = _ref.params,
        headers = _ref.headers;
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var encodedUrl = '' + url + getEncodedParams(params);
        xhr.open('GET', encodedUrl);
        setHeaders(headers, xhr);
        xhr.addEventListener('load', function () {
            if (isSuccess(xhr.status)) {
                resolve(getResponsePayload(xhr));
            } else {
                reject(getResponsePayload(xhr));
            }
        });
        xhr.send();
    });
};

var toPromise = function toPromise(method, url, params, headers) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        setHeaders(Object.assign({
            'content-type': 'application/json'
        }, headers), xhr);

        xhr.addEventListener('load', function () {
            if (isSuccess(xhr.status)) {
                resolve(getResponsePayload(xhr));
            } else {
                reject(getResponsePayload(xhr));
            }
        });

        xhr.send((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' ? JSON.stringify(params) : params);
    });
};

var post = function post(url, _ref2) {
    var body = _ref2.body,
        headers = _ref2.headers;
    return toPromise('POST', url, body, headers);
};

var put = function put(url, _ref3) {
    var body = _ref3.body,
        headers = _ref3.headers;
    return toPromise('PUT', url, body, headers);
};

var browserHttpService = {
    get: get$1,
    post: post,
    put: put
};

var index = (function (_ref) {
    var bucketKey = _ref.bucketKey,
        bucketSecret = _ref.bucketSecret,
        deliveryApi = _ref.deliveryApi;
    return eusiCore({
        deliveryApi: deliveryApi,
        HttpService: browserHttpService
    })({
        bucketKey: bucketKey,
        bucketSecret: bucketSecret
    });
});

return index;

})));
