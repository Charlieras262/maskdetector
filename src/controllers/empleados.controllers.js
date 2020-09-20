const connection = require("../db/connection")
const sql = require("mssql");
const asignationCTRL = {};

asignationCTRL.getEmpleado = async (req, res) => {
    const resp = await (await connection()).request().query("SELECT * FROM TB_DATO_BIOMETRICO");
    (await connection()).close()
    res.json({ success: true, resp });
};

asignationCTRL.valEmpleado = async (req, res) => {
    const currentConnection = (await connection());
    const respDB = await getDatoBiometricoByValor(currentConnection, req.body.base64)
    if (respDB.recordset.length > 0) {
        const datoBiometrico = respDB.recordset[0];
        const respEm = await getEmpleadoById(currentConnection, datoBiometrico.ID_EMPLEADO)
        if (respEm.recordset.length > 0) {
            if (validarDatos(req.body.day, respEm.recordset[0])) {
                res.json({ success: true });
            } else res.json({ success: false, msg: "El empledo no tiene acceso este dia." });
        } else res.json({ success: false, msg: "El empleado no existe en la base de datos." });
    } else res.json({ success: false, msg: "Los datos biometricos no existen en la base de datos." });
    currentConnection.close()
};

const getDatoBiometricoByValor = async (currentConnection, valor) => await currentConnection.request()
    .input('imagen', sql.VarChar, valor)
    .query(`SELECT * FROM TB_DATO_BIOMETRICO WHERE VALOR = @imagen`);

const getEmpleadoById = async (currentConnection, id) => await currentConnection.request()
    .input('id', sql.Int, id)
    .query(`SELECT * FROM TB_EMPLEADO WHERE ID_EMPLEADO = @id`);

const validarDatos = (day, empleado) => {
    const lastDPINumber = parseInt(empleado.DPI.toString().slice(empleado.DPI.length - 1))
    switch (lastDPINumber) {
        case 1: case 4: case 7:
            return day == 'ln'
        case 2: case 5: case 8:
            return day == 'ma'
        case 3: case 6: case 9:
            return day == 'mi'
        case 4: case 5: case 9: case 0:
            return day == 'ju'
        case 1: case 6: case 8: case 0:
            return day == 'vi'
        case 2: case 3: case 7:
            return day == 'sa'
        default:
            return false;
    }
}
module.exports = asignationCTRL;