import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NewNotebookDialogComponent } from "./new-notebook-dialog.component";

describe("NewNotebookDialogComponent", () => {
    let component: NewNotebookDialogComponent;
    let fixture: ComponentFixture<NewNotebookDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewNotebookDialogComponent]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewNotebookDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
