import {Component, OnInit, OnDestroy} from '@angular/core';
import {FirebaseService} from '../services/firebase/firebase.service';
import {ActivatedRoute} from '@angular/router';
import {InterfaceComponentObject, InterfaceLivevalueObject} from '../services/firebase/InterfaceComponentObject';
import {ComponentenObject} from '../services/firebase/ComponentObject';
import {environment} from '../../environments/environment';
import {Realtime2Service} from '../services/realtime/realtime2.service';
import {AuthService} from '../services/auth/auth.service';
import {trigger, style, state, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss', '../app.component.scss'],
  animations: [
    trigger('valueAnimation', [
      state('void => *', style({opacity: 1})),
      transition('void => *', []),
      transition('* => *', [
        animate(2000, style({opacity: 1, color: 'white', background: '#2196f3'}))
      ])
    ])
  ]
})
export class DetailComponent implements OnInit, OnDestroy {
  public detail: InterfaceComponentObject;
  public show: boolean;
  public isSub: Boolean;
  public panelOpenState;
  private dataReceived;
  private liveValueReceived;
  public superuser: boolean;
  private url;
  public id;
  private loading;
  public subscriberUserLevel;
  qrLoaded: boolean;

  constructor(private route: ActivatedRoute,
              private firebaseService: FirebaseService,
              private authservice: AuthService,
              private realtimeservice: Realtime2Service) {
    this.detail = new ComponentenObject();
    this.show = false;
  }

  ngOnInit() {
    this.loading = true;
    this.id = this.route.snapshot.paramMap.get('firebaseId');
    this.url = this.route.snapshot.url;
    this.getDetail(this.id);
    this.panelOpenState = true;
    this.dataReceived = false;
    this.liveValueReceived = false;
    this.panelOpenState = true;
    this.superuser = this.authservice.isUserlevel(environment.superuser);
    this.subscriberUserLevel = this.authservice.getUserLevelObservable().subscribe(value => {
      this.superuser = this.authservice.isUserlevel(environment.superuser);
    });
  }


  closeQr(event) {
    this.qrLoaded = event;
  }

  getDetail(id: string) {
    this.firebaseService.getComponentenObjektObs(id)
      .subscribe(data => {
          this.detail = <InterfaceComponentObject>data;
          //      console.log('livevalue Feld 000000  ' + JSON.stringify(this.detail.livevalue));
          this.dataReceived = true;
          //  alert('ID error');
          if (this.detail.livevalue != null) {
            //  this.getLiveValuesIds(this.detail.livevalue);
            if (this.detail.livevalue.length > 0) {
              this.dosubscribe(this.detail.livevalue);
            }
            this.show = true;
            this.panelOpenState = true;
          }
        },
        error1 => console.log(error1));

  }

  dosubscribe(livevalues: InterfaceLivevalueObject[]) {
    this.realtimeservice.getData(livevalues).subscribe(
      data => {
        // important to close subscription on destroy
        this.isSub = true;
        this.detail.livevalue = data;
        this.liveValueReceived = true;
        this.loading = false;
      }
    );
  }

  /**
   * Überprüfte Objekt ob es initaliesiert wurde
   * @param {string} input
   * @returns {boolean}
   */
  checkContent(input: string): boolean {
    if (input != null && typeof(input) === 'string' && this.show === true) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Überprüfte einen String auf Inhalt
   * @param {string} input
   * @returns {boolean}
   */
  checkContentObj(input: object): boolean {
    if (input !== null && input !== undefined && this.show === true) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    if (this.isSub === true) {
      this.realtimeservice.unsubscribe();
      this.subscriberUserLevel.unsubscribe();
      this.isSub = false;
    }
  }
}
