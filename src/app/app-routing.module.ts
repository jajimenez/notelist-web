import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuardService } from "./services/auth-guard.service";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { MainComponent } from "./main/main.component";
import { NotebookComponent } from "./main/notebook/notebook.component";
import { NoteComponent } from "./main/note/note.component";

const routes: Routes = [
    {"path": "", pathMatch: "full", component: MainComponent, canActivate: [AuthGuardService]},
    {
        path: "notebooks/:notebook_id", component: NotebookComponent,
        children: [
            {path: ":note_id", pathMatch: "full", component: NoteComponent},
            {path: ":note_id/edit", component: NoteComponent}
        ]
    },
    // {path: "search/:search", component: SearchComponent, canActivate: [AuthGuardService]},
    {path: "login", component: LoginComponent, canActivate: [AuthGuardService]},
    {path: "logout", component: LogoutComponent, canActivate: [AuthGuardService]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
