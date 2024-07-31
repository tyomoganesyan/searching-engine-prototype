const express = require('express');
const app = express();
const body_parser = require('body-parser');
require('dotenv').config();
const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
client.connect();
app.use(body_parser.json());

app.get('/search', async (req, res) => {
    const db = client.db('engine');
    const page = db.collection('pages');
    const q = req.query.q;
    if(!q) {
        return res.status(400).json({message:'Bad request'});
    }
    const pages = await page.find({terms:q}).toArray();
    res.status(200).json({ pages });
})

app.post('/crawl', async (req, res) => {
    const { title, content } = req.body;
    const db = client.db('engine');
    const page = db.collection('pages');

    if (!title && !content) {
        return res.status(400).json({ messsage: 'bad request' });
    }
    const terms = mySplit(content);
    const insertedData = await page.insertOne({ title, terms });
    res.status(200).json({ message: 'data inserted successfully', data: { insertedId: insertedData.insertedId, terms } });

})

app.listen(PORT, () => {
    console.log('Server is listening to http://localhost:' + PORT);
})


function mySplit(str) {
    if (!str) {
        return [];
    }
    return str.split(" ");
}