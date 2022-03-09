import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { NotebookService } from "src/app/services/notebook.service";
import { Notebook } from "../models/notebook.model";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit, OnDestroy {
    notebooksSub: Subscription | undefined;

    constructor(private router: Router, private notebookService: NotebookService) {}

    ngOnInit(): void {
        this.notebooksSub = this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => {
                if (this.notebookService.currentNotebook.value === null && notebooks.length > 0) {
                    const id = notebooks[0].id;
                    this.router.navigateByUrl("/notebooks/" + id);
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.notebooksSub?.unsubscribe();
    }
}
