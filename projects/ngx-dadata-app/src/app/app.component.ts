import { Component } from '@angular/core';
import { DadataConfig, DadataParty, DadataSuggestion, DadataType } from 'projects/ngx-dadata/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  configAddress: DadataConfig = {
    apiKey: '2e51c5fbc1a60bd48face95951108560bf03f7d9',
    type: DadataType.address,
    locations: [
      {
        city: 'Москва',
      }
    ]
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
