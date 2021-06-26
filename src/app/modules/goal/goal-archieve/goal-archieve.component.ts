import { Component, OnInit, OnDestroy } from '@angular/core';
import { IGoalListType, IGoalConditions, IGoalType } from '../../../models';
import { GoalService, AppService } from '../../../service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-goal-archieve',
  templateUrl: './goal-archieve.component.html',
  styleUrls: ['./goal-archieve.component.scss']
})
export class GoalArchieveComponent implements OnInit, OnDestroy {

  loader = false;
  goals$: Subscription;
  goals: IGoalListType;
  isUpdate = false;
  goal: IGoalType = null;
  conditions: IGoalConditions = {
    filter: {
      isAchieved: true,
      q: null
    },
    sort: {
      createdAt: 'DESC',
      isPinned: 'DESC'
    },
    limit: 100
  };
  loaderImage = this.appService.loaderImage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private goalService: GoalService,
    private appService: AppService
  ) { }

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
}
