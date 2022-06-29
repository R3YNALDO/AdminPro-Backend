const mongoose = require('mongoose');



const dbConnections = async () => {

    try{

        await mongoose.connect(process.env.DB_CNN,
        {
           // useNewUrlParser: true,
           // useUnifieldTopology: true,
           // useCreateIndex: true
        });

        console.log('DB online');

    } catch (error){
        console.log(error);
        throw new Error('Error en la conexion a la DB');
    }
   
  

}

module.exports = {
    dbConnections
}