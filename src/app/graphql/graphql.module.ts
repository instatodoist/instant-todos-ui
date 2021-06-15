import { Apollo} from 'apollo-angular';
import {HttpClientModule} from '@angular/common/http';
import {InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink} from 'apollo-angular/http';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import { NgModule } from '@angular/core';
import { environment } from '../../environments/environment';
import { UtilityService } from '../service/utility.service';
import { LsService } from '../service/ls.service';
import { AuthService } from '../service/auth/auth.service';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ]
})
export class GraphqlModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    utilityService: UtilityService,
    lsService: LsService,
    private authService: AuthService,
    private router: Router
  ) {

    const httpLink2 = httpLink.create({
      uri: environment.API_URL
    });
    // auth link
    const authLink = setContext((_, { headers }) =>
      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      // eslint-disable-next-line implicit-arrow-linebreak
      ({
        headers: {
          ...headers,
          authorization: lsService.getValue('__token') ? `Bearer ${lsService.getValue('__token')}` : ''
        }
      }));
    // error link
    const errorLink = onError((err): any => {
      const {graphQLErrors = null, networkError= null }  = err as any;
      if(graphQLErrors){
        graphQLErrors.map(({ message }) =>
          utilityService.toastrError(message)
        );
        return throwError(graphQLErrors);
      } else if(networkError){
        const { status, error = null } = networkError;
        const errors = error?.errors || null;
        if(errors && status === 400){
          errors.map(({ message }) =>
            utilityService.toastrError(message)
          );
          return throwError(errors);
        } else if(errors && status === 500){
          errors.map(({ message }) =>
            utilityService.toastrError('Internal Server Error, Please try after some time.')
          );
          return throwError(errors);
        }
      }
      this.authService.logout();
      this.router.navigate(['/']);
      return false;
    });
    const httpLinkWithErrorHandling = ApolloLink.from([
      errorLink,
      authLink,
      httpLink2
    ]);
    apollo.create({
      link: httpLinkWithErrorHandling,
      cache: new InMemoryCache(),
      connectToDevTools: true,
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all'
        }
      }
    });
  }
}
