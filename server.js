const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-form", async (req, res) => {
    try {
        const response = await axios.post(
            "https://app.mailingboss.com/lists/67aca1cc3b9dd/subscribe",
            req.body,
            { headers: { "Content-Type": "application/json" } }
        );

        res.json({ success: true, message: "Enviado com sucesso!", data: response.data });
    } catch (err) {
        console.error("Erro ao enviar formulário:", err.message); // Para depuração
        res.status(500).json({ success: false, error: "Erro ao enviar formulário." });
    }
});

app.listen(3001, () => console.log("Server is running on port 3001"));
