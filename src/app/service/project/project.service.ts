import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import {
  TODO_PROJECT_ADD_MUTATION,
  TODO_PROJECT_UPDATE_MUTATION,
  TODO_PROJECT_DELETE_MUTATION,
  TODO_PROJECT_QUERY
} from '../../graphql/gql/todo.gql';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TodoProjectType,
  ISuccessType,
  IGQLVariable
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private apollo: Apollo
  ) { }

  // fetch
  fetch(): Observable<TodoProjectType[]> {
    return this.apollo
      .watchQuery({
        query: TODO_PROJECT_QUERY,
        variables: {
          sort: { updatedAt: 'ASC' }
        }
      })
      .valueChanges.pipe(map(({ data }: any) => data.todoProjectList));
  }

  // create
  create(body: TodoProjectType, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'addTodoProject';
    const postTodo = this.createPayload(body);
    // initialising gql variables
    let variables: IGQLVariable<string,  TodoProjectType> = {};
    variables = {
      ...variables,
      input: {
        name: postTodo.name
      }
    };
    return this.apollo.mutate({
      mutation: TODO_PROJECT_ADD_MUTATION,
      variables,
      refetchQueries: [
        ...refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => data[defaultDataKey]));
  }

  // update
  update(body: TodoProjectType, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'updateTodoProject';
    const postTodo = this.createPayload(body);
    // initialising gql variables
    let variables: IGQLVariable<string,  TodoProjectType> = {};
    variables = {
      ...variables,
      input: {
        name: postTodo.name
      },
      // eslint-disable-next-line no-underscore-dangle
      id: postTodo._id
    };
    return this.apollo.mutate({
      mutation: TODO_PROJECT_UPDATE_MUTATION,
      variables,
      refetchQueries: [
        ...refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => data[defaultDataKey]));
  }

  // delete
  delete(body: TodoProjectType, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'deleteTodoProject';
    const postTodo = this.createPayload(body);
    const variables: IGQLVariable<string,  TodoProjectType> = {};
    // eslint-disable-next-line no-underscore-dangle
    variables.id = postTodo._id;
    return this.apollo.mutate({
      mutation: TODO_PROJECT_DELETE_MUTATION,
      variables,
      refetchQueries: [
        ...refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => data[defaultDataKey]));
  }

  private createRefetchQuery(conditions: any = null): any{
    // refetch query
    const refetchQuery: any = {
      query: TODO_PROJECT_QUERY
    };
    if (conditions) {
      refetchQuery.variables = conditions;
    }
    // if passing conditions
    if (conditions) {
      refetchQuery.variables = { ...conditions };
    }
    return [
      ...[refetchQuery]
    ];
  }

  private createPayload(body: TodoProjectType): TodoProjectType {
    const postTodo: TodoProjectType = { ...body };
    return postTodo;
  }
}

