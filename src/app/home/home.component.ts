import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { NotebookService } from "src/app/services/notebook.service";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    constructor(
        private router: Router,
        private actRoute: ActivatedRoute,
        private notebookService: NotebookService
    ) { }

    ngOnInit(): void {
        this.notebookService.getNotebooks().subscribe({
            next: (notebooks: Notebook[]) => {
                if (notebooks.length > 0) {
                    this.router.navigate([notebooks[0].id], {relativeTo: this.actRoute});
                }
            }
        })
    }
}
