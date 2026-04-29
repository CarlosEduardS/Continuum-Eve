import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type InputTypes = 'text' | 'email' | 'password';

@Component({
  selector: 'app-primary-input',
  imports: [ReactiveFormsModule],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInput),
      multi: true
    }
  ],
  templateUrl: './primary-input.html',
  styleUrl: './primary-input.scss',
})
export class PrimaryInput implements ControlValueAccessor {
  type = input<InputTypes>('text')
  placeHolder = input<string>('')
  label = input<string>('')
  inputName = input<string>('')

  value: string = ''
  onChange: any = () => {};
  onTouched: any = () => {}

  onInput(event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    
  }
}
