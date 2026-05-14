const Brevo = require('@getbrevo/brevo');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405 };

    const payload = JSON.parse(event.body);
    
    // Accedemos a los datos según el formato de Brevo Webhook
    const email = payload.contact?.email || payload.email;
    const nombre = payload.contact?.attributes?.NOMBRE || "VORTEX";

    // Configuración API
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.ContactsApi();

    // Generar código único
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const codigoUnico = `VX-${nombre.substring(0,2).toUpperCase()}-${randomNum}`;

    try {
        let updateContact = new Brevo.UpdateContact();
        updateContact.attributes = { "CODIGO_VORTEX": codigoUnico };
        
        await apiInstance.updateContact(email, updateContact);
        return { statusCode: 200, body: "OK" };
    } catch (error) {
        return { statusCode: 500, body: "Error actualizando contacto" };
    }
};