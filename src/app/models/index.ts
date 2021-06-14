export * from './auth.model';
export * from './goal.model';
export * from './shared.model';
export * from './todo.model';
export * from './setting.model';

/** TODO: Need to remove */
import * as UserModel from './auth.model';
export { UserModel };

export interface ILink {
  name: string;
  slug?: string;
  icon: string;
  link: string;
  count?: number;
}
export interface INavLink {
  name: string;
  slug?: string;
  icon: string;
  link?: string;
  children?: ILink[];
  active?: boolean;
  count?: number;
}
