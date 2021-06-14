/* eslint-disable @typescript-eslint/naming-convention */
import {gql} from 'apollo-angular';
export const CONFIG_SETTING = gql`
  query setting {
    setting{
      theme
    }
  }
`;

export const CONFIG_SETTING_MUTATION = gql`
  mutation setting( $input: SettingInputType!) {
    setting(input: $input){
      theme
    }
  }
`;

export default {
  CONFIG_SETTING
};
