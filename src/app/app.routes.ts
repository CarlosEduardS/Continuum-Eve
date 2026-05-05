import { Routes } from '@angular/router';
import { Login } from './features/pages/login/login';
import { Signup } from './features/pages/signup/signup';
import { Home } from './features/home/home';
import { Info } from './features/info/info';
import { Contato } from './features/contato/contato';
import { Controller } from './features/controller/controller';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'signup', component: Signup},
    {path: 'home', component: Home},
    {path: 'info', component: Info},
    {path: 'contact', component: Contato},
    {path: 'controller', component: Controller},
    {path: 'profile', component: Profile},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
