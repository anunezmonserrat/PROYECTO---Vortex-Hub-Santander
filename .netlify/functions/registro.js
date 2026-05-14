const Brevo = require('@getbrevo/brevo');

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método no permitido" };
    }

    const { email, nombre } = JSON.parse(event.body);

    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    
    // Aquí es donde Netlify buscará la llave de forma segura
    apiKey.apiKey = process.env.BREVO_API_KEY; 

    let apiInstance = new Brevo.ContactsApi();

    // Generador de código Vortex
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const codigoUnico = `VX-${nombre.substring(0,2).toUpperCase()}-${randomNum}`;

    let createContact = new Brevo.CreateContact();
    createContact.email = email;
    createContact.attributes = {
        "NOMBRE": nombre,
        "CODIGO_VORTEX": codigoUnico
    };
    createContact.listIds = [5]; // Actualizado a tu lista ID 5
    createContact.updateEnabled = true;

    try {
        await apiInstance.createContact(createContact);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Éxito", codigo: codigoUnico })
        };
    } catch (error) {
        // Si el error es porque el usuario ya existe, Brevo devuelve un 400
        // pero con updateEnabled: true debería funcionar.
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
// Este código es una función de Netlify que maneja el registro de usuarios en Brevo. Asegúrate de configurar la variable de entorno BREVO_API_KEY en Netlify para que funcione correctamente.