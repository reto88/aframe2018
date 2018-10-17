import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatSort} from '@angular/material';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {InterfaceComponentObject} from '../../services/firebase/InterfaceComponentObject';


export interface TableObject {
  id: string;
  name: string;
  aks: string;
  group: string;
}

const ELEMENT_DATA: TableObject[] = [
  {id: '1', name: 'Wp', aks: '65NT_EXP03_E100', group: 'unit'}
];


@Component({
  selector: 'app-overview-list',
  templateUrl: './overview-list.component.html',
  styleUrls: ['./overview-list.component.scss']
})
export class OverviewListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'aks']; // Table colum names
  dataSource;
  objects: InterfaceComponentObject[];
  isLoading: boolean;

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit() {
    this.loadAllObjects();
    this.isLoading = true;
  }

// get all Komponentenobject from firebase Db
  loadAllObjects() {
    return this.firebaseService.getComponentObjectList()
      .subscribe(
        response => {
          this.objects = response;
          ELEMENT_DATA[0].name = response[0].name;
          ELEMENT_DATA[0].aks = response[0].aks;
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.objects);
        }
      );
  }

// Search filter and return just filtered value

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterIt(searchKey) {
    return this.objects.filter(obj => Object.keys(obj).some(key => obj[key].includes(searchKey)));
  }


}
