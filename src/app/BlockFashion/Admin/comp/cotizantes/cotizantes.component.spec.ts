import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizantesComponent } from './cotizantes.component';

describe('CotizantesComponent', () => {
  let component: CotizantesComponent;
  let fixture: ComponentFixture<CotizantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotizantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
