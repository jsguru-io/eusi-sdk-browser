/*eslint-disable*/
const eusi = eusiBrowser({
    deliveryApi: 'http://localhost:4301/api/v1', // this one is optional, default url will be set to target our cloud delivery API
    bucketKey: '46e5945b-789d-4cc2-8a40-608612425226',
    bucketSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJidWNrZXRfaWQiOiI0NmU1OTQ1Yi03ODlkLTRjYzItOGE0MC02MDg2MTI0MjUyMjYiLCJpZCI6IjU0MjBjYjA2LTRmMGYtNDMzMy1hODJhLTc5ZmFjMzU5YTU2ZSIsInRpbWVzdGFtcCI6MTUxNjYxMDU5NDc1Mn0.Li8Sb8v1CJnANDctUQumAQo90puBtNA3ywh4MmnxP-M'
});

window.anonymous_btn.addEventListener('click', evt => {
    evt.preventDefault();
    // for anonymous user

    eusi.getAccess().then((response) => {
        const eusiClient = eusi(response.token);
        eusiClient.getById('44e8c09b-ed9e-4424-99e0-2de60adafa01').then(console.log);
        eusiClient.get({
            name: 'Aussie Open 2018 - first round'
        }).then(console.log);

        eusiClient.getTaxonomy('colours').then(response => {
            console.log('Fetched taxonomy', response);
        });
    });
});

window.register_btn.addEventListener('click', evt => {
    evt.preventDefault();

    // user registration
    eusi
        .register({
            email: window.register_email.value,
            password: window.register_password.value,
            firstName: window.register_first_name.value,
            lastName: window.register_last_name.value
        })
        .then(user => {
            //saveUserToLocalStorage(user) - for FE implementations
            const eusiClient = eusi(user.token);
            console.log(user);

            eusiClient.getByType('blog').then(console.log);

            eusiClient.getByName('Content 1').then(console.log);

            eusiClient.getByTaxonomyPath('news.sport.tennis').then(console.log);

            eusiClient.get({
                taxonomyPath: 'news.sport.table-tennis',
                type: 'News'
            }).then(console.log);

            eusiClient.getByField({
                maxAge: {
                    $lt: 10
                },
                footerText: {
                    $like: '%some text which resides inside the web page footer section%'
                }
            }).then(console.log);
        });
});

window.login_btn.addEventListener('click', (evt) => {
    evt.preventDefault();


    //passing token around for every endpoint call
    eusi.login(window.email.value, window.password.value).then(user => {
        eusi.getByType('Template2', {
            token: user.token
        }).then(console.log);
        eusi.getByName('Content 1', {
            token: user.token
        }).then(console.log);
        eusi.getByField({
            code: {
                $like: '%some xml code for example%'
            }
        }, {
            token: user.token
        }).then(console.log);
    });

    // OR creating the instance once which will remember the passed token and expose the identical API
    eusi.login(window.email.value, window.password.value).then(user => {
        const eusiClient = eusi(user.token);
        eusiClient.submitForm('3597ba73-384c-4766-951b-cc86a31bef00', {
            email: window.email.value,
            password: window.password.value
        });

        eusiClient.get({
            name: {
                $like: '%travel%',
            },
            type: 'blog'
        });
    })
        .catch(() => {
        alert('wrong user name or password');
    });
});
