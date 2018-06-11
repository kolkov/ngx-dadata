import {DaDataAddress, DaDataBank, DaDataEmail, DaDataFIO, DaDataParty} from './data';

export interface DaDataSuggestion {
  value: string;
  unrestricted_value: string;
  data: DaDataAddress | DaDataFIO | DaDataParty | DaDataBank | DaDataEmail;
}
