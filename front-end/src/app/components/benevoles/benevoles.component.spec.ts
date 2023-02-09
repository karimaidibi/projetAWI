import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenevolesComponent } from './benevoles.component';

describe('BenevolesComponent', () => {
  let component: BenevolesComponent;
  let fixture: ComponentFixture<BenevolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenevolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenevolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
