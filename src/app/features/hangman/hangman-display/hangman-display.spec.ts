import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangmanDisplay } from './hangman-display';

describe('HangmanDisplay', () => {
  let component: HangmanDisplay;
  let fixture: ComponentFixture<HangmanDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangmanDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangmanDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
