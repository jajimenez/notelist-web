import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-confirmation-dialog",
    templateUrl: "./confirmation-dialog.component.html",
    styleUrls: ["./confirmation-dialog.component.css"]
})
export class ConfirmationDialogComponent implements OnInit {
    title: string = "";
    message: string = "";

    constructor(public modal: NgbActiveModal) {}

    ngOnInit(): void {}

    onAcceptClick() {
        this.modal.close();
    }
}
