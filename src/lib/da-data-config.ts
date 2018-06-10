import {DaDataType} from "./ngx-da-data.service";

export interface DaDataConfig {
  apiKey: string;
  type?: DaDataType,
  delay?: number;
  limit?: number;
  width?: 'auto' | string,
  minWidth?: '0' | string,
}

export const DaDataconfigDefault: DaDataConfig = {
  apiKey: '',
  type: DaDataType.address,
  delay: 500,
  limit: 10,
  width: 'auto',
  minWidth: '0',

};
