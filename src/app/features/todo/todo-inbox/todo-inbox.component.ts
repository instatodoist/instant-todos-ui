import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, of, Subscription } from 'rxjs';
import { TodoListType, TodoCompletedListType, TodoType, TodoConditions, ITodoTypeCount, ItabName } from '../../../models';
import { TodoService, AppService, UtilityService, ProjectService } from '../../../service';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// declare let $: any;
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss']
})
export class TodoInboxComponent implements OnInit, AfterViewInit, OnDestroy {
  loader = true;
  extraLoader = true;
  todosC: TodoCompletedListType = {
    totalCount: 0,
    data: []
  };
  todos: TodoListType;
  popupType: string; // popup type - update/delete
  todo: TodoType = null; // single todo object
  conditions: TodoConditions; // aploo refreshfetch conditions
  TODOTYPES = this.todoService.todoTypes(); // todo types wrt routes
  todoCurrentType: string; // current route
  queryStr = '';
  compltedCount = 0;
  loaderImage = this.appService.loaderImage;
  isDeleting = false;
  // modalSubscription: Subscription;
  count: ITodoTypeCount;
  tabs: ItabName = {
    [this.TODOTYPES.today]: [
      {
        name: this.TODOTYPES.today,
        isShown: true,
        link: '/tasks/today'
      }
    ],
    [this.TODOTYPES.pending]: [
      {
        name: this.TODOTYPES.pending,
        isShown: true,
        link: '/tasks/pending'
      }
    ],
    [this.TODOTYPES.inbox]: [
      {
        name: this.TODOTYPES.inbox,
        isShown: true,
        link: '/tasks/inbox'
      }
    ],
    [this.TODOTYPES.upcoming]: [
      {
        name: this.TODOTYPES.upcoming,
        isShown: true,
        link: '/tasks/upcoming'
      }
    ],
    [this.TODOTYPES.completed]: [
      {
        name: this.TODOTYPES.completed,
        isShown: true,
        link: '/tasks/completed'
      }
    ]
  };
  private deleteReqSubscription: Subscription;

  private fetchCompletedTodosSubscription: Subscription;
  private fetchTodosSubscription: Subscription;

  constructor(
    private todoService: TodoService,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private toastr: UtilityService,
    private router: Router,
    private modalService: NgbModal,
    private projectService: ProjectService
  ) {
  }

  ngOnDestroy(): void {
    // unsubscript complete
    if(this.fetchCompletedTodosSubscription){
      this.fetchCompletedTodosSubscription.unsubscribe();
    }
    // unsubscribe delete
    if(this.deleteReqSubscription){
      this.deleteReqSubscription.unsubscribe();
    }
    this.fetchTodosSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.fetchTodosOnLoad();
  }

  fetchTodosOnLoad(){
    this.todoCurrentType = ''; // default to inbox
    this.loader = true;
    this.fetchTodosSubscription = this.projectService.fetchAll()
      .pipe(
        switchMap(data=> combineLatest([of(data), this.activatedRoute.params, this.activatedRoute.queryParams])),
        map(data => ({
          labels: data[0],
          params: data[1],
          query: data[2]
        })),
        switchMap(data=>{
          const { params = null, query = null, labels } = data;
          const { label = null } = params;
          const { q = '' } = query;
          if (!label) {
            this.todoCurrentType = this.todoService.getCurentRoute();
            this.conditions = this.todoService.getConditions(this.todoCurrentType);
          } else {
            this.todoCurrentType = label;
            this.tabs = {
              ...this.tabs,
              [label]: [
                {
                  name: label,
                  isShown: true,
                  link: `/tasks/lists/${label}`
                }
              ]
            };
            // eslint-disable-next-line no-underscore-dangle
            const labelId = labels.filter(obj => (obj.name).toLowerCase() === label.toLowerCase())[0]._id;
            this.conditions = this.todoService.getConditions(labelId, 'labels');
          }
          if (q) {
            this.queryStr = q;
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.conditions = { ...this.conditions, filter: { ...this.conditions.filter, title_contains: this.queryStr } };
          }
          if (this.todoCurrentType === this.TODOTYPES.completed) {
            this.loader = true;
            const newQuery = { ...this.conditions, filter: { ...this.conditions.filter, isCompleted: true } };
            return combineLatest([
              this.todoService.countByTodoType(newQuery),
              this.todoService.fetchCompleted(this.conditions)
            ]);
          } else {
            this.extraLoader = true;
            return combineLatest([
              this.todoService.countByTodoType(query),
              this.todoService.fetchAll(this.conditions)
            ]);
          }
        })
      )
      .subscribe(response => {
        const [countObj, dataList] = response;
        const { data = {} } = dataList;
        if(data.hasOwnProperty('todoList')){
          const todos = {...data.todoList};
          this.todos = {
            ...this.todos,
            totalCount: todos.totalCount,
            data: this.todoService.sortArrayByDate(todos.data, 'createdAt')
          };
        } else if(data.hasOwnProperty('todoCompleted')){
          this.customizeCompleteTodos(data.todoCompleted, true);
        }
        const { today = 0, pending = 0, inbox = 0, completed = 0, upcoming = 0 } = countObj;
        this.count = {
          pending,
          today,
          inbox,
          completed,
          upcoming
        };
        this.extraLoader = false;
        if (this.todoCurrentType) {
          this.appService.configureSeo(this.todoCurrentType);
        }
      });
  }

