import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Injector,
  AfterViewInit,
  Inject,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';

import { TodoService, AppService } from '../../../../services';
import { ITodoTypeCount, INavLink } from '../../../../models';
import { TodoProjectDialogComponent } from '../../../todo/todo-project-dialog/todo-project-dialog.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [`
    .iq-menu-custom {
      padding-bottom: 100% !important;
    }
    .mat-icon{
      margin-right: 20px;
    }
  `]
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vcprojects', { read: ViewContainerRef }) projectVcRef: ViewContainerRef;

  isOpen = false;
  count: ITodoTypeCount;
  navLinks: INavLink[];
  currentUrl = '';
  isSidebarCollapse = false;
  private subscriptions = {
    count: null as Subscription
  };

  constructor(
    private todoService: TodoService,
    private appService: AppService,
    private modalService: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.navLinks = this.nav();
    const query = {
      filter: {
        isCompleted: true
      }
    };
    combineLatest([
      this.appService.currentUrlDataSource$,
      this.todoService.countByTodoType(query)
    ])
      .subscribe((response: any) => {
        const [currentUrl = '', foo] = response;
        this.appService.countDataSource$$.next(foo);
        this.attachActiveClass(currentUrl);
        this.populateCount();
        // this.lazyLoadComponent();
      });
      // subscribe to count
      this.subscribeToCount();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(){
    this.subscriptions.count.unsubscribe();
  }

  subscribeToCount(){
    this.subscriptions.count = this.appService.countDataSource$
      .subscribe(response=>{
        const { today, pending, inbox, completed, upcoming } = response;
        console.log(response);
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

  attachActiveClass(currentUrl: string): void {
    this.currentUrl = currentUrl;
    const navLinks = this.nav().filter(item => {
      if (item.link && this.currentUrl.match(new RegExp(item.link, 'g'))) {
        return true;
      } else if (!item.link) {
        const childrenMatch = item.children.filter(
          chileItem => this.currentUrl.match(
            new RegExp(chileItem.link, 'g')) ||
            chileItem.link.match(new RegExp('lists', 'g'))
          );
        if (childrenMatch.length) {
          return true;
        }
        if (
          item.name === 'Lists' &&
          (this.currentUrl.match(new RegExp('lists', 'g')))) {
          return true;
        }
      }
      return false;
    });
    if (navLinks.length) {
      this.navLinks = this.nav().map(item => {
        if (navLinks[0].name === item.name) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
    }
  }

  populateCount(): void {
    this.navLinks = this.navLinks.map(item => {
      switch(item.slug) {
      case 'today':
        item = { ...item, count: this.count.today };
        break;
      case 'pending':
        item = { ...item, count: this.count.pending };
        break;
      case 'inbox':
        item = { ...item, count: this.count.inbox };
        break;
      case 'upcoming':
        item = { ...item, count: this.count.upcoming };
        break;
      case 'completed':
        item = { ...item, count: this.count.completed };
        break;
      default:
        item.children = item.children && item.children.length && item.children.map(child => child);
        break;
      }
      return item;
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  lazyLoadComponent(): void{
    this.modalService.open(TodoProjectDialogComponent, {
      width: '50%'
    });
  }

  adjustSidebar(): void{
    const collapseClassExist = this.document.body.classList.contains('sidebar-main');
    if(collapseClassExist){
      this.isSidebarCollapse = false;
    } else {
      this.isSidebarCollapse = true;
    }
  }

  private nav(): INavLink[] {
    return [
      {
        name: 'Smart Analysis',
        slug: 'smart-analysis',
        icon: 'analytics',
        link: '/smart-analysis'
      },
      {
        name: 'Today',
        slug: 'today',
        icon: 'calendar_today',
        link: '/tasks/today',
        count: 0
      },
      {
        name: 'Pending',
        slug: 'pending',
        icon: 'pending_actions',
        link: '/tasks/pending',
        count: 0
      },
      {
        name: 'Upcoming',
        slug: 'upcoming',
        icon: 'upcoming',
        link: '/tasks/upcoming',
        count: 0
      },
      {
        name: 'Completed',
        slug: 'completed',
        icon: 'check_circle',
        link: '/tasks/completed',
        count: 0
      },
      {
        name: 'Inbox',
        slug: 'inbox',
        icon: 'inbox',
        link: '/tasks/inbox',
        count: 0
      },
      {
        active: false,
        name: 'Lists',
        slug: 'lists',
        icon: 'fa fa-list-alt',
        children: [
          {
            name: '',
            icon: 'fa fa-tag',
            link: '/lsits'
          }
        ]
      }
    ];
  }

}
