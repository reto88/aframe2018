import {InterfaceComponentObject, InterfaceDocumentObject, InterfaceLivevalueObject} from './InterfaceComponentObject';
import {Observable} from 'rxjs/internal/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {environment} from '../../../environments/environment';


export class Livevalue {
  $LivevalueObjectList: Observable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.$LivevalueObjectList = this.db.list(environment.firebaseTables.livevalueObjektName).valueChanges();
  }


  /**
   * Geter für Info Live Object List
   * @returns {Observable<any[]>}
   */
  getLivevalueObjectList(): Observable<any[]> {
    return this.$LivevalueObjectList;
  }

  /**
   * Gibt in Observable auf ein einzelnes Live Object zurück
   * @param {string} iddb
   * @returns {Observable<any>}
   */
  getLivevalueObject(iddb: string): Observable<any>{
    return  this.db.object(environment.firebaseTables.livevalueObjektName + '/' + iddb).valueChanges();
  }
  /**
   * Diese Methode erstelle eine neus Live Object in der DB
   * @param {LivevalueObject} liveObject
   * @returns {string}
   */
  newLiveObject(liveObject: InterfaceLivevalueObject): string {
    let pushID = this.db.createPushId(); //Pusch Id für die DB
    console.log('pusch ID ist:  ' + pushID);
    if (pushID != null) {
      liveObject.id = pushID;
      this.db.object(environment.firebaseTables.livevalueObjektName + '/' + pushID).set(liveObject);
      return pushID;
    } else {
      return null;
    }
  }

}


export class LivevalueObject implements InterfaceLivevalueObject{
  id: string;
  aks: string;
  numericId: string;
  name: string;
  timestamp: string;
  unit: string;
  value: number;

  constructor(){}
}