  customizeCompleteTodos(response: any, isDirectCall = false): void {
    const { totalCount, data = [] } = response;
    if (isDirectCall) {
      this.todosC = { ...this.todosC, totalCount, data };
    } else {
      this.todosC = { totalCount, data: [...this.todosC.data, ...data] };
    }
    if ((totalCount === null) || (data === null) || (data.length === totalCount)) {
      this.loader = false;
    } else {
      this.loader = true;
    }
  }

  /**
   * @param conditions - based on route
   */
   getCompletedTodos(conditions: TodoConditions, isDirectCall = false): void {
    this.loader = true;
    if (isDirectCall) {
      conditions.offset = 1;
    }
    this.extraLoader = false;
    this.fetchCompletedTodosSubscription = this.todoService.fetchCompleted(conditions)
      .subscribe(({data}) => {
        this.customizeCompleteTodos(data.todoCompleted);
      });
  }

  /**
   * @param todo - todo object
   * @param popupType - update/delete
   */
  openPopUp(todo: TodoType): void {
    const modelRef  = this.modalService.open(TodoDialogComponent, {
      size: 'lg',
      scrollable: true
    });
    modelRef.componentInstance.todo = todo;
  }

  /**
   * @param todo - todo object
   */
   markComplete(todo: TodoType): void {
    this.todo = { ...todo };
    const postBody: TodoType = {
      // eslint-disable-next-line no-underscore-dangle
      _id: this.todo._id,
      isCompleted: !this.todo.isCompleted,
    };
    this.todoService
      .updateTodo(postBody, this.conditions)
      .subscribe(() => {
        this.todo = null;
        // navigate to today route if no pending task
        if (this.todoCurrentType === this.TODOTYPES.pending && !this.count.pending) {
          this.router.navigate(['/tasks/today']);
        }
      });
  }

  /**
   * @param todo - todo object
   */
  deleteTodo(todo: TodoType): void {
    if (todo.deleteRequest) {
      this.isDeleting = true;
      const postBody: TodoType = {
        // eslint-disable-next-line no-underscore-dangle
        _id: todo._id,
        operationType: 'DELETE'
      };
      this.deleteReqSubscription = this.todoService
        .deleteTodo(postBody, this.conditions)
        .subscribe(() => {
          this.isDeleting = false;
          this.toastr.toastrSuccess('Task Deleted');
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @HostListener('scroll', ['$event'])
  refresh(): void {
    const { totalCount, data } = this.todosC;
    // if (this.conditions.offset === ) {
    //   this.getCompletedTodos(this.conditions);
    // } else
    if (data.length < totalCount && this.loader) {
      const { offset } = this.conditions;
      this.conditions = { ...this.conditions, offset: offset + 1 };
      this.getCompletedTodos(this.conditions);
    }
  }

  get trackIds(): string[] {
    // eslint-disable-next-line no-underscore-dangle
    return this.todos.data.map(track => track._id);
  }

  onTodoDrop(event: CdkDragDrop<TodoType[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

}
