import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJeuComponent } from './create-jeu.component';

describe('CreateJeuComponent', () => {
  let component: CreateJeuComponent;
  let fixture: ComponentFixture<CreateJeuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJeuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateJeuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
