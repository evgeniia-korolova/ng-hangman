import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  protected readonly authService = inject(AuthService);
  protected fb = inject(NonNullableFormBuilder);

  protected passwordVisible = signal<boolean>(false);
  protected confirmPasswordVisible = signal<boolean>(false);

  protected signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.signUpForm.invalid) return;
  
    const { name, email } = this.signUpForm.getRawValue();  
    this.authService.createUser(name, email);    
    this.signUpForm.reset();
    this.authService.closeOverlay()
  }
  
  
}
