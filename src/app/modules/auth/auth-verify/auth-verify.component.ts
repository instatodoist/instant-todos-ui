import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { UserModel } from '../../../models';
@Component({
  selector: 'app-auth-verify',
  templateUrl: './auth-verify.component.html',
  styleUrls: ['./auth-verify.component.scss']
})
export class AuthVerifyComponent implements OnInit {

  isSubmit = false;
  loader: boolean;
  formObj: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      otp: ['', Validators.required],
      hashToken: ['', Validators.required]
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
    this.isSubmit = true;
    this.authService.verification(this.formObj.value)
      .subscribe((response: UserModel.RegisterResponse) => {
        this.loader = false;
        if (this.router.url.match('auth/forgot-password/confirmation')) {
          const data = response;
          this.router.navigate(['auth/reset-password/', data.hashToken]);
          this.loader = false;
        } else {
          this.isSubmit = false;
          this.router.navigate(['/auth/login']);
        }
      },
      () => {
        this.isSubmit = false;
        this.loader = false;
      });
  }

}
