import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-calculo',
  templateUrl: './new-calculo.component.html',
  styleUrls: ['./new-calculo.component.css']
})
export class NewCalculoComponent implements OnInit {
public currentTab=0
public prevBtn=''
public prueba = document.getElementById('nextBtn');

public displayPrevBtn:String
public displayNextBtn:String

public displayTab:String
public displayTab2:String

public htmlStr:String


//Iniciamos añadir los nuevos
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
//Finaliza añadir los nuevos


  constructor() { }

  ngOnInit(): void {
    this.showTab(this.currentTab)
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
    console.log('La currentTab',x[this.currentTab])
    if (el != null){
      console.log('Asignando')
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





}
