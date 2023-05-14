import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductoCalculadoraComponent } from './edit-producto-calculadora.component';

describe('EditProductoCalculadoraComponent', () => {
  let component: EditProductoCalculadoraComponent;
  let fixture: ComponentFixture<EditProductoCalculadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductoCalculadoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductoCalculadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
