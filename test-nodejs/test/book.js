// during the test the env variable is ser to test
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Book = require('./../app/models/book');

// require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./../server');
let should = chai.should();

chai.use(chaiHttp);

// parents blocks
describe('Books', () => {

    // before each test we empty the db
    beforeEach( (done) => {
        Book.remove({}, (err) => {
            done();
        });
    });

    // Test GET /book
    describe('GET /book', () => {

        it('it should GET all the books', (done) => {
            chai.request(server)
                .get('/book')
                .end( (err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    // Test POST /book
    describe('POST /book', () => {

        it('it should not POST a book without pages field', (done) => {

            let book = {
                title: 'Lord of the rings',
                author: 'J.R.R. Tolkien',
                year: 1954
            };

			chai.request(server)
            .post('/book')
		    .send(book)
		    .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
                done();
		    });
        });

        it('it should POST a book', (done) => {
            
            let book = {
                title: 'Lord of the rings',
                author: 'J.R.R. Tolkien',
                year: 1954,
                pages: 1170
            };

            chai.request(server)
            .post('/book')
            .send(book)
            .end( (err, res) => {
                res.should.be.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book successfully added!');
                res.body.book.should.have.property('title');
                res.body.book.should.have.property('author');
                res.body.book.should.have.property('pages');
                res.body.book.should.have.property('year');
                done();
            });
        });
    });

    // Test GET /book/:id
    describe('GET /book/:id', () => {

        it('it should GET a book by the given id', (done) => {

            let book = new Book({ 
                title: "The Lord of the Rings", 
                author: "J.R.R. Tolkien", 
                year: 1954, 
                pages: 1170 
            });

            book.save((err, book) => {
                chai.request(server)
                .put(`/book/${book._id}`)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.book.should.have.property('title');
                    res.body.book.should.have.property('author');
                    res.body.book.should.have.property('pages');
                    res.body.book.should.have.property('year');
                    res.body.book.should.have.property('_id').eql(book.id);
                    done();
                });
            });
        });
    });

    // test PUT /book/:id
    describe('PUT /book/:id', () => {
        
        it('it should UPDATE a book given the a id', (done) => {
            
            let book = new Book({
                title: "The Chronicles of Narnia", 
                author: "C.S. Lewis", 
                year: 1948, 
                pages: 778
            });

            book.save((err, book) => {
                chai.request(server)
                .put(`/book/${book._id}`)
                .send({
                    title: "The Chronicles of Narnia", 
                    author: "C.S. Lewis", 
                    year: 1950, 
                    pages: 778
                }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.be.a('object');
                    res.body.should.have.property('message').eql('Book successfully updated!');
                    res.body.book.should.have.property('year').eql(1950);
                    done();
                });
            });
        });
    });

    // test DELETE /book/:id
    describe('DELETE /book/:id', () => {
        
        it('it shoul DELETE a book given the id', (done) => {
            let book = new Book({
                title: "The Chronicles of Narnia", 
                author: "C.S. Lewis", 
                year: 1948, 
                pages: 778
            });

            book.save((err, book) => {
                chai.request(server)
                .delete(`/book/${book._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                    done();
                });
            });
        });
    });

});