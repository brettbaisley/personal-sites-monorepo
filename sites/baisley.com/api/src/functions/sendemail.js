const { app } = require('@azure/functions');
const { EmailClient } = require("@azure/communication-email");

const EMAIL_SEND_MIN_TIME_SECONDS = 5;

app.http('sendemail', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        let formData = null;
        try {
            formData = await request.formData();
        } catch (err) {
            context.log("Could not parse request body as form data, using query parameters only");
            return { status: 400, body: "Invalid form data" };
        }

        const msg_name = (formData && formData.get("name")) || request.query.get("name");
        const msg_email = (formData && formData.get("email")) || request.query.get("email");
        const msg_message = (formData && formData.get("message")) || request.query.get("message");
        const honeypot = (formData && formData.get("website")) || request.query.get("website");
        const form_start = parseInt(formData && formData.get("formStart"), 10) || parseInt(request.query.get("formStart"), 10);
        const current_time = Date.now();

        if (current_time - form_start < EMAIL_SEND_MIN_TIME_SECONDS * 1000) {
            context.res = { status: 400, body: "We did not send message due to possible spam detected." };
            return context.res;
        }

        if (honeypot) {
            context.log("Honeypot field detected, ignoring request as possible spam.");
            context.res = { status: 400, body: "We did not send message due to possible spam detected." };
            return context.res
        }

        if (!msg_email || !msg_name || !msg_message) {
            context.res =  { status: 400, body: "Missing parameters" };
            return context.res;
        }        

        try {
            const emailClient = new EmailClient(process.env.AZURE_EMAIL_CONNECTION_STRING);
            const message = {
                senderAddress: process.env.AZURE_EMAIL_SENDER,
                content: {
                    subject: "Message from brettbaisley.com Contact Form",
                    plainText: `Name: ${msg_name}\nEmail: ${msg_email}\nMessage:\n${msg_message}`
                },
                recipients: {
                    to: [{ address: process.env.AZURE_EMAIL_TO }]
                }
            };

            const poller = await emailClient.beginSend(message);
            const result = await poller.pollUntilDone();

            context.res = { status: 200, body: "Your message has sent successfully." };
            return context.res;
        } catch (err) {
            context.error("Error sending email:", err);
            context.res =  { status: 500, body: "There was an issue sending message. Please try again later." };
            return context.res;
        }
    }
});
