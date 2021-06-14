import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  CONFIG_SETTING,
  CONFIG_SETTING_MUTATION
} from '../../graphql/gql/setting.gql';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IConfiSetting,
  IConfiSettingGql,
  IGQLVariable
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(
    private apollo: Apollo
  ) { }

  // fetch
  fetch(): Observable<any> {
    return this.apollo
      .watchQuery({
        query: CONFIG_SETTING
      })
      .valueChanges
      .pipe(map((response: IConfiSettingGql)=>
        response.data.setting
      ));
  }


  // update
  update(body: IConfiSetting): Observable<IConfiSetting>{
    // initialising gql variables
    const variables: IGQLVariable<string,  IConfiSetting> = {
      input: {
        theme: body.theme
      },
    };
    return this.apollo.mutate({
      mutation: CONFIG_SETTING_MUTATION,
      variables
    })
    .pipe(map((response: IConfiSettingGql)=>
      response.data.setting
    ));
  }
}
