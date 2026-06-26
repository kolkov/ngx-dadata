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

export interface DadataLocationGeo {
  lat: number;
  lon: number;
  radius_meters: number;
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

  // Address-specific params
  restrictValue?: boolean;
  language?: 'ru' | 'en';
  locationsGeo?: DadataLocationGeo[];
  division?: 'administrative' | 'municipal';

  // Party-specific params
  entityType?: 'LEGAL' | 'INDIVIDUAL';
  status?: string[];
  okved?: string[];
  branchType?: 'MAIN' | 'BRANCH';

  // Bank-specific params
  bankStatus?: string[];
  bankType?: string[];

  // FIO-specific params
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN';
  parts?: ('SURNAME' | 'NAME' | 'PATRONYMIC')[];
}

export const DadataConfigDefault: DadataConfig = {
  apiKey: '',
  type: DadataType.address,
  delay: 500,
  limit: 10,
  partyAddress: 'city',
};

export interface GeolocateOptions {
  count?: number;
  radius_meters?: number;
  language?: 'ru' | 'en';
  apiKey: string;
}

export interface IplocateOptions {
  language?: 'ru' | 'en';
  apiKey: string;
}

/** @deprecated Use DadataLocation instead */
export type Location = DadataLocation;
/** @deprecated Use DadataBound instead */
export type Bound = DadataBound;
/** @deprecated Use DadataBounds instead */
export type Bounds = DadataBounds;
