import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { EditNotebookDialogComponent } from "../edit-notebook-dialog/edit-notebook-dialog.component";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { NotebookService } from "../services/notebook.service";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-manage-notebooks-dialog",
    templateUrl: "./manage-notebooks-dialog.component.html",
    styleUrls: ["./manage-notebooks-dialog.component.css"]
})
export class ManageNotebooksDialogComponent implements OnInit {
    notebooks: Notebook[] = [];
    checkedNotebooks: Notebook[] = [];

    constructor(
        private router: Router,
        private modalService: NgbModal,
        public modal: NgbActiveModal,
        private notebookService: NotebookService
    ) {}

    ngOnInit(): void {
        this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => {
                this.notebooks = notebooks;
                this.checkedNotebooks = [];

                const currentNotebook = this.notebookService.currentNotebook.value;
                
                if (!this.notebooks.find((n: Notebook) => n.id === currentNotebook?.id)) {
                    if (this.notebooks.length > 0) this.router.navigateByUrl("/notebooks/" + this.notebooks[0].id);
                    else this.router.navigateByUrl("/");
                }
            }
        });
    }

    toggleChecked(e: Event, notebookId: string) {
        const checkboxId = "checkbox_" + notebookId;
        const checkbox: HTMLInputElement = document.getElementById(checkboxId) as HTMLInputElement;

        if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
        const notebook = this.notebooks.find((n: Notebook) => n.id === notebookId);

        if (notebook) {
            if (checkbox.checked) {
                this.checkedNotebooks.push(notebook);
            } else {
                const i = this.checkedNotebooks.indexOf(notebook);
                this.checkedNotebooks.splice(i, 1);
            }
        }
    }

    onAddClick() {
        const d = this.modalService.open(EditNotebookDialogComponent);
        d.componentInstance.notebooks = this.notebooks;

        d.closed.subscribe({
            next: (result: Notebook) => this.addNotebook(result)
        });
    }

    private addNotebook(notebook: Notebook) {
        this.notebookService.createNotebook(notebook.name).subscribe();
    }

    onEditClick() {
        const d = this.modalService.open(EditNotebookDialogComponent);
        d.componentInstance.notebooks = this.notebooks;
        d.componentInstance.notebook = this.checkedNotebooks[0];

        d.closed.subscribe({
            next: (result: Notebook) => this.updateNotebook(result)
        });
    }

    private updateNotebook(notebook: Notebook) {
        this.notebookService.updateNotebook(notebook).subscribe();
    }

    onDeleteClick() {
        if (this.checkedNotebooks.length != 1) return;

        const name = this.checkedNotebooks[0].name;
        const d = this.modalService.open(ConfirmationDialogComponent);

        d.componentInstance.title = "Delete notebook";
        d.componentInstance.message = "Are you sure that you want to delete the " + name + " notebook?";

        d.closed.subscribe({
            next: () => this.deleteNotebook()
        });
    }

    private deleteNotebook() {
        if (this.checkedNotebooks.length != 1) return;

        const id = this.checkedNotebooks[0].id;
        this.notebookService.deleteNotebook(id).subscribe();
    }
}
