import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { WsMsg, WsEventMsg, WsRestMsg, WsAck, wsEventMsgFac} from './ws-msg';
import { copyProps } from '../helpers/object-utils';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  /// a subject is an observable with shared scope
  /// a WebSocket subject is an observable that shared a websocket from all actives subscriptions;
  /// it disconnects from the websocket server when there is no subscription anymore, and reconnect when the observables returned by multiplex are subscribed again.
  private socket: WebSocketSubject<WsMsg>;
  // public socket: WebSocket;

  constructor() { 
    console.log('WebSocketSubject contructor');
    this.socket = this.getNewSocket();
    //TODO => método para reconectar com alguma lógica - ver exemplos no arquivo de Atividades
      // the default subscription was deprecated for enabling to close connection when there is no active subscriptions anymore.
      // for using it, implement if(this.socket.observers.length == 1 )
      // this. socket.subscribe(
      // (message)=>{this. processMessage(message) ;}, 
      // (error)=>{console.log(`error`, error);this.retry()}, 
      // ()=>console.warn('Completed!')
      // )
    }
    
  private getNewSocket() {
    console.log('environment.API_WEBSOCKET ', environment.API_WEBSOCKET);
    return new WebSocketSubject<WsMsg>(environment.API_WEBSOCKET);
  }

  //! Important to unsubscribe to the Observable on ngOnDestroy
  getEventObs<T>(url, params, func: (result: T)=>void){
    const msg: WsEventMsg = wsEventMsgFac({type:'subscribe', url, params})
    // let subData: WsEventMsg = {type: 'subscribe',}
    let unSubData: WsEventMsg = copyProps({type: 'unsubscribe'}, msg, ['url', 'id'])
    let sub: Subscription;
    // let obs: Observable<T>;
    const filterFn =  
    (recMsg:WsAck)=>{
      console.log(`filter multiplex msg`, msg);
      if(recMsg.type == 'END_OK' || recMsg.type == 'END_ERROR' ) sub.unsubscribe();
      return recMsg && recMsg.url === msg.url && recMsg.id === msg.id
    }

    const obs: Observable<WsAck> = this.socket.multiplex(
      ()=>{return msg},
      ()=>{return unSubData},
      filterFn
      );

    sub = obs.subscribe(
      (recMsg)=>{func(recMsg.body)},
      (err)=>{console.log('getEventObs() err ', err);}
    )

  }

  //! Important to unsubscribe to the Observable on ngOnDestroy
  doObsOnce(msg: WsRestMsg){
    let unSubData: WsAck = {type: 'END_OK', url:msg.url}
    console.log('doObsOnce -------------');
    //delete msg.params
    return this.socket.multiplex(
      ()=>{console.log('sub');return msg},
      undefined/* ()=>{console.log('unsub');return unSubData} */,
      (serverMsg:WsEventMsg)=>{console.log(`filter multiplex msg`, serverMsg);
        return serverMsg.url && serverMsg.url === msg.url});
  }

  public send (message: WsMsg) {
    this.socket.next(message)
  }

  public get(url: string, params?: any) {
    return this.doObsOnce({type: 'GET', url, params} as WsRestMsg);
  }
  public post(url: string, params?: any) {
    return this.doObsOnce({type: 'POST', url, params} as WsRestMsg);
  }
  public delete(url: string, params?: any) {
    this.socket.next({type: 'DELETE', url, params} as WsRestMsg)
  }
  public put(url: string, params?: any) {
    this.socket.next({type: 'PUT', url, params} as WsRestMsg)
  }
  /*
  // processMessage(message){
  //   console.log('processMessage');
  //   console.log(`message [${message}]`);
  // }

  // retry(){
  //   console.log('retry');
  // }

  // public send (eventTag: string) {
  //   console.log('send');
  //   let subData = {type: 'subscribe', event:'eventTag'}
  //   let unSubData = {type: 'unsubscribe', event:'eventTag'}
  //   let obs = this.socket.multiplex(
  //     ()=>{return subData},
  //     ()=>{return unSubData},
  //     (msg)=>{console.log(`filter multiplex msg`, msg);return msg.replace});
  //   let subscription = obs.subscribe({
  //    next: (msg)=>{console.log(`obs subscribe msg [${msg}]`);}, 
  //    error: (error)=>{console.log(`obs subscribe msg [${error}]`);}, 
  //    complete: ()=>{console.log(`obs subscribe complete`);}
  //   })
    
  //   setTimeout(() => {
  //     subscription.unsubscribe();
  //   }, 1000);

  //   let obj = {test:2, array: ["123",{a:1},123]}
  //   this.socket.next(obj);
  // this.socket.unsubscribe();

  // }
  */

}

