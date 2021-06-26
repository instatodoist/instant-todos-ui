import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-goal',
  template: `
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div class="iq-card-body">
          <nav mat-tab-nav-bar>
            <a mat-tab-link *ngFor="let route of routes"
              [routerLink]="route.url"
              [active]="route.isActive"
            > {{route.name}} </a>
          </nav>
          </div>
        </div>
      </div>
    </div>
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
    this.currentUrlSubscription = this.appService.currentUrlDataSource$.subscribe((url: string) => {
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
