import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: '../sign-up/sign-up.scss',
})
export class SignIn {
  protected fb = inject(NonNullableFormBuilder);
  protected readonly authService = inject(AuthService);

  protected passwordVisible = signal<boolean>(false);

  protected signInForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.signInForm.invalid) return;

    const { email, password } = this.signInForm.getRawValue();
    const success = await this.authService.loginUser(email, password);

    if (success) {
      console.log('Login successful');
      this.authService.closeOverlay();
    } else {
      console.log('Login failed');
    }
  }
}
