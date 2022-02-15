import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-confirmation-dialog",
    templateUrl: "./confirmation-dialog.component.html",
    styleUrls: ["./confirmation-dialog.component.css"]
})
export class ConfirmationDialogComponent implements OnInit {
    @Input("dialId") dialId: string = "";
    @Input("title") title: string = "";
    @Output() accept: EventEmitter<void> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    onAcceptClick() {
        this.accept.emit();
    }
}
