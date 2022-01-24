import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgWrongDirective } from './img-wrong.directive';

//declarations 
const decl = [
    ImgWrongDirective
    
];

@NgModule({
  declarations: [decl],
  imports: [
    CommonModule
  ],
  exports: [decl]
})
export class DirectiveModule { }
