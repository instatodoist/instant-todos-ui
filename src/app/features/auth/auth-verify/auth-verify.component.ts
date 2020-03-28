declare var mdc: any;
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppConfig } from '../../../service/appconfig';
import { AuthService } from '../../../service/auth/auth.service';
import { UserModel } from '../../../models';
@Component({
  selector: 'app-auth-verify',
  templateUrl: './auth-verify.component.html',
  styleUrls: ['./auth-verify.component.scss']
})
export class AuthVerifyComponent implements OnInit {

  appData: any;
  loader: boolean;
  formObj: FormGroup;

  constructor(
    private appConfig: AppConfig,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      otp: ['', Validators.required],
      hashToken: ['', Validators.required],
    });
    this.appConfig.appData.subscribe(data => {
      this.appData = data;
    });
    this.activatedRoute.params.subscribe((params) => {
      this.formObj.patchValue({
        hashToken: params.hash
      });
      console.log(this.formObj.value);
    });
  }

  // auth check after submit
  register(): void {
    this.loader = true;
    this.authService.verification(this.formObj.value).subscribe((response: UserModel.RegisterResponse) => {
      this.router.navigate(['login']);
      this.loader = false;
    });
  }

}
