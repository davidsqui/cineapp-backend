import { Cliente } from './../_model/cliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  clienteCambio = new Subject<Cliente[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/clientes`;    
  
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Cliente[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get(`${this.url}/${id}`, {
      responseType: 'blob'
    });
  }

  listarPorUsuario(nombre: string){
    return this.http.post<Cliente>(`${this.url}/usuario`, nombre);
  }

  listarPageable(p:number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  registrar(cliente: Cliente, file?: File) {

    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const clienteBlob = new Blob([JSON.stringify(cliente)], { type: "application/json" });
    formdata.append('cliente', clienteBlob);

    return this.http.post(`${this.url}`, formdata, {
      responseType: 'text'
    });

  }

  modificar(cliente: Cliente, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const clienteBlob = new Blob([JSON.stringify(cliente)], { type: "application/json" });
    formdata.append('cliente', clienteBlob);

    return this.http.put(`${this.url}`, formdata);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
