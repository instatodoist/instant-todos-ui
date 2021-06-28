import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import {
  TODO_LABEL_ADD_MUTATION,
  TODO_LABEL_UPDATE_MUTATION,
  TODO_LABEL_DELETE_MUTATION,
  TODO_LABEL_QUERY
} from '../../graphql/gql/todo.gql';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ISuccessType,
  IGQLVariable,
  TodoLabelType
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private apollo: Apollo
  ) { }

  // fetch
  fetchAll(): Observable<TodoLabelType[]> {
    return this.apollo
      .watchQuery({
        query: TODO_LABEL_QUERY,
        variables: {
          sort: { updatedAt: 'ASC' }
        }
      })
      .valueChanges.pipe(map(({ data }: any) => data.todoLabelList));
  }

  // create
  create(body: TodoLabelType, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'addTodoLabel';
    const {_id, operationType, ...postBody } = body;
    // initialising gql variables
    let variables: IGQLVariable<string,  TodoLabelType> = {};
    variables = {
      ...variables,
      input: {
        ...postBody
      }
    };
    return this.apollo.mutate({
      mutation: TODO_LABEL_ADD_MUTATION,
      variables,
      refetchQueries: [
        ...refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => data[defaultDataKey]));
  }

  // update
  update(body: TodoLabelType, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'updateTodoLabel';
    const { _id, operationType, ...postBody } = this.createPayload(body);
    // initialising gql variables
    let variables: IGQLVariable<string,  TodoLabelType> = {};
    variables = {
      ...variables,
      input: {
        ...postBody
      },
      id: _id
    };
    return this.apollo.mutate({
      mutation: TODO_LABEL_UPDATE_MUTATION,
      variables,
      refetchQueries: [
        ...refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => data[defaultDataKey]));
  }

  // delete
  delete(body: TodoLabelType, conditions: any = null): Observable<ISuccessType>{
    const refetchQuery = this.createRefetchQuery(conditions);
    const defaultDataKey = 'deleteTodoLabel';
    const postTodo = this.createPayload(body);
    const variables: IGQLVariable<string,  TodoLabelType> = {};
    // eslint-disable-next-line no-underscore-dangle
    variables.id = postTodo._id;
    return this.apollo.mutate({
      mutation: TODO_LABEL_DELETE_MUTATION,
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
      query: TODO_LABEL_QUERY
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

  private createPayload(body: TodoLabelType): TodoLabelType {
    const postTodo: TodoLabelType = { ...body };
    return postTodo;
  }
}
