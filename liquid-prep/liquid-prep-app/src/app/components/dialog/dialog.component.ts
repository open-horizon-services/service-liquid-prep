import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  type: string;
  name: string;
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
  cancelLabel = 'Cancel';
  okLabel = 'Save';
  notOK = true;
  label = '';
  newValue = '';
  show = false;
  
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData    
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
      switch(evt.source.value) {
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
          break;  
        case 'water_value':
            this.label = 'Water Value'
            this.show = false;
            break;
        case 'interval':
          this.label = 'Interval'
          this.show = true;
          break;
        }
    }
  }
  cancel(): void {
    this.dialogRef.close();
  }
  run() {
    if(this.newValue.length > 0) {
      
    }
    console.log('data', this.newValue)

    this.dialogRef.close(this.data);
  }  
}
