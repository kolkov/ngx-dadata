import {DaDataAddress, DaDataBank, DaDataEmail, DaDataFIO, DaDataParty} from "./data";

export interface DaDataSuggestion {
  value: string;
  unrestricted_value: string;
  data: DaDataFIO | DaDataAddress | DaDataParty | DaDataBank | DaDataEmail;
}
