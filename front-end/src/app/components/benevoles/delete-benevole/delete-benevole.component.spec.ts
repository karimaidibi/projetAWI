import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBenevoleComponent } from './delete-benevole.component';

describe('DeleteBenevoleComponent', () => {
  let component: DeleteBenevoleComponent;
  let fixture: ComponentFixture<DeleteBenevoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBenevoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteBenevoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
