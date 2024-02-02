import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-agregar-productos-calculadora',
  templateUrl: './agregar-productos-calculadora.component.html',
  styleUrls: ['./agregar-productos-calculadora.component.css']
})
export class AgregarProductosCalculadoraComponent implements OnInit {
  public id = '';
  public token = localStorage.getItem('token');
  public load_data = false;

  public producto: any = {
    categoria: '',
    tipo: '',
    amperaje:'',
    voltaje_potencia:[]
  };


  public panel: any = {
    voc: '',
    isc: '',
    imp:'',
    vmp:'',
    potencia:'',
    eficiencia:'',
    tension:''
  };



  public inversor: any = {
    potencia:'',
    entrada_dc:'',
    salida_ac:[]
  };


  public controlador: any = {
    tipo: '',
    amperaje:'',
    max_potencia_paneles:[]
  };
  public voltaje:any
  public potencia:any


  public voltaje_salida_inversor_ac=''

  
  public bateria: any = {
    voltaje:'',
    amperaje:'',
    tecnologia:''
  };

  public valores :Array<any>= [];
  public tabla:Array<any>= [];
  public a=0

  constructor(
    private _adminService:AdminService,
    private _router:Router,
    private _route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        
        //TO DO
        //Consultar si el producto ya se esta usando en la calculadora

        this._adminService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
           if(response.data == undefined){
            console.log('Producto no encontrado')
            
           }else{
             this.producto = response.data;
            console.log('Producto a editar en calculadora',this.producto)
           }
            
          },
        );
        
      }
    );


  }

  actualizar(actualizarForm:any){}

  editarFila(item:any){}

  registro(registroForm:any){
    console.log('Registro Controlador')
  }

  registroPanel(registroPanelForm:any){
   if(registroPanelForm.valid){

    var data : any= {};
    data.producto=this.id
    data.voc=this.panel.voc,
    data.isc=this.panel.isc,
    data.imp=this.panel.imp,
    data.vmp=this.panel.vmp,
    data.potencia=this.panel.potencia,
    data.eficiencia=this.panel.eficiencia,
    data.tension=this.panel.tension

    this._adminService.registro_panel_calculadora_admin(data,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se agrego el panel para Calculos en la calculadora Solar'
        });

        // this.load_btn = false;

        this._router.navigate(['/dashboard_calculadora']);
      },
      error=>{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: error.error.message
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

  
  registroInversor(registroInversorForm:any){
    if(registroInversorForm.valid){
      var data : any= {};
      data.producto=this.id
      data.potencia=this.inversor.potencia,
      data.salida_ac=this.inversor.salida_ac,
      data.entrada_dc=this.inversor.entrada_dc,

      this._adminService.registro_inversor_calculadora_admin(data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agrego el Inversor para Calculos en la calculadora Solar'
          });
          this._router.navigate(['/dashboard_calculadora']);
        },
        error=>{
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

  registroBateria(registroBateriaForm:any){
    if(registroBateriaForm.valid){
      var data : any= {};
      data.producto=this.id
      data.voltaje=this.bateria.voltaje,
      data.amperaje=this.bateria.amperaje,
      data.tecnologia=this.bateria.tecnologia,
      
      this._adminService.registro_producto_calculadora_admin(data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agrego la bateria para Calculos en la calculadora Solar'
          });

          // this.load_btn = false;

          this._router.navigate(['/dashboard_calculadora']);
        },
        error=>{
          // this.load_btn = false;
        }
      )



    }
  }

  registroControlador(registroControladorForm:any){
    if(registroControladorForm.valid){
      var data:any={}
      data.producto=this.id
      data.tipo=this.controlador.tipo
      data.amperaje=this.controlador.amperaje
      data.max_potencia_paneles=this.controlador.max_potencia_paneles

      this._adminService.registro_controlador_calculadora_admin(data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agrego el Controlador para Calculos en la calculadora Solar'
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

    //Inicia añadir/borra campos controlador
  addCampo(){
    const dato={
      voltaje:this.voltaje,
      potencia:this.potencia,
    }
    this.controlador.max_potencia_paneles.push(dato)
console.log('Arreglo',this.controlador.max_potencia_paneles)
this.voltaje=''
this.potencia=''
    }

    borrar(item:number) {
      this.controlador.max_potencia_paneles.splice(item,1); 
    }
    //Finaliza añadir/borra campos controlador

    addVoltaje_Salida_Inversor(){
      this.inversor.salida_ac.push(this.voltaje_salida_inversor_ac)
      this.voltaje_salida_inversor_ac=''
    }

    borrar_salida_inversor(item:number){
      this.inversor.salida_ac.splice(item,1);      
    }


    

guardarDatos(){
  var data : any= {};
      data.tipo = this.producto.tipo;
      data.voltaje_potencia = this.valores;
      data.amperaje = this.producto.amperaje;
      console.log(data)

}


}
