import { NgModule } from '@angular/core';
import { NgxDaDataComponent } from './ngx-da-data.component';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [NgxDaDataComponent],
  exports: [NgxDaDataComponent]
})
export class NgxDaDataModule { }
