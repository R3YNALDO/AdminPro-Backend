const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')


    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {

        const medicoDB = await medico.save();

        
        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarMedico = async(req, res = response) => {
    const uid = req.params.id;


    try {

        const medicoDB = await Medico.findById( uid );

        if ( !medicoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico por ese id'
            });
        }

        // Actualizaciones
        const { nombre, usuario, hospital, ...campos } = req.body;

        if ( medicoDB.nombre !== nombre ) {

            const existeNombre = await Medico.findOne({ nombre });
            if ( existeNombre ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un medico con ese nombre'
                });
            }
        }
        
        campos.nombre = nombre;
        const medicoActualizado = await Medico.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            medico: medicoActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarMedico = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const medicoDB = await Medico.findById( uid );

        if ( !medicoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico por ese id'
            });
        }

        await Medico.findByIdAndDelete( uid );

        
        res.json({
            ok: true,
            msg: 'Medico eliminado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}