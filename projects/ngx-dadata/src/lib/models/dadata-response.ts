import {DadataSuggestion} from './suggestion';

export interface DadataResponse {
  suggestions: DadataSuggestion[];
}

export interface DadataIplocateResponse {
  location: DadataSuggestion | null;
}
