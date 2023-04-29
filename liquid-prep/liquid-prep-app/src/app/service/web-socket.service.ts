import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { delayWhen, retryWhen, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const RECONNECT_INTERVAL = 30000;
let WS_ENDPOINT = '';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private $socket: WebSocketSubject<any>;
  private $msgSubject = new Subject();
  $message: any;
  constructor() { }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[Data Service] Try to reconnect', val)), 
      delayWhen(_ => timer(RECONNECT_INTERVAL)))));
  }
  private getNewWebSocket() {
    return webSocket({
      url: WS_ENDPOINT,
      //serializer: msg => JSON.stringify({task: "admin,user", msg: {...msg as {}}}),
      closeObserver: {
        next: () => {
          console.log('[DataService]: connection closed');
          this.$socket = undefined;
          this.connect({ reconnect: true });
        }
      },
    });
  }  
  connect2(cfg: { reconnect: boolean } = { reconnect: false }): void { 
    if (!this.$socket || this.$socket.closed) {
      this.$socket = this.getNewWebSocket();
      this.$message = this.$socket.multiplex(
        () => ({subscribe: 'LP'}),
        () => ({unsubscribe: 'LP'}),
        message => message.type === 'LP');
    }
  }
  connect(options) { 
    this.$socket = webSocket(options);
    return {
      subscribe: (params: any) => {
        const observableA = this.$socket.multiplex(
          () => params,
          () => ({ close: true }),
          (message: any) =>  {
            console.log(message)
            return message.requestId === params.requestId
          }
        );
        return observableA
      }
    }
  }
  wsConnect(ws: string, type) {
    if (!this.$socket || this.$socket.closed) {
      WS_ENDPOINT = ws;
      this.$socket = webSocket(ws);
      this.$socket.subscribe((message) => {
        console.log(message)
      })
      //this.$message = this.$socket.multiplex(
      //  () => ({subscribe: type}),
      //  () => JSON.stringify({"unsubscribe" : type}),
      //  message => message.type == type
      //)    
        
      //this.$message = this.$socket.multiplex(
      //  () => ({subscribe: 'LP'}),
      //  () => ({unsubscribe: 'LP'}),
      //  message => message.type === 'LP');

    }
  }
  sendMsg(type: string, message: any) {
    this.$message = this.$socket.multiplex(
      () => message,
      () => JSON.stringify({"unsubscribe" : type}),
      message => message.type == type
    )    
    this.$message.subscribe(message)
    //return this.$socket.multiplex(
    //  () => message,
    //  () => JSON.stringify({"unsubscribe" : type}),
    //  message => message.Operation == type
    //)    
  }
}
