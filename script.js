const APIKEY = "9f8e2ddc39e01c6d64b9c8ffd7d3c589";
const APIURL = "http://api.openweathermap.org/data/2.5/weather?";
const LOCATIONURL = "http://api.openweathermap.org/geo/1.0/direct?"
const ICONURL = "http://openweathermap.org/img/wn/";
const KELVICELSIUS = 273.15;

let latitude;
let longitude;
let searchLocation;

let myWeather = {};
let searchLocationData = [];

function getUserLocation(){
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude =  position.coords.longitude;
        });
    }
}

function getLocationWeather(){
    axios.get(`${APIURL}lat=${latitude}&lon=${longitude}&appid=${APIKEY}`)
        .then(response => {
            myWeather = response.data;
        })
        .catch(err => console.log(err));
}

function getLocationPosition(callback) {
    searchLocation = document.querySelector("header input").value;
    if(searchLocation != ""){
        axios.get(`${LOCATIONURL}q=${searchLocation}&limit=1&appid=${APIKEY}`)
        .then(response => {
            searchLocationData = response.data;
            latitude = searchLocationData[0].lat;
            longitude = searchLocationData[0].lon;
            callback();
        })
        .catch(err => console.log(err));
    }
    else{
        alert("Insira um local válido");
    }
    
}

function displayWeatherInfo(){
    document.querySelector(".weather").innerHTML = `
    <img src="${ICONURL}${myWeather.weather[0].icon}@4x.png">
    <p>${myWeather.weather[0].description.toUpperCase()}</p>
    `
    document.querySelector(".data").innerHTML = `
    <p>Temperatura</p>
    <p>${myWeather.main.temp} ºC</p>
    <p>Pressão</p>
    <p>${myWeather.main.pressure} hPa</p>
    <p>Humidade</p>
    <p>${myWeather.main.humidity} %</p>
    `
}

document.querySelector("header input").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) getLocationPosition(()=>{getLocationWeather()});
});

function renderWindow(){
    document.querySelector(".loading").classList.add("hide");
    if(latitude != undefined && longitude != undefined) getLocationWeather(displayWeatherInfo);
}



// initialization

getUserLocation();
setTimeout(renderWindow, 2000);
setInterval(displayWeatherInfo, 1000);


