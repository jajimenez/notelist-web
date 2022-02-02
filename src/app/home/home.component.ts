import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Data } from "@angular/router";
import { Subscription } from "rxjs";

import { NotebookService } from "src/app/services/notebook.service";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnDestroy {
    private notebooksSub: Subscription | null = null;
    private dataSub: Subscription | null = null;

    private notebooks: Notebook[] = [];

    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private notebookService: NotebookService
    ) {}

    ngOnInit(): void {
        this.notebooksSub = this.notebookService.notebooks.subscribe({
            next: (notebooks: Notebook[]) => this.notebooks = notebooks
        });

        this.dataSub = this.actRoute.data.subscribe({
            next: (d: Data) => {
                if (d["redirect"] && this.notebooks.length > 0) {
                    this.router.navigate(["notebooks", this.notebooks[0].id]);
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.notebooksSub?.unsubscribe();
        this.dataSub?.unsubscribe();
    }
}
