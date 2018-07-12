/*eslint-disable*/
const eusi = eusiBrowser({
    deliveryApi: 'http://localhost:4301/api/v1', // this one is optional, default url will be set to target our cloud delivery API
    bucketKey: '44b8a955-c68f-4861-a45b-148ca2c63e77',
    bucketSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJidWNrZXRfaWQiOiI0NGI4YTk1NS1jNjhmLTQ4NjEtYTQ1Yi0xNDhjYTJjNjNlNzciLCJpZCI6IjFiMjAyMDYyLTI3YzYtNDRkZC1hMjQ2LTQxNTZmMzlmOGQ3MCIsInRpbWVzdGFtcCI6MTUzMDYwNDk5NTEyMH0.y71lgDsCu_1s1VX_hpRXsBnHyVWhdS6_sbI764L6e9c'
});

window.anonymous_btn.addEventListener('click', evt => {
    evt.preventDefault();
    // for anonymous user

    eusi.getAccess().then((response) => {
        const eusiClient = eusi(response.token);
        eusiClient.getById('2ebd3d28-6ea4-42c0-a922-43641e5a5753').then(console.log);
        eusiClient.getByKey('Blog-1a34').then(console.log);
        eusiClient.get({
            title: 'Europe travel'
        }).then(console.log);

        eusiClient.getByModel('Blog').then(console.log);

        eusiClient.getTaxonomy('colours').then(response => {
            console.log('Fetched taxonomy', response);
        });

        eusiClient.purchaseContent('2ebd3d28-6ea4-42c0-a922-43641e5a5753', {
            currency: 'ETH',
            description: 'Buying Europe  Travel blog'
        }).then(console.log)
            .catch(console.error);
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

            eusiClient.getByModel('blog').then(console.log);

            eusiClient.getByName('Content 1').then(console.log);

            eusiClient.getByTaxonomyPath('news.sport.tennis').then(console.log);

            eusiClient.get({
                taxonomyPath: 'news.sport.table-tennis',
                model: 'News'
            }).then(console.log);

            eusiClient.getByField({
                maxAge: {
                    $lt: 10
                },
                footerText: {
                    $like: '%some text which resides inside the web page footer section%'
                }
            }).then(console.log);

            eusiClient.purchaseContent('2ebd3d28-6ea4-42c0-a922-43641e5a5753', {
                currency: 'ETH',
                description: 'Buying Europe  Travel blog'
            });
        });
});

window.login_btn.addEventListener('click', (evt) => {
    evt.preventDefault();


    //passing token around for every endpoint call
    eusi.login(window.email.value, window.password.value).then(user => {
        eusi.getByModel('Blog', {
            token: user.token
        }).then(console.log);
        eusi.getByTitle('Visiting Serbia', {
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
        eusiClient.getById('2ebd3d28-6ea4-42c0-a922-43641e5a5753').then(console.log);

        eusiClient.submitForm('3597ba73-384c-4766-951b-cc86a31bef00', {
            email: window.email.value,
            password: window.password.value
        });

        eusiClient.get({
            title: {
                $like: '%travel%',
            },
            type: 'blog'
        }).then(console.log);
        eusiClient.get().then(console.log)

        eusiClient.purchaseContent('2ebd3d28-6ea4-42c0-a922-43641e5a5753', {
            currency: 'ETH',
            description: 'Buying Europe  Travel blog'
        })
            .then(console.log)
            .catch(console.error);
    })
        .catch(() => {
            alert('wrong user name or password');
        });
});
