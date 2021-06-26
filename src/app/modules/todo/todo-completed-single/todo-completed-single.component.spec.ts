import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoCompletedSingleComponent } from './todo-completed-single.component';

describe('TodoCompletedSingleComponent', () => {
  let component: TodoCompletedSingleComponent;
  let fixture: ComponentFixture<TodoCompletedSingleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoCompletedSingleComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoCompletedSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
