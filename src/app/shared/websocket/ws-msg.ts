export interface WsMsg{
  type: string,
  url: string
  params?: any;
}

export interface WsEventMsg extends WsMsg{
  type: 'subscribe' | 'unsubscribe',
}

export interface WsRestMsg extends WsMsg{
  type: 'GET'|'PUT'|'DELETE'|'POST',
}