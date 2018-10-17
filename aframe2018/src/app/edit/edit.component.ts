import {Component, OnInit} from '@angular/core';
import {
  InterfaceDocumentObject,
  InterfaceLivevalueObject
} from '../services/firebase/InterfaceComponentObject';
import {ComponentenObject} from '../services/firebase/ComponentObject';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseService} from '../services/firebase/firebase.service';
import {DocumentObject} from '../services/firebase/DocumentObject';
import {InformationObject} from '../services/firebase/InformationObject';
import {SelectorDialogComponent} from '../common/selector-dialog/selector-dialog.component';
import {MatDialog} from '@angular/material';
import {LivevalueObject} from '../services/firebase/LivevalueObject';
import {environment} from '../../environments/environment';
import {DataInputHeader} from '../common/input-header/input-header.component';
import {AuthService} from '../services/auth/auth.service';
import {DeleteDialogComponent} from '../common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../app.component.scss']
})
export class EditComponent implements OnInit {
  public detail: ComponentenObject;
  public show: boolean;
  public panelOpenState;
  private dataReceived;
  private liveValueReceived;
  private obsObjectCompo;
  private obsObjectDoc;
  private obsObjectInfo;
  public id;
  private dialogResult;
  public dataValid: boolean;
  qrLoaded: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private firebaseService: FirebaseService,
              private authservice: AuthService,
              private dialog: MatDialog) {
    this.detail = new ComponentenObject();
    this.show = false;
    this.dataValid = true;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('firebaseId');
    this.getDetail(this.id);
    this.dataReceived = false;
    this.liveValueReceived = false;
  }

  closeQr(event) {
    this.qrLoaded = event;
  }

  getDetail(id: string) {
    this.obsObjectCompo = this.firebaseService.getComponentenObjektObs(id)
      .subscribe(
        data => {
          this.detail = data;
          this.dataReceived = true;
          this.show = true;
          this.obsObjectCompo.unsubscribe();
        },
        err => {
        });
  }

  /**
   * Überprüfte einen String auf Inhalt
   * @param {string} input
   * @returns {boolean}
   */
  checkContent(input: string): boolean {
    if (input !== null && typeof(input) === 'string' && input !== undefined && this.show === true) {
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

  /**
   * Callback für eingabe Header
   * @param {DataInputHeader} data
   */
  newData(data: DataInputHeader) {
    this.dataValid = data.inputValide;
    this.detail.aks = data.aks;
    this.detail.name = data.name;
    this.detail.group = data.type;
  }

  /**
   * Schreibt das Komponentenobjekt neu in die DB
   */
  save() {
    let newObject = new ComponentenObject();
    newObject = <ComponentenObject>this.detail;
    this.firebaseService.changeComponentenObjek(newObject);
    this.router.navigate(['/detail', this.id]);
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: {id: this.id, aks: this.detail.aks, name: this.detail.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(['/overview']);
        this.firebaseService.removComponentenObjek(this.id);

      }
    });
  }

  /**
   * Bewegt das Object im Array um eine position nach oben
   * @param {number} pos
   */
  upLiveObject(pos: number) {
    if (pos > 0) {
      const tempElement1: InterfaceLivevalueObject = this.detail.livevalue[pos - 1];
      const tempElement2: InterfaceLivevalueObject = this.detail.livevalue[pos];
      this.detail.livevalue[pos - 1] = tempElement2;
      this.detail.livevalue[pos] = tempElement1;
      console.log(`Livevalue one up`);
    } else {
      console.log(`Livevalue on top`);
    }
  }

  /**
   * Bewegt das Object im Array um eine position nach unten
   * @param {number} pos
   */
  downLiveObject(pos: number) {
    if (pos < this.detail.documents.length) {
      const tempElement1: InterfaceLivevalueObject = this.detail.livevalue[pos + 1];
      const tempElement2: InterfaceLivevalueObject = this.detail.livevalue[pos];
      this.detail.livevalue[pos + 1] = tempElement2;
      this.detail.livevalue[pos] = tempElement1;
      console.log(`Livevalue one down`);
    } else {
      console.log(`Livevalue on button`);
    }
  }

  /**
   * Entfernt ein Doc Object aus dem Array
   * Die Ànderung ist erst in der DB nach save()
   * @param {number} pos
   */
  removeDocObject(pos: number) {
    const tempArray = new Array<InterfaceDocumentObject>();
    for (let i = 0; i < this.detail.documents.length; i++) {
      if (i !== pos) {
        tempArray.push(this.detail.documents[i]);
      }
    }
    this.detail.documents = tempArray;
  }

  /**
   * Bewegt das Object im Array um eine position nach oben
   * @param {number} pos
   */
  upDocObject(pos: number) {
    if (pos > 0) {
      const tempElement1: InterfaceDocumentObject = this.detail.documents[pos - 1];
      const tempElement2: InterfaceDocumentObject = this.detail.documents[pos];
      this.detail.documents[pos - 1] = tempElement2;
      this.detail.documents[pos] = tempElement1;
    } else {
    }
  }

  /**
   * Bewegt das Object im Array um eine position nach unten
   * @param {number} pos
   */
  downDocObject(pos: number) {
    if (pos < this.detail.documents.length) {
      const tempElement1: InterfaceDocumentObject = this.detail.documents[pos + 1];
      const tempElement2: InterfaceDocumentObject = this.detail.documents[pos];
      this.detail.documents[pos + 1] = tempElement2;
      this.detail.documents[pos] = tempElement1;
    } else {
    }
  }

  /**
   * Hilsf Methode to Array
   * @param {InformationObject} data
   * @returns {InformationObject[]}
   */
  toArray(data: InformationObject): InformationObject[] {
    const returnValue = new Array<InformationObject>();
    if (data != null) {
      returnValue.push(data);
    }
    return returnValue;
  }

  openDialog(editObject, searchTable, searchProp1, searchProp2, maxItem) {


    const dialogRef = this.dialog.open(SelectorDialogComponent, {
      width: '85%', // 400px
      height: '70%', // 500px
      data: {
        editObject: editObject,
        searchTable: searchTable,
        searchProp1: searchProp1,
        searchProp2: searchProp2,
        maxItem: maxItem
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      switch (searchTable) {
        case 'document': {
          this.detail.documents = <DocumentObject[]>result;
          break;
        }

        case 'live': {
          this.detail.livevalue = <LivevalueObject[]>result;
          break;
        }
        case 'information': {
          if (result !== undefined) {
            if (result.length > 0) {
              this.detail.information = <InformationObject>result[0];
            } else {
              this.detail.information = null;
            }
          } else {
            this.detail.information = null;
          }
        }
      }
      this.dialogResult = result;
    });
  }
}
