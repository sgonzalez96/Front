import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appImgWrong]'
})
export class ImgWrongDirective implements OnInit {
  
  pathImg="assets/opus/img/user-default.png";

  constructor(private elmtRef: ElementRef) { }

  ngOnInit(): void {
  
   
  }

  @HostListener('error')
  loadImgByDefault(){
    const element = this.elmtRef.nativeElement;
    element.src = this.pathImg;
  }

}
