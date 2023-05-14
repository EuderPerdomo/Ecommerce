import { Component, OnInit } from '@angular/core';

import { GuestService } from 'src/app/services/guest.service';

import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-new-calculo',
  templateUrl: './new-calculo.component.html',
  styleUrls: ['./new-calculo.component.css']
})
export class NewCalculoComponent implements OnInit {

  //single: any[];
  //multi: any[];

  view:[number,number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  showYAxisLabel = true;
  yAxisLabel = 'Producción Wh/d';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'], 
    group: ScaleType.Ordinal,
    selectable: true, 
    name: 'Customer Usage',
  };

public single:any=[]


public currentTab=0
public prevBtn=''
public prueba = document.getElementById('nextBtn');

public displayPrevBtn:String
public displayNextBtn:String

public displayTab:String
public displayTab2:String

public htmlStr:String


//Iniciamos añadir los nuevos
public nombre_cliente='juan'
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
public controladores_bd:Array<any>=[]

//Paso 4, paneles solares
public panel=0
public portada_panel=''

//Paso 5, Baterias
public amperaje=0
public profundidad=0
public dias=0
public baterias_bd:Array<any>=[]
//Finaliza añadir los nuevos

///Obtencion de datos desde PVGIS
public calculo_pvgis:any

//Calculo de paneles Necesarios
public numero_paneles=0
public horas_sol:any
public horas_sol_pico=0
public peakpower=500

//consulta paneles base de datos
public paneles_bd:Array<any>=[]


//Calculo de baterias
public amperios_necesarios=0
public baterias=0
public batterysize=500

//Ubicacion
public longitud=-74.220
public latitud=4.582

//Inversores
public inversores_bd:Array<any>=[]

//Poyecto
public proyecto_nombre='Default Name'

//Cuando ya se consultaron datos de PVGIS
calc_pvgis_onload=false

  constructor(
    private _guestService:GuestService,
    ) { 
      //Object.assign(this, { single })//para graficos
    }


  onSelect(event:any) {
      console.log(event);
    }


  ngOnInit(): void {
    this.showTab(this.currentTab)
    this.hsp()
    this.consultar_paneles()
    this.listar_baterias()
  }


  estilos={
    "display":"block"
  }

  estilo_prevBtn={
    "display":"block"
  }



 
showTab(n:any) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    //this.displayTab="block"

    const el = document.getElementById(n);
    if (el != null){
      console.log('Asignando')
      el.style.display = 'block';
    }
    console.log(el)
   if (n == 0) {
    this.displayPrevBtn = "none";
   } else {
    this.displayPrevBtn = "inline";
   }
   if (n == (x.length - 1)) { 
      this.htmlStr= 'Submit';
   } else {
    this.htmlStr= 'Next';
   }
   this.fixStepIndicator(n)
   
  }

nextPrev(n:any) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    const el = document.getElementById(this.currentTab.toString());

    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !this.validateForm()) return false;
    // Hide the current tab:
    if (el != null){
      el.style.display = 'none';
    }
    this.currentTab = this.currentTab + n;
    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      const formulario = document.getElementById("regForm");
      //document.getElementById("regForm").submit();
      return false;
    }
    this.showTab(this.currentTab);
    return false
  }

validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[this.currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty...
      if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid; // return the valid status
  }

fixStepIndicator(n:any) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //Cambia el actual a clase activa
    x[n].className += " active";
  }


//Añadimos calculadora
hayRegistros() {
  return this.valores.length>0;              
}

