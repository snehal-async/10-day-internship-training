import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FacilitiesComponent } from './pages/facilities/facilities.component';
import { FacilityDetailsComponent } from './pages/facility-details/facility-details.component';
import { InspectionsComponent } from './pages/inspections/inspections.component';
import { InspectionHistoryComponent } from './pages/inspection-history/inspection-history.component';
import { inspectionAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'FacilityOps — Dashboard'
  },
  {
    path: 'facilities',
    component: FacilitiesComponent,
    title: 'FacilityOps — Facilities Directory'
  },
  {
    path: 'facilities/:id',
    component: FacilityDetailsComponent,
    title: 'FacilityOps — Facility Details'
  },
  {
    path: 'inspections',
    pathMatch: 'full',
    redirectTo: 'inspections/history'
  },
  {
    path: 'inspections/new',
    component: InspectionsComponent,
    canActivate: [inspectionAuthGuard],
    title: 'FacilityOps — Record Inspection'
  },
  {
    path: 'inspections/history',
    component: InspectionHistoryComponent,
    title: 'FacilityOps — Inspection History'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
