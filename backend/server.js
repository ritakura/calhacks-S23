const express = require('express')
const cors = require('cors')
const axios = require('axios');
let cheerio = require('cheerio');
const app = express() // an express application

const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(cors()); // adds cors middleware to express application
app.use(express.json()) // for parsing incoming requests with JSON payloads

app.post('/api', (req, res) => {
    console.log("am i getting anything?", req.body);
    const url = req.body.url;
    const prompt = req.body.prompt;

    console.log("url ==> ", url);
    console.log("prompt ==> ", prompt);

    axios.get(url)
    .then(async (response) => {
        const html = response.data;
        const text = cheerio.load(html).text();

        const full_prompt = prompt
                            + "\nAnswer this question/prompt within 50 tokens using the information given in the source below as the basis for all truth and facts.\n\n" 
                            + text;

        const resp = await openai.createCompletion(
            {
              model: "text-davinci-003",
              prompt: full_prompt,
              max_tokens: 100
            },
            {
                timeout: NaN,
            }
        );

        console.log("response ==>", resp.data.choices[0].text)

        return res.status(200).json({
            success: true,
            response:  resp.data.choices[0].text,
          });
        // res.send({response: resp.data.choices[0].text});
    })
    .catch(function(error) {
        console.log('Error:', error.message);
    });
})

app.get('/api', (req, res) => {
    res.send("hi");
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})