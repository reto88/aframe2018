import {InterfaceInformationObject} from './InterfaceComponentObject';
import {Observable} from 'rxjs/internal/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {environment} from '../../../environments/environment';


export class Information {
  $InformationObjectList: Observable<any[]>;
  constructor(private db: AngularFireDatabase){
    this.$InformationObjectList = this.db.list(environment.firebaseTables.infoObjektName).valueChanges();
  }

  /**
   * Geter für Info Object List
   * @returns {Observable<any[]>}
   */
  getInformationObjectList(): Observable<any[]> {
    return this.$InformationObjectList;
  }
  /**
   * Gibt ein Observabal auf ein einzelnes Informations Object zurück
   * @param {string} iddb
   * @returns {Observable<any>}
   */
  getInformationObject(iddb: string): Observable<any>{
    return  this.db.object(environment.firebaseTables.infoObjektName + '/' + iddb).valueChanges();
  }
  /**
   * Erstellt ein neue Info Object in der Firebase DB
   * @param {InterfaceInformationObject} infoObject
   * @returns {string}
   */
  newInformationObject(infoObject: InterfaceInformationObject): string {
    const pushID = this.db.createPushId(); //Pusch Id für die DB
    console.log('pusch ID ist:  ' + pushID);
    if (pushID != null) {
      infoObject.id = pushID;
      this.db.object(environment.firebaseTables.infoObjektName + '/' + pushID).set(infoObject);
      return pushID;
    } else {
      return null;
    }
  }
}

export class InformationObject implements InterfaceInformationObject{
  id: string;
  description: string;
  manufacturer: string;
  manufacturerurl: string;
  ordernumber: string;
  productname: string;
  producttype: string;
  supplier: string;
  supplierurl: string;

  constructor(){}


}
