import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuardService } from "./services/auth-guard.service";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
    {path: "", component: HomeComponent, canActivate: [AuthGuardService]},
    {path: "login", component: LoginComponent, canActivate: [AuthGuardService]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
