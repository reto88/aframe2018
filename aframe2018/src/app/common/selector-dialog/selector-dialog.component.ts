import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData, LoginDialogComponent} from '../../auth/login/login-dialog/login-dialog.component';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {LivevalueObject} from '../../services/firebase/LivevalueObject';
import {InformationObject} from '../../services/firebase/InformationObject';
import {DocumentObject} from '../../services/firebase/DocumentObject';


@Component({
  selector: 'app-selector-dialog',
  templateUrl: './selector-dialog.component.html',
  styleUrls: ['./selector-dialog.component.scss']
})
export class SelectorDialogComponent implements OnInit {

  isLoading: boolean;
  allInformations: InformationObject[];
  allLiveValues: LivevalueObject[];

  uniqueSearchGroups;
  searchArray;
  newItemObject;
  newItemObject2;
  dialogResult;
  selectedInformations;
  inputEditObject;

// this.selectedInformations = this.data.editObject[0].searchArray;
  constructor(private firebaseService: FirebaseService,
              private thisDialogRef: MatDialogRef<SelectorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.thisDialogRef.disableClose = true;
  }

  ngOnInit() {
    // Check if already an object exist --> edit
    if (this.data.editObject.length >= 1) {
      this.selectedInformations = this.getObjectWithSearchArray(this.data.editObject, this.data.searchProp1, this.data.searchProp2);
    }
    // check which data has to be qrLoaded from firebase db
    switch (this.data.searchTable) {
      case 'document': {
        this.getDocumentObject(this.data.searchProp1, this.data.searchProp2);
        break;
      }
      case 'live': {
        this.getLiveValueObject(this.data.searchProp1, this.data.searchProp2);
        break;
      }
      case 'information': {
        this.getInformationObject(this.data.searchProp1, this.data.searchProp2);
      }

    }
  }

// get InformationObject from Firebase db and set it to ng-select
  getInformationObject(searchProp1, searchProp2) {
    this.isLoading = true;
    this.firebaseService.getInformationObjectList().subscribe(
      data => {
        this.isLoading = false;
        this.allInformations = data;
        // search array with two seatch properties
        this.newItemObject2 = this.getObjectWithSearchArray(this.allInformations, searchProp1, searchProp2);
        console.log('data' + JSON.stringify(data));
      }
    );
  }

// get LiveValueObject from Firebase db and set it to ng-select
  getLiveValueObject(searchProp1, searchProp2) {
    this.isLoading = true;
    this.firebaseService.getLivevalueObjectList().subscribe(
      data => {
        this.isLoading = false;
        this.allLiveValues = data;

        // search array with two search properties
        this.newItemObject2 = this.getObjectWithSearchArray(this.allLiveValues, searchProp1, searchProp2);
      }
    );
  }

// get DocumentObject from Firebase db and set it to ng-select
  getDocumentObject(searchProp1, searchProp2) {
    this.isLoading = true;
    this.firebaseService.getDocumentObjectList().subscribe(
      data => {
        this.isLoading = false;
        this.allLiveValues = data;
        // search array with two seatch properties
        this.newItemObject2 = this.getObjectWithSearchArray(this.allLiveValues, searchProp1, searchProp2);
      }
    );

  }

// set Search array for ng select add two rows to array
  getObjectWithSearchArray(objectArr, searchProp1, searchProp2) {
    const arrayGroup = new Array<any>();
    for (const item of objectArr) {

      if (searchProp2 === '') {
        this.searchArray = item[searchProp1];
      } else {
        this.searchArray = item[searchProp1] + ' ' + item[searchProp2];
      }
      item['searchArray'] = this.searchArray;
      arrayGroup.push(item);
      this.newItemObject = arrayGroup;
    }
    this.uniqueSearchGroups = Array.from(new Set(this.searchArray));
    return this.newItemObject;
  }

  onCloseConfirm() {
    this.thisDialogRef.close(this.selectedInformations);
  }

  onCloseCancel() {
    this.thisDialogRef.close(this.data.editObject);
  }

}
