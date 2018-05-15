
const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();
const _ = require('underscore');

let Categoria = require('../models/categoria');


//Mostrar todas las categorías
app.get('/categoria', verificaToken, (req,res) => {

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err, categorias) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            categorias
        })
    });

});

//Mostrar una categoría por id
app.get('/categoria/:id', verificaToken, (req,res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            });
        }

        return res.json({
            categoria: categoriaDB
        })

    });

});

//Crear nueva categoría
app.post('/categoria', verificaToken, (req,res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//Modificar una categoría
app.put('/categoria/:id', verificaToken, (req,res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'La categoría no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
        
    });

});

//Borrar una categoría
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req,res) => {
    //Solo un administrador puede borrar categorías
    //Borrar físicamente el registro

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'La categoría no existe'
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Categoría borrada'
        });
        
    });

});

module.exports = app;