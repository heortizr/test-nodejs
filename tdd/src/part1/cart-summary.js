var tax = require('./tax');

function CartSummary(items) {
    this._items = items;
}

CartSummary.prototype.getSubtotal = function() {


    if ( this._items.length ) {
        return this._items.reduce( (subtotal, item) => {
            return subtotal += (item.quantity * item.price);
        }, 0);
    }

    return 0;
};

CartSummary.prototype.getTax = function(state, done) {

    tax.calculate(this.getSubtotal(), state, (taxInfo) => {
        done(taxInfo.amount);
    });

};

module.exports = CartSummary;
