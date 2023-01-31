import { formatDate, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { TodayWeather } from 'src/app/models/TodayWeather';
import { CropDataService } from 'src/app/service/CropDataService';
import { WeatherDataService } from 'src/app/service/WeatherDataService';

import { Crop } from '../../models/Crop';

@Component({
  selector: 'app-my-crops',
  templateUrl: './my-crops.component.html',
  styleUrls: ['./my-crops.component.scss'],
})
export class MyCropsComponent implements OnInit {
  myCrops: Crop[];
  displayedColumns: string[] = ['EmptyColumnTitle'];

  tabs = ['My Crops', 'Settings'];
  activeTab = this.tabs[0];
  background: ThemePalette = undefined;

  isCameraDisabled = false;

  public currentDate = '';
  public weatherIconDay = '';
  public weatherIconNight = '';
  public loading = false;
  public temperatureMax = null;
  public temperatureMin = null;
  public todayWeather = null;
  public myCropStatus: 'no-crop' | 'crop-selected' = 'no-crop';
  public errorMessage = '';

  constructor(
    private router: Router, private location: Location,
    private weatherService: WeatherDataService, private cropDataService: CropDataService
    ) {
    this.updateWeatherInfo();
  }

  ngOnInit(): void {
    //this.isCameraDisabled = location.hostname.indexOf('localhost') < 0 && location.protocol !== 'https';

    this.cropDataService.getMyCrops().subscribe(myCrops => {
      this.myCrops = myCrops;
      if (this.myCrops.length > 0){
        this.myCropStatus = 'crop-selected';
      }
    });

    this.currentDate =  formatDate(new Date(), 'MMMM d, yyyy', 'en');

    // TODO: Add weather template
    /*this.dataService.getWeatherInfo().subscribe((weatherInfo: WeatherResponse) => {
      const todayWeather = WeatherService.getInstance().createTodayWeather(weatherInfo);
    });*/

  }

  public tabClicked(tab) {
    this.activeTab = tab;
    if (tab === tab[0]) {
      this.router.navigateByUrl('/my-crops').then(r => {});
    } else {
      this.router.navigateByUrl('/settings').then(r => {});
    }
  }

  public fabClicked() {
    this.router.navigateByUrl('/select-crop').then(r => {});
  }

  public volumeClicked() {

  }

  public cropClicked(event){
    this.router.navigate(['advice']).then(r => {});
  }

  public backClicked() {
    this.location.back();
  }

  onContextMenu($event: MouseEvent, crop: Crop) {
  }

  onViewCropAdvice(crop: Crop) {
    this.cropDataService.storeSelectedCropIdInSession(crop.id);
    this.router.navigate(['advice']).then(r => {});
  }

  onRemoveCrop(crop: Crop) {
    this.cropDataService.deleteMyCrop(crop.id);
    window.location.reload();
  }

  onAdd1stCrop() {
    this.router.navigateByUrl('/select-crop').then(r => {});
  }

  inspect() {
    this.router.navigateByUrl('/inspect').then(r => {});
  }

  updateWeatherInfo(){

    this.loading = true;
    this.weatherService.getTodayWeather().subscribe(
        (todayWeather: TodayWeather) => {
          this.loading = false;
          this.todayWeather = todayWeather;
        },
        (err) => {
          this.loading = false;
          this.errorMessage = err ;
        }
    );
  }

  showError(msg) {
    alert(msg ? msg : this.errorMessage);
  }

}
