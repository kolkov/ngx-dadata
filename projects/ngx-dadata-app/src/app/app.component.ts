import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgxDadataComponent, DadataConfig, DadataSuggestion, DadataType } from '@kolkov/ngx-dadata';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxDadataComponent, FormsModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  apiKey = '';

  configAddress: DadataConfig = {
    apiKey: this.apiKey,
    type: DadataType.address,
    locations: [{ city: 'Москва' }],
  };

  configFio: DadataConfig = {
    apiKey: this.apiKey,
    type: DadataType.fio,
  };

  configParty: DadataConfig = {
    apiKey: this.apiKey,
    type: DadataType.party,
    partyAddress: 'full',
  };

  configBank: DadataConfig = {
    apiKey: this.apiKey,
    type: DadataType.bank,
  };

  configEmail: DadataConfig = {
    apiKey: this.apiKey,
    type: DadataType.email,
  };

  addressValue = '';
  selectedResult: DadataSuggestion | null = null;

  onApiKeyChange(key: string): void {
    this.apiKey = key;
    this.configAddress = { ...this.configAddress, apiKey: key };
    this.configFio = { ...this.configFio, apiKey: key };
    this.configParty = { ...this.configParty, apiKey: key };
    this.configBank = { ...this.configBank, apiKey: key };
    this.configEmail = { ...this.configEmail, apiKey: key };
  }

  onSelected(suggestion: DadataSuggestion): void {
    this.selectedResult = suggestion;
  }
}
