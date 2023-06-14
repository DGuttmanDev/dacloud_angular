import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './registration/registration.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import {StartPageComponent} from "./start-page/start-page.component";

const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login/registration', component: RegistrationComponent },
  { path: 'user/configuration', component: ConfigurationComponent },
  { path: 'user/configuration/personal-data', component: PersonalDataComponent },
  { path: 'user/configuration/subscription', component: SubscriptionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
