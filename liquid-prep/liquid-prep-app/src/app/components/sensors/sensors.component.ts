import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export class Device {
  status?: any;
  timeSeries: TimeSeries;
  constructor() {
    this.timeSeries = new TimeSeries;
  }
}
export class TimeSeries {
  id?: string;
  name?: string;
  Mac?: string;
  lastUpdate?: any;
  moisture?: number;
}

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})
export class SensorsComponent implements OnInit {
  devices: TimeSeries[] = [];
  columns: string[] = ['name', 'moisture', 'lastUpdate', 'action'];
  dataSource = new MatTableDataSource<TimeSeries>([]);
  device: Device;
  actions = [
    {value: 'device_name', text: 'Device Name'},
    {value: 'air_value', text: 'Calibrate Air'},
    {value: 'water_value', text: 'Calibrate Water'},
    {value: 'interval', text: 'Interval'},
    {value: 'query', text: 'Query'}
  ]
  
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchTimeSeries();
  }
  fetchTimeSeries() {
    this.http.get<Device>(`http://192.168.86.27:3003/log`)
      .subscribe(
        (data) => {
          this.device = data
          console.log(this.device)
          this.listDevice(data.timeSeries)
        }
      )
  }
  refresh() {
    console.log('refresh')
    this.fetchTimeSeries();
  }
  listDevice(devices: TimeSeries) {
    let data: TimeSeries[] = [];
    Object.keys(devices).forEach((key) => {
      console.log('**', devices[key])
        let element = devices[key];
        this.devices.push(element);
        data.push({
          id: element.id,
          name: element.name,
          moisture: element.moisture,
          lastUpdate: new Date(element.timestamp).toLocaleTimeString(navigator.language, {month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'})
        })
      this.dataSource.data = data;
    })
  }
}
