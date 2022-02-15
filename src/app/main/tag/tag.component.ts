import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-tag",
    templateUrl: "./tag.component.html",
    styleUrls: ["./tag.component.css"]
})
export class TagComponent implements OnInit {
    @Input() name: string = "";
    @Input() color: string | undefined = undefined;
    @Input() editMode: boolean = false;
    @Output() close: EventEmitter<void> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    getStyle(): object {
        if (this.color) return {backgroundColor: this.color};
        return {};
    }

    onCloseClick() {
        this.close.emit();
    }
}
