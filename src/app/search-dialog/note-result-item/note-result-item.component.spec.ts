import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoteResultItemComponent } from "./note-result-item.component";

describe("NotebookResultItemComponent", () => {
    let component: NoteResultItemComponent;
    let fixture: ComponentFixture<NoteResultItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ NoteResultItemComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NoteResultItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
