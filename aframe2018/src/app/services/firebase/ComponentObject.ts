import {Observable} from 'rxjs/internal/Observable';
import {
  InterfaceDocumentObject,
  InterfaceInformationObject,
  InterfaceComponentObject,
  InterfaceLivevalueObject
} from './InterfaceComponentObject';
import {AngularFireDatabase, SnapshotAction} from 'angularfire2/database';
import {environment} from '../../../environments/environment';
import {DocumentObject} from './DocumentObject';
import {InformationObject} from './InformationObject';
import {LivevalueObject} from './LivevalueObject';
import {ComponentObjectDB, InformationObjectDB, LivevalueObjectDB} from './interfaceDB';
import {Observer} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {isLineBreak} from 'codelyzer/angular/sourceMappingVisitor';

export class Component {
  $ComponentObjectList: Observable<any[]>;
  observer: Observer<any>;

  constructor(private db: AngularFireDatabase, private authservice: AuthService) {
    this.$ComponentObjectList = this.db.list(environment.firebaseTables.componentObjektName).valueChanges();
  }
  /**
   * Geter für Componenten List
   * @returns {Observable<any[]>}
   */
  getComponentObjectList(): Observable<any[]> {
    return this.$ComponentObjectList;
  }
  /**
   * Diese Methode erstelle eine neue Komponente in der DB
   *    * @param {string} aks
   * @param {string} name
   * @param {GROUPTYPE} groupe
   * @returns {string}
   */
  newComponentenObject(aks: string, name: string, groupe: string): string {
    if (aks != null && name != null) {
      const newComponentObject = new ComponentObjectDB();
      let pushID: string;
      newComponentObject.aks = aks;
      newComponentObject.name = name;
      newComponentObject.group = groupe;
      newComponentObject.author = this.authservice.getUser();
      newComponentObject.date = Date().toString();
      console.log(newComponentObject);
      pushID = this.db.createPushId(); //Pusch Id für die DB
      console.log('pusch ID ist:  ' + pushID);
      if (pushID != null) {
        newComponentObject.id = pushID;
        this.db.object(environment.firebaseTables.componentObjektName + '/' + pushID).set(newComponentObject);
        return pushID;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  /**
   * Fügt einer Komponente ein Live Value Objekt hinzu
   * @param {string} dbKeyComponent
   * @param {string} dbKeyLiveObject
   */
  addInfoObject(dbKeyComponent: string, dbKeyInfoObject: string) {
    const keyDB: string = environment.firebaseTables.componentObjektName + '/' + dbKeyComponent;
    const observ = this.db.object(keyDB).valueChanges().subscribe(
      value => {
        const datenTEmp = (<ComponentObjectDB>value);
        datenTEmp.informationID = dbKeyInfoObject;
        observ.unsubscribe();
        this.db.object(keyDB).set(datenTEmp);
      });
  }
  /**
   * Fügt einer Komponente ein belibiges  Objekt hinzu
   * @param {string} dbKeyComponent
   * @param {string} dbKeyObject
   * @param {string} typObject
   */
  private addObject(dbKeyComponent: string, dbKeyObject: string, typObject: string) {
    const keyDB: string = environment.firebaseTables.componentObjektName + '/' + dbKeyComponent + '/' + typObject;
    const observ = this.db.object(keyDB).valueChanges().subscribe(
      value => {
        const datenTEmp = [];
        if (value !== null) {
          for (const key of (<string>value)) {
            if (typeof(key) !== 'undefined') {
              datenTEmp.push(key);
            }
          }
        }
        datenTEmp.push(dbKeyObject);
        console.log(datenTEmp);
        observ.unsubscribe();

        this.db.object(keyDB).set(datenTEmp);
      }
    );
  }
  /**
   * Fügt einer Komponente ein Live Value Objekt hinzu
   * @param {string} dbKeyComponent
   * @param {string} dbKeyInfoObject
   */
  //
  addLiveObject(dbKeyComponent: string, dbKeyLiveObject: string) {
    this.addObject(dbKeyComponent, dbKeyLiveObject, 'livevalueID');
  }
  /**
   * Fügt einer Komponente ein Doc  Objekt hinzu
   * @param {string} dbKeyComponent
   * @param {string} dbKeyDocObject
   */
  addDocObject(dbKeyComponent: string, dbKeyDocObject: string) {
    this.addObject(dbKeyComponent, dbKeyDocObject, 'documentsID');
  }
  /**
   * Getter für ein einzelne Komponente
   * @param {string} iddb
   * @returns {InterfaceComponentObject}
   */
  getComponentenObjekt(iddb: string): InterfaceComponentObject {
    console.log('id DB  ' + iddb);
    const componentObject = new ComponentenObject();
    const keyDB: string = environment.firebaseTables.componentObjektName + '/' + iddb;
    const keyDBLive: string = environment.firebaseTables.livevalueObjektName;
    const keyDBDoc: string = environment.firebaseTables.docObjektName;
    const keyDBInfo: string = environment.firebaseTables.infoObjektName;
    const obsComp = this.db.object(keyDB).valueChanges();
    //Komponenten Objekt aus Firbase holen
    const subscriber = obsComp.subscribe(
      value => {
        let datenDB = new ComponentObjectDB;
        datenDB = (<ComponentObjectDB>value);
        console.log('Log DatenDB  ' + datenDB);
        componentObject.aks = datenDB.aks || '65NT_65adssd';
        componentObject.name = datenDB.name;
        componentObject.author = datenDB.author;
        componentObject.group = datenDB.group;
        componentObject.date = datenDB.date;
        subscriber.unsubscribe();
        //Object für die Informationen aus Firebase holen
        componentObject.information = new InformationObject();
        const obsInfo = this.db.object(keyDBInfo + '/' + datenDB.informationID).valueChanges();
        const subsriberInfo = obsInfo.subscribe(
          value1 => {
            const datenDBInfo = (<InformationObjectDB>value1);
            componentObject.information = (<InformationObject>datenDBInfo);
            subsriberInfo.unsubscribe();
          });
        //Objecte fèr die Livewerte aus Firebase holen
        componentObject.livevalue = new Array<LivevalueObject>();
        for (const item of datenDB.livevalueID) {
          const tempObject = new LivevalueObject();
          const obsLlive = this.db.object(keyDBLive + '/' + item.toString()).valueChanges();
          const subscriberLive = obsLlive.subscribe(
            value1 => {
              const datenDBLive: LivevalueObjectDB = (<LivevalueObjectDB>value1);
              tempObject.aks = datenDBLive.aks;
              tempObject.numericId = datenDBLive.numericId;
              tempObject.unit = datenDBLive.unit;
              tempObject.timestamp = datenDBLive.timestamp;
              tempObject.value = datenDBLive.value;
              subscriberLive.unsubscribe();
            });
          componentObject.livevalue.push(tempObject);
        }
        //Doc Objekte aus DB holen
        componentObject.documents = new Array<DocumentObject>();
        for (const item of datenDB.documentsID) {
          const tempObject = new DocumentObject();
          const obsDoc = this.db.object(keyDBDoc + '/' + item.toString()).valueChanges();
          const subscriberDoc = obsDoc.subscribe(
            value1 => {
              const datenDBDoc: DocumentObject = (<DocumentObject>value1);
              tempObject.url = datenDBDoc.url;
              tempObject.name = datenDBDoc.name;
              subscriber.unsubscribe();
            });
          componentObject.documents.push(tempObject);
        }
      }
    );
    return componentObject;
  }
  /**
   * Getter für ein Observable auf eine einzelne Komponente
   * @param {string} iddb
   * @returns {Observable<InterfaceComponentObject>}
   */
  getComponentenObjektObs(iddb: string): Observable<InterfaceComponentObject> {
    console.log('id DB  ' + iddb);
    let componentReciv: boolean = false;
    let infoReciv: boolean = false;
    let liveReciv: boolean = false;
    let docReciv: boolean = false;
    let componentObject = new ComponentenObject();
    const keyDB: string = environment.firebaseTables.componentObjektName + '/' + iddb;
    const keyDBLive: string = environment.firebaseTables.livevalueObjektName;
    const keyDBDoc: string = environment.firebaseTables.docObjektName;
    const keyDBInfo: string = environment.firebaseTables.infoObjektName;
    const obsComp = this.db.object(keyDB).valueChanges();
    let datenDB: ComponentObjectDB;
    //Komponenten Objekt aus Firbase holen
    const subscriber = obsComp.subscribe(
      value => {
        if (value === null) {
          alert('Objekt in DB nicht vorhandne: ' + iddb);
        } else {
          datenDB = new ComponentObjectDB();
          datenDB = (<ComponentObjectDB>value);
          console.log('Log DatenDB  ' + datenDB);
          componentObject.id = datenDB.id;
          componentObject.aks = datenDB.aks;
          componentObject.name = datenDB.name;
          componentObject.author = datenDB.author;
          componentObject.group = datenDB.group;
          componentObject.date = datenDB.date;
          subscriber.unsubscribe();
          componentReciv = true;
          if (componentReciv && infoReciv && liveReciv && docReciv) {
            this.observer.next(componentObject);
            this.observer.complete();
          }
          //this.observer.next(componentObject);
          //Object für die Informationen aus Firebase holen
          componentObject.information = new InformationObject();
          if (datenDB.informationID != null) {
            const obsInfo = this.db.object(keyDBInfo + '/' + datenDB.informationID).valueChanges();
            const subsriberInfo = obsInfo.subscribe(
              value1 => {
                const datenDBInfo = (<InformationObjectDB>value1);
                componentObject.information = (<InformationObject>datenDBInfo);
                subsriberInfo.unsubscribe();
                infoReciv = true;
                if (componentReciv && infoReciv && liveReciv && docReciv) {
                  this.observer.next(componentObject);
                  this.observer.complete();
                }
              },
              error1 => {
                this.observer.error(`error while data loding`);
              });
          } else {
            infoReciv = true;
          }
          const obsInfo = this.db.object(keyDBInfo + '/' + datenDB.informationID).valueChanges();
          const subsriberInfo = obsInfo.subscribe(
            value1 => {
              const datenDBInfo = (<InformationObjectDB>value1);
              componentObject.information = (<InformationObject>datenDBInfo);
              subsriberInfo.unsubscribe();
              infoReciv = true;
              if (componentReciv && infoReciv && liveReciv && docReciv) {
                this.observer.next(componentObject);
                this.observer.complete();
              }
            },
            error1 => {
              this.observer.error(`error while data loding`);
            });
          //Objecte fèr die Livewerte aus Firebase holen
          componentObject.livevalue = new Array<LivevalueObject>();
          if (datenDB.livevalueID != null) {
            for (const item of datenDB.livevalueID) {
              let tempObject = new LivevalueObject();
              const obsLlive = this.db.object(keyDBLive + '/' + item.toString()).valueChanges();
              const subscriberLive = obsLlive.subscribe(
                value1 => {
                  const datenDBLive: LivevalueObjectDB = (<LivevalueObjectDB>value1);
                  let tempObject = new LivevalueObject();
                  tempObject = <LivevalueObject>value1;
                  subscriberLive.unsubscribe();
                  componentObject.livevalue.push(tempObject);
                  if (componentObject.livevalue.length === datenDB.livevalueID.length) {
                    liveReciv = true;
                    if (componentReciv && infoReciv && liveReciv && docReciv) {
                      this.observer.next(componentObject);
                      this.observer.complete();
                    }
                  }
                },
                error1 => {
                  this.observer.error(`error while data loding`);
                });
            }
          } else {
            liveReciv = true;
          }
          //Doc Objekte aus DB holen
          componentObject.documents = new Array<DocumentObject>();
          if (datenDB.documentsID != null) {
            for (const item of datenDB.documentsID) {
              const tempObject = new DocumentObject();
              const obsDoc = this.db.object(keyDBDoc + '/' + item.toString()).valueChanges();
              const subscriberDoc = obsDoc.subscribe(
                value1 => {
                  const datenDBDoc: DocumentObject = (<DocumentObject>value1);
                  /*tempObject.id = datenDBDoc.id;
                  tempObject.url = datenDBDoc.url;
                  tempObject.name = datenDBDoc.name;*/
                  componentObject.documents.push(<InterfaceDocumentObject>value1);
                  subscriber.unsubscribe();
                  if (componentObject.documents.length === datenDB.documentsID.length) {
                    docReciv = true;
                    if (componentReciv && infoReciv && liveReciv && docReciv) {
                      this.observer.next(componentObject);
                      this.observer.complete();
                    }
                  }
                },
                error1 => {
                  this.observer.error(`error while data loding`);
                });
            }
          } else {
            docReciv = true;
          }
        }
      },
      error => {
        this.observer.error(`error while data loding`);
      }
    );
    return this.createObservable();
  }

  private createObservable(): Observable<any> {
    return new Observable(observer => {
      this.observer = observer;
    });
  }
  /**
   * Schribt das Objekt neu in die DB
   * @param {ComponentenObject} objectToChange
   * @returns {boolean}
   */
  changeComponentenObjek(objectToChange: InterfaceComponentObject): boolean {
    if (objectToChange.aks !== null && objectToChange.name !== null && objectToChange.id !== null) {
      const keyDB: string = environment.firebaseTables.componentObjektName + '/' + objectToChange.id;
      let newObject = new ComponentObjectDB();
      newObject.id = objectToChange.id;
      newObject.aks = objectToChange.aks;
      newObject.name = objectToChange.name;
      newObject.group = objectToChange.group;
      newObject.author = objectToChange.author;
      newObject.date = objectToChange.date;
      if (objectToChange.information !== null) {
        newObject.informationID = objectToChange.information.id;
      }
      if (objectToChange.livevalue.length > 0) {
        newObject.livevalueID = new Array<string>();
        for (let item of objectToChange.livevalue) {
          newObject.livevalueID.push(item.id);
        }
      }
      if (objectToChange.documents.length > 0) {
        newObject.documentsID = new Array<string>();
        for (let item of objectToChange.documents) {
          newObject.documentsID.push(item.id);
        }
      }
      this.db.object(keyDB).set(newObject);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Löschte ein Komponentne objekt aus der DB
   * @param {string} id
   */
  removeComponentenObjek(id: string) {
    const keyDB: string = environment.firebaseTables.componentObjektName + '/' + id;
    this.db.object(keyDB).remove();
  }
}

/**
 * Classe für ein Komponenten Object
 */
export class ComponentenObject implements InterfaceComponentObject {

  id: string;
  aks: string;
  author: string;
  date: string;
  documents: DocumentObject[];
  group: string;
  information: InformationObject;
  livevalue: LivevalueObject[];
  name: string;

  constructor() {
    this.information = new InformationObject();
    this.livevalue = new Array<LivevalueObject>();
    this.documents = new Array<DocumentObject>();
  }

}
