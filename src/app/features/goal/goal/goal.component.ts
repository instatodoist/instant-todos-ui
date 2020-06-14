import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-goal',
  template: `
  <div class="container-fluid">
    <ul class="nav nav-tabs mb-3" id="myTab-1" role="tablist">
      <li class="nav-item" *ngFor="let route of routes">
        <a class="nav-link" id="home-tab" [routerLink]="route.url" [ngClass]="{'active': route.isActive}">
          {{route.name}}
        </a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  </div>
  `,
  styles: []
})
export class GoalComponent implements OnInit, OnDestroy {

  currentUrlSubscription: Subscription;
  routes = [
    {
      name: 'Notes',
      url: '/notes',
      isActive: true
    },
    {
      name: 'Archieved',
      url: '/notes/archieved',
      isActive: false
    }
  ];

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.currentUrlSubscription = this.appService.currentUrlObservable.subscribe((url: string) => {
      if (url) {
        const currentRoute = this.routes.filter(item => item.url === url);
        if (currentRoute.length) {
          this.routes = this.routes.map(item => {
            if (item.url === currentRoute[0].url) {
              item.isActive = true;
            } else {
              item.isActive = false;
            }
            return item;
          });
        }
      }
    });
  }

  ngOnDestroy() {
    this.currentUrlSubscription.unsubscribe();
  }

}
