var express = require('express');

var Hospital = require('../models/hospital');
var User = require('../models/user');
var Doctor = require('../models/doctor');

var app = express();

app.get('/todo/:search', (req, res) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    Promise.all([
        SearchHospitals(search, regex),
        SearchDoctors(search, regex),
        searchUsers(search, regex)
    ]).then(results => {

        results.status(200).json({
            ok: true,
            hospitales: results[0],
            medicos: results[1],
            usuarios: results[2]
        });

    });


});

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'hospital':
            promesa = SearchHospitals(busqueda, regex);
            break;
        case 'usuario':
            promesa = searchUsers(busqueda, regex);
            break;
        case 'medico':
            promesa = SearchDoctors(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda son: usuarios, medico y hospitales',
                errs: { message: 'Tipo de tabla / coleccion no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});

function SearchHospitals(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find()
            .or([{ 'nombre': regex }])
            .populate('usuario', 'nombre email img')
            .exec({ nombre: regex }, (err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function SearchDoctors(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Doctor.find()
            .or([{ 'nombre': regex }])
            .populate('hospital')
            .populate('usuario', 'nombre email img')
            .exec({ nombre: regex }, (err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function searchUsers(busqueda, regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuario', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;