import {gql} from 'apollo-angular';


// eslint-disable-next-line @typescript-eslint/naming-convention
const ToDo: any = {};

ToDo.fragments = {
  count: gql`
    fragment TodoCount on TodoListType {
        totalCount
    }
    `,
  cFields: gql`
    fragment TodoCFields on TodoType {
      _id
      title
      labels {
        name
      }
      project {
        name
      }
      subTasks {
        title
        createdAt
      }
      projectId
      createdAt
      updatedAt
    }
    `,
  filelds: gql`
    fragment TodoFields on TodoType {
      _id
      title
      labels {
        color
        name
        _id
      }
      project {
        name
      }
      comments {
        description
        _id
      }
      subTasks {
        _id
        title
        labels {
          color
          name
          _id
        }
        project {
          name
        }
        projectId
        isCompleted
        scheduledDate
        createdAt
        parent
      }
      parent
      projectId
      isCompleted
      createdAt
      updatedAt
      scheduledDate
      # priority
      # notes {
      #     description
      #     _id
      #     userId {
      #         email
      #         _id
      #     }
      # }
      # user {
      #     email
      # }
    }
  `
};

export const TODO_LIST_QUERY = gql`
  query todoList ($first: Int = 100, $offset: Int = 1, $filter: TodoFilterInputType, $sort: TodoSortInputType){
    todoList (first: $first, offset: $offset, filter: $filter, sort: $sort ){
      ...TodoCount
      data {
          ...TodoFields
      }
    }
  }
  ${ToDo.fragments.count}
  ${ToDo.fragments.filelds}
`;

export const TODO_LISTCOUNT_QUERY = gql`
  query todoList ($first: Int = 100, $offset: Int = 1, $filter: TodoFilterInputType, $sort: TodoSortInputType){
    todoList (first: $first, offset: $offset, filter: $filter, sort: $sort ){
      ...TodoCount
    }
  }
  ${ToDo.fragments.count}
`;

export const TODO_COMPLETED_QUERY = gql`
  query todoCompleted ($first: Int = 100, $offset: Int = 1, $filter: TodoCompletedFilterInputType, $sort: TodoCompletedSortInputType){
    todoCompleted (first: $first, offset: $offset, filter: $filter, sort: $sort ){
      totalCount
      data {
        _id
        count
        list {
          ...TodoCFields
        }
      }
    }
  }
  ${ToDo.fragments.cFields}
`;

export const TODO_ADD_MUTATION = gql`
  mutation addTodo( $input: TodoInputType!) {
    addTodo(input: $input){
      message
      ok
    }
  }
`;

export const TODO_UPDATE_MUTATION = gql`
  mutation updateTodo( $id: ID!, $input: TodoInputType!) {
    updateTodo(id: $id, input: $input){
      message
      ok
    }
  }
`;

export const TODO_DELETE_MUTATION = gql`
  mutation deleteTodo( $id: ID!) {
    deleteTodo(id: $id){
      message
      ok
    }
  }
`;

export const TODO_LIST_COUNT_QUERY = gql`
  query todoCount($filter: TodoFilterInputType) {
    today: todoList (filter: { type: today} ){
      ...TodoCount
    }
    upcoming: todoList (filter: { type: upcoming} ){
      ...TodoCount
    }
    pending: todoList (filter: { type: pending} ){
      ...TodoCount
    }
    inbox: todoList (filter: { type: backlog} ){
      ...TodoCount
    },
    completed: todoList (filter: $filter){
      ...TodoCount
    },
  }
  ${ToDo.fragments.count}
`;

export const TODO_COMPLETED_COUNT_QUERY = gql`
  query todoCompleted{
    todoCompleted {
      totalCount
    }
  }
`;

export const TODO_LABEL_ADD_MUTATION = gql`
  mutation addTodoLabel( $input: TodoLabelInputType!) {
    addTodoLabel(input: $input){
      message
      ok
    }
  }
`;

export const TODO_LABEL_UPDATE_MUTATION = gql`
  mutation addTodoLabel( $id: ID!, $input: TodoLabelInputType!) {
    updateTodoLabel(id: $id, input: $input){
      message
      ok
    }
  }
`;

export const TODO_LABEL_DELETE_MUTATION = gql`
  mutation deleteTodoLabel( $id: ID!) {
    deleteTodoLabel(id: $id){
      message
      ok
    }
  }
`;

export const TODO_LABEL_QUERY = gql`
  query todoLabelList{
    todoLabelList {
      name
      _id
      count
      slug
      color
      description
    }
  }
`;

// Here are the APIs for Project
// This is the new API's replacing lables
// labels will serve another purpose

export const TODO_PROJECT_ADD_MUTATION = gql`
  mutation addTodoProject( $input: TodoProjectInputType!) {
    addTodoProject(input: $input){
      message
      ok
    }
  }
`;

export const TODO_PROJECT_UPDATE_MUTATION = gql`
  mutation addTodoProject( $id: ID!, $input: TodoProjectInputType!) {
    updateTodoProject(id: $id, input: $input){
      message
      ok
    }
  }
`;

export const TODO_PROJECT_DELETE_MUTATION = gql`
  mutation deleteTodoProject( $id: ID!) {
    deleteTodoProject(id: $id){
      message
      ok
    }
  }
`;

export const TODO_PROJECT_QUERY = gql`
  query todoProjectList {
    todoProjectList {
      name
      _id
      count
      slug
    }
  }
`;

export default {
  TODO_ADD_MUTATION,
  TODO_DELETE_MUTATION,
  TODO_UPDATE_MUTATION,
  TODO_LIST_QUERY,
  TODO_COMPLETED_QUERY
};
