import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxDadataModule } from '@kolkov/ngx-dadata';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, NgxDadataModule ],
  declarations: [ AppComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
