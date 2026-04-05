import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { SignUp } from "../sign-up/sign-up";
import { SignIn } from "../sign-in/sign-in";

@Component({
  selector: 'app-overlay',
  imports: [SignUp, SignIn],
  templateUrl: './overlay.html',
  styleUrl: './overlay.scss',
})
export class Overlay {
  protected readonly authService = inject(AuthService);

  closeOverlay() {
    this.authService.closeOverlay();
  }
}
