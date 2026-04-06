import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild, OnInit,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { FocusTrapDirective } from "../../../core/directives/focus-trap-directive";
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, FocusTrapDirective, TranslocoPipe],
  templateUrl: './sign-in.html',
  styleUrl: '../sign-up/sign-up.scss',
})
export class SignIn implements OnInit {
  protected fb = inject(NonNullableFormBuilder);
  protected firstInput = viewChild<ElementRef<HTMLInputElement>>('firstInput');
  protected readonly authService = inject(AuthService);

  protected passwordVisible = signal<boolean>(false);

  ngOnInit() {
    this.firstInput()?.nativeElement.focus();
  }

  protected signInForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  focusFirst(): void {
    this.firstInput()?.nativeElement.focus();
  }

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
