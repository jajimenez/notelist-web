import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { MarkdownModule} from "ngx-markdown";

import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptorService } from "./services/auth-interceptor.service";
import { AppComponent } from "./app.component";
import { MainComponent } from "./main/main.component";
import { NotebookComponent } from "./main/notebook/notebook.component";
import { HeaderComponent } from "./main/header/header.component";
import { SelectNotebookDialogComponent } from "./main/header/select-notebook-dialog/select-notebook-dialog.component";
import { ManageNotebooksDialogComponent } from "./main/header/manage-notebooks-dialog/manage-notebooks-dialog.component";
import { NewNotebookDialogComponent } from "./main/header/new-notebook-dialog/new-notebook-dialog.component";
import { NoteListComponent } from "./main/note-list/note-list.component";
import { NoteItemComponent } from "./main/note-list/note-item/note-item.component";
import { TagComponent } from "./main/tag/tag.component";
import { NoteComponent } from "./main/note/note.component";
import { AddTagDialogComponent } from "./main/note/add-tag-dialog/add-tag-dialog.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        NotebookComponent,
        HeaderComponent,
        SelectNotebookDialogComponent,
        ManageNotebooksDialogComponent,
        NewNotebookDialogComponent,
        NoteListComponent,
        NoteItemComponent,
        TagComponent,
        NoteComponent,
        AddTagDialogComponent,
        LoginComponent,
        LogoutComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        MarkdownModule.forRoot()
    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
    bootstrap: [AppComponent]
})
export class AppModule {}
