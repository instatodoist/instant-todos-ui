import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGoalListType, IGoalConditions, IGoalType, IOperationEnumType, ITemplateOperation } from '../../../models';
import { GoalService, AppService, UtilityService } from '../../../service';
import { GoalDialogComponent } from '../goal-dialog/goal-dialog.component';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit, OnDestroy {

  goals$: Subscription;
  goals: IGoalListType;
  conditions: IGoalConditions;
  isUpdate = false;
  goal: IGoalType = null;
  loaderImage = this.appService.loaderImage;
  loader = false;
  $ =  this.utilityService.JQuery;

  constructor(
    private activatedRoute: ActivatedRoute,
    private goalService: GoalService,
    private appService: AppService,
    private utilityService: UtilityService,
    private modalService: NgbModal
  ) {
    this.conditions = {
      filter: {
        isAchieved: false,
        q: null
      },
      sort: {
        createdAt: 'DESC',
        isPinned: 'DESC'
      }
    };
  }

  ngOnInit(): void {
    this.loader = true;
    this.goals$ = this.activatedRoute.queryParams
      .pipe(
        switchMap((qParams: any) => {
          const { q = null } = qParams;
          this.conditions = {
            ...this.conditions, filter: {
              ...this.conditions.filter, q
            }
          };
          return this.goalService.listGoals(this.conditions);
        })
      )
      .subscribe(
        (response) => {
          if (response.data){
            this.loader = false;
          }
          this.goals = response;
        }
      );
  }

  ngOnDestroy(): void {
    this.goals$.unsubscribe();
  }

  openUpdatePopUp(goal: IGoalType = null, type: ITemplateOperation = 'IS_UPDATE'): void {
    if (type === 'IS_UPDATE') {
      const modelRef = this.modalService.open(GoalDialogComponent, {size: 'lg'});
      modelRef.componentInstance.goal = goal;
    } else {
      this.modalService.open(GoalDialogComponent, {size: 'lg'});
    }
  }

  updateGoal(goal: IGoalType = null, type: ITemplateOperation = 'IS_PINNED'): void {
    let operationType: IOperationEnumType = 'ADD';
    const goalObj = {
      // eslint-disable-next-line no-underscore-dangle
      _id: goal._id,
      title: goal.title,
      description: goal.description
    };
    if (type === 'IS_PINNED') {
      operationType = 'UPDATE';
      this.submit({
        ...goalObj,
        operationType,
        isPinned: !goal.isPinned
      });
    } else if (type === 'IS_ARCHIEVED') {
      operationType = 'UPDATE';
      this.submit({
        ...goalObj,
        operationType,
        isAchieved: !goal.isAchieved
      });
    } else if (type === 'IS_DELETED') {
      operationType = 'DELETE';
      this.submit({
        ...goalObj,
        operationType,
        isDelete: !goal.isDelete
      });
    }
  }

  submit(postBody: IGoalType = null): void {
    this.goalService.goalOperation(postBody, this.conditions).subscribe();
  }

}
