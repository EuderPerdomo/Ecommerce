import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCalculadoraComponent } from './dashboard-calculadora.component';

describe('DashboardCalculadoraComponent', () => {
  let component: DashboardCalculadoraComponent;
  let fixture: ComponentFixture<DashboardCalculadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCalculadoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCalculadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
