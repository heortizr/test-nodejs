var chai = require('chai');
var nock = require('nock');
var tax = require('./../../src/part1/tax');
var expect = chai.expect;

describe('tax', () => {

    it('calculate() should resolve with an object containing the tax details', (done) => {

        nock('https://some-tax-service.com')
        .post('/request')
        .reply(200, (uri, requestBody) => {
            return {
                amount: requestBody.subtotal * 0.10,
            };
        });

        tax.calculate(100, 'CA', function(taxDetails) {
            expect(taxDetails).to.eql({ amount: 10 });
            done();
        });

    });

    it('calculate() should not make a request if the state is not CA', function(done) {
        nock('https://some-tax-service.com')
        .post('/request')
        .reply(200, function(uri, requestBody) {
            return {
                amount: requestBody.subtotal * 0.10
            };
        });
      
        tax.calculate(100, 'NY', function(taxDetails) {
            expect(taxDetails).to.eql({ amount: 0 });
            done();
        });
    });
});