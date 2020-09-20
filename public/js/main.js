const endPoint = "https://fcrecogn.cognitiveservices.azure.com/face/v1.0/detect?returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
const key = "bf8f5105780a40beb335382cf250ba8f"

const internalEndPont = "https://examenparcial2.azurewebsites.net/api/biodat"

const p = document.getElementById("message")
const t = document.getElementById("title")

document.getElementById("limpiar").addEventListener("click", () => {
    document.getElementById("urlImg").value = ""
    document.getElementById("imagen").src = "./images/mask.png"
})

document.getElementById("procesar").addEventListener("click", () => {
    let urlImg = document.getElementById("urlImg").value
    document.getElementById("imagen").src = urlImg
    p.innerHTML = "Por favor, Espere"
    t.innerHTML = "Procesando Imagen"
    $("#repDialog").modal()
    $("#daySelect").css({ opacity: 0.0 });
    $("#footer").hide()
    $("#imagen").hide()
    $("#okBtn").hide()
    $("#daySelect").show()

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
            if (json.length > 0) {
                const accesorio = json[0].faceAttributes.accessories.find(accesorio => accesorio.type == "mask")
                if (accesorio) {
                    if (accesorio.confidence >= 0.8) {
                        p.innerHTML = "Se detecto mascarilla, seleccione el día actual para continuar."
                        t.innerHTML = "Casi Listo"
                        $("#daySelect").css({ opacity: 1.0 });
                        $("#okBtn").show()
                        $("#imagen").show()
                    } else {
                        p.innerHTML = "No puede pasar. No tiene mascarilla."
                        t.innerHTML = "Error"
                    }
                } else {
                    p.innerHTML = "No puede pasar. No tiene mascarilla."
                    t.innerHTML = "Error"
                }
            } else {
                p.innerHTML = "No puede pasar. No tiene mascarilla."
                t.innerHTML = "Error"
            }
            $("#footer").show()
            $("#ld").hide()
        })
})

document.getElementById("okBtn").addEventListener("click", () => {
    let urlImg = document.getElementById("urlImg").value

    fetch(internalEndPont, {
        method: 'POST',
        body: JSON.stringify({ urlImg, day: $('#daySelect').val() }),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(response => response.json())
        .then(json => {
            if (json.success) {
                p.innerHTML = "Accesso Concedido"
                t.innerHTML = "Finalizado"
                document.getElementById("imagen").src = "./images/success.png"
            } else {
                p.innerHTML = `Accesso Denegado. ${json.msg}`
                t.innerHTML = "Finalizado"
                document.getElementById("imagen").src = "./images/fail.png"
            }
            $("#ld").hide()
            $("#daySelect").hide()
            $("#daySelect").css({ opacity: 1.0 });
            $("#imagen").show()
        })
    p.innerHTML = "Por favor, Espere"
    t.innerHTML = "Validando"

    $("#ld").show()
    $("#footer").hide()
    $("#imagen").hide()
    $("#daySelect").css({ opacity: 0.0 });
})