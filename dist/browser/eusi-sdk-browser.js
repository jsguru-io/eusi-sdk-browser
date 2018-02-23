(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.eusiBrowser = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var checkForArray = function checkForArray(operatorName, operatorValue) {
    if (!Array.isArray(operatorValue)) {
        throw new Error('value of ' + operatorName + ' operator must be of Array type');
    }
};

var parseOperatorName = function parseOperatorName(key, operatorName) {
    return key + '[' + operatorName + ']';
};

var parseOperatorValue = function parseOperatorValue(name, operatorName, operatorValue) {
    switch (operatorName) {
        case '$between':
        case '$in':
            {
                checkForArray(operatorName, operatorValue);
                return defineProperty({}, name + '[' + operatorName + ']', operatorValue.join(','));
            }

        default:
            {
                return defineProperty({}, parseOperatorName(name, operatorName), operatorValue);
            }
    }
};

var getElementFilterFromQueryObject = function getElementFilterFromQueryObject(name, query) {
    return Object.keys(query).reduce(function (acc, operatorName) {
        return Object.assign({}, acc, parseOperatorValue(name, operatorName, query[operatorName]));
    }, {});
};

var getFilter = function getFilter(name) {
    return function (value) {
        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' ? defineProperty({}, name, value) : getElementFilterFromQueryObject(name, value);
    };
};

var singleFilterParser = {
    type: getFilter('sys.type'),
    key: getFilter('sys.key'),
    name: getFilter('sys.name'),
    taxonomyName: getFilter('sys.taxonomy.name'),
    taxonomyId: getFilter('sys.taxonomy'),
    taxonomyPath: getFilter('sys.taxonomy.path'),
    field: function field() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return Object.keys(value).reduce(function (acc, elementName) {
            var elementValue = value[elementName];
            var filterName = 'elem.' + elementName;

            var filter = getFilter(filterName)(elementValue);
            return Object.assign({}, acc, filter);
        }, {});
    }
};

var parseFilter = (function (filter) {
    return Object.keys(filter).filter(function (filterName) {
        return !!filter[filterName];
    }).reduce(function (acc, filterName) {
        var filterValue = filter[filterName];
        var parser = singleFilterParser[filterName];
        return Object.assign({}, acc, parser(filterValue));
    }, {});
});

var checkAccessToken = function checkAccessToken(accessToken) {
    if (!accessToken) {
        throw new Error("access token missing! Maybe you forgot to login or register or \n        for anonymous usage you have to obtain the token by calling getAccess method on eusi client object");
    }
};

var getCommonHeaders = function getCommonHeaders(token) {
    return {
        Authorization: "Bearer " + token
    };
};

var Content = (function (_ref) {
    var bucketKey = _ref.bucketKey,
        httpService = _ref.httpService,
        baseUrl = _ref.baseUrl;

    var get = function get(query) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref2$pageSize = _ref2.pageSize,
            pageSize = _ref2$pageSize === undefined ? 20 : _ref2$pageSize,
            _ref2$pageNumber = _ref2.pageNumber,
            pageNumber = _ref2$pageNumber === undefined ? 1 : _ref2$pageNumber,
            token = _ref2.token;

        var key = query.key,
            name = query.name,
            taxonomyId = query.taxonomyId,
            taxonomyName = query.taxonomyName,
            taxonomyPath = query.taxonomyPath,
            type = query.type,
            field = query.field;

        checkAccessToken(token);
        var params = parseFilter({
            key: key,
            name: name,
            taxonomyId: taxonomyId,
            taxonomyName: taxonomyName,
            taxonomyPath: taxonomyPath,
            type: type,
            field: field
        });

        return httpService.get(baseUrl + '/' + bucketKey + '/items', {
            params: Object.assign({}, params, {
                number: pageSize,
                page: pageNumber
            }),
            headers: getCommonHeaders(token)
        });
    };

    var getOne = function getOne(keyOrId, _ref3) {
        var token = _ref3.token;

        checkAccessToken(token);
        return httpService.get(baseUrl + '/' + bucketKey + '/items/' + keyOrId, {
            headers: getCommonHeaders(token)
        });
    };

    var getByName = function getByName(contentName, options) {
        return get({
            name: contentName
        }, options);
    };

    var getByType = function getByType(contentType, options) {
        return get({
            type: contentType
        }, options);
    };

    var getByTaxonomyName = function getByTaxonomyName(taxonomyName, options) {
        return get({
            taxonomyName: taxonomyName
        }, options);
    };

    var getByTaxonomyPath = function getByTaxonomyPath(taxonomyPath, options) {
        return get({
            taxonomyPath: taxonomyPath
        }, options);
    };

    var getByTaxonomyId = function getByTaxonomyId(taxonomyId, options) {
        return get({
            taxonomyId: taxonomyId
        }, options);
    };

    var getByField = function getByField(fieldQuery, options) {
        return get({
            field: fieldQuery
        }, options);
    };

    return {
        get: get,
        getByTaxonomyPath: getByTaxonomyPath,
        getByType: getByType,
        getById: getOne,
        getByTaxonomyId: getByTaxonomyId,
        getByTaxonomyName: getByTaxonomyName,
        getByName: getByName,
        getByField: getByField
    };
});

