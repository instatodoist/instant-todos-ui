import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { GoalService, UtilityService } from '../../../service';
import { IGoalType, IExternalModal, IGoalConditions } from '../../../models';
type IGoalPopupType = 'GOAL_ADD' | 'GOAL_UPDATE';

@Component({
  selector: 'app-goal-dialog',
  templateUrl: './goal-dialog.component.html',
  styleUrls: ['./goal-dialog.component.scss']
})
export class GoalDialogComponent implements OnInit {

  @Input() // Goal object
  goal: IGoalType = null;
  @Input() // model ID
  modelId = 'goal-dialog';
  @Input() // parent Conditions
  conditions: IGoalConditions;
  defaultConfig: IExternalModal;
  formObj: FormGroup;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  QUILL_OPTIONS: unknown;
  isSubmit = false;
  popUpType: IGoalPopupType = 'GOAL_ADD';

  constructor(
    private goalService: GoalService,
    private fb: FormBuilder,
    private toastr: UtilityService,
    @Inject(MAT_DIALOG_DATA) public data: IGoalType,
    public dialogRef: MatDialogRef<GoalDialogComponent>
  ) {
    this.goal = data;
  }

  ngOnInit(): void {
    this.QUILL_OPTIONS = {
      theme: 'snow',
      placeholder: 'Write your note here ...',
      toolbar: [
        [
          'bold',
          'italic',
          'underline',
          'strike',
          'code',
          'image'
        ]
      ]
    };
    this.formObj = this.fb.group({
      _id: [''],
      title: ['', [Validators.required]],
      isAchieved: [false],
      isPinned: [false],
      description: [''],
      accomplishTenure: [null],
      operationType: ['ADD']
    });
    this.populateModal();
  }

  private populateModal() {
    if (this.goal) {
      this.formObj.patchValue({
        // eslint-disable-next-line no-underscore-dangle
        _id: this.goal._id,
        title: this.goal.title,
        description: this.goal.description,
        isAchieved: this.goal.isAchieved,
        isPinned: this.goal.isPinned,
        accomplishTenure: this.goal.accomplishTenure,
        operationType: 'UPDATE'
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  submit(): void {
    if (this.formObj.valid) {
      this.isSubmit = true;
      delete this.formObj.value.accomplishTenure;
      this.goalService.goalOperation(this.formObj.value, this.conditions)
        .subscribe(() => {
          this.isSubmit = false;
          this.dialogRef.close();
          let message = 'Note created';
          // eslint-disable-next-line no-underscore-dangle
          if (this.formObj.value._id) {
            message = 'Note updated';
          }
          this.toastr.toastrSuccess(message);
        },
        (() => {
          this.isSubmit = false;
        })
        );
    }
  }

}
