import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GOAL_QUERY,
  ADD_GOAL_MUTATION,
  UPDATE_GOAL_MUTATION
} from '../../gql';
import {
  IGoalConditions,
  IGoalListType,
  IGoalType,
  SuccessType as ISuccessType
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  API_URL = environment.API_URL;
  constructor(private apollo: Apollo) { }

  listGoals(conditions: IGoalConditions): Observable<IGoalListType> {
    return this.apollo
      .watchQuery({
        query: GOAL_QUERY,
        variables: conditions,
      })
      .valueChanges.pipe(map(({ data }: any) => {
        return data.listThought;
      }));
  }

  goalOperation(body: IGoalType, conditions: IGoalConditions = null): Observable<ISuccessType> {
    let gqlOperation = ADD_GOAL_MUTATION;
    let defaultDataKey = 'addThought';
    const { operationType, _id, ...postBody } = body;
    // refetch query after add or update
    const refetchQuery: any = {
      query: GOAL_QUERY,
    };
    // if passing conditions
    if (conditions) {
      refetchQuery.variables = { ...conditions };
    }
    if (!postBody.accomplishTenure) {
      delete postBody.accomplishTenure;
    }
    // initialising gql variables
    let variables: any = {};
    // checking which operation - 'ADD' | 'UPDATE' | 'DELETE'
    switch (operationType) {
      case 'UPDATE':
        gqlOperation = UPDATE_GOAL_MUTATION;
        defaultDataKey = 'updateThought';
        variables = {
          ...variables,
          input: { ...postBody },
          id: body._id
        };
        break;
      // case 'DELETE':
      //   gqlOperation = TODO_DELETE_MUTATION;
      //   defaultDataKey = 'deleteTodo';
      //   variables.id = body._id;
      //   break;
      default:
        variables = {
          ...variables,
          input: postBody
        };
        break;
    }
    const refetch = [refetchQuery];
    return this.apollo.mutate({
      mutation: gqlOperation,
      variables,
      refetchQueries: [
        ...refetch
        // {
        //   query: GOAL_QUERY,
        //   variables: {
        //     filter: {
        //       isCompleted: true
        //     }
        //   }
        // }
      ]
    })
      .pipe(map(({ data }: any) => {
        return data[defaultDataKey];
      }));
  }
}
