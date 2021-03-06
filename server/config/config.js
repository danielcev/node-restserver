

////////////
// Puerto //
////////////

process.env.PORT = process.env.PORT || 3000;

//
//// ENTORNO
//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//
//// VENCIMIENTO DEL TOKEN
// 60 segundos
// 60 minutos
// 24 horas
// 30 días 

process.env.CADUCIDAD_TOKEN = "48h";



//
//// SEED de autenticación
//

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//
//// Base de datos
//

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;


//
//// Google Client ID
//

process.env.CLIENT_ID = process.env.CLIENT_ID || '453469128362-v3dmmcl62tosfo70k0o7grrkbfgu0j47.apps.googleusercontent.com';