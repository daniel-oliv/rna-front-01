// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const URL_DEFAULT_API = 'localhost:3047/';
const PROTOCOL_HTTPS = false;
const HTTP_API = PROTOCOL_HTTPS ? 'https://' : 'http://';
const URL_API = HTTP_API + URL_DEFAULT_API;

const URL_WEBSOCKET = 'ws://' + URL_DEFAULT_API + 'connect';


export const environment = {
  production: false,
  API_WEBSOCKET: URL_WEBSOCKET
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
