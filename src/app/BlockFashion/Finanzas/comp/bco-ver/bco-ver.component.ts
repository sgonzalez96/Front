import { Component, OnInit } from '@angular/core';
import { BcoMov } from '../../models/bcomov';
import { ActivatedRoute } from '@angular/router';
import { MovbcoService } from '../../serv/movbco.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bco-ver',
  templateUrl: './bco-ver.component.html',
  styleUrls: ['./bco-ver.component.css']
})
export class BcoVerComponent implements OnInit {
  idRec = '';
  objRec: BcoMov;

  constructor(
    private actRout: ActivatedRoute,
    private movsrv: MovbcoService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.idRec = this.actRout.snapshot.params['id'];
    this.movsrv.getMovBco(this.idRec).subscribe(
      resma => {
        this.objRec = resma;
      }
    );
  }

  volver() {
    this._location.back();
  }

}
