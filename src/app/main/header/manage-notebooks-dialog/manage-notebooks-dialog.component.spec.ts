import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ManageNotebooksDialogComponent } from "./manage-notebooks-dialog.component";

describe("ManageNotebooksDialogComponent", () => {
    let component: ManageNotebooksDialogComponent;
    let fixture: ComponentFixture<ManageNotebooksDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ManageNotebooksDialogComponent]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageNotebooksDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
