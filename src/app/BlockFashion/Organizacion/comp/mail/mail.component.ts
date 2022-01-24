
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMail } from '../../models/mail';


@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {

  @Input() para: string;
  @Output() closePopup: EventEmitter<IMail> = new EventEmitter<IMail>();

  public form: FormGroup;
  public mail: IMail;

  constructor(private _formBuilder: FormBuilder) { 
    this.form = _formBuilder.group({
      para: ["", Validators.required],
      asunto: ["", Validators.required],
      cuerpo:["", Validators.required],
      cc:[null]
    });
  }

  
  public get f() {
    return this.form.controls;
  }
  
  
  public get dataForm() : IMail {
    return {
      destino: this.f.para.value,
      asunto: this.f.asunto.value,
      texto: this.f.cuerpo.value,
      cc: this.f.cc.value
    }
  }
  

  ngOnInit() {
    this.f.para.setValue(this.para);
    
  }

  //cancelar mail 
  close(){
    this.closePopup.emit(null);
  }

  enviar(){

    this.closePopup.emit(this.dataForm);
  }




}
