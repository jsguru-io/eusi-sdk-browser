import eusiCore from 'eusi-sdk-core';
import browserHttpService from './httpService';

export default ({ bucketKey, bucketSecret, deliveryApi }) => eusiCore({
    deliveryApi,
    HttpService: browserHttpService
})({
    bucketKey,
    bucketSecret
});
