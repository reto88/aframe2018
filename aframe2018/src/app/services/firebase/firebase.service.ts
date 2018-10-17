import {Injectable} from '@angular/core';
import {InterfaceComponentObject,
  InterfaceDocumentObject,
  InterfaceInformationObject,
  InterfaceLivevalueObject} from './InterfaceComponentObject';
import {Observable} from 'rxjs/internal/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {Component, ComponentenObject} from './ComponentObject';
import {Information} from './InformationObject';
import {Document} from './DocumentObject';
import {Livevalue} from './LivevalueObject';
import {AuthService} from '../auth/auth.service';
import {Users} from './Users';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  component: Component;
  information: Information;
  document: Document;
  livevalue: Livevalue;
  users: Users;

  constructor(private db: AngularFireDatabase, private authservice: AuthService) {
    this.component = new Component(this.db, this.authservice);
    this.information = new Information(this.db);
    this.document = new Document(this.db);
    this.livevalue = new Livevalue(this.db);
    this.users = new Users(this.db);
  }
  /**
   * Geter für Componenten List
   * @returns {Observable<any[]>}
   */
  getComponentObjectList(): Observable<any[]> {
    return this.component.getComponentObjectList();
  }
  /**
   * Getter für ein einzelne Komponente
   * @param {string} iddb
   * @returns {InterfaceComponentObject}
   */
  getComponentenObjekt(iddb: string): InterfaceComponentObject {
    return this.component.getComponentenObjekt(iddb);
  }
  /**
   * Getter für ein einzelne Komponente
   * @param {string} iddb
   * @returns {InterfaceComponentObject}
   */
  getComponentenObjektObs(iddb: string): Observable<any> {
    return this.component.getComponentenObjektObs(iddb);
  }
  /**
   * Schribt das Objekt neu in die DB
   * @param {ComponentenObject} objectToChange
   * @returns {boolean}
   */
  changeComponentenObjek(objectToChange: InterfaceComponentObject): boolean {
    return this.component.changeComponentenObjek(objectToChange);
  }

  /**
   * Entfernt ein Komponeten Objekt mit der id aus der DB
   * @param {string} id
   */
  removComponentenObjek(id: string) {
    this.component.removeComponentenObjek(id);
  }

  /**
   * Geter für Info Object List
   * @returns {Observable<any[]>}
   */
  getInformationObjectList(): Observable<any[]> {
    return this.information.getInformationObjectList();
  }
  /**
   * Gibt ein Observabal auf ein einzelnes Informations Object zurück
   * @param {string} iddb
   * @returns {Observable<any>}
   */
  getInformationObject(iddb: string): Observable<any>{
    return  this.information.getInformationObject(iddb);
  }
  /**
   * Geter für Document Object List
   * @returns {Observable<any[]>}
   */
  getDocumentObjectList(): Observable<any[]> {
    return this.document.getDocumentObjectList();
  }
  /**
   * Gibt ein Observabal auf ein einzelnes Dokumenten Object zurück
   * @param {string} iddb
   * @returns {Observable<any>}
   */
  getDocumentObject(iddb: string): Observable<any>{
    return  this.document.getDocumentObject(iddb);
  }
  /**
   * Geter für Info Live Object List
   * @returns {Observable<any[]>}
   */
  getLivevalueObjectList(): Observable<any[]> {
    return this.livevalue.getLivevalueObjectList();
  }
  /**
   * Gibt in Observable auf ein einzelnes Live Object zurück
   * @param iddb
   * @returns {Observable<any>}
   */
  getLivevalueObject(iddb): Observable<any>{
    return this.livevalue.getLivevalueObject(iddb);
  }
  /**
   * Diese Methode erstelle eine neue Komponente in der DB
   *    * @param {string} aks
   * @param {string} name
   * @param {GROUPTYPE} groupe
   * @returns {string}
   */
  newComponentenObject(aks: string, name: string, groupe: string): string {
    return this.component.newComponentenObject(aks, name, groupe);
  }
  /**
   * Fügt einer Komponente ein Live Value Objekt hinzu
   * @param {string} dbKeyComponent
   * @param {string} dbKeyLiveObject
   */
  addInfoObject(dbKeyComponent: string, dbKeyInfoObject: string) {
    this.component.addInfoObject(dbKeyComponent, dbKeyInfoObject);
  }
  addLiveObject(dbKeyComponent: string, dbKeyLiveObject: string) {
    this.component.addLiveObject(dbKeyComponent, dbKeyLiveObject);
  }
  /**
   * Fügt einer Komponente ein Doc  Objekt hinzu
   * @param {string} dbKeyComponent
   * @param {string} dbKeyDocObject
   */
  addDocObject(dbKeyComponent: string, dbKeyDocObject: string) {
    this.component.addDocObject(dbKeyComponent, dbKeyDocObject);
  }
  /**
   * Diese Methode erstelle eine neus Info Object in der DB
   * @param {InformationObject} infoObject
   * @returns {string}
   */
  newInformationObject(infoObject: InterfaceInformationObject): string {
    return this.information.newInformationObject(infoObject);
  }
  /**
   * Diese Methode erstelle eine neus Doc Object in der DB
   * @param {DocumentObject} docObject
   * @returns {string}
   */
  newDocObject(docObject: InterfaceDocumentObject): string {
    return this.document.newDocObject(docObject);
  }
  /**
   * Diese Methode erstelle eine neus Live Object in der DB
   * @param {LivevalueObject} liveObject
   * @returns {string}
   */
  newLiveObject(liveObject: InterfaceLivevalueObject): string {
    return this.livevalue.newLiveObject(liveObject);
  }

  /**
   * Gibt eine Observebel mit dem Array der users
   */
  getUsers(): Observable<any[]> {
    return this.users.getUserList();
  }

  test(){
    this.db.scheduler.schedule(alert('da war was'));
  }
}
