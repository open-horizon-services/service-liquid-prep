import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { WebSocketService } from 'src/app/service/web-socket.service';

import { DialogComponent } from '../dialog/dialog.component';

export class Device {
  status?: any;
  timeSeries: TimeSeries;
  sensorType: SensorType;
  constructor() {
    this.timeSeries = new TimeSeries;
  }
}
export class TimeSeries {
  id?: string;
  name?: string;
  mac?: string;
  lastUpdate?: any;
  moisture?: number;
  sensorType?: SensorType;
}
interface DisplayTimeSeries extends TimeSeries {
  displayMoisture?: number;
}
export interface IServer {
  edgeGateway: string;
  espNowGateway: string;
  ws: string;
}

export enum SensorType {
  oldSensor = 'OldSensor',
  plantMate = 'PlantMate',
}

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})
export class SensorsComponent implements OnInit {
  displayedColumns = ['name', 'moisture', 'lastUpdate', 'action', 'sensorType']; 
  sensorTypes = [SensorType.oldSensor, SensorType.plantMate];


  onSensorTypeChange(element: any, newType: string) {
    element.sensorType = newType;
    const displayMoisture = this.processReading(element.moisture, newType);
    element.displayMoisture = displayMoisture; 
    this.dataSource.data = [...this.dataSource.data];
  }

  devices: TimeSeries[] = [];
  columns: string[] = ['name', 'moisture', 'lastUpdate', 'action'];
  dataSource = new MatTableDataSource<TimeSeries>([]);
  device: Device;
  timeSeries = {};
  actions = [
    {value: 'device_name', text: 'Device Name'},
    {value: 'air_value', text: 'Calibrate Air'},
    {value: 'water_value', text: 'Calibrate Water'},
    {value: 'esp_interval', text: 'Interval'},
    {value: 'ping', text: 'Ping Sensor'},
    {value: 'query', text: 'Query Sensor'},
    {value: 'moisture', text: 'Get Moisture Reading'},
    {value: 'enable_bluetooth', text: 'Enable Bluetooth'},
    {value: 'disable_bluetooth', text: 'Disable Bluetooth'},
    {value: 'update_pin', text: 'Update Input Pin'},
  ];
  dialogRef: any;
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  espNowGateway = 'http://192.168.1.48';
  edgeGateway = 'http://192.168.1.138:3003';
  ws = 'ws://192.168.1.138:3003';
  servers: IServer;
  showServers = false;
  
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.servers = this.webSocketService.getServers();
    if(this.servers) {
      this.edgeGateway = this.servers.edgeGateway;
      this.espNowGateway = this.servers.espNowGateway;
      this.ws = this.servers.ws;
    }
    this.fetchTimeSeries();
  }
  fetchTimeSeries() {
    this.http.get<Device>(`${this.edgeGateway}/log`)
      .subscribe(
        (data) => {
          this.device = data;
          let oldData = this.webSocketService.getSensorData() || {};
          this.timeSeries = Object.assign(oldData, data.timeSeries);
          this.webSocketService.saveSensorData(this.timeSeries);
          console.log(this.device)
          this.listDevice(this.timeSeries)
        }
      )
  }
  toggleServers() {
    this.showServers = !this.showServers;
  }
  saveServers() {
    console.log('save')
    this.webSocketService.saveServers({edgeGateway: this.edgeGateway, espNowGateway: this.espNowGateway, ws: this.ws});
  }
  refresh() {
    console.log('refresh')
    this.fetchTimeSeries();
  }
  recommend(mac: string) {
    console.log(mac)
  }
  listDevice(devices: TimeSeries) {
    let data: TimeSeries[] = [];
    Object.keys(devices).forEach((key) => {
      console.log('**', devices[key])
      let element = devices[key];
      element.mac = key;
      this.devices.push(element);
      data.push({
        ...element, 
        moisture: this.processReading(element.moisture, element.sensorType), 
        lastUpdate: new Date(element.lastUpdate).toLocaleTimeString(navigator.language, {month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'})
      })
      this.dataSource.data = data;
    })
  }
  openDialog(payload: any, cb: any) {
    this.dialogRef = this.dialog.open(DialogComponent, {
      hasBackdrop: true,
      width: payload.width || '300px',
      height: 'auto',
      panelClass: 'custom-modalbox',
      data: payload
    })
    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.dialog.closeAll();
      cb(result);
    })
  }
  showMessage(msg: string, action: string = 'OK') {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 3000;
    this.snackBar.open(msg, action, config);
  }
  showDialog(row: string) {
    let sensor = this.timeSeries[row]
    console.log(row, sensor)
    this.openDialog({title: sensor.name, ws: this.ws, espnow: this.espNowGateway, type: 'input', placeholder: 'Sensor', buttons: {ok: 'Run'}, object: this.actions, mac: sensor.mac}, (resp: any) => {
      if (resp) {
        console.log(resp);
        this.showMessage('Condition has been saved.')
      }
    })
  }  

  processOldSensor(reading: number): number {
    // Y = -64.13 + 2.001x - 0.01049x^2
    return Math.round((-64.13 + (2.001 * reading) - (0.01049 * reading * reading)) * 100) / 100;
  }

  processPlantMate(reading: number): number {
    // Y = 7.845 - 0.1526x + 0.004196x^2
    return Math.round((7.845 - (0.1526 * reading) + (0.004196 * reading * reading)) * 100) / 100;
  }

  processReading(moisture: number, sensorType: string): number {
    switch (sensorType) {
      case SensorType.oldSensor:
        return this.processOldSensor(moisture);
      case SensorType.plantMate:
        return this.processPlantMate(moisture);
      default:
        console.error(`Unknown sensor type: ${sensorType}`);
        return moisture; 
    }
  }

}


