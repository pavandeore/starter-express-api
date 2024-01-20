require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run(LANGUAGE, DATA) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Give me a "+LANGUAGE+" REST API WRAPPER code ONLY (no explanation) for this provided text \n" + DATA;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

app.use(express.json());
app.use(cors());

app.post("/text", (req, res) => {
    const { language, text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "No text provided" });
    }

    run(language, text).then((data) => {
        return res.status(200).json({ data });
    });
});


app.listen(process.env.PORT || 3000);