var getTokenLinkedAPI = function getTokenLinkedAPI(authAPI, token) {
    return {
        // there is only one method from AUTH API which requires token
        getUser: function getUser() {
            return authAPI.getUser({ token: token });
        }
    };
};

var Auth = (function (_ref) {
    var bucketKey = _ref.bucketKey,
        bucketSecret = _ref.bucketSecret,
        httpService = _ref.httpService,
        baseUrl = _ref.baseUrl;

    var getAccess = function getAccess() {
        return httpService.post(baseUrl + '/' + bucketKey + '/authorize', {
            body: {
                secret: bucketSecret
            }
        });
    };

    var execute = function execute(url, body) {
        return getAccess().then(function (response) {
            var headers = getCommonHeaders(response.token);
            return httpService.post(url, {
                headers: headers,
                body: body
            });
        });
    };

    var login = function login(email, password) {
        return execute(baseUrl + '/' + bucketKey + '/login', {
            email: email, password: password
        });
    };

    var register = function register(_ref2) {
        var email = _ref2.email,
            password = _ref2.password,
            firstName = _ref2.firstName,
            lastName = _ref2.lastName;
        return execute(baseUrl + '/' + bucketKey + '/register', {
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName
        });
    };

    var getUser = function getUser(_ref3) {
        var token = _ref3.token;
        return httpService.get(baseUrl + '/' + bucketKey + '/me', {
            headers: getCommonHeaders(token)
        });
    };

    return {
        getAccess: getAccess,
        login: login,
        register: register,
        getUser: getUser
    };
});

var toUrlEncodedForm = function toUrlEncodedForm(formPayload) {
    var form = Object.keys(formPayload).map(function (propName) {
        return propName + '=' + formPayload[propName];
    }).reduce(function (acc, queryParam) {
        return acc ? acc + '&' + queryParam : queryParam;
    }, '');
    return encodeURI(form);
};

var getHeaders = function getHeaders(accessToken) {
    var includeContentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    checkAccessToken(accessToken);
    var contentType = includeContentType ? {
        'content-type': 'application/x-www-form-urlencoded'
    } : {};
    return Object.assign({}, getCommonHeaders(accessToken), contentType);
};

var getTokenLinkedAPI$1 = function getTokenLinkedAPI(formsAPI, token) {
    return {
        getForm: function getForm(formKey) {
            return formsAPI.getForm(formKey, {
                token: token
            });
        },
        submitForm: function submitForm(formKey, formData) {
            return formsAPI.submitForm(formKey, formData, {
                token: token
            });
        },
        testSubmitForm: function testSubmitForm(formKey, formData) {
            return formsAPI.testSubmitForm(formKey, formData, {
                token: token
            });
        }
    };
};

