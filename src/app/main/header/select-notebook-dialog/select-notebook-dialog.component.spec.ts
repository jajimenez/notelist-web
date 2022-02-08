import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectNotebookDialogComponent } from "./select-notebook-dialog.component";

describe("SelectNotebookDialogComponent", () => {
    let component: SelectNotebookDialogComponent;
    let fixture: ComponentFixture<SelectNotebookDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectNotebookDialogComponent]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectNotebookDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
