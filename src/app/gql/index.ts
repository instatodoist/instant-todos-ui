
export * from './auth.gql';
export * from './goal.gql';
export * from './todo.gql';

/** TODO: Need to remove */
import * as authGql from './auth.gql';

export default {
  ...authGql,
};
