/* global describe, it, expect, before */
/* jshint expr: true */

var IonisxStrategy  = require('../lib/strategy');
var fs              = require('fs');


// ## //

describe('strategy', function () {
    before(function () {
        this.strategy = new IonisxStrategy({
            clientID: 'ABC123',
            clientSecret: 'secret'
        }, function () {});
    });

    it('should be named ionisx', function () {
        expect(this.strategy.name).to.equal('ionisx');
    });

    it('should have default user agent', function () {
        expect(this.strategy._oauth2._customHeaders['User-Agent']).to.equal('passport-ionisx');
    });


    describe('constructed with user agent option', function () {
        before(function () {
            this.strategy = new IonisxStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret',
                userAgent: 'cool-ionisx-agent'
            }, function () {});
        });

        it('should have default user agent', function () {
            expect(this.strategy._oauth2._customHeaders['User-Agent']).to.equal('cool-ionisx-agent');
        });
    });

    describe('constructed with custom headers including user agent', function () {
        before(function () {
            this.strategy = new IonisxStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret',
                customHeaders: {
                    'User-Agent': 'cool-ionisx-agent'
                }
            }, function () {});
        });

        it('should have default user agent', function () {
            expect(this.strategy._oauth2._customHeaders['User-Agent']).to.equal('cool-ionisx-agent');
        });
    });

    describe('constructed with both custom headers including user agent and user agent option', function () {
        before(function () {
            this.strategy = new IonisxStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret',
                userAgent: 'cool-ionisx-agent',
                customHeaders: {
                    'User-Agent': 'even-better-ionisx-agent'
                }
            }, function () {});
        });

        it('should have default user agent', function () {
            expect(this.strategy._oauth2._customHeaders['User-Agent']).to.equal('even-better-ionisx-agent');
        });
    });

    describe('load profile', function () {
        before(function () {
            this.strategy = new IonisxStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret'
            }, function () {});

            this.strategy._oauth2.get = function (url, accessToken, callback) {
                var body = fs.readFileSync('test/data/example.json', 'utf8');
                callback(null, body, undefined);
            };
        });

        it('should parse the profile', function (done) {
            var self = this;

            this.strategy.userProfile('token', function (err, profile) {
                if (err) {
                    done(err);
                }
                else {
                    expect(profile).to.be.ok;
                    expect(profile.provider).to.equal('ionisx');

                    self.profile = profile;

                    done();
                }
            });
        });

        it('should have set the _raw property', function () {
            expect(this.profile._raw).to.be.a('string');
        });

        it('should have set the _json property', function () {
            expect(this.profile._json).to.be.an('object');
        });
    });
});