var Forms = (function (_ref) {
    var httpService = _ref.httpService,
        bucketKey = _ref.bucketKey,
        baseUrl = _ref.baseUrl;

    var getForm = function getForm(formKey, _ref2) {
        var token = _ref2.token;
        return httpService.get(baseUrl + '/' + bucketKey + '/forms/' + formKey, {
            headers: getHeaders(token, false)
        });
    };

    var submitForm = function submitForm(formKey, form, _ref3) {
        var token = _ref3.token;
        return httpService.post(baseUrl + '/' + bucketKey + '/forms/' + formKey, {
            body: toUrlEncodedForm(form),
            headers: getHeaders(token)
        });
    };

    var testSubmitForm = function testSubmitForm(formKey, form, _ref4) {
        var token = _ref4.token;
        return httpService.post(baseUrl + '/' + bucketKey + '/forms/' + formKey + '/test', {
            body: toUrlEncodedForm(form),
            headers: getHeaders(token)
        });
    };

    return {
        getForm: getForm,
        submitForm: submitForm,
        testSubmitForm: testSubmitForm
    };
});

var config = {
    deliveryApi: 'https://delivery.stg.eusi.cloud/api/v1'
};

var Taxonomy = (function (_ref) {
    var bucketKey = _ref.bucketKey,
        baseUrl = _ref.baseUrl,
        httpService = _ref.httpService;
    return {
        getTaxonomy: function getTaxonomy(taxonomyId, _ref2) {
            var token = _ref2.token;

            return httpService.get(baseUrl + '/' + bucketKey + '/taxonomy/' + taxonomyId, {
                headers: getCommonHeaders(token)
            });
        }
    };
});

var checkForAccessData = function checkForAccessData(key, secret) {
    var errorMessage = function errorMessage(paramName) {
        return paramName + ' data is missing. You can find it under settings section on EUSI web app';
    };

    if (!key) {
        throw new Error(errorMessage('bucketKey'));
    }

    if (!secret) {
        throw new Error(errorMessage('bucketSecret'));
    }
};

var Client = (function (_ref) {
    var HttpService = _ref.HttpService,
        deliveryApi = _ref.deliveryApi;
    return function () {
        var bucketAccessData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var bucketKey = bucketAccessData.bucketKey,
            bucketSecret = bucketAccessData.bucketSecret;

        checkForAccessData(bucketKey, bucketSecret);
        var options = {
            bucketKey: bucketKey,
            bucketSecret: bucketSecret,
            httpService: HttpService,
            baseUrl: deliveryApi || config.deliveryApi
        };

        var contentFilteringAPI = Content(options);
        var authAPI = Auth(options);
        var formsAPI = Forms(options);
        var taxonomyAPI = Taxonomy(options);

        // creating a helper object which will encapsulate the access token which is then passed to every calling function
        var createLinkBasedOnToken = function createLinkBasedOnToken(token) {
            var accessTokenAPI = Object.assign({}, contentFilteringAPI, taxonomyAPI);
            var baseAPI = Object.keys(accessTokenAPI).reduce(function (acc, functionName) {
                return Object.assign({}, acc, defineProperty({}, functionName, function () {
                    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        rest[_key - 1] = arguments[_key];
                    }

                    var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    return accessTokenAPI[functionName](query, Object.assign.apply(Object, [{}, {
                        token: token
                    }].concat(rest)));
                }));
            }, {});

            return Object.assign({}, baseAPI, getTokenLinkedAPI$1(formsAPI, token), getTokenLinkedAPI(authAPI, token));
        };

        return Object.assign(createLinkBasedOnToken, authAPI, formsAPI, contentFilteringAPI, taxonomyAPI);
    };
});

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
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

        xhr.send((typeof params === 'undefined' ? 'undefined' : _typeof$1(params)) === 'object' ? JSON.stringify(params) : params);
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
    return Client({
        deliveryApi: deliveryApi,
        HttpService: browserHttpService
    })({
        bucketKey: bucketKey,
        bucketSecret: bucketSecret
    });
});

return index;

})));
