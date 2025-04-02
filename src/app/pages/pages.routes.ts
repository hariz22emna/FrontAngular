import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { PatientsComponent } from './patients/patients.component';


export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {path:'patients',component:PatientsComponent},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
