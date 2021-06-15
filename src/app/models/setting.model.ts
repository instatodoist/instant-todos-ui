import { IGql }  from './common.model';

export interface IConfiSetting {
  theme?: string;
  lang?: string;
}

export interface IConfigSettingResponse {
  setting: IConfiSetting;
}

export interface IConfiSettingGql extends IGql<IConfigSettingResponse> {
  data: IConfigSettingResponse;
}
