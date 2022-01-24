import { TemplateRef } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Dtoitem } from "src/app/opus/opus-users/models/DtoItem";


/* this is a class that will control all access of my child components within CRUD
    consult the methods to get or set values 
*/
export class ListControlAccess {
    objs: ListSubjects[] = [];

    public setData(keys: IMenuPoint[]) {
        for (let i = 0; i < keys.length; i++) {
            let subj = new BehaviorSubject<Dtoitem | null>(null);
        let $obs: Observable<any> = subj.asObservable();
        this.objs.push({
            key: keys[i].key,
            _subject: subj,
            $observable: $obs
        });
            
        }
        
    }


    public setNext(key: string, data: Dtoitem) {
        for (let i = 0; i < this.objs.length; i++) {
            if (this.objs[i].key == key) {
                this.objs[i]._subject.next(data);
            }

        }
    }

    // get observable by key 
    public getObservable(key: string): Observable<Dtoitem> | null | undefined  {  
            let obs = null;
            for (let i = 0; i < this.objs.length; i++) {
                if (this.objs[i].key == key) {
                    obs =  this.objs[i].$observable;
                }
            }
            return obs;
            
       


    }



}

export interface IMenuPoint {
    key: string,
    flag: boolean,
    descripcion: string,
  }





export class ListSubjects {
    key: string = "";
    _subject: BehaviorSubject<Dtoitem | null> = new BehaviorSubject<Dtoitem | null>(null);
    $observable: Observable<any> = this._subject.asObservable();

}