import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {InterfaceComponentObject} from '../../services/firebase/InterfaceComponentObject';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss']
})
export class OverviewCardComponent implements OnInit, OnDestroy {

  value: string;
  objecttoShow: InterfaceComponentObject[];
  show = false;
  objects: InterfaceComponentObject[];
  received: boolean;
  objectFilterAKS: any = {aks: ''};
  dataReceived: boolean;
  isLoading: boolean;


  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit() {
    this.loadAllObjects();
    this.isLoading = true;
  }

  loadAllObjects() {
    return this.firebaseService.getComponentObjectList()
      .subscribe(
        response => {
          this.dataReceived = true;
          this.objects = response;
          this.objecttoShow = this.objects;
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this.received = false;
  }
}
