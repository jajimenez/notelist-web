import { Component, ViewEncapsulation, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { ManageNotebooksDialogComponent } from "../manage-notebooks-dialog/manage-notebooks-dialog.component";
import { NotebookService } from "../services/notebook.service";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-select-notebook-dialog",
    templateUrl: "./select-notebook-dialog.component.html",
    styleUrls: ["./select-notebook-dialog.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class SelectNotebookDialogComponent implements OnInit, OnDestroy {
    notebooks: Notebook[] = [];
    notebooksSub: Subscription | undefined;

    constructor(
        private modalService: NgbModal,
        private notebookService: NotebookService,
        public modal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.notebooksSub = this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => this.notebooks = notebooks
        });
    }

    onManageClick() {
        const d = this.modalService.open(ManageNotebooksDialogComponent, { scrollable: true, backdropClass: "backdrop" });
    }

    ngOnDestroy(): void {
        this.notebooksSub?.unsubscribe();
    }
}
