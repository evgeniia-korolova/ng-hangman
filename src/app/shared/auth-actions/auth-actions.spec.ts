import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthActions } from './auth-actions';

describe('AuthActions', () => {
  let component: AuthActions;
  let fixture: ComponentFixture<AuthActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
