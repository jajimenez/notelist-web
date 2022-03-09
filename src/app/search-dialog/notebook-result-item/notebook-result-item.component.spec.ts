import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NotebookResultItemComponent } from "./notebook-result-item.component";

describe("NotebookResultItemComponent", () => {
    let component: NotebookResultItemComponent;
    let fixture: ComponentFixture<NotebookResultItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ NotebookResultItemComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NotebookResultItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
