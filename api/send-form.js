const axios = require("axios");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const response = await axios.post(
            "https://app.mailingboss.com/lists/67aca1cc3b9dd/subscribe",
            req.body,
            { headers: { "Content-Type": "application/json" } }
        );

        res.json({ success: true, message: "Enviado com sucesso!", data: response.data });
    } catch (err) {
        console.error("Erro ao enviar formulário:", err.message);
        res.status(500).json({ success: false, error: "Erro ao enviar formulário." });
    }
};
