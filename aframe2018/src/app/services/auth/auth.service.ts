import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable, Observer} from 'rxjs';
import {UserObjectDB} from '../firebase/interfaceDB';
import {AngularFireDatabase} from 'angularfire2/database';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private userLevel: string;
  private userLevelSubscriber;
  observerUserLevel: Observer<string>;
  observerUser: Observer<string>;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router, private db: AngularFireDatabase) {
    this.user = _firebaseAuth.authState;
    // get logged in user for leve user or superuser
    this.user.subscribe(
      (user) => {
        if (user) {
          const userData = <firebase.User>user;
          this.userDetails = user;
          this.userLevelSubscriber = this.db.list(environment.firebaseTables.usersObjektName).valueChanges().subscribe(value => {
            this.userLevel = null;
            const userList = <UserObjectDB[]>value;
            for (const item of userList) {
              if (item.name === user.email) {
                this.userLevel = item.level;
                this.observerUserLevel.next(item.level);
              }
            }
            this.userLevelSubscriber.unsubscribe();
          });

        } else {
          this.userDetails = null;
          this.observerUserLevel.next('noUser');
        }
      },
      error => {
        this.userDetails = null;
        this.observerUser.next('');
        this.observerUserLevel.next('');
        this.observerUser.error('error with the user Name');
        this.observerUserLevel.error('error with the user Name');
      }
    );
  }

// log i
  signInRegular(email, password) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }
// create new user
  createNewUser(email, password) {
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }


  isLoggedIn() {
   
   if (this.userDetails == null) {
     return false;
    } else {
     return true;
    }
  }


  getUser(): string {
    if (this.userDetails == null) {
      return null;
    } else {
      return this.userDetails.email;
    }
  }

  getUserObservable(): Observable<string> {
    return this.createObservableUser();
  }

  private createObservableUser(): Observable<string> {
    return new Observable(observer => {
      this.observerUser = observer;
    });
  }

  getUserLevel(): string {
    return this.userLevel;
  }

  isUserlevel(level: string): boolean {
    if (level === this.userLevel) {
      return true;
    } else {
      return false;
    }
  }

  getUserLevelObservable(): Observable<string> {
    return this.createObservableUserLevel();
  }

  private createObservableUserLevel(): Observable<string> {
    return new Observable(observer => {
      this.observerUserLevel = observer;
    });
  }

  logout() {
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }
}

