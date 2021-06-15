import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { LsService } from './../../service/ls.service';
import { environment } from '../../../environments/environment';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserModel, IUserProfile, IUserPassword, ISuccessType, ILoginResponse } from '../../models';
import {
  LOGIN_QUERY,
  REGISTER_MUTATION,
  FORGOT_PASSWORD,
  EMAIL_VERIFICATION,
  PROFILE_QUERY,
  RESET_PASSWORD,
  PROFILE_UPDATE_GQL,
  UPDATE_PASSWORD_GQL,
  GOOGLE_MUTATION
} from '../../graphql/gql/auth.gql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authKey = 'isLoggedIn';
  API_URL = environment.API_URL;

  constructor(
    private lsService: LsService,
    private apollo: Apollo
  ) { }

  login(): boolean {
    return this.lsService.getValue(this.authKey) ? true : false;
  }

  logout(): boolean {
    this.lsService.deleteValue(this.authKey);
    this.lsService.deleteValue('__token');
    this.lsService.clearAll();
    return true;
  }

  signIn(postData: UserModel.UserType) {
    return this.apollo
      .watchQuery({
        query: LOGIN_QUERY,
        variables: {
          input: postData
        }
      })
      .valueChanges.pipe(map(({ data }) => data));
  }

  register(postData: UserModel.UserType): Observable<UserModel.RegisterResponse> {
    return this.apollo
      .mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          input: postData
        }
      })
      .pipe(map(({ data }: any) => data.register)
      );
  }

  verification(postData: UserModel.UserType): Observable<UserModel.RegisterResponse> {
    return this.apollo
      .mutate({
        mutation: EMAIL_VERIFICATION,
        variables: {
          input: postData
        }
      })
      .pipe(map(({ data }: any) => data.emailVerificationByOtp)
      );
  }

  forgotPassword(postBody: any): Observable<any> {
    return this.apollo.mutate({
      mutation: FORGOT_PASSWORD,
      variables: {
        input: postBody
      }
    })
      .pipe(map(({ data }: any) => data.userForgotpassword));
  }

  resetPassword(postBody: any): Observable<any> {
    return this.apollo.mutate({
      mutation: RESET_PASSWORD,
      variables: {
        input: postBody
      }
    })
      .pipe(map(({ data }: any) => data.userResetPassword));
  }

  updatePassword(postBody: IUserPassword): Observable<ISuccessType> {
    return this.apollo.mutate({
      mutation: UPDATE_PASSWORD_GQL,
      variables: {
        input: postBody
      }
    })
      .pipe(map(({ data }: any) => data.updatePassword));
  }

  profile(): Observable<UserModel.IUserProfile> {
    return this.apollo
      .watchQuery({
        query: PROFILE_QUERY,
        fetchPolicy: 'cache-and-network'
      })
      .valueChanges.pipe(map(({ data }: any) => data?.profile || null));
  }

  updateProfile(postBody: IUserProfile): Observable<IUserProfile> {
    const { image, ...body} = postBody;
    return this.apollo.mutate({
      mutation: PROFILE_UPDATE_GQL,
      variables: {
        input: body,
        image: postBody.image
      },
      context: {
        useMultipart: true
      }
    })
      .pipe(map(({ data }: any) => data.updateProfile));
  }

  googleLogin(postData: IUserProfile): Observable<ILoginResponse>  {
    return this.apollo
      .mutate({
        mutation: GOOGLE_MUTATION,
        variables: {
          input: postData
        }
      })
      .pipe(map(({ data }: any) => data.googleLogin)
      );
  }
}
