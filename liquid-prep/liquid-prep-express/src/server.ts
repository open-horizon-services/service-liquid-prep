import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import * as http from 'http';
import { util } from 'liquid-prep-lib';
import path from 'path';

import { Utils } from './common';

declare const process: any;

export class Server {
  app = express();
  apiUrl = `${process.env.SERVERLESS_ENDPOINT}`
  constructor(private port = 3000) {
    this.initialise()
  }

  initialise() {
    let app = this.app;
    app.use(cors({
      origin: '*'
    }));
    app.use(fileUpload());

    const server = http.createServer(app);
    const utils = new Utils(server, this.port);
  
    app.use('/static', express.static('public'));

    app.use('/', express.static('dist/liquid-prep-app'))
  
    app.get('/', (req: express.Request, res: express.Response, next: any) => { //here just add next parameter
      res.sendFile(
        path.resolve(__dirname, "index.html")
      )
      // next();
    })
  
    app.get("/staff", (req: express.Request, res: express.Response) => {
      res.json(["Jeff", "Gaurav"]);
    });

    app.post('/upload', (req: any, res: any) => {
      try {
        this.setInteractive();
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send('No files were uploaded.');
        } else {
          let imageFile = req.files.imageFile;
          const mimetype = imageFile ? imageFile.mimetype : '';
          if(mimetype.indexOf('image/') >= 0 || mimetype.indexOf('video/') >= 0) {
            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            console.log('type: ', imageFile, imageFile.mimetype)
            let uploadPath = __dirname + `/public/images/image.png`;
            if(mimetype.indexOf('video/') >= 0) {
              let ext = imageFile.name.match(/\.([^.]*?)$/);
              uploadPath = __dirname + `/public/video/video${ext[0]}`;
            }
            
            // Use the mv() method to place the file somewhere on your server
            imageFile.mv(uploadPath, function(err) {
              if (err)
                return res.status(500).send(err);
        
              res.send({status: true, message: 'File uploaded!'});
            });
          } else {
            res.send({status: true, message: 'Only image and video files are accepted.'});
          }
        }  
      } catch(err) {
        res.status(500).send(err);
      }
    });

    app.get("/get_weather_info", (req: express.Request, res: express.Response, next) => {
      util.httpGet(`${this.apiUrl}/get_weather_info`)
      .subscribe({
        next: (data: any) => res.send(data),
        error: (err: any) => next(err)
      })  
      // @ts-ignore
      // let weather = new Weather(req.query.weatherApiKey, req.query.geoCode, req.query.language, req.query.units);
      // let fiveDaysWeatherInfo = weather.get5DaysForecast();
      // res.send({data: fiveDaysWeatherInfo});
    });
  
    app.get("/get_crop_list", (req: express.Request, res: express.Response, next) => {
      util.httpGet(`${this.apiUrl}/get_crop_list`)
      .subscribe({
        next: (data: any) => res.send(data),
        error: (err: any) => next(err)
      })  
    });

    app.get("/get_crop_info", (req: express.Request, res: express.Response, next) => {
      // @ts-ignore
      let id = req.query.id;
      util.httpGet(`${this.apiUrl}/get_crop_info?id=${id}`)
      .subscribe({
        next: (data: any) => res.send(data),
        error: (err: any) => next(err)
      })  
    });

    // app.get("*",  (req: express.Request, res: express.Response) => {
    //   res.sendFile(
    //       path.resolve( __dirname, "index.html" )
    //   )
    // });
  
    //app.listen(this.port, () => {
    //  console.log(`Started on ${this.port}`);
    //});
  }
  setInteractive = () => {
    process.env.npm_config_lastinteractive = Date.now();
  }
}
