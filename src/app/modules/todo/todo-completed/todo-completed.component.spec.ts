import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoCompletedComponent } from './todo-completed.component';

describe('TodoCompletedComponent', () => {
  let component: TodoCompletedComponent;
  let fixture: ComponentFixture<TodoCompletedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoCompletedComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
