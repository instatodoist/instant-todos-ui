import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GOAL_QUERY,
  ADD_GOAL_MUTATION,
  UPDATE_GOAL_MUTATION,
  GOAL_DELETE_MUTATION
} from '../../graphql/gql';
import {
  IGoalConditions,
  IGoalListType,
  IGoalType,
  ISuccessType,
  IGoalResponseType,
  IGoalGQLNames,
  IGQLVariable
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
        fetchPolicy: 'cache-and-network'
      })
      .valueChanges.pipe(
        map((response: IGoalResponseType) => ({
            data: response?.data?.listThought.data || null,
            totalCount: response?.data?.listThought.totalCount || 0,
            loading: response.loading
          }))
      );
  }

  goalOperation(body: IGoalType, conditions: IGoalConditions = null): Observable<ISuccessType> {
    let gqlOperation = ADD_GOAL_MUTATION;
    let defaultDataKey: IGoalGQLNames = 'addThought';
    const { operationType, _id, ...postBody } = body;
    let variables: IGQLVariable<string, IGoalType> = {}; // initialising gql variables
    switch (operationType) { // checking which operation - 'ADD' | 'UPDATE' | 'DELETE'
    case 'UPDATE':
      gqlOperation = UPDATE_GOAL_MUTATION;
      defaultDataKey = 'updateThought';
      variables = {
        ...variables,
        input: { ...postBody },
        id: body._id
      };
      break;
    case 'DELETE':
      gqlOperation = GOAL_DELETE_MUTATION;
      defaultDataKey = 'deleteThought';
      variables.id = body._id;
      break;
    default:
      variables = {
        ...variables,
        input: postBody
      };
      break;
    }
    return this.apollo.mutate({
      mutation: gqlOperation,
      variables,
      refetchQueries: [
        {
          query: GOAL_QUERY,
          variables: {
            ...conditions
          }
        }
      ]
    })
      .pipe(
        map((response: IGoalResponseType) => ({
          ...response?.data[defaultDataKey],
          loading: response.loading
        }))
      );
  }
}
