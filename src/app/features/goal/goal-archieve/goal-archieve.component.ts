import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IGoalListType, IGoalConditions, IGoalType, IExternalModal } from '../../../models';
import { GoalService, AppService } from '../../../service';
import { Subscription } from 'rxjs';
declare var $: any;

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
  extModalConfig: IExternalModal = this.appService.ExternalModelConfig;
  conditions: IGoalConditions = {
    filter: {
      isAchieved: true
    },
    sort: {
      createdAt: 'DESC',
      isPinned: 'DESC'
    },
    limit: 100
  };
  loaderImage = this.appService.loaderImage;

  constructor(
    private goalService: GoalService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.loader = true;
    this.goals$ = this.goalService.listGoals(this.conditions).subscribe((data: any) => {
      if (typeof data !== 'undefined') {
        this.goals = data.listThought;
        this.loader = false;
      }
    }, () => {
      this.loader = false;
    });
  }

  ngOnDestroy() {
    this.goals$.unsubscribe();
  }
}
