import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-add-tag-dialog",
    templateUrl: "./add-tag-dialog.component.html",
    styleUrls: ["./add-tag-dialog.component.css"]
})
export class AddTagDialogComponent implements OnInit {
    tags: string[] = [];
    valid: boolean = false;
    exists: boolean = false;

    constructor(public modal: NgbActiveModal) {}

    ngOnInit(): void {}

    onTagInput(form: NgForm) {
        const tag: string = form.value.tag.trim();
        this.valid = tag.length !== 0;

        this.exists = this.tags.find(
            (t: string) => tag.trim().toLowerCase() === t.trim().toLowerCase()
        ) !== undefined;
    }

    onSubmit(form: NgForm) {
        if (!form.valid || !this.valid || this.exists) return;

        const tag = form.value.tag.trim();
        this.modal.close(tag);
    }
}
