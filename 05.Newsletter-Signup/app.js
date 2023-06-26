const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use (bodyParser.urlencoded({extended: true}));

const port = 3000;

app.get("/", (req,res) => {
    
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", (req,res) => {
    let firstName = req.body.fname;
    let lastName = req.body.lname;
    let email = req.body.email;
    
    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };
    let jsonData = JSON.stringify(data);
    console.log(jsonData);


    const url = "https://us17.api.mailchimp.com/3.0/lists/194634ec92";

    const options = {
        methord: "POST",
        auth: "authkey"
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

    res.send("thank you ");
});

app.listen(port , () => {
    console.log("server is running at port no. " + port);
})


