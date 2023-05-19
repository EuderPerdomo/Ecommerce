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

  public panel_solar: any = {
    tipo: '',
    amperaje:'',
    max_potencia_paneles:[]
  };

  public inversor: any = {
salida_ac:'',
entrada_dc:'',
potencia:'',
producto:''
  };
  public voltaje_salida_inversor_ac=''

  public bateria: any = {
    voltaje:'',
    amperaje:'',
    tecnologia:''
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
        console.log(this.tipo)

        this.load_data = true;
        this._adminService.obtener_producto_calculadora_admin(this.id,this.token,this.tipo).subscribe(
          response=>{
           if(response.data == undefined){
            this.load_data = false;
            this.producto = undefined;
            
           }else{
             this.load_data = false;
             console.log('response data', response.data)
             this.producto = response.data;

             if(this.tipo=='controlador'){
              this.controlador = response.data;
              this.portada=this.controlador[0].producto.portada
              console.log('El controlador que obtengo',this.controlador)
             }

             if(this.tipo=='panel_solar'){
              this.panel_solar = response.data;
              this.portada=this.panel_solar[0].producto.portada
              console.log('El panel que obtengo',this.panel_solar)
             }

             if(this.tipo=='inversor'){
              this.inversor = response.data;
              this.portada=this.inversor[0].producto.portada
              console.log('El inversor que obtengo',this.inversor)
             }

             if(this.tipo=='bateria'){
              this.bateria = response.data[0];
              this.portada=this.bateria.producto.portada
              console.log('la bateria que obtengo',this.bateria)
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
      data.tipo=this.controlador[0].producto.tipo
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


  actualizar_panel(actualizarform:any){

    if(actualizarform.valid){
      var data:any={}
      data.producto=this.id
      data.tipo=this.panel_solar[0].producto.tipo

      data.vmp=this.panel_solar[0].vmp
      data.imp=this.panel_solar[0].imp
      data.voc=this.panel_solar[0].voc
      data.isc=this.panel_solar[0].isc
      data.tension=this.panel_solar[0].tension
      data.eficiencia=this.panel_solar[0].eficiencia
      data.potencia=this.panel_solar[0].potencia

console.log('datos de actualizacion panel solar',data,this.panel_solar[0])
      this._adminService.actualizar_panel_calculadora_admin(this.panel_solar[0]._id,data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se cambiaron los parametros para el panel solar'
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
            message: 'Error al intentar enviar la información a la DB'
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



  actualizarInversor(actualizarform:any){
    if(actualizarform.valid){
      var data:any={}
      data.producto=this.id,
      data.salida_ac=this.inversor[0].salida_ac,
      data.entrada_dc=this.inversor[0].entrada_dc,
      data.potencia=this.inversor[0].potencia

console.log('datos de actualizacion',data)

      this._adminService.actualizar_inversor_calculadora_admin(this.inversor[0]._id,data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizaron los datos del inversor correctamente'
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
            message: 'Error al intentar enviar la información a la DB'
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

  addVoltaje_Salida_Inversor(){

    console.log('datos salida ac',this.inversor[0].salida_ac)

    this.inversor[0].salida_ac.push(this.voltaje_salida_inversor_ac)
    this.voltaje_salida_inversor_ac=''
  }

  borrar_salida_inversor(item:number){
    this.inversor[0].salida_ac.splice(item,1);      
  }


  actualizarBateria(actualizarform:any){
    if(actualizarform.valid){
      var data:any={}
      data.producto=this.id,

      data.voltaje=this.bateria.voltaje,
      data.amperaje=this.bateria.amperaje,
      data.tecnologia=this.bateria.tecnologia

console.log('datos de actualizacion',data)

      this._adminService.actualizar_bateria_calculadora_admin(this.bateria._id,data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizaron los datos de la bateria correctamente'
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
            message: 'Error al intentar enviar la información a la DB'
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
