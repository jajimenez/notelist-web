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
    private dataSub: Subscription | null = null;

    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private notebookService: NotebookService
    ) {}

    ngOnInit(): void {
        this.dataSub = this.actRoute.data.subscribe({
            next: (d: Data) => {
                const notebooksSub = this.notebookService.notebooks.subscribe({
                    next: (notebooks: Notebook[]) => {
                        if (d["redirect"] && notebooks.length > 0) {
                            this.router.navigate(["notebooks", notebooks[0].id]);
                        }

                        notebooksSub.unsubscribe();
                    }
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.dataSub?.unsubscribe();
    }
}
