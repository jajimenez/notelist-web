import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { UserService } from "src/app/services/user.service";
import { NotebookService } from "src/app/services/notebook.service";
import { User } from "src/app/models/user.model";
import { Notebook } from "src/app/models/notebook.model";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
    user: User | null = null;
    notebooks: Notebook[] = [];
    currentNotebook: Notebook | undefined = undefined;

    constructor(
        private actRoute: ActivatedRoute,
        private userService: UserService,
        private notebookService: NotebookService) {
    }

    ngOnInit(): void {
        this.userService.user.subscribe({
            next: (u: User | null ) => {
                this.user = u;

                this.actRoute.params.subscribe({
                    next: (params: Params) => {
                        this.notebookService.getNotebooks().subscribe({
                            next: (notebooks: Notebook[]) => {
                                this.notebooks = notebooks;
                                const notebook_id = params["notebook_id"];

                                if (notebook_id) this.currentNotebook = this.notebooks.find(
                                    (n: Notebook) => n.id == notebook_id
                                )
                            },
                            error: (e: string) => console.log(e)
                        });
                    }
                });
            }
        });
    }
}
