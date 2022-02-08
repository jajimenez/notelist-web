import { Component, Input, OnInit } from "@angular/core";
import { NotePreview } from "src/app/models/note.model";

@Component({
    selector: "app-note-list",
    templateUrl: "./note-list.component.html",
    styleUrls: ["./note-list.component.css"]
})
export class NoteListComponent implements OnInit {
    @Input() notes: NotePreview[] = [];

    constructor() {}

    ngOnInit(): void {}
}
