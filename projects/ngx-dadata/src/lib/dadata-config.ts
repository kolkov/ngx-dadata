import {DadataType} from './ngx-dadata.service';

export interface Location {
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

export interface Bound {
  value: 'country' | 'region' | 'city' | 'street' | 'settlement' | 'area' | 'house';
}

export interface Bounds {
  fromBound?: Bound;
  toBound?: Bound;
}

export interface DadataConfig {
  apiKey: string;
  type?: DadataType;
  delay?: number;
  limit?: number;
  width?: 'auto' | string;
  minWidth?: '0' | string;
  partyAddress?: 'city' | 'full';
  locations?: Location[];
  locationsBoost?: Location[];
  bounds?: Bounds;
  restrict_value?: boolean
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
