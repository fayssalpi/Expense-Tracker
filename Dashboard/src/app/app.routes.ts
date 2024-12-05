import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { BudgetComponent } from './budget/budget.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuardGuard } from './__Guards/auth-guard.guard';




export const routes: Routes = [

    {path: 'main', component: MainContentComponent, canActivate: [authGuardGuard] },
    {path: 'budget', component: BudgetComponent, canActivate: [authGuardGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }, 
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login', pathMatch: 'full' } 


];
