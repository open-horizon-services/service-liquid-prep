"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

// path of web socket
const url = "http://192.168.4.222/moisture.json";
const settings = { method: "Get" };
var moisture_array = [];



fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        moisture_array.push(json);
        console.log(moisture_array);
    }); 
  
 

Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const liquid_prep_lib_1 = require("liquid-prep-lib");
const express_1 = __importDefault(require("express"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.apiUrl = `${process.env.SERVERLESS_ENDPOINT}`;
        this.initialise();
    }
    initialise() {
        let app = this.app;
        app.use((0, cors_1.default)({
            origin: '*'
        }));
        app.use((0, express_fileupload_1.default)());
        app.use('/static', express_1.default.static('public'));
        app.use('/', express_1.default.static('dist/liquid-prep-app'));
        app.get('/', (req, res, next) => {
            res.sendFile(path_1.default.resolve(__dirname, "index.html"));
            // next();
        });
        app.get("/staff", (req, res) => {
            res.json(["Jeff", "Gaurav"]);
        });
        app.get("/get_weather_info", (req, res, next) => {
            liquid_prep_lib_1.util.httpGet(`${this.apiUrl}/get_weather_info`)
                .subscribe({
                    next: (data) => res.send(data),
                    error: (err) => next(err)
                });
            // @ts-ignore
            // let weather = new Weather(req.query.weatherApiKey, req.query.geoCode, req.query.language, req.query.units);
            // let fiveDaysWeatherInfo = weather.get5DaysForecast();
            // res.send({data: fiveDaysWeatherInfo});
        });
        app.get("/get_crop_list", (req, res, next) => {
            liquid_prep_lib_1.util.httpGet(`${this.apiUrl}/get_crop_list`)
                .subscribe({
                    next: (data) => res.send(data),
                    error: (err) => next(err)
                });
        });
        app.get("/get_crop_info", (req, res, next) => {
            // @ts-ignore
            let id = req.query.id;
            liquid_prep_lib_1.util.httpGet(`${this.apiUrl}/get_crop_info?id=${id}`)
                .subscribe({
                    next: (data) => res.send(data),
                    error: (err) => next(err)
                });
        });

        app.get("/moisture_level", (req, res, next) => {
            res.send(moisture_array);
            console.log(`sent moisture level: ${moisture_array}`);
        });


      
        app.listen(3000, () => {
            console.log('Started on 3000');
        });
    


    }
};
exports.Server = Server;
