// tests/part1/cart-summary-test.js
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var CartSummary = require('./../../src/part1/cart-summary');
var tax = require('./../../src/part1/tax');

describe('getTax()', () => {

    beforeEach( () => {
        sinon.stub(tax, 'calculate')
        .callsFake( (subtotal, state, done) => {
            setTimeout( () => {
                done({ amount: 30 });
            }, 0);
        });
    });
    
    afterEach( () => {
        tax.calculate.restore();
    });

    it('getTax() should execute the callback function with the tax amount', ( done ) => {
        var cartSummary = new CartSummary([{
            id: 1,
            quantity: 4,
            price: 50
          }, {
            id: 2,
            quantity: 2,
            price: 30
          }, {
            id: 3,
            quantity: 1,
            price: 40
        }]);

        cartSummary.getTax( 'NY', ( taxAmount ) => {
            expect( taxAmount ).to.equal( 30 );
            expect( tax.calculate.getCall(0).args[0] ).to.equal( 300 );
            expect( tax.calculate.getCall(0).args[1] ).to.equal( 'NY' );
            done();
        });
    });

});

describe('CartSummary', () => {

    it('getSubtotal() should return 0 if no item are passed in', () => {
        var cartSummary = new CartSummary([]);
        expect(cartSummary.getSubtotal()).to.equal(0);
    });

    it('getSubtotal() should return the sum price * quantity foal all items', () => {
        var cartSummary = new CartSummary([{
            id: 1,
            quantity: 4,
            price: 50
          }, {
            id: 2,
            quantity: 2,
            price: 30
          }, {
            id: 3,
            quantity: 1,
            price: 40
        }]);

        expect(cartSummary.getSubtotal()).to.equal(300);

    });

});
