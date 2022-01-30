import { Component, OnInit } from "@angular/core";
import { NotePreview } from "./note.model";

@Component({
    selector: "app-note-list",
    templateUrl: "./note-list.component.html",
    styleUrls: ["./note-list.component.css"]
})
export class NoteListComponent implements OnInit {
    notes: NotePreview[] = [];

    constructor() { }

    ngOnInit(): void {
    }
}
