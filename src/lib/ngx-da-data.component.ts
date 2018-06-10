import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef, HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {DaDataType, NgxDaDataService} from "./ngx-da-data.service";
import {Subject, timer} from "rxjs";
import {debounce} from "rxjs/operators";
import {DaDataResponse} from "./models/da-data-response";
import {DaDataSuggestion} from "./models/suggestion";
import {DaDataConfig, DaDataConfigDefault} from "./da-data-config";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

const NGX_DADATA_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxDaDataComponent),
  multi: true
};

@Component({
  selector: 'ngx-da-data',
  templateUrl: "./ngx-da-data.component.html",
  styleUrls: ['./ngx-da-data.component.scss'],
  providers: [ NGX_DADATA_VALUE_ACCESSOR ]
})
export class NgxDaDataComponent implements OnInit, ControlValueAccessor {
  private _value: any = '';
  currentFocus = -1;

  data: DaDataSuggestion[] = [];

  @Input() config: DaDataConfig = DaDataConfigDefault;
  @Input() apiKey: string;
  @Input() disabled = null;
  @Input() type = DaDataType.address;
  @Input() limit = DaDataConfigDefault.limit;

  @Output() selectedSuggestion: DaDataSuggestion;
  @Output() selected = new EventEmitter<DaDataSuggestion>();

  @ViewChild('inputValue') inputValue: ElementRef;

  private inputString$ = new Subject<string>();

  onChange = (value: string) => {};
  onTouched = () => {};

  constructor(private dataService: NgxDaDataService, private _r: Renderer2) {
  }

  ngOnInit() {
    this.type = this.config.type;
    this.dataService.setApiKey(this.apiKey ? this.apiKey : this.config.apiKey);
    this.inputString$.pipe(
      debounce(() => timer(this.config.delay ? this.config.delay : 500)),
    ).subscribe(x => {
      this.dataService.getData(x, this.type, this.limit).subscribe((y: DaDataResponse) => {
        this.data = y.suggestions;
      })
    })
  }

  getData(value: string) {
    this.inputString$.next(value);
    this.currentFocus = -1;
  }

  get value(): any {
    return this._value;
  };

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  onClick(item: DaDataSuggestion) {
    this.inputValue.nativeElement.value = item.value;
    this.inputValue.nativeElement.focus();
    this.selectedSuggestion = item;
    this.data = [];
    this.currentFocus = -1;
    this.writeValue(item.value);
    this.selected.emit(item);
  }

  @HostListener('document:click')
  onOutsideClick(){
    this.data = [];
  }

  onArrowDown() {
    this.removeFocus(this.currentFocus);
    if (this.currentFocus >= this.data.length - 1) {
      this.currentFocus = 0;
    } else {
      this.currentFocus++;
    }
    this.setFocus(this.currentFocus);
  }

  onArrowUp() {
    this.removeFocus(this.currentFocus);
    if (this.currentFocus == 0) {
      this.currentFocus = this.data.length - 1;
    } else {
      this.currentFocus--;
    }
    this.setFocus(this.currentFocus);
  }

  onEnter() {
    this.selectedSuggestion = this.data[this.currentFocus];
    this.inputValue.nativeElement.value = this.selectedSuggestion.value;
    this.data = [];
    this.currentFocus = -1;
    this.writeValue(this.selectedSuggestion.value);
    this.selected.emit(this.selectedSuggestion);
  }

  setFocus(id: number) {
    const activeEl = document.getElementById(id + "item");
    this._r.addClass(activeEl, "active");
  }

  removeFocus(id: number) {
    if (id != -1) {
      const activeEl = document.getElementById(id + "item");
      this._r.removeClass(activeEl, "active");
    }
  }

  writeValue(value: any): void {
    this._value = value;
    this.onChange(value);
  }

  /**
   * Set the function to be called
   * when the control receives a change event.
   *
   * @param fn a function
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Set the function to be called
   * when the control receives a touch event.
   *
   * @param fn a function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Implements disabled state for this element
   *
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    alert("disabled!");
    this.disabled = isDisabled;
  }
}
