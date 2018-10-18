import { Component,AfterViewInit, OnInit, OnDestroy,ViewChild,ElementRef} from '@angular/core';
import { loadFont } from 'load-bmfont';
import { TextureLoader } from 'three';
import { ThreeMSDF } from 'three-msdf';
import { Realtime2Service } from '../../services/realtime/realtime2.service';
import { InterfaceComponentObject, InterfaceLivevalueObject } from '../../services/firebase/InterfaceComponentObject';
import { LivevalueObject } from '../../services/firebase/LivevalueObject';

import { DOCUMENT } from '@angular/common'; 
declare let THREE: any;
declare let THREEx: any;
@Component({
  selector: 'app-aframe',
  templateUrl: './aframe.component.html',
  styleUrls: ['./aframe.component.scss', '../../app.component.scss']
})
export class AframeComponent implements AfterViewInit, OnDestroy {
  live= [{
    "aks" : "65NT_MET51_B870_M00",
    "id" : "-LMwSBnGaVIaoPUCbIY5",
    "name" : "Aussentemperatur",
    "numericId" : "3200000",
    "timestamp" : "1",
    "unit" : "°C        ",
    "value" : 1
  },{
    "aks" : "65NT_MET51_B870_M08",
    "id" : "-LMwSBnh3kxDZFkj4tVd",
    "name" : "Globalstrahlung",
    "numericId" : "3200008",
    "timestamp" : "1",
    "unit" : "W/m^2     ",
    "value" : 1
  },{
    "aks" : "65NT_MET51_B870_M07",
    "id" : "-LOYEFkF3WiVi5cb5vd6",
    "name" : "Niederschlagsstatus",
    "numericId" : "3200007",
    "timestamp" : "1",
    "unit" : "-         ",
    "value" : 1
  }
]

  constructor(private realtimeservice: Realtime2Service) { }
  @ViewChild('a-canvas') myCanvas: ElementRef;
public context: CanvasRenderingContext2D;
context2;
  test;
  test1;
  isSub;
  isloading;
  myLiveObject: LivevalueObject[];
  lastTimeMsec;
  
  ngAfterViewInit() {
 
    this.augmented();
 //   var canvas = document.getElementById('a-canvas');
   // var ctx = canvas;
  //  console.log(ctx+ 'ctx');

 //   console.log('aframe' + JSON.stringify(this.myLiveObject[0]));
  this.dosubscribe(this.live);
  console.log(this.live);
  }
  goHomeAndReload() {
    window.location.href = '../overview';
  }
  dosubscribe(livevalues: InterfaceLivevalueObject[]) {
    console.log('aframe2!!!!!!!!!!!!!' + JSON.stringify(livevalues));
    this.realtimeservice.getData(livevalues).subscribe(
      data => {
        // important to close subscription on destroy
        this.isSub = true;
        console.log('mydata' + JSON.stringify(data));
        this.isloading = false;

      this.test=data[0].value || 41;
      this.test1=data[1].value || 42;
      console.log(this.test1+'test1');
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