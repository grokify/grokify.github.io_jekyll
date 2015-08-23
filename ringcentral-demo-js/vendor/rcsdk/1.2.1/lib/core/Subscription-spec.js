describe('RCSDK.core.Subscription', function() {

    Mock.registerHooks(this);

    describe('subscribe', function() {

        it('automatically renews subscription', function(done) {

            Mock.subscribeGeneric(60);

            var subscription = rcsdk.getSubscription();

            subscription.on(subscription.events.renewSuccess, function() {
                subscription.destroy(); // prevent next renewals
                done();
            });

            subscription
                .register({
                    events: ['foo', 'bar']
                })
                .then(function(ajax) {
                    expect(ajax.data.expiresIn).to.equal(60);
                })
                .catch(done);

        });

    });

    describe.skip('destroy', function() {});

    describe('notify method', function() {

        it('fires a notification event when the notify method is called and passes the message object', function(done) {

            var subscription = rcsdk.getSubscription();

            subscription.on(subscription.events.notification, function(event) {
                expect(event).to.deep.equal({foo: 'bar'});
                done();
            });

            subscription.notify({foo: 'bar'});

        });

    });

    describe('renew', function() {

        it('fails when no subscription', function(done) {

            var subscription = rcsdk.getSubscription();

            subscription
                .renew()
                .then(function() {
                    done(new Error('This should not be reached'));
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Subscription ID is required');
                    done();
                });

        });

        it('fails when no eventFilters', function(done) {

            var subscription = rcsdk.getSubscription();

            subscription.subscription = {id: 'foo'};

            subscription
                .renew()
                .then(function() {
                    done(new Error('This should not be reached'));
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Events are undefined');
                    done();
                });

        });

    });

    describe('subscribe', function() {

        it('fails when no eventFilters', function(done) {

            var subscription = rcsdk.getSubscription();

            subscription
                .subscribe()
                .then(function() {
                    done(new Error('This should not be reached'));
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Events are undefined');
                    done();
                });

        });

        it('calls the success callback and passes the subscription provided from the platform', function(done) {

            var event = 'foo';

            var subscription = rcsdk.getSubscription();

            Mock.subscribeGeneric();

            subscription
                .subscribe({
                    events: [event]
                })
                .then(function() {
                    expect(subscription.subscription.eventFilters.length).to.equal(1);
                    done();
                })
                .catch(done);

        });

        it('calls the error callback and passes the error provided from the platform', function(done) {

            rcsdk.getXhrResponse().add({
                path: '/restapi/v1.0/subscription',
                /**
                 * @param {XhrMock} transport
                 * @returns {Object}
                 */
                response: function(transport) {

                    transport.setStatus(400);

                    return {
                        'message': 'Subscription failed'
                    };

                }
            });

            var subscription = rcsdk.getSubscription();

            subscription
                .subscribe({
                    events: ['foo']
                })
                .then(function() {
                    done(new Error('This should never be reached'));
                })
                .catch(function(e) {

                    expect(e.message).to.equal('Subscription failed');
                    expect(e).to.be.an.instanceOf(Error);
                    done();

                });

        });

    });

    describe('notify method', function() {

        it('decrypts AES-encrypted messages when the subscription has an encryption key', function() {

            var subscription = rcsdk.getSubscription(),
                spy = chai.spy(function(event) {

                    expect(event).to.deep.equal({
                        "timestamp": "2014-03-12T20:47:54.712+0000",
                        "body": {
                            "extensionId": 402853446008,
                            "telephonyStatus": "OnHold"
                        },
                        "event": "/restapi/v1.0/account/~/extension/402853446008/presence",
                        "uuid": "db01e7de-5f3c-4ee5-ab72-f8bd3b77e308"
                    });

                }),
                aesMessage = 'gkw8EU4G1SDVa2/hrlv6+0ViIxB7N1i1z5MU/Hu2xkIKzH6yQzhr3vIc27IAN558kTOkacqE5DkLpRdnN1orwtIBsUHmPMkMWTOLDzVr6eRk+2Gcj2Wft7ZKrCD+FCXlKYIoa98tUD2xvoYnRwxiE2QaNywl8UtjaqpTk1+WDImBrt6uabB1WICY/qE0It3DqQ6vdUWISoTfjb+vT5h9kfZxWYUP4ykN2UtUW1biqCjj1Rb6GWGnTx6jPqF77ud0XgV1rk/Q6heSFZWV/GP23/iytDPK1HGJoJqXPx7ErQU=';

            subscription.subscription = {deliveryMode: {encryptionKey: 'e0bMTqmumPfFUbwzppkSbA==', subscriberKey: 'foo', address: 'foo'}};

            subscription
                .on(subscription.events.notification, spy)
                .subscribeAtPubnub() // Manually subscribe
                .notify(aesMessage); // Directly call notify method

            // Simulate socket message
            subscription.pubnub.receiveMessage(aesMessage);

            expect(spy).to.be.called.twice();

        });

    });

    describe('destroy', function() {

        it('unsubscribes', function(done) {

            var subscription = rcsdk.getSubscription(),
                destroySpy = chai.spy(function() {});

            Mock.subscribeGeneric();

            subscription
                .subscribe({
                    events: ['foo']
                })
                .then(function() {

                    expect(subscription.subscription).not.to.equal(null);

                    subscription.pubnub.unsubscribe = destroySpy;

                    subscription.destroy();

                    expect(destroySpy).to.be.called.once();

                    done();

                }).catch(done);

        });

    });

});
