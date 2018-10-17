import {InterfaceDocumentObject} from './InterfaceComponentObject';
import {Observable} from 'rxjs/internal/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {environment} from '../../../environments/environment';


export class Document {
  $DocumentObjectList: Observable<any[]>;
  constructor(private db: AngularFireDatabase) {
    this.$DocumentObjectList = this.db.list(environment.firebaseTables.docObjektName).valueChanges();
  }

  /**
   * Geter für Document Object List
   * @returns {Observable<any[]>}
   */
  getDocumentObjectList(): Observable<any[]> {
    return this.$DocumentObjectList;
  }
  /**
   * Gibt ein Observabal auf ein einzelnes Dokumenten Object zurück
   * @param {string} iddb
   * @returns {Observable<any>}
   */
  getDocumentObject(iddb: string): Observable<any>{
    return  this.db.object(environment.firebaseTables.docObjektName + '/' + iddb).valueChanges();
  }
  /**
   * Diese Methode erstelle eine neus Doc Object in der DB
   * @param {DocumentObject} docObject
   * @returns {string}
   */
  newDocObject(docObject: InterfaceDocumentObject): string {
    const pushID = this.db.createPushId(); //Pusch Id für die DB
    console.log('pusch ID ist:  ' + pushID);
    if (pushID != null) {
      docObject.id = pushID;
      this.db.object(environment.firebaseTables.docObjektName + '/' + pushID).set(docObject);
      return pushID;
    } else {
      return null;
    }
  }
}

export class DocumentObject implements InterfaceDocumentObject{
  id: string;
  name: string;
  url: string;

  constructor(){}
}
