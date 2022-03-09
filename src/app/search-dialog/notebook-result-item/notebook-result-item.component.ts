import { Component, Input, OnInit } from "@angular/core";

import { NotebookSearchResult } from "src/app/models/search.model";

@Component({
    selector: "app-notebook-result-item",
    templateUrl: "./notebook-result-item.component.html",
    styleUrls: ["./notebook-result-item.component.css"]
})
export class NotebookResultItemComponent implements OnInit {
    @Input() notebook: NotebookSearchResult = new NotebookSearchResult();

    constructor() {}

    ngOnInit(): void {}
}
