import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCalculoComponent } from './new-calculo.component';

describe('NewCalculoComponent', () => {
  let component: NewCalculoComponent;
  let fixture: ComponentFixture<NewCalculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCalculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCalculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
