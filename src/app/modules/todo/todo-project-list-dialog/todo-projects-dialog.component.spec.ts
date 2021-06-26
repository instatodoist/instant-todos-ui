import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogTodoProjectsComponent } from './todo-projects-dialog.component';

describe('DialogTodoProjectsComponent', () => {
  let component: DialogTodoProjectsComponent;
  let fixture: ComponentFixture<DialogTodoProjectsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTodoProjectsComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTodoProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
