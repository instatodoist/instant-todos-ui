/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from 'apollo-angular';

export const SUB_TODO_ADD_MUTATION = gql`
  mutation addSubTodo( $input: SubTaskInputType!) {
    addSubTodo(input: $input){
      message
      ok
    }
  }
`;

export const SUB_TODO_UPDATE_MUTATION = gql`
  mutation updateSubTodo( $id: ID!, $input: SubTaskInputType!) {
    updateSubTodo(id: $id, input: $input){
      message
      ok
    }
  }
`;

export const SUB_TODO_DELETE_MUTATION = gql`
  mutation deleteSubTodo( $id: ID!) {
    deleteSubTodo(id: $id){
      message
      ok
    }
  }
`;

// export const SUB_TODO_LIST_QUERY = gql`
//   query subTodoList($id: ID!){
//     subTodoList(id: $id) {
//       title
//       _id
//     }
//   }
// `;

export default {
  SUB_TODO_ADD_MUTATION,
  SUB_TODO_DELETE_MUTATION,
  SUB_TODO_UPDATE_MUTATION,
  // SUB_TODO_LIST_QUERY
};
