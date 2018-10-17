import {InterfaceDocumentObject} from './InterfaceComponentObject';
import {Observable} from 'rxjs/internal/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {environment} from '../../../environments/environment';


export class Users {
  $UserList: Observable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.$UserList = this.db.list(environment.firebaseTables.usersObjektName).valueChanges();
  }

  /**
   * Geter für User List
   * @returns {Observable<any[]>}
   */
  getUserList(): Observable<any[]> {
    return this.$UserList;
  }

}
