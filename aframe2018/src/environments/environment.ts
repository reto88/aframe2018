// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCVfgIgLRR1uULqAroiE_lLgjdifazVefc',
    authDomain: 'bfhv00-73ca4.firebaseapp.com',
    databaseURL: 'https://bfhv00-73ca4.firebaseio.com',
    projectId: 'bfhv00-73ca4',
    storageBucket: 'bfhv00-73ca4.appspot.com',
    messagingSenderId: '28762766763'
  },
  firebaseTables: {
    componentObjektName: 'komponenten',
    infoObjektName: 'info',
    docObjektName: 'doc',
    livevalueObjektName: 'livevalue',
    usersObjektName: 'users'
  },
  componentenType: {select: ['Sensor', 'Actuator', 'Valve', 'Pump', 'Unit', 'Undefined'],
    defaultSelect: 'Undefined'},
  user: 'user',
  superuser: 'superuser',
  // baseUrl: 'http://localhost:4200/scan/', // Für QR Code
  baseUrl: ' https://bfhar-aa879.firebaseapp.com/scan/',
  routingBaseId: '-LNn6WGUxcVDQiTFy51F',
  realTimeServerUrl: 'https://visualizer.nestcollaboration.ch/Realtime/realtimedata' // Für Realtime Server
};


