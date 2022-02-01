import { Component, Input, OnInit } from "@angular/core";
import { NotePreview } from "src/app/models/note.model";

@Component({
    selector: "app-note-item",
    templateUrl: "./note-item.component.html",
    styleUrls: ["./note-item.component.css"]
})
export class NoteItemComponent implements OnInit {
    @Input() note: NotePreview = new NotePreview();

    constructor() { }

    ngOnInit(): void {
    }
}