cambio(test:any){
this.w_totales=this.potencia0*this.cantidad0
this.promedio0=this.w_totales*this.horas_uso_dia0
console.log('funcionde cambio',this.w_totales,this.promedio0,this.potencia0,this.cantidad0,this.w_totales,this.horas_uso_dia0)
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

//Finaliza añadir Calculadora

//Inicia traer HSP
hsp(){

const lat=this.latitud
const lon=this.longitud
const angle=15

   //numero_paneles=potencia_dia/HSP*0.9*potencia_panel
   this.numero_paneles=this.total_dia/4*0.9*450

   this._guestService.consulta_hsp(lat,lon,angle).subscribe(
      response=>{
        this.horas_sol=response
        console.log('datos de hsp', this.horas_sol.data.outputs.monthly[0].month,this.horas_sol.data.outputs.monthly.length);
const data:any=[]//Array<any>= []
        for (let clave of this.horas_sol.data.outputs.monthly){
         console.log('clave valor',clave['H(i)_m']);
         data.push(Number(clave['H(i)_m']))
       }
       var peor_escenario:any=0
       peor_escenario=(Math.min.apply(Math, data)/30)

console.log('el minimo de radiacion es',peor_escenario)
//this.calcularPaneles(peor_escenario)
this.horas_sol_pico=peor_escenario

      },
      error=>{
        console.log('Error en la consulta de hsp')
      }
    );

}
//Finaliza traer HSP

//Inicia calcular paneles
calcularPaneles(potencia_panel:any){
  console.log('Potencia arreglo de panels',potencia_panel,this.total_dia,this.horas_sol_pico)
   //let potencia_panel=250
this.numero_paneles=Math.round(this.total_dia/(this.horas_sol_pico*0.9*potencia_panel)) //this.total_dia/hsp*0.9*450
this.peakpower=this.numero_paneles*potencia_panel
console.log('Potencia arreglo de panels',this.peakpower,this.numero_paneles)
}
//Finaliza calcular paneles

//Inicia calcular Baterias
calcularBaterias(){
/**
 * Primero:
 * Amperios_necesarios
 * ***Potencia diaria: potencia_dia
 * ***dias autonomia
 * ***eficiencia inversor
 * ***voltaje controlador
 * ***perdidas
 */
var potencia_dia=2000
var dias_autonomia=1
var eficiencia_inversor=0.9
var voltaje_controlador=12
var perdidas=1.15

this.amperios_necesarios=((potencia_dia*dias_autonomia)/(eficiencia_inversor*voltaje_controlador))*perdidas
console.log('Los amperios necesarios son:',this.amperios_necesarios)

/**Paso 2
 * capacidad Baterias en anperios
 * baterias en paralelo
 * baterias en serie
 * voltaje bateria
 * voltaje controlador
 * 
 */

let capacidad_bateria=100
let voltaje_bateria=12

let baterias_paralelo=this.amperios_necesarios/capacidad_bateria
let baterias_serie=voltaje_controlador/voltaje_bateria

this.baterias=Math.round(baterias_paralelo*baterias_serie)

this.batterysize=(capacidad_bateria*voltaje_bateria)*this.baterias

   }
   //Finaliza calcular pBaterias



///Inicia prueba enviar datos API
EnviarDatosApi(){
/*
const lat=this.latitud
const lon=this.longitud
const peakpower=this.peakpower
const batterysize=this.batterysize
const consumptionday=this.total_dia//this.total_dia
const cutoff=this.profundidad
*/

const lat=4.582
const lon=-74.220
const peakpower=500
const batterysize=2000
const consumptionday=2600//this.total_dia
const cutoff=14

console.log('Laprofundidad ',cutoff,this.profundidad,cutoff*this.profundidad)
const outputformat='json'

  this._guestService.consulta_Pvgis(lat,lon,peakpower,batterysize,consumptionday,cutoff).subscribe(
    response=>{
      this.calculo_pvgis=response
      localStorage.setItem('respuesta',response.data);
      console.log('respuesta obtenida', this.calculo_pvgis.data['inputs'],'respuesta completa',this.calculo_pvgis.data);
      console.log(this.calculo_pvgis.data.inputs.location.latitude);
      this.calc_pvgis_onload=true



//Pasando a arreglo para graficar
const data:any=[]//Array<any>= []
this.single=[]
var meses=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        for (let clave of this.calculo_pvgis.data.outputs.monthly){
         console.log('clave valor',clave['month'],clave['E_d']);
         //estudiantes.push({nombreEstudiante: 'Andrea', testScore: 100}, { nombreEstudiante: 'Timmy', testScore: 71});
         this.single.push({name:meses[clave['month']-1],value:clave['E_d']})
       }
       console.log('grafico de radiacion mensual',this.single)
//Finaliza arreglo para Graficar
    },
    error=>{
      console.log('Error en la consulta')
    }
  );
}
//Finaliza enviar datos API


//Inicia traer paneles para la calculadora
consultar_paneles(){
  this._guestService.consultar_paneles().subscribe(
    response=>{
      console.log('Paneles consultados',response.data);
      this.paneles_bd=response.data
    },
    error=>{
      console.log('Error en la consulta de paneles solares')
    }
  );
}

listar_controladores(){
  this._guestService.listar_controladores().subscribe(
    response=>{
      console.log('Controladores consultados',response.data);
      this.controladores_bd=response.data
    },
    error=>{
      console.log('Error en la consulta de Controladores')
    }
  );
}

listar_baterias(){
  this._guestService.listar_baterias().subscribe(
    response=>{
      console.log('Controladores consultados',response.data);
      this.baterias_bd=response.data
    },
    error=>{
      console.log('Error en la consulta de Controladores')
    }
  );
}



test_buscar_imagen(_id:any){
console.log('busqueda de la imagen',_id)
for (let clave of this.paneles_bd){
  if(_id==clave['_id']){
    console.log('clave valor',clave['producto'].portada,clave['potencia']);
    this.portada_panel=clave['producto'].portada
    this.calcularPaneles(clave['potencia'])
  }
  }
}

//Finaliza traer paneles para la calculadora

}
