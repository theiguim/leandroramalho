const express = require('express');
const axios = require('axios');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_TOKEN = "7369265:11246be568a69ea784591ac605b8cbe1";

// Função para formatar número no padrão E.164
const formatPhoneNumber = (phone) => {
    return `+${phone.replace(/\D/g, "")}`;
};

const createSubscriber = async (phone, name) => {
    try {
        const formattedPhone = formatPhoneNumber(phone);

        const response = await axios.post(
            "https://api.manychat.com/fb/subscriber/createSubscriber",
            { phone: formattedPhone, name },
            {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.data.id;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error.response?.data || error.message);
        return null;
    }
};

const sendMessage = async (subscriberId, message) => {
    try {
        if (!subscriberId) throw new Error("Subscriber ID inválido.");

        await axios.post(
            "https://api.manychat.com/fb/sending/sendContent",
            {
                subscriber_id: subscriberId,
                message_tag: "CONFIRMED_EVENT_UPDATE",
                content: { messages: [{ type: "text", text: message }] }
            },
            { headers: { "Authorization": `Bearer ${API_TOKEN}`, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error.response?.data || error.message);
    }
};

app.post('/webhook', async (req, res) => {
    const { phone, name } = req.body;

    try {
        const subscriberId = await createSubscriber(phone, name);

        if (subscriberId) {
            await sendMessage(subscriberId, "Testando.");
            return res.status(200).send({ success: true, message: "Mensagem enviada com sucesso!" });
        } else {
            return res.status(500).send({ success: false, message: "Erro ao criar o usuário." });
        }

    } catch (error) {
        console.error("Erro no Webhook:", error);
        res.status(500).send({ success: false, message: "Erro ao processar o formulário." });
    }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
