const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Setup done')
})

app.post('/', (req, res) => {
    const info = req.body;
    console.log(info);
})

app.listen(port, () => {
    console.log('listening to port', port);
})