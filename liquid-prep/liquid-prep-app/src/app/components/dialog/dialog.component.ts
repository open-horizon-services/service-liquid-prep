import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  type: string;
  name: string;
  gateway: string;
  espnow: string;
  placeholder: string;
  mac: string;
  object: any;
  buttons: any;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  //@ViewChild('display', { static: false, read: ElementRef})
  cancelLabel = 'Cancel';
  okLabel = 'Save';
  notOK = true;
  label = '';
  newValue = '';
  show = false;
  url = '';
  html = '';
  
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient   
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data.buttons) {
      this.okLabel = this.data.buttons.ok ? this.data.buttons.ok : this.okLabel
      this.cancelLabel = this.data.buttons.cancel ? this.data.buttons.cancel : this.cancelLabel
    }
  }
  onChange(evt: any) {
    if(evt.isUserInput) {
      console.log(evt.source.value)
      let type = evt.source.value;
      //this.data.type = type.match(/query/) ? 'display' : 'input'
      switch(type) {
        case 'device_name':
          this.label = 'Name'
          this.newValue = this.data.title;
          this.show = true;
          break;
        case 'air_value':
          this.label = 'Air Value'
          this.show = false;
          break;
        case 'query':
          this.label = 'Query';
          this.show = false;
          this.url = `${this.data.gateway}/${type}?host_addr=${this.data.mac}`;
          break;  
        case 'water_value':
            this.label = 'Water Value'
            this.show = false;
            break;
        case 'interval':
          this.label = 'Interval'
          this.show = true;
          this.url = `${this.data.gateway}/${this.data.type}?host_addr=${this.data.mac}`;
          break;
        }
    }
  }
  cancel(): void {
    this.dialogRef.close();
  }
  run() {
    this.http.get(this.url)
    .subscribe(
      (data) => {
        console.log(data)
      }
    )
  }  
}
