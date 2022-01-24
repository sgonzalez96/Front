import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPadronComponent } from './control-padron.component';

describe('ControlPadronComponent', () => {
  let component: ControlPadronComponent;
  let fixture: ComponentFixture<ControlPadronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPadronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPadronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
