import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBenevoleComponent } from './update-benevole.component';

describe('UpdateBenevoleComponent', () => {
  let component: UpdateBenevoleComponent;
  let fixture: ComponentFixture<UpdateBenevoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBenevoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBenevoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
