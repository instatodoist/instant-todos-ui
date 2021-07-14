import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../../../services';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit, OnDestroy {

  routes = [
    {
      name: 'Personal Information',
      url: '/profile/update',
      isActive: true
    },
    {
      name: 'Change Password',
      url: '/profile/password',
      isActive: false
    }
  ];
  currentUrlSubscription: Subscription;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.currentUrlSubscription = this.appService.currentUrlDataSource$
      .subscribe((url: string) => {
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
