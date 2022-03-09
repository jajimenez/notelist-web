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
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";
import { SearchDialogComponent } from "./search-dialog/search-dialog.component";
import { NotebookResultItemComponent } from "./search-dialog/notebook-result-item/notebook-result-item.component";
import { NoteResultItemComponent } from "./search-dialog/note-result-item/note-result-item.component";
import { SelectNotebookDialogComponent } from "./select-notebook-dialog/select-notebook-dialog.component";
import { ManageNotebooksDialogComponent } from "./manage-notebooks-dialog/manage-notebooks-dialog.component";
import { EditNotebookDialogComponent } from "./edit-notebook-dialog/edit-notebook-dialog.component";
import { NoteListComponent } from "./main/note-list/note-list.component";
import { NoteItemComponent } from "./main/note-list/note-item/note-item.component";
import { TagComponent } from "./main/tag/tag.component";
import { NoteComponent } from "./main/note/note.component";
import { AddTagDialogComponent } from "./main/note/add-tag-dialog/add-tag-dialog.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        NotebookComponent,
        HeaderComponent,
        ConfirmationDialogComponent,
        SearchDialogComponent,
        NotebookResultItemComponent,
        NoteResultItemComponent,
        SelectNotebookDialogComponent,
        ManageNotebooksDialogComponent,
        EditNotebookDialogComponent,
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
        MarkdownModule.forRoot(),
        NgbModule
    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
    bootstrap: [AppComponent]
})
export class AppModule {}
