import { Component,AfterViewInit, OnInit, OnDestroy,ViewChild,ElementRef } from '@angular/core';
import { loadFont } from 'load-bmfont';
import { TextureLoader } from 'three';
import { ThreeMSDF } from 'three-msdf';
import { Realtime2Service } from '../../services/realtime/realtime2.service';
import { InterfaceComponentObject, InterfaceLivevalueObject } from '../../services/firebase/InterfaceComponentObject';
import { LivevalueObject } from '../../services/firebase/LivevalueObject';

declare let THREE: any;
declare let THREEx: any;
@Component({
  selector: 'app-aframe',
  templateUrl: './aframe.component.html',
  styleUrls: ['./aframe.component.scss', '../../app.component.scss']
})
export class AframeComponent implements AfterViewInit, OnDestroy {

  constructor(private realtimeservice: Realtime2Service) { }
  @ViewChild('a-canvas') myCanvas: ElementRef;
public context: CanvasRenderingContext2D;
  test = 9090;
  isSub;
  isloading;
  myLiveObject: LivevalueObject[];
  lastTimeMsec;
  
  ngAfterViewInit() {
    this.augmented();
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

 //   console.log('aframe' + JSON.stringify(this.myLiveObject[0]));
  this.dosubscribe(this.myLiveObject);
  }
  goHomeAndReload() {
    window.location.href = '../overview';
  }
  dosubscribe(livevalues: InterfaceLivevalueObject[]) {

    console.log('aframe2' + JSON.stringify(this.myLiveObject[0]));
    this.realtimeservice.getData(livevalues).subscribe(
      data => {
        // important to close subscription on destroy
        this.isSub = true;
        console.log('mydata' + data);
        this.isloading = false;

      }
    );
  }
  ngOnDestroy() {
    if (this.isSub === true) {
      this.realtimeservice.unsubscribe();
      this.isSub = false;
    }
  }
  augmented() {
    const onRenderFcts = [];
   // run the rendering loop
   let lastTimeMsec = null;
   // to use Qr Service in requestAnimatation()
   const that = this;
   // updated 60 fps
   requestAnimationFrame(function animate(nowMsec) {
     // keep looping
 // console.log('looping');
    
     
     requestAnimationFrame(animate);
     // measure time
     lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
     const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
     lastTimeMsec = nowMsec;
     // call each update function
   

   });




  }

}