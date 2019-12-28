import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rol } from '../_model/rol';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  menuCambio = new Subject<Rol[]>();
  url: string = `${environment.HOST}`;

  constructor(private http: HttpClient, private router: Router) { }

  listar(){
    return this.http.get<Rol[]>(`${this.url}/roles`);
  }

  listarPorUsuario(nombre: string) {
    let access_token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME)).access_token;
    return this.http.post<Rol[]>(`${this.url}/roles/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }
}
