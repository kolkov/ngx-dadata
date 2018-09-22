# ngx-dadata
Angular 6+ [DaData][dadata] suggestion (подсказки) implementation

## Getting Started

### Demo
Demo is here [demo][demo]

Working code for this demo at stackblitz [example][example]

### Installation

Install via [npm][npm] package manager

```bash
npm install @kolkov/ngx-dadata --save
```

### Usage

Import `ngx-dadata` module

```typescript
import { HttpClientModule } from '@angular/common/http';
...
import { NgxDaDataModule } from '@kolkov/ngx-dadata';

@NgModule({
  imports: [ HttpClientModule, NgxDaDataModule ]
})
```

Then in HTML

```html
<ngx-da-data [config]="config" [(ngModel)]="currentAddress"></ngx-da-data>
```

or

```html
<ngx-da-data formControlName="currentAddress" [config]="config"></ngx-da-data>
```

where

```typescript
import { DaDataConfig } from '@kolkov/ngx-dadata';

...

config: DaDataConfig = {
    apiKey: 'your_api_key',
    type: DaDataType.address
  };
```

also you may add additional options to constraint search (for example cities only):

```typescript
import { DaDataConfig } from '@kolkov/ngx-dadata';

...

config: DaDataConfig = {
    apiKey: 'your_api_key',
    type: DaDataType.address
    options: {
      from_bound: {value: "city"},
      to_bound: {value: "city"}
    }
  };
```

For `ngModel` to work, you must import `FormsModule` from `@angular/forms`, or for `formControlName`, you must import `ReactiveFormsModule` from `@angular/forms`

[npm]: https://www.npmjs.com/
[dadata]: https://dadata.ru/api/suggest/
[demo]: https://ngx-dadata.stackblitz.io/
[example]: https://stackblitz.com/edit/ngx-dadata
