const axios = require("axios")

const API_TOKEN = process.env.MANYCHAT_API_TOKEN

const createSubscriber = async (phone, name) => {
    try {
        const response = await axios.post(
            "https://api.manychat.com/fb/subscriber/createSubscriber",
            {
                whatsapp_phone: phone,
                first_name: name,
                consent_phrase: "O usuário consentiu em receber mensagens pelo WhatsApp através do formulário."
            },
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.data.id
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error.response?.data || error.message)
        return null
    }
};

const sendMessage = async (subscriberId) => {
    try {
        if (!subscriberId) throw new Error("Subscriber ID inválido.")

        await axios.post(
            "https://api.manychat.com/fb/sending/sendFlow",
            {
                subscriber_id: subscriberId,
                flow_ns: "content20250228132143_376772"
            },
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Método não permitido." })
    }

    const { phone, name } = req.body

    if (!phone || !name) {
        return res.status(400).json({ success: false, message: "Dados inválidos." })
    }

    try {
        const subscriberId = await createSubscriber(phone, name);

        if (subscriberId) {
            await sendMessage(subscriberId)
            return res.status(200).json({ success: true, message: "Mensagem enviada com sucesso!" })
        } else {
            return res.status(500).json({ success: false, message: "Erro ao criar o usuário." })
        }
    } catch (error) {
        console.error("Erro no Webhook:", error)
        return res.status(500).json({ success: false, message: "Erro ao processar o formulário." })
    }
}
