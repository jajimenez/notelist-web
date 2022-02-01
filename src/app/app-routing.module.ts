import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuardService } from "./services/auth-guard.service";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { MainComponent } from "./home/main/main.component";
import { NoteViewComponent } from "./home/main/note-view/note-view.component";

const routes: Routes = [
    {
        "path": "", redirectTo: "/notebooks", pathMatch: "full"
    },
    {
        path: "notebooks", component: HomeComponent, canActivate: [AuthGuardService],
        children: [
            {
                path: "", pathMatch: "full", data: {"redirect": true}, component: HomeComponent,
            },
            {
                path: ":notebook_id", component: MainComponent, 
                children: [
                    {
                        path: "notes/:note_id", component: NoteViewComponent
                    }
                ]
            }
        ]
    },
    {path: "login", component: LoginComponent, canActivate: [AuthGuardService]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
