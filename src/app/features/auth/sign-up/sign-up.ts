import { Component, ElementRef, inject, signal, viewChild, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { FocusTrapDirective } from '../../../core/directives/focus-trap-directive';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, FocusTrapDirective, TranslocoPipe],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp implements OnInit {
  protected readonly authService = inject(AuthService);
  protected fb = inject(NonNullableFormBuilder);
  private firstInput = viewChild<ElementRef<HTMLInputElement>>('firstInput');
  protected passwordVisible = signal<boolean>(false);
  protected confirmPasswordVisible = signal<boolean>(false);

  protected signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  ngOnInit() {
    this.firstInput()?.nativeElement.focus();
  }

  focusFirst(): void {
    this.firstInput()?.nativeElement.focus();
  }

  async onSubmit(): Promise<void> {
    if (this.signUpForm.invalid) return;

    const { name, email, password } = this.signUpForm.getRawValue();
    await this.authService.createUser(name, email, password);
    this.signUpForm.reset();
    this.authService.activeForm.set('signIn');    
  }
}
