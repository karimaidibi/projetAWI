import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteJeuComponent } from './delete-jeu.component';

describe('DeleteJeuComponent', () => {
  let component: DeleteJeuComponent;
  let fixture: ComponentFixture<DeleteJeuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteJeuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteJeuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
