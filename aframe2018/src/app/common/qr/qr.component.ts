import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss', '../../app.component.scss']
})
export class QrComponent implements OnInit {
  myQrCode;
  id;
  @Input() aks: string;

  @Output() isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('firebaseId');
    this.myQrCode = environment.baseUrl + this.id;
    console.log('qr'+this.myQrCode);

  }

// print code
  printfunction() {
    window.print();
  }

  // to close qr view
  onClose() {
    this.isLoaded.emit(false);
  }
}
