const connection = require("../db/connection");
const imageToBase64 = require('image-to-base64');
const sql = require('mssql');
const asignationCTRL = {};

asignationCTRL.getEmpleado = async (req, res) => {
    const resp = await (await connection()).request().query("SELECT * FROM TB_DATO_BIOMETRICO");
    (await connection()).close()
    res.json({ success: true, resp });
};

asignationCTRL.valEmpleado = async (req, res) => {
    const currentConnection = (await connection());
    const base64 = await imageToBase64(req.body.urlImg)
    const respDB = await getDatoBiometricoByValor(currentConnection, base64)
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
    if (lastDPINumber == 1 || lastDPINumber == 4 || lastDPINumber == 7)
        if (day == 'ln') return true;
    if (lastDPINumber == 2 || lastDPINumber == 5 || lastDPINumber == 8)
        if (day == 'ma') return true;
    if (lastDPINumber == 3 || lastDPINumber == 6 || lastDPINumber == 9)
        if (day == 'mi') return true;
    if (lastDPINumber == 4 || lastDPINumber == 5 || lastDPINumber == 9 || lastDPINumber == 0)
        if (day == 'ju') return true;
    if (lastDPINumber == 1 || lastDPINumber == 6 || lastDPINumber == 8 || lastDPINumber == 0)
        if (day == 'vi') return true;
    if (lastDPINumber == 2 || lastDPINumber == 3 || lastDPINumber == 7)
        if (day == 'sa') return true;
    return false;
}

module.exports = asignationCTRL;