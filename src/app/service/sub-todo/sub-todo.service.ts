import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import {
  TODO_LIST_QUERY,
  TODO_LIST_COUNT_QUERY,
  TODO_PROJECT_QUERY,
  SUB_TODO_ADD_MUTATION,
  SUB_TODO_UPDATE_MUTATION,
  SUB_TODO_DELETE_MUTATION
} from '../../graphql/gql';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TodoType,
  ISubTask,
  ISuccessType,
  IGQLVariable
} from '../../models';
@Injectable({
  providedIn: 'root'
})

export class SubTodoService {
  constructor(
    private apollo: Apollo
  ) { }

   // create
   createSubTodo(body: ISubTask, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'addSubTodo';
    // initialising gql variables
    const variables: IGQLVariable<string,  ISubTask> = {
      input: {
        todoId: body.todoId,
        title: body.title
      }
    };

    return this.apollo.mutate({
      mutation: SUB_TODO_ADD_MUTATION,
      variables,
      refetchQueries: [
        ...refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => data[defaultDataKey]));
  }

  // update
  updateSubTodo(subTodoId: string, body: ISubTask, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'updateSubTodo';
    // initialising gql variables
    const variables: IGQLVariable<string,  ISubTask> = {
      // eslint-disable-next-line no-underscore-dangle
      id: subTodoId,
      input: {
        todoId: body.todoId,
        title: body.title
      }
    };
    return this.apollo.mutate({
      mutation: SUB_TODO_UPDATE_MUTATION,
      variables,
      refetchQueries: [
        ...refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => data[defaultDataKey]));
  }

  // delete
  deleteSubTodo(subTodoId: string, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'deleteSubTodo';
    const variables: IGQLVariable<string,  TodoType> = {
      id: subTodoId
    };
    return this.apollo.mutate({
      mutation: SUB_TODO_DELETE_MUTATION,
      variables,
      refetchQueries: [
        ...refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => data[defaultDataKey]));
  }

  private createRefetchQuery(conditions: any = null, type?: string): any{
    // refetch query
    const refetchQuery: any = {
      query: TODO_LIST_QUERY
    };
    // if passing conditions
    if (conditions) {
      refetchQuery.variables = { ...conditions };
    }
    return [
        ...[refetchQuery],
        {
          query: TODO_LIST_COUNT_QUERY,
          variables: {
            filter: {
              isCompleted: true
            }
          }
        },
        {
          query: TODO_PROJECT_QUERY,
          variables: {
            sort: { updatedAt: 'ASC' }
          }
        }
      ];
  }
}
