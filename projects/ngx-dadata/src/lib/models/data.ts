export interface DadataFIO {
  surname: string | null;
  name: string | null;
  patronymic: string | null;
  gender: string | null;
  qc: string | null;
}

export interface DadataMetro {
  name: string;
  line: string;
  distance: number;
}

export interface DadataAddress {
  postal_code: string | null;
  country: string | null;
  country_iso_code: string | null;
  federal_district: string | null;
  region_fias_id: string | null;
  region_kladr_id: string | null;
  region_iso_code: string | null;
  region_with_type: string | null;
  region_type: string | null;
  region_type_full: string | null;
  region: string | null;
  area_fias_id: string | null;
  area_kladr_id: string | null;
  area_with_type: string | null;
  area_type: string | null;
  area_type_full: string | null;
  area: string | null;
  sub_area: string | null;
  sub_area_fias_id: string | null;
  sub_area_kladr_id: string | null;
  sub_area_with_type: string | null;
  sub_area_type: string | null;
  sub_area_type_full: string | null;
  city_fias_id: string | null;
  city_kladr_id: string | null;
  city_with_type: string | null;
  city_type: string | null;
  city_type_full: string | null;
  city: string | null;
  city_area: string | null;
  city_district_fias_id: string | null;
  city_district_kladr_id: string | null;
  city_district_with_type: string | null;
  city_district_type: string | null;
  city_district_type_full: string | null;
  city_district: string | null;
  settlement_fias_id: string | null;
  settlement_kladr_id: string | null;
  settlement_with_type: string | null;
  settlement_type: string | null;
  settlement_type_full: string | null;
  settlement: string | null;
  street_fias_id: string | null;
  street_kladr_id: string | null;
  street_with_type: string | null;
  street_type: string | null;
  street_type_full: string | null;
  street: string | null;
  stead: string | null;
  stead_fias_id: string | null;
  stead_kladr_id: string | null;
  stead_type: string | null;
  stead_type_full: string | null;
  stead_cadnum: string | null;
  house_fias_id: string | null;
  house_kladr_id: string | null;
  house_type: string | null;
  house_type_full: string | null;
  house: string | null;
  house_cadnum: string | null;
  block_type: string | null;
  block_type_full: string | null;
  block: string | null;
  flat_type: string | null;
  flat_type_full: string | null;
  flat: string | null;
  flat_area: string | null;
  flat_cadnum: string | null;
  room: string | null;
  room_fias_id: string | null;
  room_kladr_id: string | null;
  room_type: string | null;
  room_type_full: string | null;
  room_cadnum: string | null;
  square_meter_price: string | null;
  flat_price: string | null;
  postal_box: string | null;
  fias_id: string | null;
  fias_code: string | null;
  fias_level: string | null;
  fias_actuality_state: string | null;
  kladr_id: string | null;
  geoname_id: string | null;
  capital_marker: string | null;
  okato: string | null;
  oktmo: string | null;
  tax_office: string | null;
  tax_office_legal: string | null;
  timezone: string | null;
  geo_lat: string | null;
  geo_lon: string | null;
  beltway_hit: string | null;
  beltway_distance: string | null;
  metro: DadataMetro[] | null;
  qc_geo: string | null;
  qc_complete: string | null;
  qc_house: string | null;
  history_values: [
    string | null
    ];
  unparsed_parts: string | null;
  source: string | null;
  qc: string | null;
}

export interface DadataFinance {
  tax_system: string | null;
  income: number | null;
  expense: number | null;
  debt: number | null;
  penalty: number | null;
  year: number | null;
}

export interface DadataPartyRef {
  inn: string | null;
  ogrn: string | null;
  name: string | null;
}

export interface DadataParty {
  kpp: string | null;
  capital: string | null;
  management: {
    name: string | null;
    post: string | null;
  };
  founders: string | null;
  managers: string | null;
  branch_type: string | null;
  branch_count: number | null;
  employee_count: number | null;
  source: string | null;
  qc: string | null;
  hid: string | null;
  type: string | null;
  state: {
    status: string | null;
    actuality_date: number | null;
    registration_date: number | null;
    liquidation_date: number | null;
  };
  opf: {
    type: string | null;
    code: string | null;
    full: string | null;
    short: string | null;
  };
  name: {
    full_with_opf: string | null;
    short_with_opf: string | null;
    latin: string | null;
    full: string | null;
    short: string | null;
  };
  inn: string | null;
  ogrn: string | null;
  okpo: string | null;
  okved: string | null;
  okveds: string | null;
  authorities: string | null;
  documents: string | null;
  licenses: string | null;
  finance: DadataFinance | null;
  predecessors: DadataPartyRef[] | null;
  successors: DadataPartyRef[] | null;
  citizenship: string | null;
  address: {
    value: string | null;
    unrestricted_value: string | null;
    data: DadataAddress;
  };
  phones: string | null;
  emails: string | null;
  ogrn_date: number | null;
  okved_type: string | null;
}

export interface DadataBank {
  opf: {
    type: string | null;
    full: string | null;
    short: string | null;
  };
  name: {
    payment: string | null;
    full: string | null;
    short: string | null;
  };
  bic: string | null;
  swift: string | null;
  inn: string | null;
  kpp: string | null;
  okpo: string | null;
  correspondent_account: string | null;
  registration_number: string | null;
  payment_city: string | null;
  rkc: {
    opf: {
      type: string | null;
      full: string | null;
      short: string | null;
    };
    name: {
      payment: string | null;
      full: string | null;
      short: string | null;
    };
    bic: string | null;
    swift: string | null;
    okpo: string | null;
    correspondent_account: string | null;
    registration_number: string | null;
    rkc: string | null;
    address: {
      value: string | null;
      unrestricted_value: string | null;
      data: string | null;
    };
    phone: string | null;
    state: {
      status: string | null;
      actuality_date: number | null;
      registration_date: number | null;
      liquidation_date: string | null;
    };
  };
  address: {
    value: string | null;
    unrestricted_value: string | null;
    data: DadataAddress;
  };
  phone: string | null;
  state: {
    status: string | null;
    actuality_date: number | null;
    registration_date: number | null;
    liquidation_date: string | null;
  };
}

export interface DadataEmail {
  local: string | null;
  domain: string | null;
  qc: string | null;
}

export interface DadataCountry {
  code: string | null;
  alfa2: string | null;
  alfa3: string | null;
  name_short: string | null;
  name: string | null;
}
