

# eusi-sdk-browser
The JS library which abstracts low level communication with [**EUSI**](https://eusi.io) delivery API is meant to be used within web browsers (client side code).

> EUSI is an API-first CMS that is user-friendly, beautifully
designed and easy to use.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of content

- [Installation](#installation)
- [Independent bundle](#independent-bundle)
- [Simple usage](#simple-usage)
- [Configuration](#configuration)
- [Authorization/Authentication](#authorizationauthentication)
  - [login](#login)
  - [register](#register)
  - [getAccess](#getaccess)
  - [getUser](#getuser)
- [Fetching content](#fetching-content)
  - [by key](#by-key)
  - [by id](#by-id)
  - [by content model](#by-content-model)
  - [by content type](#by-content-type)
  - [by content title](#by-content-title)
  - [by content name](#by-content-name)
  - [by taxonomy id](#by-taxonomy-id)
  - [by taxonomy name](#by-taxonomy-name)
  - [by taxonomy path](#by-taxonomy-path)
  - [by field](#by-field)
  - [Pagination](#pagination)
- [Purchasing content](#purchasing-content)
	- [example](#example)
	- [parameters](#parameters)
- [Advanced querying](#advanced-querying)
  - [$like](#like)
  - [$between](#between)
  - [$in](#in)
  - [$lt](#lt)
  - [$gt](#gt)
  - [combining operators](#combining-operators)
- [Handling forms](#handling-forms)
  - [getForm](#getform)
  - [submitForm](#submitform)
  - [testSubmitForm](#testsubmitform)
- [Fetching taxonomy](#fetching-taxonomy)
  - [getTaxonomy](#gettaxonomy)
- [Wrapping up the access token](#wrapping-up-the-access-token)
- [More examples](#more-examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Installation
*NOTE: **eus-sdk-browser** package is peer dependent on **eusi-sdk-core** package
so please make sure you have installed them both !*
```sh
npm install --save eusi-sdk-core eusi-sdk-browser
```
or
```sh
yarn add eusi-sdk-core eusi-sdk-browser
```

## Independent bundle
If you are not using any bundling tools or you simply want to manually include our library on your page, we have a solution for you.
First you need to install both of our libraries **eusi-sdk-core** and **eusi-sdk-browser** through npm or yarn and then simply include them as shown below.
```html
<script src="/node_modules/eusi-sdk-core/dist/browser/eusi-sdk-core.js"></srcipt>
<script src="/node_modules/eusi-sdk-browser/dist/browser/eusi-sdk-browser.js"></srcipt>
```
or for production ready uses you can fetch minified bundle
```html
<script src="/node_modules/eusi-sdk-core/dist/browser/eusi-sdk-core.min.js"></srcipt>
<script src="/node_modules/eusi-sdk-browser/dist/browser/eusi-sdk-browser.min.js"></srcipt>
```
This will make global ***eusiBrowser*** object available to you.

## Simple usage
``` js
    import eusiBrowser from 'eusi-sdk-browser';

    // both bucketKey and bucketSecret should be obtained form inside our eusi app under the settings tab
    const eusi = eusiBrowser({
	    bucketKey: '46e5945b-789d-4cc2-8a40-608612425226',
	    bucketSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJidWNrZXRfaWQiOiI0NmU1OTQ1Yi03ODlkLTRjYzItOGE0MC02MDg2MTI0MjUyMjYiLCJpZCI6IjU0MjBjYjA2LTRmMGYtNDMzMy1hODJhLTc5ZmFjMzU5YTU2ZSIsInRpbWVzdGFtcCI6MTUxNjYxMDU5NDc1Mn0.Li8Sb8v1CJnANDctUQumAQo90puBtNA3ywh4MmnxP-M'
    });

	// obtaining an anonymous access token
	// (in case you are not using our membership system or
	// you want sguest access)
    eusi.getAccess()
	    .then((response) => eusi.getById('44e8c09b-ed9e-4424-99e0-2de60adafa01', { token: response.token }))
        .then(console.log);
```

## Configuration
You can configure *eusiBrowser* factory with the following parameters:

 - **bucketKey** (mandatory) - represents unique identificator of the bucket you are accessing
 - **bucketSecret** (mandatory) - the secret token that you are given
 - **deliveryApi** (optional) - represents a target URL of our delivery API. By default it is set to target our production ready API.

## Authorization/Authentication
We use two step authorization system.
First you need to acquire the bucket key **(aka bucket id)**  and the bucket secret. Both of these you can obtain through our application.

 1. Go to the settings section.
 2. Click on the bucket keys tab where you will be able to create a new bucket key.
 3. Choose a name and select which parts should be turned on.
 4. Click save and you will be displayed with the bucket id (aka bucket key) and the bucket secret.

Now pass both of that data to SDK factory function and you will receive a client object.

```js
   const eusi = eusiBrowser({
	    bucketKey: '46e5945b-789d-4cc2-8a40-608612425226',
	    bucketSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJidWNrZXRfaWQiOiI0NmU1OTQ1Yi03ODlkLTRjYzItOGE0MC02MDg2MTI0MjUyMjYiLCJpZCI6IjU0MjBjYjA2LTRmMGYtNDMzMy1hODJhLTc5ZmFjMzU5YTU2ZSIsInRpbWVzdGFtcCI6MTUxNjYxMDU5NDc1Mn0.Li8Sb8v1CJnANDctUQumAQo90puBtNA3ywh4MmnxP-M'
    });
```
***NOTE:  that only parts of the API which are activated you will be able to use with that newly created key.***

Next step is acquiring an access token.
There are a few ways of doing it as described below.

### login

If the user is already registered

```js
eusi.login({
  email: 'johndoe@mail.com',
  password: '123'
}).then(response => {
  const { token, member } = response;
  // now you are ready to go

  eusi.getById('060c99b0-b2db-42ca-a94d-c4873c2bda90', { token }).then(console.log);

  // or you can wrap the token up so you dont pass it every time you request something
  // for more info please refer to "Wrapping up the access token" section
  const withTokenClient = eusi(token);
  withTokenClient.getById('060c99b0-b2db-42ca-a94d-c4873c2bda90').then(console.log);
  withTokenClient.getByName('Some content title').then(console.log);
}).catch(error => {
	console.log('Login failed'};
});
```
### register

If you want to create a new user

```js
eusi.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@mail.com',
  password: '123'
}).then(response => {
  const { token, member } = response;
  // now you are ready to go

  const withTokenClient = eusi(token);
  withTokenClient.getById('060c99b0-b2db-42ca-a94d-c4873c2bda90').then(console.log);
  withTokenClient.getByName('Some content title').then(console.log);
}).catch(error => {
	console.log('Registration failed'};
});
```
**NOTE: The register method will automatically login newly created user.**

### getAccess

If you are requesting resources as a guest user

``` js
eusi.getAccess().then(response => {
	const withTokenClient = eusi(response.token);
	return withTokenClient.getByTaxonomyName('teachers');
})
.then(console.log)
.catch(error => console.log('Obtaining temporary access token failed');
```
### getUser
Retrieves info of the currently logged in user
```js
eusi.getUser({ token }).then(user => console.log(user));
```
or if you have created [*withTokenClient*](#wrapping-up-the-access-token)
```js
withTokenClient.getUser().then(user => console.log(user));
```

## Fetching content

### by key

```js
eusi.getByKey('First-blog234', { token ).then(console.log);
```
### by id

``` js
eusi.getById('44e8c09b-ed9e-4424-99e0-2de60adafa01', { token })
  .then(console.log);
```

### by content model

``` js
eusi.get({
    model: 'blog'
}, { token })
    .then(console.log);
```
or

``` js
eusi.getByModel('blog', { token })
    .then(console.log);
```

### ~~by content type~~
**WARNING: This method is deprecated. Please use [getByModel](#by-content-model) instead**.

``` js
eusi.get({
    type: 'blog'
}, { token })
    .then(console.log);
```
or

``` js
eusi.getByType('blog', { token })
    .then(console.log);
```
### by content title

``` js
eusi.get({ title: 'Aussie open - first round'}, { token })
	.then(console.log);
```
or
``` js
eusi.getByTitle('Aussie open - first round', { token })
    .then(console.log);
```


### ~~by content name~~
**WARNING: This method is deprecated. Please use [getByTitle](#by-content-title) instead.**

``` js
eusi.get({ name: 'Aussie open - first round'}, { token })
	.then(console.log);
```
or
``` js
eusi.getByName('Aussie open - first round', { token })
    .then(console.log);
```

### by taxonomy id

``` js
eusi.get({
    taxonomyId: '99e5945b-789d-4ac2-8a40-60861542777'
}).then(console.log);
```
or
``` js
eusi.getByTaxonomyId('99e5945b-789d-4ac2-8a40-60861542777')
	.then(console.log);
```

### by taxonomy name
``` js
eusi.get({
    taxonommyName: 'sport-news'
}, { token })
    .then(console.log);
```
or
``` js
eusi.getByTaxonomyName('sport-news', { token })
	.then(console.log);
```

### by taxonomy path
``` js
eusi.get({
    taxonommyPath: 'sport-news.tennis.ao' // you can find the full path of every taxonomy item under taxonomy tab inside eusi app
}, { token })
	.then(console.log);
```
or
``` js
eusi.getByTaxonomyPath('sport-news.tennis.ao')
	.then(console.log);
```

### by field
***NOTE: currently we support searching only by textual fields***
``` js
eusi.get({
    field: {
        'responsible-scientist': 'Nikola Tesla',
    }
}, { token }).then(res => {
  console.log(res);
  // prints out all the content which have field key 'responsible-scientis' with the value 'Nikola Tesla'
});
```
or
``` js
eusi.getByField({
  'responsible-scientist': 'Nikola Tesla'
}), { token }).then(res => {
  console.log(res);
  // prints out all the content which have field key 'responsible-scientis' with the value 'Nikola Tesla'
});
```
or you can search for a match by providing multiple field queries
``` js
eusi.getByField({
     'responsible-scientist': 'Nikola Tesla',
     'location': 'New York'
}, { token }).then(result => {
    console.log(result);
    // prints out all the content which have field
    // 'responsible-scientist' with the value 'Nikola Tesla' and
    // which have at the same time 'location' field with
    // the value 'New York'
});
```
### Pagination
We support pagination.
In order to control the pagination you use two optional properties as part of a second object argument: **pageSize** and **pageNumber**. This signature is same for all content related API methods.
```js
eusi.getByTitle('Some content title', {
  token,
  pageSize: 20,
  pageNumber: 1
});

eusi.get({
  title: 'Some content title',
  taxonomyName: 'some taxonomy name'
}, {
  token,
  pageSize: 10,
  pageNumber: 5
});
```
or if you have created [withTokenClient](#wrapping-up-the-access-token)
```js
withTokenClient.getByType('blog', {
  pageSize: 20,
  pageNumber: 1
});

withTokenCient.get({
  id: '82803b24-1ad5-11e8-accf-0ed5f89f718b'
}, {
  pageSize: 10,
  pageNumber: 5
});
```
## Purchasing content using crypto currencies
Our platform allows your customers to purchase any content you have set price on it by using crypto currencies.
At the moment we support payment with 6 most popular crypto currencies:

 - Bitcoin (BTC)
 - Bitcoin Cash (BCH)
 - Litecoin (LTC)
 - Dash (dash)
 - Ethereum (ETH)
 - Ripple (XRP)

### Example
```js
const contentId = '966364a6-877f-4747-9214-afd0172e4e32';
withTokenClient.purchaseContent(contentId, {
  currency: 'ETH',
  description: 'Buying my first content',
  notifyUrl: 'https://my-payment-hook-url.com'
}).then(console.log);

// the response will be formatted like this
{
    "id": "123f293c-79b1-4f62-935b-655e5a09f53d",
    "member_id": "04eca9ce-3d4d-45c1-9fd9-d86515359447",
    "content_id": "966364a6-877f-4747-9214-afd0172e4e32",
    "amount": "2.000000000000000000",
    "currency": "USD",
    "requested_currency_to_pay_with": "ETH",
    "address": "0xacd0f6319d5d22e978be085bb5dedd94ec93ff07",
    "deposit": {
        "address": "0xacd0f6319d5d22e978be085bb5dedd94ec93ff07"
    },
    "payment_url": "https://www.alfacoins.com/invoice/5b471b5c98046",
    "iframe": "https://www.alfacoins.com/iframe/5b471b5c98046",
    "status": "pending",
    "updated_at": "2018-07-12T09:11:56.670Z",
    "created_at": "2018-07-12T09:11:56.670Z"
}
```
### Parameters
- **contentId** - id of the content to purchase
- **currency** - crypto currency code which you want to pay with
- **description** - payment description which is going to be sent to your customer as part of a notification email
- **notifyUrl** - the URL which is going to be POST requested with every status change of the payment

For more details please check our official [API documentation](https://delivery.docs.eusi.io/).


## Advanced querying
Our API provides you with an easy and elegant interface to make more complex queries.
Instead of passing simple string to every method from above, you can pass a query object.
Currently we support these operators: **$like**, **$between**, **$in** , **$lg**, **$gt** and by default for multiple query object props logical AND operator is used.
**They all work the same as related SQL operators.**

### $like
Matches substrings
``` js
eusi.getByField({
     'responsible-scientist': {
        location: 'New%'
     },
}, { token }).then(result => {
    console.log(result);
    // prints out all the content which have field 'location' which value starts with 'New'
});

// You can combine queries with any number of quearible fields
eusi.get({
    title: {
        $like: 'Today%'
    },
    taxonomyPath: {
        $like: 'news.%'
    },
}).then(.../ fetches all the content which title starts with 'Today' and which has any taxnomy which is a descendant of taxonomy 'news'
```
*NOTE: When using $like operator there is no case sensitivity.*

### $between
Matches interval
``` js
eusi.getByField({
	salary: {
		$between: [100000, 150000] // the value must be an array !
   }
}, { token }).then(console.log); // prints out all the content which has a field salary between 100000 and 1500000
```
### $in
Matches any of the supplied operands
``` js
eusi.getByTitle({
  $in: ['Nikola Tesla', 'Mihajlo Pupin'] // // the value must be an array !
}, { token }).then(console.log); // prints out all the content which has title equal to either 'Nikola Tesla' or 'Mihajlo Pupin'
```
### $lt
Matches all the number values lower then specified value
``` js
eusi.get({
    field: {
        maxAge: {
            $lt: 10
        }
    }
}).then(console.log);
```
### $gt
Matches all the number values greater then specified value
``` js
esui.getByField({
    field: {
        maxAge: {
            $gt: 10
        }
    }
}).then(console.log);
```
### combining operators
You can combine any number of fields with any number of existing operators to create complex queries.

***NOTE: nesting operators is not supported***
```js
eusi.get({
  title: {
    $like: '%tennis%',
  },
  taxonomyName: 'sport-news',
  field: {
    longevity: {
        $between: [5, 10]
    },
    salary: {
        $gt: 5000
    }
  }
}, { token }).then(console.log);
```
## Handling forms

We expose an API for managing web forms.

### getForm
Requests the form metadata

```js
const formId = '169ab8e4-18aa-11e8-accf-0ed5f89f718b';
eusi.getForm(formId, { token }).then(form => console.log(form));

// or by using more friendly form key
const formKey = 'login_form';
eusi.getForm(formId, { token }).then(form => console.log(form));
```

### submitForm
Submits the form

```js
const formKey = 'login_form';
withTokenClient.submitForm(formKey, {
	userName: 'johndoe',
	password: '123';
}).then(() => {
  console.log('Submit successful');
});
```

### testSubmitForm
Submits the test data. Handy if you want to check if your form is working correctly and triggering all the hooks but you don't want to be collected as a real submit by our system. It has the same signature as *submitForm* method.

```js
const formKey = 'register_form';
withTokenClient.submitForm(formKey, {
	firstName: 'John',
	lastName: 'Smith',
	email: 'john@smith.com',
	password: 'smithy123'
}).then(() => {
  console.log('Submit successful');
});
```

## Fetching taxonomy
You can ask for a specific taxonomy and get all the info related to it including the whole tree of children items.
### getTaxonomy
```js
// you can pass either taxonomyKey or taxonomyId
const taxonomyKeyOrId = 'categories';
withTokenClient
	.getTaxonomy(taxonomyKeyOrId)
	.then(taxonomy => console.log(taxonomy);
```

## Wrapping up the access token
Instead of passing the access token every time you request something you can wrap it up and receive an object with the identical API which will automatically pass the token for you any time you make a request.
``` js
    const eusi = eusiBrowser({
	    bucketKey: '46e5945b-789d-4cc2-8a40-608612425226',
	    bucketSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJidWNrZXRfaWQiOiI0NmU1OTQ1Yi03ODlkLTRjYzItOGE0MC02MDg2MTI0MjUyMjYiLCJpZCI6IjU0MjBjYjA2LTRmMGYtNDMzMy1hODJhLTc5ZmFjMzU5YTU2ZSIsInRpbWVzdGFtcCI6MTUxNjYxMDU5NDc1Mn0.Li8Sb8v1CJnANDctUQumAQo90puBtNA3ywh4MmnxP-M'
    });
    eusi.getAccess().then(response => {
		const withTokenClient = eusi(response.toekn);
		// now whenevery you request something by using 'withTokenClient' the token will be passed automatically
		withTokenClient.get({
			title: 'I just realized I dont need to pass the token every time'
		}).then(console.log);

		withTokenClient.getByTitle({
			$like: '%token time has passed%'
		}).then(console.log);

		withTokenClient.getByTitle('This feels good').then(console.log);
	});
```
**NOTE: Only API methods which require access token are exposed on *withTokenClient* object**.

## More examples
For more examples please make sure you refer to our [samples](https://github.com/jsguru-io/eusi-sdk-browser/tree/master/samples).