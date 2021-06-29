import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { TodoListType, TodoType, TodoConditions, ITodoTypeCount, ItabName, ISubscription, TodoProjectType } from '../../../models';
import { TodoService, AppService, UtilityService, ProjectService } from '../../../services';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';

// declare let $: any;
@Component({
  selector: 'app-todo-inbox',
  templateUrl: './todo-inbox.component.html',
  styleUrls: ['./todo-inbox.component.scss']
})
export class TodoInboxComponent implements OnInit, AfterViewInit, OnDestroy {
  todos: TodoListType;
  popupType: string; // popup type - update/delete
  todo: TodoType = null; // single todo object
  conditions: TodoConditions; // aploo refreshfetch conditions
  // eslint-disable-next-line @typescript-eslint/naming-convention
  TODOTYPES = this.todoService.todoTypes(); // todo types wrt routes
  todoCurrentType: string; // current route
  loaderImage = this.appService.loaderImage;
  isDeleting = false;
  q = ''; // serach string
  count: ITodoTypeCount = {};
  tabs: ItabName = this.todoService.todoTabs();
  labels: TodoProjectType[] = [];

  private params$ = combineLatest([
    this.activatedRoute.params,
    this.activatedRoute.queryParams
  ]);

  private subscriptions: ISubscription = {
    count: null,
    delete: null,
    update: null,
    todos: null
  };

  constructor(
    private todoService: TodoService,
    private appService: AppService,
    private toastr: UtilityService,
    private router: Router,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchTodosOnLoad();
    this.subscribeToCount();
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
   this.appService.unsubscribe(this.subscriptions);
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
    const { _id: id, ...body } = postBody;
    this.subscriptions.update = this.todoService
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
    this.subscriptions.todos = this.projectService.fetchAll()
      .pipe(
        switchMap(labels=>{
          this.labels = labels;
          return this.fetchParams();
        }),
        switchMap(response=>{
          const conditions = this.generateConditions(response);
          return this.todoService.fetchAll(conditions);
        })
      )
      .subscribe(response=>{
        const { data = {} } = response;
        const todos = { ...data.todoList };
        this.todos = {
          ...this.todos,
          totalCount: todos.totalCount,
          data: this.todoService.sortArrayByDate(todos.data, 'createdAt')
        };
        if (this.todoCurrentType) {
          this.appService.configureSeo(this.todoCurrentType);
        }
      });
  }

  private fetchParams() {
    // check params
    return this.params$.pipe(
      switchMap(response=>{
        const [p, query] = response;
            const { label = null } = p;
            const { q = '' } = query;
            return of({ label, q });
      })
    );
  };

  private generateConditions({ q = '', label = null  }): TodoConditions {
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
      const filterLabel = this.labels.filter(obj => (obj.slug).toLowerCase() === label.toLowerCase());
      if(filterLabel.length){
        // eslint-disable-next-line no-underscore-dangle
        this.conditions = this.todoService.getConditions(filterLabel[0]._id, 'labels');
      } else {
        this.conditions = this.todoService.getConditions(null, 'labels');
      }
    }
    if (q) {
      this.q = q;
      this.conditions = {
        ...this.conditions,
        filter: {
          ...this.conditions.filter,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          title_contains: q
        }
      };
    }
    return this.conditions;
  }

  private subscribeToCount(){
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

}
