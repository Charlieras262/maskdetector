const endPoint = "https://fcrecogn.cognitiveservices.azure.com/face/v1.0/detect?returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
const key = "bf8f5105780a40beb335382cf250ba8f"

document.getElementById("limpiar").addEventListener("click", () => {
    document.getElementById("urlImg").value = ""
    document.getElementById("imagen").src = "public/images/mask.png"
})

document.getElementById("procesar").addEventListener("click", () => {
    let urlImg = document.getElementById("urlImg").value
    document.getElementById("imagen").src = urlImg
    fetch(endPoint, {
        method: 'POST',
        body: JSON.stringify({
            url: urlImg
        }),
        headers: {
            "Content-type": "application/json",
            "Ocp-Apim-Subscription-Key": key
        }
    })
        .then(response => response.json())
        .then(json => {
            const p = document.getElementById("message")
            if (json.length > 0) {
                const accesorio = json[0].faceAttributes.accessories.find(accesorio => accesorio.type == "mask")
                if (accesorio) {
                    if (accesorio.confidence >= 0.8) {
                        p.innerHTML = "Puede pasar. Si tiene mascarilla."
                    } else p.innerHTML = "No puede pasar. No tiene mascarilla."
                } else p.innerHTML = "No puede pasar. No tiene mascarilla."
            } else p.innerHTML = "No se pudo detectar un rostro humano."
            $("#repDialog").modal()
        })
})

const conectar = () => {
    var connection = new ActiveXObject("ADODB.Connection");

    var connectionstring = "Data Source=DESKTOP-IDLATM5\\SQLEXPRESS;Initial Catalog=SQLServer Database;User ID=sqlserver_admin;Password=120399;Provider=SQLOLEDB";

    connection.Open(connectionstring);
    var rs = new ActiveXObject("ADODB.Recordset");

    rs.Open("SELECT * FROM table", connection);
    rs.MoveFirst
    while (!rs.eof) {
        console.log(rs.fields(1))
        rs.movenext;
    }

    rs.close;
    connection.close;
}