import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NgxDadataService } from './ngx-dadata.service';
import { DadataSuggestion } from './models/suggestion';
import { DadataConfig, DadataConfigDefault } from './dadata-config';
import { NGX_DADATA_CONFIG } from './provide';

let nextId = 0;

@Component({
  selector: 'ngx-dadata',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ngx-dadata.component.html',
  styleUrl: './ngx-dadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxDadataComponent),
      multi: true,
    },
  ],
  host: {
    '(document:click)': 'onOutsideClick($event)',
  },
})
export class NgxDadataComponent implements OnInit, ControlValueAccessor {
  private readonly dataService = inject(NgxDadataService);
  private readonly elRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injectedConfig = inject(NGX_DADATA_CONFIG, { optional: true });

  readonly config = input<DadataConfig>(DadataConfigDefault);
  readonly placeholder = input('');
  readonly disabled = input(false);

  /**
   * Effective config: merges input config with DI config.
   *
   * Input [config] fields take priority. Empty/missing fields fall back to
   * DI config (provideNgxDadata), then to DadataConfigDefault.
   * This allows per-component overrides (e.g. type, locations) while
   * inheriting apiKey from global DI config.
   */
  protected readonly effectiveConfig = computed(() => {
    const inputConfig = this.config();
    const diConfig = this.injectedConfig;

    if (inputConfig === DadataConfigDefault && !diConfig) {
      return DadataConfigDefault;
    }
    if (inputConfig === DadataConfigDefault) {
      return diConfig!;
    }
    if (!diConfig) {
      return inputConfig;
    }

    return {
      ...diConfig,
      ...inputConfig,
      apiKey: inputConfig.apiKey || diConfig.apiKey || '',
    };
  });

  readonly selected = output<DadataSuggestion>();

  readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputValue');

  protected readonly suggestions = signal<DadataSuggestion[]>([]);
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);

  protected readonly hasSuggestions = computed(() => this.suggestions().length > 0);

  readonly listboxId = `ngx-dadata-listbox-${nextId++}`;

  protected currentValue = '';

  private readonly input$ = new Subject<string>();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};
  private isDisabled = false;

  ngOnInit(): void {
    this.input$
      .pipe(
        debounceTime(this.effectiveConfig().delay ?? 500),
        switchMap((query) => this.dataService.getSuggestions(query, this.effectiveConfig())),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.suggestions.set(data);
        this.isOpen.set(data.length > 0);
        this.activeIndex.set(-1);
      });
  }

  protected activeDescendantId(): string | null {
    const idx = this.activeIndex();
    return idx >= 0 ? `${this.listboxId}-option-${idx}` : null;
  }

  protected optionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  protected onInput(value: string): void {
    this.currentValue = value;
    this.onChange(value);
    this.input$.next(value);
  }

  protected onSuggestionClick(item: DadataSuggestion): void {
    this.selectSuggestion(item);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const suggestions = this.suggestions();
    if (!suggestions.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => (i >= suggestions.length - 1 ? 0 : i + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        break;
      case 'Enter':
        event.preventDefault();
        if (this.activeIndex() >= 0) {
          this.selectSuggestion(suggestions[this.activeIndex()]);
        }
        break;
      case 'Escape':
        this.close();
        break;
      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(0);
        }
        break;
      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(suggestions.length - 1);
        }
        break;
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private selectSuggestion(item: DadataSuggestion): void {
    this.currentValue = item.value;
    this.onChange(item.value);
    this.selected.emit(item);
    this.close();
    this.inputEl().nativeElement.focus();
  }

  private close(): void {
    this.suggestions.set([]);
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  // ControlValueAccessor

  writeValue(value: string | null): void {
    this.currentValue = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
