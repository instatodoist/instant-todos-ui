import { SortEnumType } from './shared.model';

// enum TodoPriorityEnumType {
//   'p1',
//   'p2',
//   'p3',
//   'p4'
// }

type TodoEnumType = 'today' | 'backlog' | 'pending' | 'upcoming';
// export type PriorityEnumType = 'P1' | 'P2' | 'P3' | 'P4';

export interface IComment {
  description: string;
  _id: string;
}

export interface ISingletab {
  name: string;
  isShown: boolean;
  link: string;
}

export interface ItabName {
  [key: string]: ISingletab[];
}

export interface ITodoTypeCount {
  inbox?: number;
  today?: number;
  pending?: number;
  upcoming?: number;
  completed?: number;
}

export interface ISubTask{
  title: string;
  todoId: string;
}

export interface TodoType {
  _id?: string;
  title?: string;
  projectId?: string;
  project?: TodoProjectType;
  labelIds?: string[];
  labels?: TodoLabelType[];
  isCompleted?: boolean;
  // priority?: // PriorityEnumType;
  operationType?: string;
  deleteRequest?: boolean;
  scheduling?: boolean;
  scheduledDate?: Date;
  createdAt?: Date;
  subTasks?: TodoType[];
  parent?: string;
  notes?: string;
  comments?: IComment[];
  noteId?: string;
  list?: TodoType[];
}

export interface TodoLabelType {
  _id?: string;
  name?: string;
  color?: string;
  description?: string;
  operationType?: string;
  count?: number;
}

export interface TodoProjectType {
  _id?: string;
  name?: string;
  slug?: string;
  operationType?: string;
  count?: number;
}

export interface TodoFilterType {
  isCompleted?: boolean;
  title_contains?: string;
  labelIds?: string[];
  projectId?: string;
  startAt?: Date;
  endAt?: Date;
  type?: TodoEnumType;
  // priority?: Todo// PriorityEnumType;
}
export interface TodoSortType {
  createdAt?: SortEnumType;
  updatedAt?: SortEnumType;
  scheduledDate?: SortEnumType;
  // priority?: SortEnumType;
}

export interface TodoConditions {
  first?: number;
  offset?: number;
  sort?: TodoSortType;
  filter?: TodoFilterType;
}

export interface TodoListType {
  data: TodoType[];
  totalCount: number;
}

export interface ITodoComplete {
  _id?: string;
  list?: TodoType[];
}

export interface TodoCompletedListType {
  data: ITodoComplete[];
  totalCount: number;
}

export interface TodoLabelListType {
  data?: TodoLabelType[];
  totalCount: number;
}

// export interface TodoListResponseType {
//   todoList: {
//     data: TodoListType;
//   };
// }
