import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarProductosCalculadoraComponent } from './agregar-productos-calculadora.component';

describe('AgregarProductosCalculadoraComponent', () => {
  let component: AgregarProductosCalculadoraComponent;
  let fixture: ComponentFixture<AgregarProductosCalculadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarProductosCalculadoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarProductosCalculadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
