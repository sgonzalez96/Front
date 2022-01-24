import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsigProductoComponent } from './asig-producto.component';

describe('AsigProductoComponent', () => {
  let component: AsigProductoComponent;
  let fixture: ComponentFixture<AsigProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsigProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsigProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
