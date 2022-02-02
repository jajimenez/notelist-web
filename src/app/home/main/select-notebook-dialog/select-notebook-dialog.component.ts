import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { NotebookService } from "src/app/services/notebook.service";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-select-notebook-dialog",
    templateUrl: "./select-notebook-dialog.component.html",
    styleUrls: ["./select-notebook-dialog.component.css"]
})
export class SelectNotebookDialogComponent implements OnInit, OnDestroy {
    notebooksSub: Subscription | null = null;
    notebooks: Notebook[] = [];

    constructor(private notebookService: NotebookService) {}

    ngOnInit(): void {
        this.notebooksSub = this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => this.notebooks = notebooks,
            error: (e: string) => console.error(e)
        });
    }

    ngOnDestroy(): void {
        this.notebooksSub?.unsubscribe();
    }
}
