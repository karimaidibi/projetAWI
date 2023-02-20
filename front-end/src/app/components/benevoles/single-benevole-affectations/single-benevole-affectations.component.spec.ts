import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBenevoleAffectationsComponent } from './single-benevole-affectations.component';

describe('SingleBenevoleAffectationsComponent', () => {
  let component: SingleBenevoleAffectationsComponent;
  let fixture: ComponentFixture<SingleBenevoleAffectationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBenevoleAffectationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBenevoleAffectationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
