const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req,res){
    res.send(" your ans is :" + (parseInt(req.body.num1)+parseInt(req.body.num2)));
});


app.get('/bmi', (req, res) => {
  res.sendFile(__dirname+"/bmi.html");
});


app.post("/bmi", function(req,res){
  let h = parseInt(req.body.height);
  let w = parseInt(req.body.weight);
  let bmi = w*10000/(h*h);
  res.send(" your bmi is :" + bmi);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
