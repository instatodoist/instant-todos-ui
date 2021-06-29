import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { switchMap } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { TodoListType, TodoType, TodoConditions, ITodoTypeCount, ItabName, ISubscription } from '../../../models';
import { TodoService, AppService, UtilityService, ProjectService } from '../../../services';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';

// declare let $: any;
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss']
})
export class TodoInboxComponent implements OnInit, AfterViewInit, OnDestroy {
  loader = true;
  extraLoader = true;
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
  count: ITodoTypeCount = {};
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
    ]
  };
  private subscriptions: ISubscription = {
    count: null,
    delete: null,
    todos: null
  };

  constructor(
    private todoService: TodoService,
    private appService: AppService,
    private toastr: UtilityService,
    private router: Router,
    public dialog: MatDialog,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.fetchTodosOnLoad();
    this.subscribeToCount();
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
   this.appService.unsubscribe(this.subscriptions);
  }

  subscribeToCount(){
    this.subscriptions.count = this.appService.countDataSource$
      .subscribe(response=>{
        const { today, pending, inbox, completed, upcoming } = response;
        this.count = {
          ...this.count,
          pending,
          today,
          inbox,
          completed,
          upcoming
        };
      });
  }

  /**
   * @param todo - todo object
   * @param popupType - update/delete
   */
  openPopUp(todo: TodoType): void {
    const modelRef = this.dialog.open(TodoDialogComponent, {
      width: '50%'
    });
    modelRef.componentInstance.todo = todo;
  }

  /**
   * @param todo - todo object
   */
  updateTodo(todo: TodoType): void {
    this.todo = { ...todo };
    const postBody: TodoType = {
      // eslint-disable-next-line no-underscore-dangle
      _id: this.todo._id,
      isCompleted: !this.todo.isCompleted,
    };
    // eliminate from UI
    this.todos = {
      ...this.todos,
      // eslint-disable-next-line no-underscore-dangle
      data: this.todos.data.filter(item=> item._id !== todo._id)
    };
    const { _id: id, ...body } = postBody;
    this.todoService
      .updateTodo(id, body, this.conditions)
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
      const { _id: id, ..._ } = todo;
      this.subscriptions.delete = this.todoService
        .deleteTodo(id, this.conditions)
        .subscribe(() => {
          this.isDeleting = false;
          this.toastr.toastrSuccess('Task Deleted');
        });
    }
  }

  get trackIds(): string[] {
    // eslint-disable-next-line no-underscore-dangle
    return this.todos.data.map(track => track._id);
  }

  onTodoDrop(event: CdkDragDrop<TodoType[]>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  private fetchTodosOnLoad() {
    this.subscriptions.todos = this.fetchTodos$.subscribe(response=>{
      const { data = {} } = response;
      const todos = { ...data.todoList };
      this.todos = {
        ...this.todos,
        totalCount: todos.totalCount,
        data: this.todoService.sortArrayByDate(todos.data, 'createdAt')
      };
      this.extraLoader = false;
      if (this.todoCurrentType) {
        this.appService.configureSeo(this.todoCurrentType);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private fetchTodos$ = combineLatest([
      this.appService.fetchParams(),
      this.projectService.fetchAll()
    ])
    .pipe(
      switchMap(response=>{
        const [ params, labels ] = response;
        const { label, q } = params;
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
          this.conditions = {
            ...this.conditions,
            filter: {
              ...this.conditions.filter,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              title_contains: this.queryStr
            }
          };
        }
        this.extraLoader = true;
        return this.todoService.fetchAll(this.conditions);
      })
    );
}
