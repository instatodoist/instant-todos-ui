import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../service';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {

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
      password: ['', Validators.required],
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
  submit(): void {
    this.loader = true;
    this.isSubmit = true;
    this.authService.resetPassword(this.formObj.value)
      .subscribe(() => {
        this.loader = false;
        this.isSubmit = false;
        this.router.navigate(['/auth/login']);
      },
      () => {
        this.isSubmit = false;
        this.loader = false;
      });
  }

}
