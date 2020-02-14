import {DadataType} from './ngx-dadata.service';

export interface Locations {
  country?: string;
  country_iso_code?: string;
  region?: string;
  area?: string;
  city?: string;
  street?: string;
  street_type_full?: string;
  settlement_type_full?: string;
  city_district_type_full?: string;
  city_type_full?: string;
  area_type_full?: string;
  region_type_full?: string;
  kladr_id?: string;
  region_fias_id?: string;
  area_fias_id?: string;
  city_fias_id?: string;
  settlement_fias_id?: string;
  street_fias_id?: string;
}

export interface DadataConfig {
  apiKey: string;
  type?: DadataType;
  delay?: number;
  limit?: number;
  width?: 'auto' | string;
  minWidth?: '0' | string;
  partyAddress?: 'city' | 'full';
  locations?: Locations[];
  restrict_value?: boolean;
  hint?: boolean;
  bounds?: string;
  constraints?: any;
}

export const DadataConfigDefault: DadataConfig = {
  apiKey: '',
  type: DadataType.address,
  delay: 500,
  limit: 10,
  width: 'auto',
  minWidth: '0',
  partyAddress: 'city',
  locations: null,
};
