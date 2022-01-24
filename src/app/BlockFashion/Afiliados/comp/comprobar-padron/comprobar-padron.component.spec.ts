import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobarPadronComponent } from './comprobar-padron.component';

describe('ComprobarPadronComponent', () => {
  let component: ComprobarPadronComponent;
  let fixture: ComponentFixture<ComprobarPadronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprobarPadronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobarPadronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
