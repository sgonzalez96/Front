import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovCont } from '../../models/movcont';
import { MovcontService } from '../../serv/movcont.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rec-ver',
  templateUrl: './rec-ver.component.html',
  styleUrls: ['./rec-ver.component.css']
})
export class RecVerComponent implements OnInit {
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
