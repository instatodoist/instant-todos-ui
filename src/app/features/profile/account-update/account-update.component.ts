import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService, UtilityService, AppService } from '../../../service';

@Component({
  selector: 'app-account-update',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.scss']
})
export class AccountUpdateComponent implements OnInit, AfterViewInit {

  formObj: FormGroup;
  defaultProfileImage = this.appService.defautProfileImage;
  uploadedImage = '';

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private authService: AuthService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      firstname: [''],
      lastname: [''],
      profileImg: [null]
    });
    // this.getProfile();
    this.appService.APP_LEVEL.subscribe(({session}) => {
      this.formObj.patchValue({
        firstname: session?.firstname || '',
        lastname: session?.lastname || ''
      });
      this.uploadedImage = session?.profilePic?.url;
    });
  }

  ngAfterViewInit() {

  }

  getProfile() {
    this.authService.profile().subscribe((data) => {
      this.appService.__updateCoreAppData({
        ...this.appService.APP_DATA,
        session: {
          ...this.appService.APP_DATA.session, ...data
        }
      });
    });
  }

  submit() {
    if (this.formObj.valid && this.formObj.dirty) {
      const { profileImg, ...postBody } = this.formObj.value;
      if (profileImg) {
        postBody.image = profileImg;
      }
      this.authService.updateProfile(postBody).subscribe(() => {
        this.getProfile();
        this.utilityService.toastrSuccess('Profile Info updated succesfully');
      });
    }
  }
}
