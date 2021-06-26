import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoProjectDialogComponent } from './todo-project-dialog.component';

describe('TodoProjectDialogComponent', () => {
  let component: TodoProjectDialogComponent;
  let fixture: ComponentFixture<TodoProjectDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoProjectDialogComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
