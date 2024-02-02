import { Component, OnInit } from '@angular/core';

import { GuestService } from 'src/app/services/guest.service';

import { Color, ScaleType } from '@swimlane/ngx-charts';

import { Map, tileLayer, icon, Marker } from 'leaflet'

import * as L from 'leaflet';

//Graficos
import Chart from 'chart.js/auto'


//Slider
declare var noUiSlider: any;
declare var $: any;


@Component({
  selector: 'app-new-calculo',
  templateUrl: './new-calculo.component.html',
  styleUrls: ['./new-calculo.component.css']
})
export class NewCalculoComponent implements OnInit {
  lablesList: String[] = ['a', 'b', 'c']
  data: number[] = [1, 2, 3]
  sdata: number[] = [1, 2, 3]
  chartName = 'Nombre'

  public op = 1;


  ngAfterViewInit(): void {
    const map = new Map('map').setView([4.62111, -74.07317], 6);
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    //Inicia nuevo
    var customIcon = L.icon({
      iconUrl: './assets/images/marker.png',
      iconSize: [52, 52]
    })

    var markerOptions = {
      icon: customIcon,
      draggable: true,
    }

    var mc: any

    //    map.on('click',($scope) =>{
    // console.log('click',this.latitud)
    //    })

    map.on('click', (e) => {
      if (mc != undefined) {
        console.log('ya esta definido el Pin')
      } else {

        mc = new L.Marker([e.latlng.lat, e.latlng.lng], markerOptions).addTo(map)

        mc.on('dragend', (event: any) => {
          var latlng = event.target.getLatLng();
          console.log(latlng.lat, latlng.lng, this.latitud)
          this.latitud = latlng.lat
          this.longitud = latlng.lng
          this.hsp()
          //this.ConsultarRadiacionDiaria()
          //this.test()
        });

      }
      //var mc=new L.Marker([e.latlng.lat,e.latlng.lng],markerOptions).addTo(map)
    })
  }

  test() {
    console.log('test')
  }

  //single: any[];
  //multi: any[];

  view: [number, number] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  showYAxisLabel = true;
  yAxisLabel = 'Producción Wh/d';

