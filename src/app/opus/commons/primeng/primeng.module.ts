import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule, DropdownModule, MenuItemContent, PanelModule, RadioButtonModule } from 'primeng-lts';
import { Select2Module } from 'ng-select2-component';

const modules = [
  
    DropdownModule,
    PanelModule,
    RadioButtonModule,
    AccordionModule,
    Select2Module,
    AccordionModule
    
 
]



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modules
  ],
  exports:[modules]
})
export class PrimengModule { }
