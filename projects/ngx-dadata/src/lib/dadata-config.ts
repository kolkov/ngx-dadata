import {DadataType} from './ngx-dadata.service';

export interface DadataConfig {
  apiKey: string;
  type?: DadataType;
  delay?: number;
  limit?: number;
  width?: 'auto' | string;
  minWidth?: '0' | string;
  partyAddress?: 'city' | 'full';
}

export const DadataConfigDefault: DadataConfig = {
  apiKey: '',
  type: DadataType.address,
  delay: 500,
  limit: 10,
  width: 'auto',
  minWidth: '0',
  partyAddress: 'city',
};
