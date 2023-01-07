import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({
        message: "hello form the otherside"
    });
});

app.post("/", async (req, res) => {
    try {
        const chat = req.body.chat;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${chat}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({ error })
    }
});

app.listen(5000, () => { console.log("Server is runniing at http://localhost:5000") })