import { TestBed } from '@angular/core/testing';

import { SubTodoService } from './sub-todo.service';

describe('SubTodoService', () => {
  let service: SubTodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubTodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
