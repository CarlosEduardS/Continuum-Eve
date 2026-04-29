import { Routes } from '@angular/router';
import { Login } from './features/pages/login/login';
import { Signup } from './features/pages/signup/signup';
import { Home } from './features/home/home';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'signup', component: Signup},
    {path: 'home', component: Home},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
