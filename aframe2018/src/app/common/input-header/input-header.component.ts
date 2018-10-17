import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-input-header',
  templateUrl: './input-header.component.html',
  styleUrls: ['./input-header.component.scss']
})

export class InputHeaderComponent implements OnInit {
  @Input() valuAKS: string;
  @Input() valueName: string;
  @Input() typeSelection: string [];
  @Input() typDefault: string;
  @Output() changeValue = new EventEmitter<DataInputHeader>();

  newValueAKS: string;
  newValueName: string;
  newType: string;
  theForm;






  constructor() {



    this.newValueName = this.valueName;
    this.newValueAKS = this.valuAKS;
  }

  ngOnInit() {
    this.theForm = new FormGroup({
      'aks': new FormControl(this.valuAKS, [Validators.required, Validators.minLength(5)]),
      'name': new FormControl(this.valueName, [Validators.required, Validators.minLength(5)]),
    });
    this.newType = this.typDefault;
  }
  onChaneType(newType: string) {
    this.newType = newType;
    this.onSubmit();
  }

  onSubmit() {
    if (this.theForm.valid) {
      this.changeValue.emit({
        aks: this.theForm.value.aks,
        name: this.theForm.value.name,
        type: this.newType,
        inputValide: true
      });
    } else {
      this.changeValue.emit({
        aks: this.theForm.value.aks,
        name: this.theForm.value.name,
        type: this.newType,
        inputValide: false
      });
    }
  }

  get name() { return this.theForm.get('name'); }

}

//Interface für Rückgabewerte
export interface DataInputHeader {
  aks: string;
  name: string;
  type: string;
  inputValide: boolean;
}
