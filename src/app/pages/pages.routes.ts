import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { RoomsComponent } from './room/rooms/rooms.component';
import { PredictionComponent } from './prediction/prediction.component';


export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {path:'patients',component:PredictionComponent},
    {path:'rooms',component:RoomsComponent},

    { path: '**', redirectTo: '/notfound' }
] as Routes;
