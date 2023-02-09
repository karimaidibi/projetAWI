import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBenevoleComponent } from './create-benevole.component';

describe('CreateBenevoleComponent', () => {
  let component: CreateBenevoleComponent;
  let fixture: ComponentFixture<CreateBenevoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBenevoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBenevoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
