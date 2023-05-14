import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';

declare var iziToast:any;
declare var $:any;


@Component({
  selector: 'app-edit-producto-calculadora',
  templateUrl: './edit-producto-calculadora.component.html',
  styleUrls: ['./edit-producto-calculadora.component.css']
})
export class EditProductoCalculadoraComponent implements OnInit {
public portada=''
  public id = '';
  public tipo = '';
  public load_data = false;



  public producto: any = {
  };

  public voltaje:any
  public potencia:any

  public controlador: any = {
    tipo: '',
    amperaje:'',
    max_potencia_paneles:[]
  };

  public token = localStorage.getItem('token');



  constructor(
    private _adminService:AdminService,
    private _router:Router,
    private _route : ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this._route.params.subscribe(
      params=>{
        console.log(params)
        this.id = params['id'];
        this.tipo = params['tipo'];

        this.load_data = true;
        this._adminService.obtener_producto_calculadora_admin(this.id,this.token,this.tipo).subscribe(
          response=>{
           if(response.data == undefined){
            this.load_data = false;
            this.producto = undefined;
            
           }else{
             this.load_data = false;
             this.producto = response.data;

             if(this.tipo=='controlador'){
              this.controlador = response.data;
              this.portada=this.controlador[0].producto.portada
              console.log('El controlador que obtengo',this.controlador)
             }

             console.log('Datos de Producto',this.producto,'caracteristica',this.producto[0].tipo)
            // this.listar_etiquetas();
             //this.listar_etiquetas_producto();
             //this.imgSelect = this.producto.portada;
           }
            
          },
          error=>{
            console.log(error);
            
          }
        );
        
      }
    );



  }


  actualizar_controlador(actualizarform:any){
    if(actualizarform.valid){
      var data:any={}
      data.producto=this.id
      data.tipo=this.controlador[0].tipo
      data.amperaje=this.controlador[0].amperaje
      data.max_potencia_paneles=this.controlador[0].max_potencia_paneles
console.log('datos de actualizacion',data)
      this._adminService.actualizar_controlador_calculadora_admin(this.controlador[0]._id,data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agrego el Controlado para Calculos en la calculadora Solar'
          });

          this._router.navigate(['/dashboard_calculadora']);
        },
        error=>{
          iziToast.show({
            title: 'ERROR',
            titleColor: 'red',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Error al intentar genviar la información a la DB'
        });
        }
      )
    }
    else{
      iziToast.show({
        title: 'ERROR',
        titleColor: 'red',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Formulario Invalido'
    });
    }
  }

//Inicia  añadir borrar campos del controlador
  addCampo(){
    const dato={
      voltaje:this.voltaje,
      potencia:this.potencia,
    }
    console.log(this.controlador)
    this.controlador[0].max_potencia_paneles.push(dato)
console.log('Arreglo',this.controlador.max_potencia_paneles)
this.voltaje=''
this.potencia=''
    }
borrar(item:number) {
      this.controlador[0].max_potencia_paneles.splice(item,1); 
    }
//Finaliza  añadir borrar campos del controlador


}
