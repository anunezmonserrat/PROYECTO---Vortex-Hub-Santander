const Brevo = require('@getbrevo/brevo');

exports.handler = async (event, context) => {
    // Brevo enviará los datos en un POST cuando ocurra el evento
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método no permitido" };
    }

    const payload = JSON.parse(event.body);
    // Brevo manda el email del contacto en el webhook
    const userEmail = payload.email || payload.content.email; 
    const userName = payload.attributes?.NOMBRE || "VX";

    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new Brevo.ContactsApi();

    // Generamos el código aquí, en el servidor
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const codigoUnico = `VX-${userName.substring(0,2).toUpperCase()}-${randomNum}`;

    // Actualizamos el contacto existente con su nuevo código
    let updateContact = new Brevo.UpdateContact();
    updateContact.attributes = { "CODIGO_VORTEX": codigoUnico };

    try {
        await apiInstance.updateContact(userEmail, updateContact);
        return { statusCode: 200, body: "Código asignado con éxito" };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};
// Este código es una función de Netlify que maneja el registro de usuarios en Brevo. Asegúrate de configurar la variable de entorno BREVO_API_KEY en Netlify para que funcione correctamente.