  colorScheme = {
    // domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'], 
    domain: ['#5AA454'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  public single: any = []




  public currentTab = 0
  public prevBtn = ''
  public prueba = document.getElementById('nextBtn');

  public displayPrevBtn: String
  public displayNextBtn: String

  public displayTab: String
  public displayTab2: String

  public htmlStr: String


  //Iniciamos añadir los nuevos
  public nombre_cliente = 'Iluminación arias comunes Iglesia Pandi Cundinamarca'
  public watts_totales = ''

  //Datos en edicion
  public potencia0 = 0
  public wtotal0 = 0
  public nombre_equipo0 = ''
  public cantidad0 = 0
  public horas_uso_dia0 = 0
  public w_totales = 0
  public promedio0 = 0
  public tester = ''
  public valores: Array<any> = [];
  public tabla: Array<any> = [];
  public a = 0;
  public simultaneo = 0
  public total_dia = 0
  public codigo = 0

  //definimos perfil de carga
  public perfil_carga = [0.0505, 0.035, 0.02, 0.025, 0.0245, 0.0265,
    0.0345, 0.0295, 0.023, 0.018, 0.018, 0.0205,
    0.0265, 0.035, 0.0415, 0.0505, 0.0455, 0.034,
    0.025, 0.03, 0.065, 0.1095, 0.1175, 0.088
  ]
  public consumo_hora:any

  //Bloqueo boton de edicion
  public editando = false

  //Paso tres, Tension y tipo de controlador
  public tension = 0
  public tipo_controlador = ''
  public controladores_bd: Array<any> = []

  //Paso 4, paneles solares
  public panel = 0
  public portada_panel = ''
  public descripcion_panel = ''

  //Paso 5, Baterias
  public amperaje = 0
  public profundidad = 0
  public dias = 0
  public baterias_bd: Array<any> = []
  public portada_bateria = ''
  public descripcion_bateria = ''
  //Finaliza añadir los nuevos

  ///Obtencion de datos desde PVGIS
  public calculo_pvgis: any

  //Calculo de paneles Necesarios
  public numero_paneles = 0
  public horas_sol: any
  public horas_sol_pico = 0
  public peakpower = 500

  //consulta paneles base de datos
  public paneles_bd: Array<any> = []


  //Calculo de baterias
  public amperios_necesarios = 0
  public baterias = 0
  public batterysize = 500
  public baterias_paralelo = 0
  public baterias_serie = 0

  //Ubicacion
  public longitud = -74.220
  public latitud = 4.582

  //Inversores
  public inversores_bd: Array<any> = []

  //Poyecto
  public proyecto_nombre = 'Default Name'


  //Cuando ya se consultaron datos de PVGIS
  calc_pvgis_onload = false

  public posicion = 0

  //Datos de Radiacion diaria
  public radiacion_diaria: any

  //Graficos
  public ChartMensual: any
  public ChartPerfilConsumo: any


  public predefinidos: Array<any> = [
    { nombre: 'PC', potencia: '100', inicio_uso: 10, fin_uso: 15 },
    { nombre: 'TV', potencia: '150', inicio_uso: 8, fin_uso: 16 },
    { nombre: 'NEVERA', potencia: '200', inicio_uso: 0, fin_uso: 23 },
    { nombre: 'LAVADORA', potencia: '300', inicio_uso: 9, fin_uso: 12 },
    { nombre: 'SECADORA', potencia: '400', inicio_uso: 12, fin_uso: 15 },
  ]

  constructor(
    private _guestService: GuestService,
  ) {
    //Object.assign(this, { single })//para graficos
  }


  onSelect(event: any) {
    console.log(event);
  }


  ngOnInit(): void {
    //this.showTab(this.currentTab)
    this.hsp()
    this.consultar_paneles()
    this.listar_baterias()
    this.listar_controladores()
    this.ConsultarRadiacionDiaria()


    this._guestService.single(this.chartName, 'key', this.lablesList, this.data, 'servicioGrafico', 'line')


    //Slider
    setTimeout(() => {
      this.predefinidos.forEach(element => {
        var slider: any = document.getElementById(element.nombre);
        noUiSlider.create(slider, {
          start: [element.inicio_uso, element.fin_uso],
          connect: true,
          range: {
            'min': 0,
            'max': 23
          },
          tooltips: [true, true],
        })

        slider.noUiSlider.on('update', function (values: any) {
          console.log()
          $('.ps-slider__min').text(values[0]);
          $('.ps-slider__max').text(values[1]);
        });
        $('.noUi-tooltip').css('font-size', '11px');
      }, 150);

    });

    //inicia Grafico Perfil Consumo
    this.ChartPerfilConsumo = new Chart('PerfilConsumos', {
      type: 'line',
      data: {
        labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        datasets: [
          {
            type: 'line',
            label: 'Distribucion Perfil de Consumo',
            data: []
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    ///Fin Grafico Perfil Consumo

    //inicia Grafico Mensual
    this.ChartMensual = new Chart('mesmes', {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        datasets: [
          {
            type: 'line',
            label: 'Irradiación Media horaria Mes',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    ///Fin Grafico Mensual

  }

  estilos = {
    "display": "block"
  }

  estilo_prevBtn = {
    "display": "block"
  }









  showTab(n: any) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    //this.displayTab="block"

    const el = document.getElementById(n);
    if (el != null) {
      el.style.display = 'block';
    }
    if (n == 0) {
      this.displayPrevBtn = "none";
    } else {
      this.displayPrevBtn = "inline";
    }
    if (n == (x.length - 1)) {
      this.htmlStr = 'Submit';
    } else {
      this.htmlStr = 'Next';
    }
    this.fixStepIndicator(n)

  }

  nextPrev(n: any) {

    if (this.posicion + n <= 0) {
      this.posicion = 0
      console.log(this.posicion)
    } else if (this.posicion + n >= 5) {
      this.posicion = 5
    } else {
      this.posicion = this.posicion + n
      console.log(this.posicion)
    }



    /*
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
  */

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

  fixStepIndicator(n: any) {
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
    return this.valores.length > 0;
  }

  cambio(test: any) {
    this.w_totales = this.potencia0 * this.cantidad0
    this.promedio0 = this.w_totales * this.horas_uso_dia0
    console.log('funcionde cambio', this.w_totales, this.promedio0, this.potencia0, this.cantidad0, this.w_totales, this.horas_uso_dia0)
  }

  calcular_potencia_simultanea() {
    this.simultaneo = this.valores.reduce((
      acc,
      obj,
    ) => acc + (obj.w_totales),
      0);
    console.log("Total: ", this.simultaneo)
  }


perfil_consumo(){
  this.consumo_hora = []//Distribucion normal de los consumos deacuerdo al perfil de carga
  for (let i = 0; i < this.perfil_carga.length; i++) {
    this.consumo_hora.push(this.perfil_carga[i] * this.total_dia)
  }

  console.log('Distribucion del perfil de consumos',this.consumo_hora)
//Actualizamos el grafico de Perfil de consumo
   // this.ChartPerfilConsumo.data.labels=this.consumo_hora
    //this.ChartMensual.data.labels.push(1);

    this.ChartPerfilConsumo.data.datasets[0].data=this.consumo_hora
 

    this.ChartPerfilConsumo.update();

//Finaliza Actualiza grafico perfil de Consumo



}
  
  calcular_potencia_dia() {
    this.total_dia = this.valores.reduce((
      acc,
      obj,
    ) => acc + (obj.consumo_diario),
      0);
    console.log("Total: ", this.total_dia)
    this.perfil_consumo()
  }

  addCampo() {
    //TO DO
    //Validar que el formulario este completo
    //Validar que todos los campos san correctos
    if (this.horas_uso_dia0 >= 24 || this.horas_uso_dia0 <= 0) {
      this.horas_uso_dia0 = 12
      //alert('Las horas de usuo diario no pueden ser mayores a 24 o menores a 0')
    }
    const data = {
      codigo: this.a,
      nombre: this.nombre_equipo0,
      potencia: this.potencia0,
      cantidad: this.cantidad0,
      w_totales: this.w_totales,
      horas_dia: this.horas_uso_dia0,
      consumo_diario: this.promedio0
    }
    this.a = this.a + 1
    this.valores.push(data)
    console.log('Arreglo', this.valores)
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


  editarFila(item: { codigo: number; nombre: string; potencia: number; cantidad: number; w_totales: number; horas_dia: number; consumo_diario: number }) {
    this.editando = true
    this.codigo = item.codigo
    this.nombre_equipo0 = item.nombre
    this.potencia0 = item.potencia
    this.cantidad0 = item.cantidad
    this.w_totales = item.w_totales
    this.horas_uso_dia0 = item.horas_dia
    this.promedio0 = item.consumo_diario
  }

  limpiarCampos() {
    this.nombre_equipo0 = ''
    this.potencia0 = 0
    this.cantidad0 = 0
    this.w_totales = 0
    this.horas_uso_dia0 = 0
    this.promedio0 = 0
  }

  guardarEditarCampo() {
    console.log('Edicion de campo', this.codigo)
    for (let x = 0; x < this.valores.length; x++)
      if (this.valores[x].codigo == this.codigo) {
        this.valores[x].codigo = this.codigo
        this.valores[x].nombre = this.nombre_equipo0
        this.valores[x].potencia = this.potencia0
        this.valores[x].cantidad = this.cantidad0
        this.valores[x].w_totales = this.w_totales
        this.valores[x].horas_dia = this.horas_uso_dia0
        this.valores[x].consumo_diario = this.promedio0
        //Liempieza de campos
        this.limpiarCampos()
        //Calculamos la potencia simultanea
        this.calcular_potencia_simultanea()
        //Calculamos la potencia Utilizada diaria
        this.calcular_potencia_dia()

        this.editando = false
        return;
      }



  }


  cancelarEditarCampo() {
    console.log('Cancelar Edicion de campo')
    //Limpiamos campos
    this.limpiarCampos()
    this.editando = false
  }



  registro(formulario: any) {
    console.log(formulario)
  }

  borrar(codigo: number) {
    console.log('Borrar', codigo, this.valores)
    for (let x = 0; x < this.valores.length; x++)
      if (this.valores[x].codigo == codigo) {
        this.valores.splice(x, 1);
        //Calculamos la potencia simultanea
        this.calcular_potencia_simultanea()
        //Calculamos la potencia Utilizada diaria
        this.calcular_potencia_dia()
        return;
      }
  }

  //Finaliza añadir Calculadora

  //Inicia traer HSP
  hsp() {

    const lat = this.latitud
    const lon = this.longitud
    const angle = 15

    //numero_paneles=potencia_dia/HSP*0.9*potencia_panel
    this.numero_paneles = this.total_dia / 4 * 0.9 * 450

    this._guestService.consulta_hsp(lat, lon, angle).subscribe(
      response => {
        this.horas_sol = response
        console.log('datos de hsp', this.horas_sol.data.outputs.monthly[0].month, this.horas_sol.data.outputs.monthly.length);
        const data: any = []//Array<any>= []
        for (let clave of this.horas_sol.data.outputs.monthly) {
          console.log('clave valor', clave['H(i)_m']);
          data.push(Number(clave['H(i)_m']))
        }
        var peor_escenario: any = 0
        peor_escenario = (Math.min.apply(Math, data) / 30)

        console.log('el minimo de radiacion es', peor_escenario)
        //this.calcularPaneles(peor_escenario)
        this.horas_sol_pico = Math.round(peor_escenario)

      },
      error => {
        console.log('Error en la consulta de hsp')
      }
    );

  }
  //Finaliza traer HSP

  //Inicia calcular paneles
  calcularPaneles(potencia_panel: any) {
    console.log('Potencia arreglo de panels', potencia_panel, this.total_dia, this.horas_sol_pico)
    //let potencia_panel=250
    this.numero_paneles = Math.round(this.total_dia / (this.horas_sol_pico * 0.9 * potencia_panel)) //this.total_dia/hsp*0.9*450
    this.peakpower = this.numero_paneles * potencia_panel
    console.log('Potencia arreglo de panels', this.peakpower, this.numero_paneles)
  }
  //Finaliza calcular paneles

  //Inicia calcular Baterias
  calcularBaterias(voltaje: any, amperaje: any) {

    console.log('Parametro recibidos en baterias', voltaje, amperaje)
    /**
     * Primero:
     * Amperios_necesarios
     * ***Potencia diaria: potencia_dia
     * ***dias autonomia
     * ***eficiencia inversor
     * ***voltaje controlador
     * ***perdidas
     */
    var potencia_dia = 2000
    var dias_autonomia = 1
    var eficiencia_inversor = 0.9
    var voltaje_controlador = 12
    var perdidas = 1.15

    this.amperios_necesarios = ((potencia_dia * dias_autonomia) / (eficiencia_inversor * voltaje_controlador)) * perdidas
    console.log('Los amperios necesarios son:', this.amperios_necesarios)

    /**Paso 2
     * capacidad Baterias en anperios
     * baterias en paralelo
     * baterias en serie
     * voltaje bateria
     * voltaje controlador
     * 
     */

    let capacidad_bateria = 100
    let voltaje_bateria = 12

    this.baterias_paralelo = Math.round(this.amperios_necesarios / capacidad_bateria)
    this.baterias_serie = Math.round(voltaje_controlador / voltaje_bateria)

    this.baterias = Math.round(this.baterias_paralelo * this.baterias_serie)

    this.batterysize = (capacidad_bateria * voltaje_bateria) * this.baterias

  }
  //Finaliza calcular pBaterias



  ///Inicia prueba enviar datos API
  EnviarDatosApi() {
    /*
    const lat=this.latitud
    const lon=this.longitud
    const peakpower=this.peakpower
    const batterysize=this.batterysize
    const consumptionday=this.total_dia//this.total_dia
    const cutoff=this.profundidad
    */

    const lat = 4.582
    const lon = -74.220
    const peakpower = 500
    const batterysize = 2000
    const consumptionday = 2600//this.total_dia
    const cutoff = 14

    console.log('Laprofundidad ', cutoff, this.profundidad, cutoff * this.profundidad)
    const outputformat = 'json'

    this._guestService.consulta_Pvgis(lat, lon, peakpower, batterysize, consumptionday, cutoff).subscribe(
      response => {
        this.calculo_pvgis = response
        localStorage.setItem('respuesta', response.data);
        console.log('respuesta obtenida', this.calculo_pvgis.data['inputs'], 'respuesta completa', this.calculo_pvgis.data);
        console.log(this.calculo_pvgis.data.inputs.location.latitude);
        this.calc_pvgis_onload = true



        //Pasando a arreglo para graficar
        const data: any = []//Array<any>= []
        this.single = []
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        for (let clave of this.calculo_pvgis.data.outputs.monthly) {
          console.log('clave valor', clave['month'], clave['E_d']);
          this.single.push({ name: meses[clave['month'] - 1], value: clave['E_d'] })
        }
        console.log('grafico de radiacion mensual', this.single)
        //Finaliza arreglo para Graficar
      },
      error => {
        console.log('Error en la consulta')
      }
    );
  }
  //Finaliza enviar datos API

  //Inicia Consultar Radiacion diaria
  ConsultarRadiacionDiaria() {

    const lat = 4.661
    const lon = -74.094
    const angle = 15


    this._guestService.consultar_radiacion_diaria(lat, lon, angle).subscribe(
      response => {
        this.radiacion_diaria = response.data.outputs.daily_profile

        //console.log('Valores iniciales', response, 'Respuesta', this.radiacion_diaria)

        const data: any = []//Array<any>= []
        for (let clave of this.radiacion_diaria) {

          //console.log('clave valor', clave['month'], clave['time'], clave['G(i)'], clave['T2m']);
          let objeto = {
            mes: clave['month'],
            hora: clave['time'],
            irradiacion: clave['G(i)'],
            temperatura: clave['T2m']
          }
          data.push(objeto)//Agregamos el objeto a los datos, contendra la información de la radiación para todos los meses
          //}

        }

        ///console.log('Datos Obtenidos',data)



        //Iniciamos calculo de Produción diaria
        //Datos del Panel
        var potencia_panel = 670 //670
        var voc = 46.1
        var isc = 18.62
        var cpt = -0.34 //Coeficiente de Potencia-Temperatura
        var cvt = -0.25 //Coeficiente de Voltage-Temperatura
        var cct = 0.04 //Coeficiente de Corriente-Temperatura
        var tonc = 43 //Temperatura de Operacion Nominal de la Celula

        //Produccion deacuerdo a temperatura
        var Tcell = []
        var voc_t = []
        var isc_t = []
        var Potencia_t = [] //Potencia total producida en cada Hora
        //Finalizamos calculo de Produción diaria

        //Perfil de carga y Potencia Consumo diario
        var consumo_diario = 2000 //Consumo diario expresado en W
        var perfil_carga = [0.0505, 0.035, 0.02, 0.025, 0.0245, 0.0265,
          0.0345, 0.0295, 0.023, 0.018, 0.018, 0.0205,
          0.0265, 0.035, 0.0415, 0.0505, 0.0455, 0.034,
          0.025, 0.03, 0.065, 0.1095, 0.1175, 0.088
        ]

        var consumo_hora = []//Distribucion normal de los consumos deacuerdo al perfil de carga
        for (let i = 0; i < perfil_carga.length; i++) {
          consumo_hora.push(perfil_carga[i] * consumo_diario)
        }


        //Datos para el grafico
        var label = []
        var sumas = []
        var temperaturas = []

        //Extraccion de los datos para un mes en especifico
        var mes_selecionado = 5
        for (let clave of data) {
          if (clave.mes == mes_selecionado) {
            label.push(clave.hora)
            sumas.push(clave.irradiacion)
            temperaturas.push(clave.temperatura)

            //Calculamos los valores de produccion
            let temperatura_celula = clave.temperatura + (tonc - 20) * clave.irradiacion / 800
            Tcell.push(temperatura_celula)
            voc_t.push(voc * (1 + (cvt / 100) * (temperatura_celula - 25)))
            isc_t.push(isc * (1 + (cct / 100) * (temperatura_celula - 25)) * clave.irradiacion / 1000)
            Potencia_t.push(potencia_panel * (1 + (cpt / 100) * (temperatura_celula - 25)) * clave.irradiacion / 1000)
          }
        }

        console.log('data original', data)
        //Añadir informacion de minutos
        const data_minutos: any = []

        for (let clave of data) {

          let h = clave['hora'].split(':')
          let hh = h[0]

          for (let index = 0; index <= 59; index++) {
            //console.log(clave.hora,index,typeof(clave.hora))

            let objeto = {
              mes: clave['mes'],
              hora: hh + ':' + index,
              irradiacion: clave['irradiacion'],
              temperatura: clave['temperatura']
            }
            data_minutos.push(objeto)
          }
        }

        console.log('Valores para data minutos: ', data_minutos)

        //Finaliza añadir informacion de minutos

        //Organizar la data para grafico de TODOS los meses
        //Datos para el grafico
        var label_mes = []
        var irradiacion_mes = []


        var mes_selecionado2 = 10
        for (let clave of data_minutos) {
          if (clave.mes == mes_selecionado2) {
            label_mes.push(clave.hora)
            irradiacion_mes.push(clave.irradiacion)
          }


        }

        //Ahora determinamos parametros de Energia a almacena en la bateria

        //Parametros Bateria
        var voltaje = 12
        var amperaje = 50
        var capacidad = voltaje * amperaje //Capacidad de la bateria medida en Wh
        var limite_descarga = 0.4 //Limite de descarga de la bateria en %
        var minimo = capacidad * limite_descarga

        var disponible_para_usar = capacidad - minimo
        var estado = capacidad


        for (let i = 0; i < Potencia_t.length; i++) {
          let energia = Potencia_t[i] - consumo_hora[i]
          //Si se esta enviando energia a la bateria
          if (energia > 0) {
            let total = disponible_para_usar + energia

            if (total > capacidad) {//Si se supera la capacidad de la bateria
              console.log('Se lleno la bateria, No aprovechada:', total - capacidad, 'W')
              disponible_para_usar = capacidad

            } else {
              //Actalizamos la energia disponible para usar
              disponible_para_usar = total
              console.log('Disponible:', disponible_para_usar, 'W')
            }
            //Si se esta sacando energia de la bateria
          } else {
            let total_descarga = disponible_para_usar + energia
            //Si se supera el limite de descarga
            if (total_descarga <= minimo) {
              let maximo_sacado = disponible_para_usar - minimo
              console.log('Se alcanzo capacidad minima de descarga, cortar, faltante:', total_descarga, 'W')
              disponible_para_usar = minimo
            }
            else {
              disponible_para_usar = total_descarga
              console.log('Energia Restante Bateria:', disponible_para_usar, 'W')
            }
          }

        }
        //Finaliza calculos en la bateria


        //Inicia Grafico 1
        var canvas = <HTMLCanvasElement>document.getElementById('myChart')
        var ctx = canvas.getContext('2d')!

        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: label,
            //labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            datasets: [{
              label: 'Irradiación Hora',
              data: sumas,
              borderWidth: 1
            },
            {
              type: 'line',
              label: 'Temperaturas',
              data: temperaturas,
            },
            {
              type: 'line',
              label: 'Energia Producida',
              data: Potencia_t,
            },
            {
              type: 'line',
              label: 'Consumos',
              //data: [19,23,12,12,17,300,370,380,400,300,250,200,150,156,100,96,76,400,500,500,845,892,300,20]
              data: consumo_hora
            }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        //Finaliza grafico 1

        //Inicia Grafico produccion Mensual

        //Inicia Prueba de tiempo Real
        let contador = 0
        while (contador >= data_minutos.length) {
          //label_mes.push(10);
          //irradiacion_mes.push(10)
        }



        //Finaliza prueba de tiempo real



        var canvas = <HTMLCanvasElement>document.getElementById('ChartMensual')
        var ctx = canvas.getContext('2d')!

        var ChartMensual = new Chart(ctx, {
          type: 'line',
          data: {
            labels: label_mes.slice(0, 500),
            datasets: [
              {
                type: 'line',
                label: 'Irradiación Media horaria Mes',
                data: irradiacion_mes.slice(0, 500)
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        //Finaliza grafico de produccion Mensual


        //Inicia Grafico 2 Consumos
        var canvas = <HTMLCanvasElement>document.getElementById('ChartConsumos')
        var ctx = canvas.getContext('2d')!

        var ChartConsumos = new Chart(ctx, {
          type: 'line',
          data: {
            labels: label,
            //labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            datasets: [


              {
                type: 'line',
                label: 'Consumos',
                //data: [19,23,12,12,17,300,370,380,400,300,250,200,150,156,100,96,76,400,500,500,845,892,300,20]
                data: consumo_hora
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        //Finaliza grafico 2







      },
      error => {
        console.log('Error en la consulta de Irradiacion diaria')
      }
    );

  }
  //Finaliza consultar radiacion diaria


  //Inicia Grafico afuera

  /// Finaliza Grafico afuera

  //Inicia traer paneles para la calculadora
  consultar_paneles() {
    this._guestService.consultar_paneles().subscribe(
      response => {
        console.log('Paneles consultados', response.data);
        this.paneles_bd = response.data
      },
      error => {
        console.log('Error en la consulta de paneles solares')
      }
    );
  }

  listar_controladores() {
    this._guestService.listar_controladores().subscribe(
      response => {
        console.log('Controladores consultados', response.data);
        this.controladores_bd = response.data
      },
      error => {
        console.log('Error en la consulta de Controladores')
      }
    );
  }

  listar_baterias() {
    this._guestService.listar_baterias().subscribe(
      response => {
        console.log('Baterias consultados', response.data);
        this.baterias_bd = response.data
        console.log(this.baterias_bd)
      },
      error => {
        console.log('Error en la consulta de Baterias')
      }
    );
  }



  test_buscar_imagen(_id: any) {
    console.log('busqueda de la imagen', _id)
    for (let clave of this.paneles_bd) {
      if (_id == clave['_id']) {
        console.log('clave valor', clave['producto'].portada, clave['potencia']);
        this.portada_panel = clave['producto'].portada
        this.descripcion_panel = clave['producto'].contenido
        this.calcularPaneles(clave['potencia'])
      }
    }
  }

  buscar_imagen_bateria(_id: any) {
    console.log('Buscar imagen bateria', _id)
    for (let clave of this.baterias_bd) {
      if (_id == clave['_id']) {
        console.log('clave valor', clave['producto'].portada, clave['potencia']);
        this.portada_bateria = clave['producto'].portada
        this.descripcion_bateria = clave['producto'].contenido
        this.calcularBaterias(clave['voltaje'], clave['amperaje'])
      }
    }
  }

  //Finaliza traer paneles para la calculadora



  changeOp(op: any) {
    this.op = op;
    console.log('Posicionamiento actual', this.op)
  }



  //Actualizar datos del Grafico

  addData() {
    this.ChartMensual.data.labels?.push(10)
    //this.ChartMensual.data.labels.push(1);
    console.log('añadir datos', this.ChartMensual.data.labels)
    this.ChartMensual.data.datasets.forEach((dataset: any) => {
      dataset.data.push(20);
    });
    console.log('añadir datos', this.ChartMensual.data.datasets)
    this.ChartMensual.update();
  }

  removeData(ChartMensual: any) {
    ChartMensual.data.labels.pop();
    ChartMensual.data.datasets.forEach((dataset: any) => {
      dataset.data.pop();
    });
    ChartMensual.update();
  }


  //Finaliza actualizar datos de grafico


}
