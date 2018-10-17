import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-item-change',
  templateUrl: './item-change.component.html',
  //styleUrls: ['./item-change.component.scss', '../../edit.component.scss', '../../../app.component.scss']
  styleUrls: ['./item-change.component.scss']
})
export class ItemChangeComponent implements OnInit {
  @Input() show: boolean;
  @Input() text: string;
  @Input() text2: string;
  @Input() pos: number;
  @Input() lenge: number;
  //@Output() remove = new EventEmitter<number>();
  @Output() up = new EventEmitter<number>();
  @Output() down = new EventEmitter<number>();



  constructor() { }

  ngOnInit() {
  }
  checkContent(input: string): boolean {
    if (input !== null && typeof(input) === 'string' && input !== undefined && this.show === true) {
      return true;
    } else {
      return false;
    }
  }

  checkFirst(pos: number): boolean {
    if (pos > 0 ){
      return false;
    } else {
      return true;
    }
  }
  checkLast(pos: number): boolean {
    if (pos < this.lenge - 1 ){
      return false;
    } else {
      return true;
    }
  }

}
