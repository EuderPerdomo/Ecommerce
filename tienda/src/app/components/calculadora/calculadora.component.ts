import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {FormBuilder, FormGroup} from '@angular/forms';
import { GuestService } from 'src/app/services/guest.service';




@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent implements OnInit,OnChanges {
  public nombre_cliente=''
  public watts_totales=''

  //Datos en edicion
  public potencia0=0
  public wtotal0=0
  public nombre_equipo0=''
  public cantidad0=0
  public horas_uso_dia0=0
  public w_totales=0
  public promedio0=0
  public tester=''
  public valores :Array<any>= [];
  public tabla:Array<any>= [];
  public a = 0;
  public simultaneo=0
  public total_dia=0
  public codigo=0

  //Bloqueo boton de edicion
  public editando=false

  //Paso tres, Tension y tipo de controlador
  public tension=0
  public tipo_controlador=''

 //Paso 4, paneles solares
  public panel=0

  //Paso 5, Baterias
  public amperaje=0
  public profundidad=0
  public dias=0
public pvgis=''

///Obtencion de datos desde PVGIS
public calculo_pvgis:any

  constructor(
    private _guestService:GuestService,) { }

  ngOnInit(): void {
    this.consulta_pvgis()
  }


  hayRegistros() {
    return this.valores.length>0;              
  }

cambio(test:any){
this.w_totales=this.potencia0*this.cantidad0
this.promedio0=this.w_totales*this.horas_uso_dia0
}

calcular_potencia_simultanea(){
  this.simultaneo = this.valores.reduce((
    acc,
    obj,
  ) => acc + (obj.w_totales),
  0);
  console.log("Total: ", this.simultaneo)
}

calcular_potencia_dia(){
  this.total_dia = this.valores.reduce((
    acc,
    obj,
  ) => acc + (obj.consumo_diario),
  0);
  console.log("Total: ", this.total_dia)
}

addCampo(){
  //TO DO
  //Validar que el formulario este completo
  //Validar que todos los campos san correctos
  if (this.horas_uso_dia0 >=24 || this.horas_uso_dia0 <=0){
this.horas_uso_dia0=12
//alert('Las horas de usuo diario no pueden ser mayores a 24 o menores a 0')
  }
  const data={
    codigo:this.a,
    nombre:this.nombre_equipo0,
    potencia:this.potencia0,
    cantidad:this.cantidad0,
    w_totales:this.w_totales,
    horas_dia:this.horas_uso_dia0,
    consumo_diario:this.promedio0
  }
this.a=this.a+1
          this.valores.push(data)
          console.log('Arreglo',this.valores)
          //TO DO
          //limpiar formulario y validar que el formulario este completo para agregarlo
          //Hacer que las horas del dia como maximo puedan ser 24
          this.limpiarCampos()

          //Calculamos la potencia simultanea
          this.calcular_potencia_simultanea()

          //Calculamos la potencia Utilizada diaria
          this.calcular_potencia_dia()
     
	}

  // actualizarTabla(tabla:any){
  //   console.log('mi tabla',tabla)
  // }


  editarFila(item: { codigo:number; nombre: string; potencia: number; cantidad: number; w_totales:number; horas_dia:number; consumo_diario:number }) {
    this.editando=true
    this.codigo=item.codigo
    this.nombre_equipo0=item.nombre
    this.potencia0=item.potencia
    this.cantidad0=item.cantidad
    this.w_totales=item.w_totales
    this.horas_uso_dia0=item.horas_dia
    this.promedio0=item.consumo_diario
  }

  limpiarCampos(){
    this.nombre_equipo0=''
    this.potencia0=0
    this.cantidad0=0
    this.w_totales=0
    this.horas_uso_dia0=0
    this.promedio0=0
  }

guardarEditarCampo(){
console.log('Edicion de campo',this.codigo)
for(let x=0;x<this.valores.length;x++)
      if (this.valores[x].codigo==this.codigo)
      {       
        this.valores[x].codigo=this.codigo
        this.valores[x].nombre=this.nombre_equipo0
        this.valores[x].potencia=this.potencia0
        this.valores[x].cantidad=this.cantidad0
        this.valores[x].w_totales=this.w_totales
        this.valores[x].horas_dia=this.horas_uso_dia0
        this.valores[x].consumo_diario=this.promedio0
        //Liempieza de campos
        this.limpiarCampos()
        //Calculamos la potencia simultanea
        this.calcular_potencia_simultanea()
        //Calculamos la potencia Utilizada diaria
        this.calcular_potencia_dia()

        this.editando=false
        return;       
      }

      
      
  }


cancelarEditarCampo(){
  console.log('Cancelar Edicion de campo')
  //Limpiamos campos
  this.limpiarCampos()
  this.editando=false
  }



registro(formulario:any){
console.log(formulario)
  }

  borrar(codigo:number) {
    console.log('Borrar',codigo,this.valores)
    for(let x=0;x<this.valores.length;x++)
      if (this.valores[x].codigo==codigo)
      {
        this.valores.splice(x,1);
        //Calculamos la potencia simultanea
this.calcular_potencia_simultanea()
//Calculamos la potencia Utilizada diaria
this.calcular_potencia_dia()
        return;
      }
  }


ngOnChanges(changes:SimpleChanges){
console.log('los changes',changes)
}

consulta_pvgis(){

  const data = {
    lat:45,
    lon:8,
    peakpower:500,
    batterysize:4000,
    consumptionday:3000,
    cutoff:40,
  };



  const date=[{lat:45},12,18,29,30,35]
      

  
      // lat=45
      // lon=8
      // peakpower=500
      // batterysize=50
      // consumptionday=200
      // cutoff=40
      // outputformat=json
const lat=45
const lon=22
const peakpower=500
const atterysize=50
const consumptionday=200
const cutoff=40
const outputformat='json'
  this._guestService.consulta_Pvgis(lat,lon,peakpower,atterysize,consumptionday,cutoff).subscribe(
    response=>{
      this.calculo_pvgis=response
      console.log('respuesta obtenida', this.calculo_pvgis.data['inputs'],'el tipo de datos es',typeof(this.calculo_pvgis));
    },
    error=>{
      console.log('Error en la consulta')
    }
  );
}

}
