import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Injector,
  ComponentRef,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TodoService, AppService } from '../../../../service';
import { ITodoTypeCount, INavLink } from '../../../../models';
import { TodoProjectDialogComponent } from '../../../todo/todo-project-dialog/todo-project-dialog.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [`
    .iq-menu-custom {
      padding-bottom: 100% !important;
    }
  `]
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('vcprojects', { read: ViewContainerRef }) projectVcRef: ViewContainerRef;

  isOpen = false;
  count: ITodoTypeCount;
  navLinks: INavLink[];
  currentUrl = '';

  constructor(
    private router: Router,
    private injector: Injector,
    private todoService: TodoService,
    private appService: AppService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.navLinks = this.nav();
    const query = {
      filter: {
        isCompleted: true
      }
    };
    combineLatest([
      this.appService.currentUrlObservable,
      this.todoService.countByTodoType(query)
    ])
      .subscribe((response: any) => {
        const [currentUrl = '', foo] = response;
        const { today = 0, pending = 0, inbox = 0, completed = 0, upcoming = 0 } = foo;
        this.count = {
          ...this.count,
          pending,
          today,
          inbox,
          completed,
          upcoming
        };
        this.attachActiveClass(currentUrl);
        this.populateCount();
        // this.lazyLoadComponent();
      });
  }

  ngAfterViewInit(): void {}

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

  private nav(): INavLink[] {
    return [
      {
        name: 'Smart Analysis',
        slug: 'smart-analysis',
        icon: 'fa fa-calendar',
        link: '/smart-analysis'
      },
      {
        name: 'Today',
        slug: 'today',
        icon: 'fa fa-calendar',
        link: '/tasks/today',
        count: 0
      },
      {
        name: 'Pending',
        slug: 'pending',
        icon: 'far fa-calendar-times',
        link: '/tasks/pending',
        count: 0
      },
      {
        name: 'Upcoming',
        slug: 'upcoming',
        icon: 'far fa-calendar-plus',
        link: '/tasks/upcoming',
        count: 0
      },
      {
        name: 'Completed',
        slug: 'completed',
        icon: 'fa fa-check',
        link: '/tasks/completed',
        count: 0
      },
      {
        name: 'Inbox',
        slug: 'inbox',
        icon: 'fa fa-inbox',
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  lazyLoadComponent(): void{
    this.modalService.open(TodoProjectDialogComponent, {size: 'lg', scrollable: true});
  }

}
