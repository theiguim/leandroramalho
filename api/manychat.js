const API_TOKEN = "2489155:2716:51925ad64eb9c3bf510d3aa3beb87fe2061f7cc9"

const createSubscriber = async (phone, name) => {
    try {
        const response = await fetch("https://api.manychat.com/fb/subscriber/createSubscriber", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                whatsapp_phone: phone,
                first_name: name,
                consent_phrase: "O usuário consentiu em receber mensagens pelo WhatsApp através do formulário."
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao cadastrar usuário");
        }

        const data = await response.json();
        return data.data?.id || null;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error.message);
        return null;
    }
};

const sendMessage = async (subscriberId) => {
    try {
        if (!subscriberId) throw new Error("Subscriber ID inválido.");

        const response = await fetch("https://api.manychat.com/fb/sending/sendFlow", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subscriber_id: subscriberId,
                flow_ns: "content20250228132143_376772"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao enviar mensagem");
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error.message);
    }
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Método não permitido." });
    }

    const { phone, name } = req.body;

    if (!phone || !name) {
        return res.status(400).json({ success: false, message: "Dados inválidos." });
    }

    try {
        const subscriberId = await createSubscriber(phone, name);

        if (subscriberId) {
            await sendMessage(subscriberId);
            return res.status(200).json({ success: true, message: "Mensagem enviada com sucesso!" });
        } else {
            return res.status(500).json({ success: false, message: "Erro ao criar o usuário." });
        }
    } catch (error) {
        console.error("Erro no Webhook:", error.message);
        return res.status(500).json({ success: false, message: "Erro ao processar o formulário." });
    }
}
