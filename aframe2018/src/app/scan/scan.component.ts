import {AfterViewInit, Component, ViewChild, Input,ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TextureComponent} from './texture/texture.component';
import {ReadQrCodeService} from '../services/readQrCode/read-qr-code.service';
import{ loadFont } from 'load-bmfont';
import { TextureLoader } from 'three';
import {ThreeMSDF }from 'three-msdf';
// variable from three and ar.js library, they are initalized in angular.json scripts
declare let THREE: any;
declare let THREEx: any;

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements AfterViewInit {
  @Input() public childCanvas: any;

  public message;
  ctx: any;
  canvas: any;
  detail: any;
  id;
  element;
  constructor(private router: Router, private route: ActivatedRoute, private readQrCodeService: ReadQrCodeService) {

  }


  @ViewChild(TextureComponent) child;
  @ViewChild('css3Sandbox') css3SandboxEl: ElementRef;
  // make a reload to close webcam
  goHomeAndReload() {
    window.location.href = '../overview';
  }

  ngAfterViewInit() {
    this.augmented();
  }

  // route to detail view, load it new to close the webcam
  goToRoute() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('firebaseId');
      window.location.href = '../detail/' + this.id;
    });

  }

  augmented() {
    //////////////////////////////////////////////////////////////////////////////////
    // Init
    //////////////////////////////////////////////////////////////////////////////////
    // init rendere
   
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    }); 
    renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    renderer.setSize(640, 480);
    renderer.domElement.style.id = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';
    document.body.appendChild(renderer.domElement);
  
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 /*
//CSS3D renderer
const renderer = new THREE.CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = 0;
//css3SandbboxEl is bound to a div via @ViewChild('css3Sandbox')
this.css3SandboxEl.nativeElement.appendChild(renderer.domElement);
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // array of functions for the rendering loop
    const onRenderFcts = [];
    // init scene and camera
    const scene = new THREE.Scene();



    //////////////////////////////////////////////////////////////////////////////////
    // Initialize a basic camera
    //////////////////////////////////////////////////////////////////////////////////
    // Create a camera
    const camera = new THREE.Camera();
    
    scene.add(camera);
    ////////////////////////////////////////////////////////////////////////////////
    //          handle arToolkitSource
    ////////////////////////////////////////////////////////////////////////////////
    const arToolkitSource = new THREEx.ArToolkitSource({
      // to read from the webcam
      sourceType: 'webcam'
      // // to read from an image
      // sourceType : 'image',
      // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
      // to read from a video
      // sourceType : 'video',
      // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
    });
    arToolkitSource.init(function onReady() {
      onResize();
    });

    // handle resize
    window.addEventListener('resize', function () {
      onResize();
    });

    function onResize() {
      arToolkitSource.onResizeElement();
      arToolkitSource.copyElementSizeTo(renderer.domElement);
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
      }
    }

    ////////////////////////////////////////////////////////////////////////////////
    //          initialize arToolkitContext
    ////////////////////////////////////////////////////////////////////////////////

    // create atToolkitContext
    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
      detectionMode: 'mono',
    });
    // initialize it
    arToolkitContext.init(function onCompleted() {
      // copy projection matrix to camera
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });
    // update artoolkit on every frame
    onRenderFcts.push(function () {
      if (arToolkitSource.ready === false) {
        return;
      }
      arToolkitContext.update(arToolkitSource.domElement);

      // update scene.visible if the marker is seen
      scene.visible = camera.visible;
    });

    ////////////////////////////////////////////////////////////////////////////////
    //          Create a ArMarkerControls
    ////////////////////////////////////////////////////////////////////////////////

    // init controls for camera
    const markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
      type: 'pattern',
      patternUrl: THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
      // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
      // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
      changeMatrixMode: 'cameraTransformMatrix'
    });
    // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
    scene.visible = false;
    //////////////////////////////////////////////////////////////////////////////////
    // add an object in the scene
    //////////////////////////////////////////////////////////////////////////////////

   this.canvas = this.child.childCanvas2;
    this.ctx = this.child.childCanvas2.getContext('2d');
    const texture = new THREE.Texture(this.canvas);
   // texture.magFilter = THREE.NearestFilter;
   texture.minFilter = THREE.LinearFilter; // LinearFilter

  

    const material = new THREE.MeshBasicMaterial({map: texture, color: 0xFFFFFF, transparent: true, opacity: 0.9});
    const geometry = new THREE.PlaneGeometry(2.15, 1, 1); // 2.5 0.8 1 x,y,z
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.2; // height from hiro marker
    mesh.rotation.x = -Math.PI / 2; // display horizontal
    scene.add(mesh);
    

 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
const element = document.createElement('div');
element.innerHTML = 'Plain text inside a div.';
 element.className = 'three-div';
const element3d = new THREE.CSS3DObject(element);
 element3d.position.y = 1.2; 
 
 this.css3SandboxEl.nativeElement.appendChild(renderer.domElement);
scene.add(element3d);
*/
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////////////
    // render the whole thing on the page
    //////////////////////////////////////////////////////////////////////////////////
    // render the scene
    onRenderFcts.push(function (delta) {
      renderer.render(scene, camera);
    });

    // run the rendering loop
    let lastTimeMsec = null;
    // to use Qr Service in requestAnimatation()
    const that = this;
    // updated 60 fps
    requestAnimationFrame(function animate(nowMsec) {
      // keep looping
      if (arToolkitContext.arController !== null) {
        // check always for new QR Codes
        that.readQrCodeService.getCanvas2d(arToolkitContext.arController.canvas.getContext('2d'));
      }
     
   texture.needsUpdate = true;      
      requestAnimationFrame(animate);
      // measure time
      lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
      const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec = nowMsec;
      // call each update function
      onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000);
      });

    });

  }

}
