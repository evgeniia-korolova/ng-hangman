import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { SignUp } from "../sign-up/sign-up";
import { SignIn } from "../sign-in/sign-in";
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-overlay',
  imports: [SignUp, SignIn, TranslocoPipe],
  templateUrl: './overlay.html',
  styleUrl: './overlay.scss',
})
export class Overlay {
  protected readonly authService = inject(AuthService);

  closeOverlay() {
    this.authService.closeOverlay();
  }  
}
