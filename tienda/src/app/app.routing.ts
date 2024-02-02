import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";
import { CuentaComponent } from "./components/perfil/cuenta/cuenta.component";
import { DireccionesComponent } from "./components/perfil/direcciones/direcciones.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { ShowProductoComponent } from "./components/productos/show-producto/show-producto.component";
import { PedidosComponent } from "./components/perfil/pedidos/pedidos.component";
import { DpedidosComponent } from "./components/perfil/dpedidos/dpedidos.component";
import { VerifyPagoComponent } from "./components/verify-pago/verify-pago.component";
import { ReviewsComponent } from "./components/perfil/reviews/reviews.component";
//import { EmbajadorasComponent } from "./components/static/embajadoras/embajadoras.component";
import { EmpresaComponent } from "./components/static/empresa/empresa.component";
import { ImpactoComponent } from "./components/static/impacto/impacto.component";
import { NosotrosComponent } from "./components/static/nosotros/nosotros.component";
import { PoliticasEnvioComponent } from "./components/static/politicas-envio/politicas-envio.component";
import { TerminosCondicionesComponent } from "./components/static/terminos-condiciones/terminos-condiciones.component";
import { ContactoComponent } from "./components/static/contacto/contacto.component";
import { NotfoundComponent } from "./components/notfound/notfound.component";
import { AuthGuard } from "../app/guards/auth.guard";
import { CalculadoraComponent } from "./components/calculadora/calculadora.component";
import { BlogComponent } from "./components/blog/blog.component";
import { NewCalculoComponent } from "./components/calculadora/new-calculo/new-calculo.component";

const appRoute : Routes = [
    {path: '', component: InicioComponent},
    {path: 'login', component: LoginComponent},

    {path: 'cuenta/perfil', component: CuentaComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/direcciones', component: DireccionesComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/pedidos', component: PedidosComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/pedidos/:id', component: DpedidosComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/reviews', component: ReviewsComponent, canActivate:[AuthGuard]},

    {path: 'verificar-pago/:tipo/:direccion/:cupon/:envio/:tipo_descuento/:valor_descuento/:total_pagar/:subtotal', component: VerifyPagoComponent},

    {path: 'productos', component: IndexProductoComponent},
    {path: 'productos/categoria/:categoria', component: IndexProductoComponent},
    {path: 'productos/:slug', component: ShowProductoComponent},

    {path: 'contacto', component: ContactoComponent},
    //{path: 'embajadoras', component: EmbajadorasComponent},
    {path: 'empresa', component:EmpresaComponent},
    {path: 'impacto-social', component: ImpactoComponent},
    {path: 'nosotros', component: NosotrosComponent},
    {path: 'politicas-envio', component: PoliticasEnvioComponent},
    {path: 'terminos-condiciones', component: TerminosCondicionesComponent},

    //Calculadora Solar
    {path: 'calculadora', component: CalculadoraComponent},
    {path: 'new-calculo', component: NewCalculoComponent},

    //Blog
    {path: 'blog', component: BlogComponent},
    {path: '**', component: NotfoundComponent}


]

export const appRoutingPorviders : any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute, { onSameUrlNavigation: 'reload' });