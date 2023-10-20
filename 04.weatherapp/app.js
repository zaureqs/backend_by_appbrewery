const express = require("express");
const https = require("https");

const app = express();

app.use(express.static(__dirname+"/public"));
app.use(express.urlencoded({extended: false}));

app.set('view engine','ejs');

const port = 3000;


app.get("/", (req,res) => {
    res.render('index', {city: "City name", Temperature: "--",Humidity : "Humidity", wind_speed: "wind-speed",img_url:"img", weatherDescription: "Description"});
});




app.post("/", function(req,res){

    let city = req.body.city;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=__your_apikey__&units=metric";
    
    https.get(url, (responce) => {
        console.log(responce.statusCode);
        if(responce.statusCode >=400 && responce.statusCode < 500)
        {
            res.render('index', {city: "City name", Temperature: "--",Humidity : "Humidity", wind_speed: "wind-speed",img_url:"img", weatherDescription: "Description"});
        }
        else
        {
            responce.on('data', (data) => {
                const weatherData = JSON.parse(data);
                console.log(weatherData);
                let temp = weatherData.main.temp;
                let weatherDescription = weatherData.weather[0].description;
                let weatherIcon = weatherData.weather[0].icon;
                let humidity = weatherData.main.humidity;
                let wind_speed = weatherData.wind.speed;
                let img_url = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                console.log(humidity,wind_speed);
                res.render('index', {city: city, Temperature: temp,Humidity : humidity, wind_speed: wind_speed,img_url:img_url, weatherDescription: weatherDescription});
            });
        }
    })
});

app.listen(port, () => {
    console.log("server is started at port No. " + port);
});
