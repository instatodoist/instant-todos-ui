import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoSingleComponent } from './todo-single.component';

describe('TodoSingleComponent', () => {
  let component: TodoSingleComponent;
  let fixture: ComponentFixture<TodoSingleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoSingleComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
