
const {Pool} = require('pg');

const config = {
    user: 'gabyscript_usuario',
    host: 'postgresql-gabyscript.alwaysdata.net',
    database: 'gabyscript_joyeria',
    password: 'desafioLATAM123',
    port: 5432,
    allowExitOnIdle: true
}

const pool = new Pool(config);

module.exports = pool;