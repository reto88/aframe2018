import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-checkt-stringelement',
  templateUrl: './checkt-stringelement.component.html',
  //styleUrls: ['./checkt-stringelement.component.scss', '../../detail.component.scss', '../../detail.component.scss' ]
  styleUrls: ['./checkt-stringelement.component.scss' ]
})


export class ChecktStringelementComponent {

  @Input() show: boolean;
  @Input() valueE: string;
  @Input() nameValue: string;


  checkContent(input: string): boolean {
    if (input !== null && typeof(input) === 'string' && input !== undefined && this.show === true) {
      return true;
    } else {
      return false;
    }
  }
}
