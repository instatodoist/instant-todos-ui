import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService, UtilityService } from '../../../service';
@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.scss']
})
export class PasswordUpdateComponent implements OnInit {

  formObj: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.formObj = this.fb.group({
      password: ['', [ Validators.required]]
    });
  }

  submit() {
    if (this.formObj.valid && this.formObj.dirty) {
      this.authService.updatePassword(this.formObj.value).subscribe(() => {
        this.utilityService.toastrSuccess('Password updated succesfully');
      });
    }
  }

}
