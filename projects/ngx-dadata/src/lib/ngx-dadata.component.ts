import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener, Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {DadataType, NgxDadataService} from './ngx-dadata.service';
import {Subject, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {DadataResponse} from './models/dadata-response';
import {DadataSuggestion} from './models/suggestion';
import {DadataConfig, DadataConfigDefault} from './dadata-config';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DOCUMENT} from '@angular/common';
import {unwrapHtmlForSink} from 'safevalues';

/*const NGX_DADATA_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgxDadataComponent),
  multi: true,
};*/

export function createDaDataValidator(value) {
  return (c: FormControl) => {
    const err = {
      rangeError: {
        given: c.value,
        expected: value,
      }
    };

    return (c.value !== value) ? err : null;
  };
}

/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let uniqueDadataIdCounter = 0;

@Component({
  selector: 'ngx-dadata',
  templateUrl: './ngx-dadata.component.html',
  styleUrls: ['./ngx-dadata.component.scss'],
  providers: [
    {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxDadataComponent),
    multi: true
  }, /*NGX_DADATA_VALIDATOR*/]
})
export class NgxDadataComponent implements OnInit, ControlValueAccessor, OnChanges {
  private v: any = '';
  currentFocus = -1;

  opened = false;

  data: DadataSuggestion[] = [];

  @Input() config: DadataConfig = DadataConfigDefault;
  @Input() apiKey: string;
  @Input() disabled = null;
  @Input() type = DadataType.address;
  @Input() limit = DadataConfigDefault.limit;
  @Input() placeholder = '';
  @Input() locations = null;

  @Output() selectedSuggestion: DadataSuggestion;
  @Output() selected: EventEmitter<DadataSuggestion> = new EventEmitter<DadataSuggestion>();
  // @Output() selectedData = new EventEmitter<DaDataAddress | DaDataFIO | DaDataBank | DaDataParty | DaDataEmail>();
  // @Output() selectedString = new EventEmitter<string>();

  @ViewChild('inputValue', { static: true }) inputValue: ElementRef;

  private inputString$ = new Subject<string>();

  /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
  id = `ngx-dadata-${uniqueDadataIdCounter++}`;

  // onSuggestionSelected = (value: string) => {};
  onTouched = () => {};
  propagateChange: any = () => {};
  validateFn: any = () => {};

  constructor(
    private dataService: NgxDadataService,
    private r: Renderer2,
    private elRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    ) {
  }

  get value(): any {
    return this.v;
  }

  set value(v: any) {
    if (v !== this.v) {
      this.v = v;
      this.propagateChange(v);
    }
  }

  ngOnInit() {
    /*this.validateFn = createDaDataValidator(this._value);
    this.propagateChange(this._value);*/
    this.type = this.config.type;
    this.locations = this.config.locations;
    this.dataService.setApiKey(this.apiKey ? this.apiKey : this.config.apiKey);
    this.inputString$.pipe(
      debounce(() => timer(this.config.delay ? this.config.delay : 500)),
    ).subscribe(x => {
      this.dataService.getData(x, this.type, this.config)
        .subscribe((y: DadataResponse) => {
        this.data = y.suggestions;
        if (this.data.length) {
          this.opened = true;
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      // console.log('ngOnChanges');
    }
  }

  getData(value: string) {
    this.inputString$.next(value);
    this.currentFocus = -1;
  }

  onClick(e: MouseEvent, item: DadataSuggestion) {
    this.inputValue.nativeElement.value = item.value;
    this.propagateChange(item.value);
    this.inputValue.nativeElement.focus();
    this.selectedSuggestion = item;
    this.data = [];
    this.currentFocus = -1;
    this.opened = false;
    this.selected.emit(item);
    // this.selectedData.emit(item.data);
    // this.selectedString.emit(item.value);
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick($event: MouseEvent) {
    if (!this.opened) {
      return;
    }
    if (!this.elRef.nativeElement.contains($event.target)) {
      this.data = [];
      this.opened = false;
    }
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
    if (this.currentFocus === 0) {
      this.currentFocus = this.data.length - 1;
    } else {
      this.currentFocus--;
    }
    this.setFocus(this.currentFocus);
  }

  onEnter(event: KeyboardEvent) {
    this.selectedSuggestion = this.data[this.currentFocus];
    this.inputValue.nativeElement.value = this.selectedSuggestion.value;
    this.data = [];
    this.currentFocus = -1;
    this.propagateChange(this.selectedSuggestion.value);
    this.selected.emit(this.selectedSuggestion);
    // this.selectedData.emit(this.selectedSuggestion.data);
    // this.selectedString.emit(this.selectedSuggestion.value);
  }

  setFocus(id: number) {
    const activeEl = this.document.getElementById(id + 'item');
    this.r.addClass(activeEl, 'active');
  }

  removeFocus(id: number) {
    if (id !== -1) {
      const activeEl = this.document.getElementById(id + 'item');
      this.r.removeClass(activeEl, 'active');
    }
  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.v = value;
    } else {
      this.v = '';
    }
    this.r.setProperty(this.inputValue.nativeElement, 'innerHTML', unwrapHtmlForSink(this.v));
  }

  /**
   * Set the function to be called
   * when the control receives a change event.
   *
   * @param fn a function
   */
  registerOnChange(fn: any): void {
    // this.onSuggestionSelected = fn;
    this.propagateChange = fn;
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
   * @param isDisabled Disabled state flag
   */
  setDisabledState(isDisabled: boolean): void {
    alert('disabled!');
    this.disabled = isDisabled;
  }
}
