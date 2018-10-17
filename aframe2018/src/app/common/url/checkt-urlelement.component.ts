import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-checkt-urlelement',
  templateUrl: './checkt-urlelement.component.html',
  styleUrls: ['./checkt-urlelement.component.scss']
})
export class ChecktUrlelementComponent  {

  @Input() show: boolean;
  @Input() url: string;
  @Input() nameUrl: string;


  checkContent(input: string): boolean {
    if (input !== null && typeof(input) === 'string' && input !== undefined && this.show === true) {
      return true;
    } else {
      return false;
    }
  }

}
