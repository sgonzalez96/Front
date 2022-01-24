import { Component, OnInit } from '@angular/core';
import { MovCont } from '../../models/movcont';
import { ActivatedRoute } from '@angular/router';
import { MovcontService } from '../../serv/movcont.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gasto-ver',
  templateUrl: './gasto-ver.component.html',
  styleUrls: ['./gasto-ver.component.css']
})
export class GastoVerComponent implements OnInit {
  idRec = '';
  objRec: MovCont;

  constructor(
    private actRout: ActivatedRoute,
    private movsrv: MovcontService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.idRec = this.actRout.snapshot.params['id'];
    this.movsrv.getMovcont(this.idRec).subscribe(
      resma => {
        this.objRec = resma;
      }
    );
  }

  volver() {
    this._location.back();
  }

}
