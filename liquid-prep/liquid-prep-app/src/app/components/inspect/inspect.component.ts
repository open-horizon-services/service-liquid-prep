import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.scss']
})
export class InspectComponent implements OnInit {
  @ViewChild('mat_card_header', {static: false, read: ElementRef})
  matCard: ElementRef;
  @ViewChild('camera', {static: false, read: ElementRef})
  camera: ElementRef;
  @ViewChild('front_camera', {static: false, read: ElementRef})
  frontCamera: ElementRef;

  columns: string[] = ['label', 'score', 'min', 'max'];
  dataSource: any[] = [];

  isCameraDisabled = false;
  cameraOn = true;
  webcamImage: WebcamImage = null;
  prevJson!: any;
  timer!: any;
  intervalMS = 10000;
  uploaded = '';
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  showWebcam = true;
  host: string;
  lastActive: number;
  cutoff: string;
  images: any[] = [];
  platform: string = '';
  cameraHeight: number = 261;
  cameraWidth: number = 481;
  matCardHeight: number;
  matCardWidth: number;
  allowCameraSwitch = true;
  deviceId: string;
  multipleWebcamsAvailable = false;
  errors: WebcamInitError[] = [];

  constructor(
    private router: Router, private location: Location,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    document.body.addEventListener('click', () => {
      this.lastActive = Date.now();
      this.resetTimer();
    }, true);
    this.host = `${location.protocol}${location.host}`;
    //this.isCameraDisabled = location.hostname.indexOf('localhost') < 0 && location.protocol !== 'https';

    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0)

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0)

    // this.ctx = this.canvas.nativeElement.getContext('2d');
    this.setInterval(this.intervalMS);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?:any) {
    if(this.cameraOn) {
      this.getMatCardSize();
      this.drawComponent();
    }
  }
  getMatCardSize() {
    this.cameraHeight = this.matCardHeight = this.matCard.nativeElement.offsetHeight;
    this.cameraWidth = this.matCardWidth = this.matCard.nativeElement.offsetWidth;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
  dataURItoBlob(dataURI: any, type: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
     }
    const blob = new Blob([int8Array], { type: type });
   return blob;
  }
  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    let data = webcamImage.imageAsDataUrl.split(',');
    let dataType = data[0].split(';');
    let type = dataType[0].split(':')[1];
    const imageBlob = this.dataURItoBlob(data[1], type);
    let imageFile = new File([imageBlob], 'snapshot.jpg', {type: type});
    this.uploadPhoto(imageFile);
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public goHome() {
    this.location.back();
  }
  doubleClick(evt: Event) {
    evt.preventDefault();
    this.frontCamera.nativeElement.innerHTML = 'camera_front';
  }
  toggleClientCamera(evt: Event) {
    evt.preventDefault();
    if(this.camera.nativeElement.innerHTML !== 'camera_alt') {
      console.log('Please turn of server camera before turning on client camera');
    }
    this.showWebcam = true;
    this.frontCamera.nativeElement.innerHTML = 'camera';
    console.log('client camera')
    this.triggerSnapshot();
  }
  setInterval(ms: number) {
    this.timer = setInterval(async () => {
      this.loadJson(`/static/js/image.json`);
    }, ms);
  }
  resetTimer() {
    clearInterval(this.timer);
    this.setInterval(this.intervalMS);
  }
  loadJson(file: any) {
    if(Date.now() - this.lastActive > 180000) {
      clearInterval(this.timer);
      return;
    }
    this.http.get(file)
    .subscribe((data: any) => {
      console.log('json', data)
      try {
        if(JSON.stringify(data) !== JSON.stringify(this.prevJson)) {
          console.log(data)
          if(data) {
            if(data.outdated === true) {
              this.http.get(`/init`)
              .subscribe((data) => {
                this.resetTimer();
                this.loadJson(file);
              });
            } else {
              this.prevJson = data;
              this.cutoff = ''+this.prevJson.confidentCutoff.toFixed(2);
              this.drawComponent();
            }
          }
        }  
      } catch(e) {
      }
    });
  }
  drawComponent() {
    if(this.prevJson) {
      let vobj = this.prevJson.version || undefined;
      let version = vobj ? `Model: ${vobj.name} v${vobj.version}` : 'version missing';
      this.platform = `${this.prevJson.platform} | ${version}`;
      let keys = Object.keys(this.prevJson.images);
      this.images = [];
      keys.forEach((key) => {
        this.images.push({name: key, class: key.replace(/\/|\./g, '-')});
      })
      let cnt = 0;
      while(cnt < 5 && keys.length > 0 && !document.querySelector(`.${keys[keys.length-1].replace(/\/|\./g, '-')}`)) {
        this.sleep(1000);
        cnt++;
      }
      setTimeout(() => this.preDraw(), 2000);  
    }
  }
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  preDraw() {
    this.images.forEach((image) => this.drawImage(image));
  }
  drawImage(image: any) {
    let objDetected:any = {};
    let el = <HTMLCanvasElement> document.querySelector(`.${image.class}`);
    let ctx = el.getContext('2d');
    let canvas = ctx.canvas;
    let img = new Image();
    let currentImage = this.prevJson.images[image.name];
    image.infoText = ` | Inference time: ${parseFloat(currentImage.elapsedTime).toFixed(2)}`;

    img.addEventListener('load', () => {
      let { naturalWidth: width, naturalHeight: height } = img;
      console.log('loaded', width, height)
      let aRatio = width/height;
      this.cameraWidth = canvas.width = this.matCardWidth;
      this.cameraHeight = canvas.height = canvas.width / aRatio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      height = canvas.height;
      width = canvas.width;
      aRatio = width/height;
      let dataSource: any[] = [];
      currentImage.bbox.forEach((box: any) => {
        let bbox = box.detectedBox;
        if(objDetected[box.detectedClass]) {
          objDetected[box.detectedClass]++;
        } else {
          objDetected[box.detectedClass] = 1;
        }
        dataSource.push({
          label: box.detectedClass,
          score: parseFloat(box.detectedScore).toFixed(2),
          min: `(${(bbox[0]/aRatio).toFixed(2)},${(bbox[1]/aRatio).toFixed(2)})`,
          max: `(${(bbox[2]/aRatio).toFixed(2)},${(bbox[3]/aRatio).toFixed(2)})`
        })

        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.strokeStyle = 'yellow';
        ctx.fillRect(bbox[1] * (width / aRatio), bbox[0] * (height / aRatio), width / aRatio * (bbox[3] - bbox[1]),
        height / aRatio * (bbox[2] - bbox[0]));
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`${box.detectedClass}: ${box.detectedScore}`, +parseFloat((bbox[1] * width).toString()).toFixed(2), +parseFloat((bbox[0] * height).toString()).toFixed(2), +parseFloat((bbox[0] * height).toString()).toFixed(2));
        ctx.lineWidth = 2;
        ctx.strokeRect(+parseFloat((bbox[1] * width).toString()).toFixed(2), +parseFloat((bbox[0] * height).toString()).toFixed(2), +parseFloat((width * (bbox[3] - bbox[1])).toString()).toFixed(2), +parseFloat((height * (bbox[2] - bbox[0])).toString()).toFixed(2));
      })
      image.dataSource = dataSource;
    });
    img.src = `${image.name}?${new Date().getTime()}`;

  }
  drawBBox() {
    console.log('choose a file')

  }
  hideCamera() {
    this.frontCamera.nativeElement.innerHTML = 'camera_front';
    this.showWebcam = false;
  }
  uploadPhoto(imageFile: any) {
    clearInterval(this.timer);
    let formData = new FormData();
    formData.append('imageFile', imageFile);
    this.http.post<any>(`/upload`, formData)
    .subscribe((res) => {
      console.log(res)
      console.log(`${imageFile.name} uploaded successfully.`)
      // this.uploaded = " - Uploaded!";
      this.resetTimer();
    }, (err) => {
      console.log(err);
      this.uploaded = " - Upload failed!";
    });

  }
}
