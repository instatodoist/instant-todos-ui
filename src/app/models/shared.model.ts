/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateRef, Type } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  IUserProfile,
  TodoType,
  IGoalType,
  IGoalConditions
} from '../models';

export type SortEnumType = 'ASC' | 'DESC';

export type IOperationEnumType = 'ADD' | 'UPDATE' | 'DELETE';

export type ITemplateOperation = 'IS_ADD' | 'IS_UPDATE' | 'IS_DELETED' | 'IS_PINNED' | 'IS_ARCHIEVED';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface IGQLVariable <T, U extends object> {
  id?: T;
  input?: U;
}

export interface IGQLLoading {
  loading?: boolean;
}

export interface ISuccessType extends IGQLLoading{
  ok?: boolean;
  message?: string;
}

export interface IExternalModal {
  TODO_ADD?: boolean;
  TODO_UPDATE?: boolean;
  GOAL_ADD?: boolean;
  GOAL_UPDATE?: boolean;
  DATE_PICKER?: boolean;
  data?: {
    todo?: TodoType;
    goal?: IGoalType;
    formControlName?: string;
    conditions?: IGoalConditions;
  };
}

export interface ILanguage {
  name: string;
  value: string;
  logo: string;
}
export interface IAppData {
  config: {
    theme: string;
    lang?: ILanguage;
    lng?: string;
    currentUrl?: string;
  };
  isLoggedIn: boolean;
  token: string;
  session: IUserProfile;
}

export type IMetaTag = {
  charset?: string;
  content?: string;
  httpEquiv?: string;
  id?: string;
  itemprop?: string;
  name?: string;
  property?: string;
  scheme?: string;
  url?: string;
} & {
  [prop: string]: string;
};

type TDialogRefData = {
  data?: {
    buttonText?: string;
    title?: string;
    modelId?: string;
    todo?: TodoType;
    goal?: IGoalType;
  };
};

export type TDialogTempRef = {
  type: 'template';
  value: TemplateRef<any>;
} & TDialogRefData;

export type TDialogCompRef = {
  type: 'component';
  value: Type<any>;
} & TDialogRefData;

export type IDialogRef = TDialogCompRef | TDialogTempRef;

export interface ISubscription {
  url?: Subscription;
  list?: Subscription;
  create?: Subscription;
  update?: Subscription;
  delete?: Subscription;
  todos?: Subscription;
  count?: Subscription;
}
