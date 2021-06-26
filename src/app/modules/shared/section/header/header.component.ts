import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService, AppService, UtilityService } from '../../../../service';
import { Subscription } from 'rxjs';
import { ILanguage, IUserProfile } from '../../../../models';
import { TodoDialogComponent } from '../../../todo/todo-dialog/todo-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  tabTitle = 'InstaTodo';
  headerTitle: string;
  session: IUserProfile;
  formObj: FormGroup;
  languages$: Subscription;
  languages: ILanguage[] = [];
  defaultLang: ILanguage = null;
  defaultProfileImage = this.appService.defautProfileImage;
  jQuery = this.utilityService.JQuery;

  constructor(
    private router: Router,
    private userService: AuthService,
    private fb: FormBuilder,
    private authService: AuthService,
    private appService: AppService,
    private utilityService: UtilityService,
    public dialog: MatDialog
  ) {
    this.formObj = this.fb.group({
      query: ['']
    });
    const urlTree = this.router.parseUrl(this.router.url);
    if (urlTree.queryParams.q) {
      this.formObj.patchValue({
        query: urlTree.queryParams.q
      });
    }
    this.appService.ROOT_STATE$.subscribe(({ session }) => {
      this.session = session;
    });
  }

  ngOnInit(): void {
    this.getProfile();
    this.onSearch();
  }

  headerJs(e: Event): void {
    const jQuery = this.jQuery;
    const myTargetElement = e.target;
    let selector;
    let mainElement;
    if (
      jQuery(myTargetElement).hasClass('search-toggle') ||
      jQuery(myTargetElement).parent().hasClass('search-toggle') ||
      jQuery(myTargetElement).parent().parent().hasClass('search-toggle')
    ) {
      if (jQuery(myTargetElement).hasClass('search-toggle')) {
        selector = jQuery(myTargetElement).parent();
        mainElement = jQuery(myTargetElement);
      } else if (jQuery(myTargetElement).parent().hasClass('search-toggle')) {
        selector = jQuery(myTargetElement).parent().parent();
        mainElement = jQuery(myTargetElement).parent();
      } else if (jQuery(myTargetElement).parent().parent().hasClass('search-toggle')) {
        selector = jQuery(myTargetElement).parent().parent().parent();
        mainElement = jQuery(myTargetElement).parent().parent();
      }
      if (!mainElement.hasClass('active') && jQuery('.navbar-list li').find('.active')) {
        jQuery('.navbar-list li').removeClass('iq-show');
        jQuery('.navbar-list li .search-toggle').removeClass('active');
      }
      selector.toggleClass('iq-show');
      mainElement.toggleClass('active');
      e.preventDefault();
    // eslint-disable-next-line no-empty
    } else if (jQuery(myTargetElement).is('.search-input')) {} else {
      jQuery('.navbar-list li').removeClass('iq-show');
      jQuery('.navbar-list li .search-toggle').removeClass('active');
    }
  }

  // do singout
  signOut(): boolean {
    this.authService.logout();
    this.router.navigate(['/']);
    return false;
  }

  /**
   * open popup
   */
  openPopUp(): void {
    this.dialog.open(TodoDialogComponent, {
      width: '50%'
    });
  }

  /**
   * fectch user profile
   */
  getProfile(): void {
    this.userService.profile()
      .subscribe(data => {
        this.session = data;
        // eslint-disable-next-line no-underscore-dangle
        this.appService.setRootState({
          ...this.appService.ROOT_STATE,
          session: this.session
        });
      });
  }

  /**
   * search content specific to the current routes
   */
  onSearch(): void {
    this.formObj.get('query').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((query) => {
      const urlTree = this.router.createUrlTree([], {
        queryParams: { q: query ? query : null },
        queryParamsHandling: 'merge',
        preserveFragment: true
      });
      return this.router.navigateByUrl(urlTree);
    });
  }

}
