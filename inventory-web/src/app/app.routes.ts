import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { RawMaterialsList } from './pages/raw-materials/raw-materials-list/raw-materials-list';
import { Products } from './pages/products/products-list/products-list';
import { ProductionMaximum } from './pages/production-maximum/production-maximum';
import { ProductionOptimization } from './pages/production-optimization/production-optimization';
import { ProductionSimulation } from './pages/production-simulation/production-simulation';

export const routes: Routes = [

  { path: '', component: Dashboard, pathMatch: 'full' },
  { path: 'app-dashboard', component: Dashboard },
  { path: 'app-raw-materials-list', component: RawMaterialsList },
  { path: 'products', component: Products },
  { path: 'production-maximum', component: ProductionMaximum },
  { path: 'production-optimization', component: ProductionOptimization },
  { path: 'production-simulation', component: ProductionSimulation }

];


