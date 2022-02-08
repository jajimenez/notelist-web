import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NotebookService } from "src/app/services/notebook.service";
import { Notebook } from "../models/notebook.model";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
    constructor(private router: Router, private notebookService: NotebookService) {}

    ngOnInit(): void {
        this.notebookService.getNotebooks().subscribe({
            next: (notebooks: Notebook[]) => {
                if (notebooks.length > 0) {
                    const id = notebooks[0].id;
                    this.router.navigateByUrl("/notebooks/" + id);
                }
            }
        });
    }
}
