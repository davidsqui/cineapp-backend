import { element } from 'protractor';
import { Cliente } from 'src/app/_model/cliente';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { ClienteService } from 'src/app/_service/cliente.service';
import { ClienteDialogoComponent } from './cliente-dialogo/cliente-dialogo.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  cantidad: number = 0;

  dataSource: MatTableDataSource<Cliente>;
  displayedColumns = ['idCliente', 'nombres', 'apellidos','fechaNac','dni','acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private clienteService: ClienteService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.clienteService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'INFO', {
        duration: 2000
      });
    });

    this.clienteService.clienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    /*this.clienteService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });*/

    this.clienteService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;

      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  mostrarMas(e: any){
    this.clienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(cliente?: Cliente) {
    let cli = cliente != null ? cliente : new Cliente();
    this.dialog.open(ClienteDialogoComponent, {
      width: '250px',
      data: cli
    });
  }

  eliminar(cliente: Cliente) {
    this.clienteService.eliminar(cliente.idCliente).subscribe(data => {
      this.clienteService.listar().subscribe(medicos => {
        this.clienteService.clienteCambio.next(medicos);
        this.clienteService.mensajeCambio.next("Se elimino");
      });
    });
  }

}
