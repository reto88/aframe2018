import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseService} from '../services/firebase/firebase.service';
import {environment} from '../../environments/environment';
import {DataInputHeader} from '../common/input-header/input-header.component';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', '../app.component.scss']
})
export class CreateComponent implements OnInit {
  aks: string;
  nameElement: string;
  idDB: string;
  compType = 'Undefined';
  dataValid: boolean;
  environment;

  constructor(private router: Router, private route: ActivatedRoute, private firebaseService: FirebaseService) {
    this.environment = environment;
    this.dataValid = false;
  }

  ngOnInit() {
  }

  newData(data: DataInputHeader) {
    this.dataValid = data.inputValide;
    this.aks = data.aks;
    this.nameElement = data.name;
    this.compType = data.type;
  }

  newType(dout: string) {
  console.log(dout);
}

  createNew(){
    if (this.dataValid) {
      this.idDB = this.firebaseService.newComponentenObject(this.aks, this.nameElement, this.compType);
      this.router.navigateByUrl('/edit/' + this.idDB);
      console.log('Neues Element in DB erstellt mit id: ' + this.idDB);
    } else {
      console.log('keine korrekte Eingabe');
    }
  }
}
