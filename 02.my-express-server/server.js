const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    // console.log(request);
    res.send("<h1> hello G ! </h1>");
})

app.get('/contact', (req, res) => {
    res.send("dsjadsjf@gmail.com");
})


app.get('/about', (req, res) => {
    res.send("I love coding");
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})