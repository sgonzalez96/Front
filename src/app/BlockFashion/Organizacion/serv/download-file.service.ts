import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

    //armar file 
    manageExcelFile(typeArchivo: string , fileName:string, bytes: Blob){
        const binaryData = [];
        binaryData.push(bytes);

        const blob=  new Blob(binaryData,{type: `${typeArchivo}`});

        //construyo una ruta http para setearla el atributo del link
        const filePath = window.URL.createObjectURL(blob);
        //creo un elemento link para disparar mi descarga de archivo
        console.log(blob.type);
        const downloadLink = document.createElement('a');

        //armo el link 
        downloadLink.href= filePath;
        downloadLink.setAttribute('download',fileName);
        document.body.appendChild(downloadLink);

        //lo disparo.
        downloadLink.click();
    }
}