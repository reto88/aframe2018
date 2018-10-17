import {Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FirebaseService} from '../../services/firebase/firebase.service';
import {InterfaceComponentObject, InterfaceLivevalueObject} from '../../services/firebase/InterfaceComponentObject';
import {Realtime2Service} from '../../services/realtime/realtime2.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-texture',
  templateUrl: './texture.component.html',
  styleUrls: ['./texture.component.scss', '../../app.component.scss']
})
export class TextureComponent implements AfterViewInit, OnDestroy {
  @Output() imageDataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() public ChildEvent = new EventEmitter();
  id;

constructor(private route: ActivatedRoute, private router: Router, private authservice: AuthService,
            private firebaseService: FirebaseService, private realtimeservice: Realtime2Service) {

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const id = this.route.snapshot.paramMap.get('firebaseId');
        this.getDetail(id);
      }
    });
  }

  @ViewChild('canvas') canvasRef: ElementRef;
  canvas: any;
  ctx: any;
  detail;
  isSub: Boolean;
  childCanvas2;
  texts: string[] = ['WAIT', '', '', '', ''];
  LiveValueObject: InterfaceLivevalueObject[];
  isloading: boolean;

  // If not logged in show info to log in
  ngAfterViewInit(): void {

    this.authservice.user.subscribe((user) => {
      if (user) {
        this.paint('wait for Data...');
        this.getDetail(id);
      } else {
        this.paint('please Login / Press back Button');
      }
    });

    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.canvas = this.canvasRef.nativeElement;
    this.childCanvas2 = this.canvas;
    const id = this.route.snapshot.paramMap.get('firebaseId');
    this.getDetail(id);
    this.isloading = true;
   this.canvas.style.display = 'none';  // dont show canvas

  }
                 
  getFont() {
    let fontBase = 1024;                // selected default width for canvas
    let fontSize = 70;     // default size for font
    let ratio = fontSize / fontBase;   // calc ratio
    let size = this.canvas.width * ratio;   // get font size based on current width
    console.log('size'+size);
    return (size|0) + 'px sans-serif'; // set font
  }

// draw canvas for AR
  paint(data) {
    this.ctx.font = this.getFont();    
  //  this.ctx.font = '50 Arial';
  console.log('font'+ this.getFont());
    this.ctx.fillStyle = '	#000000';//'#2196f3'; // '#be0000'; // background color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white'; // Font Color
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'left';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = '10';
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.stroke();
    this.texts[0] = '';
    this.texts[1] = '';
    this.texts[2] = '';
    this.texts[3] = '';
    this.texts[4] = '';
    this.texts[5] = '';
    if (this.isloading) {
      this.texts[3] = data;
    } else {
      this.texts[0] = this.detail.name;
      this.texts[1] = '';
      this.texts[2] = '';
      this.texts[3] = '';
      this.texts[4] = '';
      this.texts[5] = '';
      for (let i = 0; i < this.detail.livevalue.length; i++) {
        this.texts[i + 1] = this.detail.livevalue[i].name.trim() + ': ' + this.detail.livevalue[i].value + ' ' +
          this.detail.livevalue[i].unit;
         
      }
    }
    this.ctx.fillText(this.texts[0], 10, 40, 600); // x, y, length
    this.ctx.fillText(this.texts[1], 10, 100, 600);
    this.ctx.fillText(this.texts[2], 10, 140, 600);
    this.ctx.fillText(this.texts[3], 10, 180, 600);
    this.ctx.fillText(this.texts[4], 10, 220, 600);
    this.ctx.fillText(this.texts[5], 10, 260, 600);

    this.imageDataEmitter.emit(this.canvas);
  }
 
  
  //array[0] = "Hello There"
  //array[1] = "Canvas" 
// Get detail object from firebase db
  getDetail(id: string) {
    this.isloading = true;
    if (this.isSub === true) {
      this.realtimeservice.unsubscribe();
      this.isSub = false;
    }
// show live value start subscribe realtime service
    this.firebaseService.getComponentenObjektObs(id)
      .subscribe(data => {
        this.detail = <InterfaceComponentObject>data;
        this.isloading = true;
        if (this.detail.livevalue != null) {
          this.dosubscribe(this.detail.livevalue);
        }
      });
  }

  dosubscribe(livevalues: InterfaceLivevalueObject[]) {
    this.realtimeservice.getData(livevalues).subscribe(
      data => {
        // important to close subscription on destroy
        this.isSub = true;
        this.detail.livevalue = data;
        this.isloading = false;
        this.paint('');
      }
    );
  }

  ngOnDestroy() {
    if (this.isSub === true) {
      this.realtimeservice.unsubscribe();
      this.isSub = false;
    }
  }
}
