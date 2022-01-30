import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptorService } from "./services/auth-interceptor.service";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./home/header/header.component";
import { MainComponent } from "./home/main/main.component";
import { NoteListComponent } from "./home/main/note-list/note-list.component";
import { NoteViewComponent } from "./home/main/note-view/note-view.component";
import { NoteEditComponent } from "./home/main/note-edit/note-edit.component";
import { NoteItemComponent } from "./home/main/note-list/note-item/note-item.component";
import { DialogComponent } from './dialog/dialog.component';
import { SelectNotebookDialogComponent } from './select-notebook-dialog/select-notebook-dialog.component';
import { ManageNotebooksDialogComponent } from './manage-notebooks-dialog/manage-notebooks-dialog.component';
import { NewNotebookDialogComponent } from './new-notebook-dialog/new-notebook-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        HeaderComponent,
        MainComponent,
        NoteListComponent,
        NoteViewComponent,
        NoteEditComponent,
        NoteItemComponent,
        DialogComponent,
        SelectNotebookDialogComponent,
        ManageNotebooksDialogComponent,
        NewNotebookDialogComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
    bootstrap: [AppComponent]
})
export class AppModule { }
