import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-dashboard-calculadora',
  templateUrl: './dashboard-calculadora.component.html',
  styleUrls: ['./dashboard-calculadora.component.css']
})
export class DashboardCalculadoraComponent implements OnInit {

  public productos :Array<any>= [];
  public productos_const  :Array<any>= [];
  public etiquetas : Array<any> = [];
  public token = localStorage.getItem('token');
  public load = false;  
  public page = 1;
  public pageSize = 24;
  public filtro = '';


  public load_btn_etiqueta =false;
  public load_data_etiqueta =false;
  public nueva_etiqueta = '';

  public load_del_etiqueta = false;
  public load_btn = false;

  public load_estado = false;


  //Tipo de equipo
  public tipo_equipo=''
  public tipo_controlador=''


  constructor(private _adminService:AdminService) { }

  ngOnInit(): void {
    this.listar_etiquetas()
    this.init_data();
  }

init_data(){
  this.load = true;
    this._adminService.listar_productos_calculadora_admin(this.token).subscribe(
      response=>{
        this.productos_const = response.data;
        this.productos= this.productos_const;
        console.log('Productos',this.productos)
        this.load = false;
      }
    );
}

  listar_etiquetas(){

    this._adminService.listar_etiquetas_admin(this.token).subscribe(
      response=>{
        this.etiquetas = response.data;
console.log(this.etiquetas)
      }
    );
  }


  filtrar_producto(){
    if(this.filtro){
      var term = new RegExp(this.filtro.toString().trim() , 'i');
      this.productos = this.productos_const.filter(item=>term.test(item.titulo)||term.test(item._id));
    }else{
      this.productos = this.productos_const;
    }
  }

}
