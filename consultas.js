
const pool = require('./database/conection');
const format = require('pg-format')


const obtenerInventario = async ({limits = 6, order_by = "id_ASC", page = 1}) => {

    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    if (offset < 0) throw new Error ('La página no puede ser menor o igual a 0')

    const formattedQuery = format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);
    
    const {rows: inventario } = await pool.query(formattedQuery);
    return inventario;
}

const obtenerInventarioFiltrado = async ({stock_min, precio_max, precio_min, categoria, metal}) => {
    let filtros = [];

    let values = [];
    
    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor);
        const {length} = filtros;
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }

    if (stock_min) filtros.push(`stock >= ${stock_min}`);
    if (precio_max) filtros.push(`precio <= ${precio_max}`);
    if (precio_min) filtros.push(`precio >= ${precio_min}`);
    if (categoria) filtros.push (`categoria = '${categoria}'`); 
    if (metal) filtros.push (`metal = '${metal}'`); 
    
    
    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0 ) {
        filtros = filtros.join(" AND ");
        consulta += ` WHERE ${filtros}`

    }
    const { rows: inventario } = await pool.query(consulta)
    return inventario
}

const prepararHATEOAS = (inventario) => {

    const results = inventario.map((m) => {
        return {
            name: m.nombre, 
            href: `/inventario/joya/${m.id}`,
        }
    }).slice(0,4);
    const totalJoyas = inventario.length;
    const stockTotal = inventario.reduce(
        (a,b) => a + Number(b.stock), 0
    )
    const HATEOAS = {
        totalJoyas,
        stockTotal,
        results
    }
    return HATEOAS
}

const reportarConsulta = async (req, res, next) => {
    const parametros = req.params
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url}
    con los parámetros:
    `, parametros)
    next()
}

module.exports = {obtenerInventario, obtenerInventarioFiltrado, prepararHATEOAS, reportarConsulta};
