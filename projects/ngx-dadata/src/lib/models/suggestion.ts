import {DadataAddress, DadataBank, DadataEmail, DadataFIO, DadataParty} from './data';

export interface DadataSuggestion {
  value: string;
  unrestricted_value: string;
  data: DadataAddress | DadataFIO | DadataParty | DadataBank | DadataEmail;
}
