import { Rol } from '../../Admin/models/rol';

export class Usuario {
    idUser: number;
    userName: string;
    password: string;
    enable: boolean;
    foto: any[];
    fullname: string;
    email: string;
    afinro: number;
    roles: Rol[];

    constructor(){
        this.enable = true;
        this.afinro = 0;
    }

    esAdmin(): boolean {
        if (this.getNivel() === 90) {
            return true;
        }
        return false;
    }

    getNivel(): number {
        let niv = 0;
        if ( this.roles != null) {

            for (let i = 0; i < this.roles.length; i++) {
                if (this.roles[i].nivel > niv) {
                    niv = this.roles[i].nivel;
                }
            }
        }
        return niv;
    }
    getNivelRol(): Rol {
        let niv = 0 ;
        let nivrol = null;
        if ( this.roles != null) {

            for (let i = 0; i < this.roles.length; i++) {
                if (this.roles[i].nivel >= niv) {
                    niv = this.roles[i].nivel;
                    nivrol = this.roles[i];
                }
            }
        }
        return nivrol;
    }
}
