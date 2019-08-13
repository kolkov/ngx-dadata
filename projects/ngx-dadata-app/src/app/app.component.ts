import { Component } from '@angular/core';
import {DadataConfig, DadataParty, DadataSuggestion, DadataType} from '@kolkov/ngx-dadata';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  configAddress: DadataConfig = {
    apiKey: '2e51c5fbc1a60bd48face95951108560bf03f7d9',
    type: DadataType.address,
  };
  configFio: DadataConfig = {
    apiKey: '2e51c5fbc1a60bd48face95951108560bf03f7d9',
    type: DadataType.fio,
  };
  configParty: DadataConfig = {
    apiKey: '2e51c5fbc1a60bd48face95951108560bf03f7d9',
    type: DadataType.party,
    partyAddress: 'full',
  };

  onPartySelect(event: DadataSuggestion) {
    const partyData = event.data as DadataParty;
    console.log(partyData);
  }
}
