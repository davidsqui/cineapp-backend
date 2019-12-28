import { Cliente } from 'src/app/_model/cliente';
import { ClienteService } from './../../_service/cliente.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RolService } from './../../_service/rol.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rol } from 'src/app/_model/rol';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  userName: string;
  roles: Rol[];
  cliente: Cliente;
  imagenData: any;
  imagenEstado: boolean = false;
  labelFile: string;

  constructor(
    private rolService: RolService,
    private clienteService: ClienteService,
    private sanitization: DomSanitizer
  ) { }

  ngOnInit() {
    this.cargarDatosPerfil();
  }

  cargarDatosPerfil(){
    const helper = new JwtHelperService();
    let token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
    const decodedToken = helper.decodeToken(token.access_token);

    this.userName = decodedToken.user_name;
    this.roles = decodedToken.authorities;
    console.log(decodedToken);
    console.log(this.userName);
    console.log(this.roles);
    
    this.clienteService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
      this.cliente = data;
      console.log(this.cliente.idCliente);

      this.clienteService.listarPorId(this.cliente.idCliente).subscribe(data1 => {
        console.log(data1);
        console.log(data1.size);
        if (data1.size > 0) {          
          this.convertir(data1);
        }
      });
    });
  }

  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {      
      let base64 = reader.result;      
      this.setear(base64);
    }
  }

  setear(x: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(x);
    this.imagenEstado = true;
    console.log(this.imagenEstado);
  }

}
