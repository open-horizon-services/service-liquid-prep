import { existsSync, mkdirSync } from 'fs';
import WebSocket from 'ws';

export class Utils {
  homePath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  mmsPath = '/mms-shared';
  localPath = './local-shared';
  assets = './assets';
  public = './public';
  sharedPath = '';
  intervalMS = 10000;
  timer: NodeJS.Timer = null;

  constructor(private server: any, private port: number) {
    this.init()
  }
  init() {
    this.initWebSocketServer();
    if(!existsSync(this.localPath)) {
      mkdirSync(this.localPath);
    }
    if(!existsSync(this.assets)) {
      mkdirSync(this.assets);
    }
    if(!existsSync(this.public)) {
      mkdirSync(this.public);
    }
  }
  initWebSocketServer() {
    // Creating a new websocket server
    const wss = new WebSocket.Server({server: this.server})
    
    // Creating connection using websocket
    wss.on("connection", ws => {
      console.log("new client connected");
      // sending message
      ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
        wss.clients.forEach((client) => {
          if(client != ws && client.readyState) {
            client.send(`broadcast: ${data}`)
          }
        })
      });
      // handling what to do when clients disconnects from server
      ws.on("close", () => {
        console.log("the client has disconnected");
      });
      // handling client connection error
      ws.onerror = function () {
        console.log("Some Error occurred")
      }
    });
    require('dns').lookup(require('os').hostname(), (err, add, fam) => {
      console.log(`The WebSocket server is running on ${add}:${this.port}`);
    })
    this.server.listen(this.port, () => {
      console.log(`Started on ${this.port}`);
    });
  }
}  