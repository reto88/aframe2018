import {Injectable} from '@angular/core';
import jsQR from 'jsqr';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReadQrCodeService {

  constructor(private router: Router) {
  }
 // return URL from QR Code, input is imaage from Webcam
  getCanvas2d(canvas2d) {
   let oldid;
   let id;
    const imageData = canvas2d.getImageData(0, 0, 480, 640);
    // jsQR library
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
    if (qrCode !== null) {
      const paragraph = qrCode.data;
      const searchTerm = 'scan/';
      const indexOfFirst = paragraph.indexOf(searchTerm);
      // id is everything after scan, scan is 5 length
      id = paragraph.substr(indexOfFirst + 5);

      if (id !== oldid) {
        oldid = id;
        this.router.navigate(['/scan', id]);
      }
    }

  }
}



