import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdviceComponent } from './components/advice/advice.component';
import { InspectComponent } from './components/inspect/inspect.component';
import { MeasureSoilComponent } from './components/measure-soil/measure-soil.component';
import { MyCropsComponent } from './components/my-crops/my-crops.component';
import { SeedDateComponent } from './components/seed-date/seed-date.component';
import { SensorsComponent } from './components/sensors/sensors.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'select-crop',
    loadChildren: () => import('./components/select-crop/select-crop.module')
      .then(m => m.SelectCropModule)
  },
  {
    path: 'sensors',
    component: SensorsComponent
  },
  {
    path: 'inspect',
    component: InspectComponent
  },
  {
    path: 'my-crops',
    component: MyCropsComponent
  },
  {
    path: 'measure-soil',
    component: MeasureSoilComponent
  },
  {
    path: 'seed-date/:id',
    component: SeedDateComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'advice',
    component: AdviceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
