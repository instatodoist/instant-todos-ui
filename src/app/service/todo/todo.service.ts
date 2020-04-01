import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  TODO_LIST_QUERY,
  TODO_LABEL_QUERY,
  TODO_UPDATE_MUTATION,
  TODO_DELETE_MUTATION,
  TODO_ADD_MUTATION,
  TODO_LABEL_ADD_MUTATION,
  TODO_LABEL_UPDATE_MUTATION,
  TODO_LABEL_DELETE_MUTATION
} from '../../gql/todo.gql';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TodoConditions,
  TodoListType,
  TodoLabelType,
  TodoType,
  SuccessType,
} from '../../models/todo.model';
@Injectable({
  providedIn: 'root',
})

export class TodoService {
  private API_URL = environment.API_URL; // API Url
  private TODOTYPES = this.todoTypes(); // todo route types
  constructor(
    private apollo: Apollo
  ) { }

  // priorities array
  getPriorities() {
    return [
      {
        name: 'P1',
        color: 'red'
      },
      {
        name: 'P2',
        color: 'orange'
      },
      {
        name: 'P3',
        color: 'blue'
      },
      {
        name: 'P4',
        color: 'black'
      }
    ];
  }

  // populate color for the label
  getColor(priority: string): string {
    const priorityObj = this.getPriorities().filter(item => {
      return item.name === priority;
    });
    return priorityObj[0].color;
  }

  /**
   * @description - Return route modules
   */
  todoTypes() {
    return {
      inbox: 'backlog',
      today: 'today',
      pending: 'pending',
      completed: 'completed',
      label: 'label'
    };
  }

  /**
   * @param type - current route type
   * @description - used to get the refetch condition for current route for aplolo
   */
  getConditions(type: string): TodoConditions {
    if (type === this.TODOTYPES.today) {
      return {
        sort: {
          priority: 'ASC'
        },
        filter: {
          type: 'today'
        }
      };
    } else if (type === this.TODOTYPES.completed) {
      return {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          isCompleted: true
        }
      };
    } else if (type === this.TODOTYPES.pending) {
      return {
        sort: {
          priority: 'ASC'
        },
        filter: {
          type: 'pending'
        }
      };
    } else if (type === this.TODOTYPES.inbox) {
      return {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          type: 'backlog'
        }
      };
    } else {
      return {
        sort: {
          updatedAt: 'DESC'
        },
        filter: {
          labelId: type,
          isCompleted: false
        }
      };
    }
  }

  /**
   * @param conditions - filter params while fetching todos
   */
  listTodos(conditions: TodoConditions): Observable<TodoListType> {
    return this.apollo
      .watchQuery({
        query: TODO_LIST_QUERY,
        variables: conditions,
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(map(({ data }: any) => {
        return data.todoList;
      }));
  }

  /**
   * @description - fetching todos labels
   */
  listTodoLabels(): Observable<TodoLabelType[]> {
    return this.apollo
      .watchQuery({
        query: TODO_LABEL_QUERY,
        variables: {
          sort: { updatedAt: 'ASC' }
        },
      })
      .valueChanges.pipe(map(({ data }: any) => {
        return data.todoLabelList;
      }));
  }

  /**
   * @param body - postbody for add/update/delete task
   * @param conditions - refetch conditions for todos-task wrt apolo
   */
  todoOperation(body: TodoType, conditions: any = null): Observable<SuccessType> {
    let gqlOperation = TODO_ADD_MUTATION;
    let defaultDataKey = 'addTodo';
    const operationType = body.operationType;
    // refetch query after add or update
    const refetchQuery: any = {
      query: TODO_LIST_QUERY
    };
    // if passing conditions
    if (conditions) {
      refetchQuery.variables = conditions;
    }
    // initialising gql variables
    let variables: any = {};
    // initialising input body
    const postTodo: any = {};
    // checking title
    if (body.title) {
      postTodo.title = body.title;
    }
    // checking priority
    if (body.priority) {
      postTodo.priority = body.priority;
    }
    // checking labels
    if (body.labelId.length) {
      postTodo.label = body.labelId;
    }
    // checking scheduling
    if (body.scheduledDate && body.scheduling) {
      postTodo.scheduledDate = body.scheduledDate;
    } else if (body.scheduledDate && !body.scheduling) {
      postTodo.scheduledDate = null;
    }
    // checking which operation - 'ADD' | 'UPDATE' | 'DELETE'
    switch (operationType) {
      case 'UPDATE':
        gqlOperation = TODO_UPDATE_MUTATION;
        defaultDataKey = 'updateTodo';
        variables = {
          ...variables,
          input: {...postTodo, isCompleted: !!body.isCompleted },
          id: body._id
        };
        break;
      case 'DELETE':
        gqlOperation = TODO_DELETE_MUTATION;
        defaultDataKey = 'deleteTodo';
        variables.id = body._id;
        break;
      default:
        variables = {
          ...variables,
          input: postTodo
        };
        break;
    }
    return this.apollo.mutate({
      mutation: gqlOperation,
      variables,
      refetchQueries: [
        refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => {
        return data[defaultDataKey];
      }));
  }

  /**
   * @param body - postbody for add/update/delete label
   * @param conditions - refetch conditions for todos-label wrt apolo
   */
  todoLabelOperation(body: TodoLabelType, conditions: any = null): Observable<SuccessType> {
    let gqlOperation = TODO_LABEL_ADD_MUTATION;
    let defaultDataKey = 'addTodoLabel';
    const operationType = body.operationType;
    // refetch query after add or update
    const refetchQuery: any = {
      query: TODO_LABEL_QUERY
    };
    // if passing conditions
    if (conditions) {
      refetchQuery.variables = conditions;
    }
    // gql variables
    let variables: any = {};
    switch (operationType) {
      case 'UPDATE':
        gqlOperation = TODO_LABEL_UPDATE_MUTATION;
        defaultDataKey = 'updateTodoLabel';
        variables = {
          ...variables,
          input: {
            name: body.name
          },
          id: body._id
        };
        break;
      case 'DELETE':
        gqlOperation = TODO_LABEL_DELETE_MUTATION;
        defaultDataKey = 'deleteTodoLabel';
        variables.id = body._id;
        break;
      default:
        variables = {
          ...variables,
          input: {
            name: body.name
          }
        };
        break;
    }
    return this.apollo.mutate({
      mutation: gqlOperation,
      variables,
      refetchQueries: [
        refetchQuery
      ]
    })
      .pipe(map(({ data }: any) => {
        return data[defaultDataKey];
      }));
  }
}
