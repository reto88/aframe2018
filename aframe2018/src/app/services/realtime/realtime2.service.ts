import {Injectable} from '@angular/core';
import * as signalR from '@aspnet/signalr';
import {Observable, Observer} from 'rxjs';
import {environment} from '../../../environments/environment';
import {InterfaceLivevalueObject} from '../firebase/InterfaceComponentObject';

// interface for RT Data
export interface ICurrentDataItem {
  numericId: string;
  value: number;
  timestamp: string;
  quality?: number;

}

// Observer https://blog.codewithdan.com/2017/11/07/pushing-real-time-data-to-an-angular-service-using-web-sockets/

@Injectable({
  providedIn: 'root'
})
export class Realtime2Service {
  observer: Observer<InterfaceLivevalueObject[]>;
  connection: signalR.HubConnection;
  receivedObjectArray: InterfaceLivevalueObject[];
  arrayNumId;

  getData(liveValueObjectArray: InterfaceLivevalueObject[]): Observable<InterfaceLivevalueObject[]> {
    // get array of numericIds of the LiveValueObjectArray
    const _numericId = this.getLiveValuesIds(liveValueObjectArray);
    this.receivedObjectArray = liveValueObjectArray;
    // websocket connection to the realtime server
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.realTimeServerUrl)
      .build();
    this.connection.start().catch(function (err) {
    }).then(() => {
      // init the subscribted values with numericId
      this.connection.invoke('JoinNumericIdGroup', _numericId).then((vl: ICurrentDataItem[]) => {
        const initObjectArr = this.mapReceivedRtValue(vl, this.receivedObjectArray);
        this.observer.next(initObjectArr);
      });
    });
    // next when on value change and updated LiveValuveObject
    this.connection.on('updateData', (dt: ICurrentDataItem[]) => {
      const updatedObjectArr = this.mapReceivedRtValue(dt, this.receivedObjectArray);
      this.observer.next(updatedObjectArr);
    });
    return this.createObservable();
  }

// get array of numericIds of the LiveValueObjectArray
  getLiveValuesIds(livevalue: InterfaceLivevalueObject[]) {
    this.arrayNumId = new Array<string>();
    for (const item of livevalue) {
      this.arrayNumId.push(item.numericId);
    }
    if (this.arrayNumId[0] != null) {
      return this.arrayNumId;
    }
  }

// maps the realtime data to the livevalueObjectArray
  mapReceivedRtValue(receivedRT: ICurrentDataItem[], liveValueObjectArray: InterfaceLivevalueObject[]) {
    const liveValueObjectArrayMap = liveValueObjectArray;
    for (const receivedId of receivedRT) {
      const itemIndex = receivedRT.findIndex(item => item.numericId === receivedId.numericId);
      receivedRT[itemIndex] = receivedId;
      //    console.log('LiveValuesUpdated' + JSON.stringify(liveValues));
    }
    // realtime array aufspliten index von objekt finden welcher mit empfangen numericid matched
    for (const receivedId of receivedRT) {
      const itemIndex = liveValueObjectArrayMap.findIndex(item => item.numericId === receivedId.numericId);
      liveValueObjectArrayMap [itemIndex].value = receivedId.value; // werte ersetzen
      liveValueObjectArrayMap [itemIndex].timestamp = receivedId.timestamp; // Zeitstempel ersetzen
    }
    return liveValueObjectArrayMap;
  }

// stop connection to realtime server
  stopConnection() {
    this.connection.stop().catch(function (err) {
    }).then(() => {
        console.log(JSON.stringify(this.connection));

      }
    );
  }

// on destroy -> unsubscribe
  unsubscribe() {
    this.connection.invoke('LeaveNumericIdGroup', this.arrayNumId);
  }

  createObservable(): Observable<InterfaceLivevalueObject[]> {
    return new Observable(observer => {
      this.observer = observer;
    });
  }

}

