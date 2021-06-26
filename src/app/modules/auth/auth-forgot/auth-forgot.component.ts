import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-auth-forgot',
  templateUrl: './auth-forgot.component.html',
  styleUrls: ['./auth-forgot.component.scss']
})
export class AuthForgotComponent implements OnInit {

  isSubmit = false;
  loader: boolean;
  signinForm = this.fb.group({
    email: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  // auth check after submit
  submit(): void {
    this.loader = true;
    this.isSubmit = true;
    this.authService.forgotPassword(this.signinForm.value)
      .subscribe(
        (response: any) => {
          const data = response;
          this.router.navigate(['auth/forgot-password/confirmation', data.hashToken]);
          this.loader = false;
          this.isSubmit = false;
        },
        () => {
          this.loader = false;
          this.isSubmit = false;
        }
      );
  }
}
