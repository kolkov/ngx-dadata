import { DadataType } from './ngx-dadata.service';

export interface DadataLocation {
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

export interface DadataBound {
  value: 'country' | 'region' | 'area' | 'city' | 'settlement' | 'street' | 'house';
}

export interface DadataBounds {
  fromBound?: DadataBound;
  toBound?: DadataBound;
}

export interface DadataConfig {
  apiKey: string;
  type?: DadataType;
  delay?: number;
  limit?: number;
  partyAddress?: 'city' | 'full';
  locations?: DadataLocation[];
  locationsBoost?: DadataLocation[];
  bounds?: DadataBounds;
}

export const DadataConfigDefault: DadataConfig = {
  apiKey: '',
  type: DadataType.address,
  delay: 500,
  limit: 10,
  partyAddress: 'city',
};

/** @deprecated Use DadataLocation instead */
export type Location = DadataLocation;
/** @deprecated Use DadataBound instead */
export type Bound = DadataBound;
/** @deprecated Use DadataBounds instead */
export type Bounds = DadataBounds;
