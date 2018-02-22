# eusi-sdk-browser
The library for providing a simple interface around **EUSI** for browser (client) side code.

The documentation is in progress.
Coming every moment...

## Simple usage
	import eusiBrowser from 'eusi-browser';

    // both bucketKey and bucketSercert you can find inside our eusi-app under the settings tab
    const eusi = eusiBrowser({
	    bucketKey: '46e5945b-789d-4cc2-8a40-608612425226',
	    bucketSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJidWNrZXRfaWQiOiI0NmU1OTQ1Yi03ODlkLTRjYzItOGE0MC02MDg2MTI0MjUyMjYiLCJpZCI6IjU0MjBjYjA2LTRmMGYtNDMzMy1hODJhLTc5ZmFjMzU5YTU2ZSIsInRpbWVzdGFtcCI6MTUxNjYxMDU5NDc1Mn0.Li8Sb8v1CJnANDctUQumAQo90puBtNA3ywh4MmnxP-M'
    });

	// obtaining an anonymous access token
	// (in case you are not using out membership system or
	// you want a guest access)
    eusi.getAccess().then((response) => {
        // wrap up the token so you don't need to pass it for every call
        const eusiClient = eusi(response.token);
        eusiClient.getById('44e8c09b-ed9e-4424-99e0-2de60adafa01').then(console.log);
        eusiClient.getByTaxonomyPath('news.sport.tennis').then(console.log);
    });


