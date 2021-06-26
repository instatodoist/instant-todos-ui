import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodoLabelListComponent } from './todo-label-list.component';

describe('TodoLabelListComponent', () => {
  let component: TodoLabelListComponent;
  let fixture: ComponentFixture<TodoLabelListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoLabelListComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoLabelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
