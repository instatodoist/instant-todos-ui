import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { LsService, AppService, AuthService } from '../../../service';
import { UserModel } from '../../../models';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss']
})
export class AuthRegisterComponent implements OnInit {

  loader: boolean;
  isSubmit = false;
  signinForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private lsService: LsService) { }

  ngOnInit(): void {}

  // auth check after submit
  register(): void {
    this.loader = true;
    this.isSubmit = true;
    this.authService.register(this.signinForm.value)
      .subscribe((response: UserModel.RegisterResponse) => {
        const data = response;
        this.router.navigate(['auth/verification', data.hashToken]);
        this.loader = false;
        this.isSubmit = false;
      },
      () => {
        this.isSubmit = false;
        this.loader = false;
      }
      );
  }

}
