const { response } = require('express');
const hospital = require('../models/hospital');

const Hospital = require('../models/hospital');


const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
                                    .populate('usuario','nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({ 
        usuario: uid,
        ...req.body 
    });

    try {
        
        const hospitalDB = await hospital.save();
        

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    


}

const actualizarHospital = async(req, res = response) => {
    const uid = req.params.id;


    try {

        const hospitalDB = await Hospital.findById( uid );

        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }

        // Actualizaciones
        const { nombre, usuario, ...campos } = req.body;

        if ( hospitalDB.nombre !== nombre ) {

            const existeNombre = await Hospital.findOne({ nombre });
            if ( existeNombre ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un hospital con ese nombre'
                });
            }
        }
        
        campos.nombre = nombre;
        const hospitalActualizado = await Hospital.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarHospital = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const hospitalDB = await Hospital.findById( uid );

        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }

        await Hospital.findByIdAndDelete( uid );

        
        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}