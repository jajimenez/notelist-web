import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
    selector: "app-add-tag-dialog",
    templateUrl: "./add-tag-dialog.component.html",
    styleUrls: ["./add-tag-dialog.component.css"]
})
export class AddTagDialogComponent implements OnInit {
    @Input() noteTags: string[] = [];
    @Output() addTag: EventEmitter<void> = new EventEmitter();
    valid: boolean = false;
    exists: boolean = false;

    constructor() { }

    ngOnInit(): void {}

    onShow(form: NgForm) {
        form.reset();
        this.valid = false;
        this.exists = false;
    }

    onTagInput(form: NgForm) {
        const tag: string = form.value.tag.trim();
        this.valid = tag.length !== 0;

        this.exists = this.noteTags.find(
            (t: string) => tag.trim().toLowerCase() === t.trim().toLowerCase()
        ) !== undefined
    }

    onSubmit(form: NgForm) {
        if (!form.valid || !this.valid || this.exists) return;

        const tag = form.value.tag.trim();
        this.addTag.emit(tag);
    }
}
