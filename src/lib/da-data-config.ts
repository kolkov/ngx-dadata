import {DaDataType} from "./ngx-da-data.service";

export interface DaDataConfig {
  width?: 'auto' | string,
  minWidth?: '0' | string,
  type?: DaDataType,
}

export const DaDataconfigDefault: DaDataConfig = {
  width: 'auto',
  minWidth: '0',
  type: DaDataType.address
};
