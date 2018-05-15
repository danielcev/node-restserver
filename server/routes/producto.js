const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const _ = require('underscore');

let app = express();
let Producto = require('../models/producto');


// ===============
// Obtener todos los productos
// ===============
app.get('/productos', verificaToken, (req, res) => {
    //populate con usuario y categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .populate('usuario','nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productos) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({disponible: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            })
        });

});

// ===============
// Obtener un producto por ID
// ===============
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate con usuario y categoria

    let id = req.params.id;

    Producto.find({disponible: true, _id: id})
        .populate('usuario','nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productoDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'El producto no existe'
                    }
                });
            }
            
            res.json({
                ok: true,
                producto: productoDB
            });
    
        });

});

// ===============
// Buscar productos
// ===============
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })

})

// ===============
// Crear un nuevo producto
// ===============
app.post('/productos', verificaToken, (req, res) => {
    //Guardar el usuario
    //Guardar la categoría

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

// ===============
// Actualizar un producto
// ===============
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion']);

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
        
    });

});

// ===============
// Borrar un producto
// ===============
app.delete('/productos/:id', verificaToken, (req, res) => {
    //Disponible a false, no se borra físicamente

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, productoBorrado) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'Producto borrado mediante soft-delete'
        });
        
    });

});




module.exports = app;