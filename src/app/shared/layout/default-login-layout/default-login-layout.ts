import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-default-login-layout',
  imports: [],
  standalone: true,
  templateUrl: './default-login-layout.html',
  styleUrl: './default-login-layout.scss',
})

export class DefaultLoginLayout {
  title = input<string>('');
  primaryButtonText = input<string>('');
  secondaryButtonText = input<string>('');
  disablePrimaryButton = input<boolean>(true);
  onSubmit = output()
  onNavigate = output()

  submit(){
    this.onSubmit.emit()
  }

  navigate(){
    this.onNavigate.emit()
  }
}
