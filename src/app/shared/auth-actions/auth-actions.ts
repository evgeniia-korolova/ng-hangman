import { Component, inject, input, } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-auth-actions',
  imports: [],
  templateUrl: './auth-actions.html',
  styleUrl: './auth-actions.scss',
})
export class AuthActions {
  protected readonly authService = inject(AuthService);

  readonly buttonsStyle = input.required<string>()
}
