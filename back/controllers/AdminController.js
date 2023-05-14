var Admin = require('../models/Admin');
var Config = require('../models/Config');
var Etiqueta = require('../models/Etiqueta');
var Categoria = require('../models/Categoria');
var Variedad = require('../models/Variedad');
var Inventario = require('../models/Inventario');
var Producto = require('../models/Producto');
var Producto_etiqueta = require('../models/Producto_etiqueta');
var Contacto=require('../models/Contacto')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Venta = require('../models/Venta');
var Dventa = require('../models/Dventa');
var Carrito = require('../models/Carrito');

var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');
const bateria = require('../models/bateria');
const controlador = require('../models/controlador');
const panel_solar = require('../models/panel_solar');
const inversor = require('../models/inversor');
const { response } = require('express');
const https = require("https")



require('dotenv').config();// Para tarer rlas variables de entorno
//Probando con cloudinari
const cloudinary=require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)



const login_admin = async function(req,res){
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({email:data.email});

    if(admin_arr.length == 0){
        res.status(200).send({message: 'El correo electrónico no existe', data: undefined});
    }else{
        //LOGIN
        let user = admin_arr[0];

        bcrypt.compare(data.password, user.password, async function(error,check){
            if(check){
                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'Las credenciales no coinciden', data: undefined}); 
            }
        });
 
    } 
}

const listar_etiquetas_admin = async function(req,res){
    if(req.user){
        var reg = await Etiqueta.find();
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


/*Mi metodo que lista categorias */
const get_categorias = async function(req,res){
    if(req.user){
        var reg = await Categoria.find();
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

/**Finaliza mi metodo que lista categorias */

const eliminar_etiqueta_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        let reg = await Etiqueta.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const agregar_etiqueta_admin = async function(req,res){
    if(req.user){
        try {
            let data = req.body;

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');;
            var reg = await Etiqueta.create(data);
            res.status(200).send({data:reg});
        } catch (error) {
            res.status(200).send({data:undefined,message:'Etiqueta ya existente'});
            
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}
/* Originnal
const registro_producto_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        let productos = await Producto.find({titulo:data.titulo});
        let arr_etiquetas = JSON.parse(data.etiquetas);
        if(productos.length == 0){
            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            data.portada = portada_name;
            let reg = await Producto.create(data);

            if(arr_etiquetas.length >= 1){
                for(var item of arr_etiquetas){
                    await Producto_etiqueta.create({
                        etiqueta: item.etiqueta,
                        producto: reg._id,
                    });
                }
            }

            res.status(200).send({data:reg});
        }else{
            res.status(200).send({data:undefined, message: 'El título del producto ya existe'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}
*/

/*Con cloudinary */
const registro_producto_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        let productos = await Producto.find({titulo:data.titulo});
        let arr_etiquetas = JSON.parse(data.etiquetas);
        if(productos.length == 0){
            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');

            const {secure_url}= await cloudinary.uploader.upload(img_path)

            data.portada = secure_url;
            let reg = await Producto.create(data);
            if(arr_etiquetas.length >= 1){
                for(var item of arr_etiquetas){
                    await Producto_etiqueta.create({
                        etiqueta: item.etiqueta,
                        producto: reg._id,
                    });
                }
            }

            res.status(200).send({data:reg});
        }else{
            res.status(200).send({data:undefined, message: 'El título del producto ya existe'});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}
/**Finaliza con cloudinary */

listar_productos_admin = async function(req,res){
    if(req.user){
        var productos = await Producto.find();
        res.status(200).send({data:productos});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

listar_variedades_productos_admin = async function(req,res){
    if(req.user){
        var productos = await Variedad.find().populate('producto');
        res.status(200).send({data:productos});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const obtener_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            var reg = await Producto.findById({_id:id});
            res.status(200).send({data:reg});
        } catch (error) {
            res.status(200).send({data:undefined});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const listar_etiquetas_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var etiquetas = await Producto_etiqueta.find({producto:id}).populate('etiqueta');
        res.status(200).send({data:etiquetas});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_etiqueta_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        console.log(id);
        let reg = await Producto_etiqueta.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const agregar_etiqueta_producto_admin = async function(req,res){
    if(req.user){
        let data = req.body;

        var reg = await Producto_etiqueta.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_portada = async function(req,res){
    var img = req.params['img'];


    fs.stat('./uploads/productos/'+img, function(err){
        if(!err){
            let path_img = './uploads/productos/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const actualizar_producto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;
        if(req.files){
            //SI HAY IMAGEN
            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];
            
            //Buscar la Imagen anterior 
            modelo = await Producto.findById(id)//Traigo el modelo actual 
            const nombreArr=modelo.portada.split('/')
            const nombre=nombreArr[nombreArr.length-1]
            const [public_id]=nombre.split('.')
            cloudinary.uploader.destroy(public_id) //Elimina la anterior
            //Fin buscar imagen anterior

            const {secure_url}= await cloudinary.uploader.upload(img_path)//Cargo nueva imagen

            let reg = await Producto.findByIdAndUpdate({_id:id},{
                titulo: data.titulo,
                stock: data.stock,
                precio_antes_soles: data.precio_antes_soles,
                precio_antes_dolares: data.precio_antes_dolares,
                precio: data.precio,
                precio_dolar: data.precio_dolar,
                peso: data.peso,
                sku: data.sku,
                categoria: data.categoria,
                visibilidad: data.visibilidad,
                descripcion: data.descripcion,
                contenido:data.contenido,
                //portada: portada_name
                portada: secure_url,
                tipo:data.tipo,
                usar_en_calculadora:data.usar_en_calculadora
            });

            fs.stat('./uploads/productos/'+reg.portada, function(err){
                if(!err){
                    fs.unlink('./uploads/productos/'+reg.portada, (err)=>{
                        if(err) throw err;
                    });
                }
            })

            res.status(200).send({data:reg});
        }else{
            //NO HAY IMAGEN
           let reg = await Producto.findByIdAndUpdate({_id:id},{
               titulo: data.titulo,
               stock: data.stock,
               precio_antes_soles: data.precio_antes_soles,
                precio_antes_dolares: data.precio_antes_dolares,
               precio: data.precio,
               precio_dolar: data.precio_dolar,
                peso: data.peso,
                sku: data.sku,
               categoria: data.categoria,
               visibilidad: data.visibilidad,
               descripcion: data.descripcion,
               contenido:data.contenido,
               tipo:data.tipo,
               usar_en_calculadora:data.usar_en_calculadora
               
           });
           res.status(200).send({data:reg});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const listar_variedades_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        let data = await Variedad.find({producto:id});
        res.status(200).send({data:data});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const actualizar_producto_variedades_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;

        console.log(data.titulo_variedad);
        let reg = await Producto.findByIdAndUpdate({_id:id},{
            titulo_variedad: data.titulo_variedad,
        });
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_variedad_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        let reg = await Variedad.findByIdAndRemove({_id:id});
        res.status(200).send({data:reg});
            
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const agregar_nueva_variedad_admin = async function(req,res){
    if(req.user){
        var data = req.body;

        console.log(data);
        let reg = await Variedad.create(data);

        res.status(200).send({data:reg});
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const listar_inventario_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        var reg = await Inventario.find({producto: id}).populate('variedad').sort({createdAt:-1});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_inventario_producto_admin = async function(req,res){
    if(req.user){
        let data = req.body;

        let reg = await Inventario.create(data);

        //OBTENER EL REGISTRO DE PRODUCTO
        let prod = await Producto.findById({_id:reg.producto});
        let varie = await Variedad.findById({_id:reg.variedad});

        //CALCULAR EL NUEVO STOCK        
        //STOCK ACTUAL         
        //STOCK A AUMENTAR
        let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);

        let nuevo_stock_vari = parseInt(varie.stock) + parseInt(reg.cantidad);

        //ACTUALICACION DEL NUEVO STOCK AL PRODUCTO
        let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
            stock: nuevo_stock
        });

        let variedad = await Variedad.findByIdAndUpdate({_id:reg.variedad},{
            stock: nuevo_stock_vari
        });

        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const agregar_imagen_galeria_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
            let data = req.body;

            var img_path = req.files.imagen.path;
            var name = img_path.split('\\');
            var imagen_name = name[2];

            const {secure_url}= await cloudinary.uploader.upload(img_path)
            console.log('actualizar imagen galeria')
            let reg =await Producto.findByIdAndUpdate({_id:id},{ $push: {galeria:{
                //imagen: imagen_name,
                imagen: secure_url,
                _id: data._id
            }}},{useFindAndModify: false});

            res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_imagen_galeria_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;

        //Buscar la Imagen anterior 
        //NOTA: debo buscarla en la agleria
        modelo = await Producto.findById(id)//Traigo el modelo actual 
        const nombreArr=modelo.portada.split('/')
        const nombre=nombreArr[nombreArr.length-1]
        const [public_id]=nombre.split('.')
        let reg =await cloudinary.uploader.destroy(public_id) //Elimina la anterior
        //Fin buscar imagen anterior
        
    let test =await Producto.findByIdAndUpdate({_id:id},{$pull: {galeria: {_id:data._id}}});
    console.log(reg,public_id,'test',test,data._id)


        //let reg =await Producto.findByIdAndUpdate({_id:id},{$pull: {galeria: {_id:data._id}}});
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const verificar_token = async function(req,res){
    console.log(req.user);
    if(req.user){
        res.status(200).send({data:req.user});
    }else{
        console.log(2);
        res.status(500).send({message: 'NoAccess'});
    } 
}

const cambiar_vs_producto_admin = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var estado = req.params['estado'];

        try {
            if(estado == 'Edicion'){
                await Producto.findByIdAndUpdate({_id:id},{estado:'Publicado'});
                res.status(200).send({data:true});
            }else if(estado == 'Publicado'){
                await Producto.findByIdAndUpdate({_id:id},{estado:Edicion});
                res.status(200).send({data:true});
            }
        } catch (error) {
            res.status(200).send({data:undefined});
        }
        
     }else{
         res.status(500).send({message: 'NoAccess'});
     }
}

const obtener_config_admin = async (req,res)=>{
    let config = await Config.findById({_id:'61abe55d2dce63583086f108'});
    res.status(200).send({data:config});
}

const actualizar_config_admin = async (req,res)=>{
    if(req.user){
        let data = req.body;
        let config = await Config.findByIdAndUpdate({_id:'61abe55d2dce63583086f108'},{
            envio_activacion : data.envio_activacion,
            monto_min_soles: data.monto_min_soles,
            monto_min_dolares : data.monto_min_dolares
        });
        res.status(200).send({data:config});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
    
}

const pedido_compra_cliente = async function(req,res){
    if(req.user){
        try {
            var data = req.body;
            var detalles = data.detalles;
            let access = false;
            let producto_sl = '';

            for(var item of detalles){
                let variedad = await Variedad.findById({_id:item.variedad}).populate('producto');
                if(variedad.stock < item.cantidad){
                    access = true;
                    producto_sl = variedad.producto.titulo;
                }
            }

            if(!access){
                data.estado = 'En espera';
                let venta = await Venta.create(data);
        
                for(var element of detalles){
                    element.venta = venta._id;
                    await Dventa.create(element);
                    await Carrito.remove({cliente:data.cliente});
                }
                enviar_email_pedido_compra(venta._id);
                res.status(200).send({venta:venta});
            }else{
                res.status(200).send({venta:undefined,message:'Stock insuficiente para ' + producto_sl});
            }
        } catch (error) {
            console.log(error);
        }

        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const enviar_email_pedido_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'diegoalonssoac@gmail.com',
                pass: 'dcmplvjviofjojgf'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_pedido.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'diegoalonssoac@gmail.com',
                to: orden.cliente.email,
                subject: 'Gracias por tu orden, Prágol.',
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
} 

const obtener_ventas_admin  = async function(req,res){
    if(req.user){
        let ventas = [];
            let desde = req.params['desde'];
            let hasta = req.params['hasta'];

            ventas = await Venta.find().populate('cliente').populate('direccion').sort({createdAt:-1});
            res.status(200).send({data:ventas});

            
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const obtener_detalles_ordenes_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        try {
            let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente');
            let detalles = await Dventa.find({venta:venta._id}).populate('producto').populate('variedad');
            res.status(200).send({data:venta,detalles:detalles});

        } catch (error) {
            console.log(error);
            res.status(200).send({data:undefined});
        }
        
        
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const marcar_finalizado_orden = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            estado: 'Finalizado'
        });

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const eliminar_orden_admin = async function(req,res){
    if(req.user){

        var id = req.params['id'];

        var venta = await Venta.findOneAndRemove({_id:id});
        await Dventa.remove({venta:id});

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const marcar_envio_orden = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            tracking: data.tracking,
            estado: 'Enviado'
        });

        mail_confirmar_envio(id);

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const confirmar_pago_orden = async function(req,res){
    if(req.user){

        var id = req.params['id'];
        let data = req.body;

        var venta = await Venta.findByIdAndUpdate({_id:id},{
            estado: 'Procesando'
        });

        var detalles = await Dventa.find({venta:id});
        for(var element of detalles){
            let element_producto = await Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = await Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            await Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            await Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });
        }

        res.status(200).send({data:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const mail_confirmar_envio = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'diegoalonssoac@gmail.com',
                pass: 'dcmplvjviofjojgf'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_enviado.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'diegoalonssoac@gmail.com',
                to: orden.cliente.email,
                subject: 'Tu pedido ' + orden._id + ' fué enviado',
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
} 

const registro_compra_manual_cliente = async function(req,res){
    if(req.user){

        var data = req.body;
        var detalles = data.detalles;

        data.estado = 'Procesando';
        
        console.log(data);

        let venta = await Venta.create(data);

        for(var element of detalles){
            element.venta = venta._id;
            element.cliente = venta.cliente;
            await Dventa.create(element);

            let element_producto = await Producto.findById({_id:element.producto});
            let new_stock = element_producto.stock - element.cantidad;
            let new_ventas = element_producto.nventas + 1;

            let element_variedad = await Variedad.findById({_id:element.variedad});
            let new_stock_variedad = element_variedad.stock - element.cantidad;

            await Producto.findByIdAndUpdate({_id: element.producto},{
                stock: new_stock,
                nventas: new_ventas
            });

            await Variedad.findByIdAndUpdate({_id: element.variedad},{
                stock: new_stock_variedad,
            });
        }

        enviar_orden_compra(venta._id);

        res.status(200).send({venta:venta});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const enviar_orden_compra = async function(venta){
    try {
        var readHTMLFile = function(path, callback) {
            fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
    
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'diegoalonssoac@gmail.com',
                pass: 'dcmplvjviofjojgf'
            }
        }));
    
     
        var orden = await Venta.findById({_id:venta}).populate('cliente').populate('direccion');
        var dventa = await Dventa.find({venta:venta}).populate('producto').populate('variedad');
    
    
        readHTMLFile(process.cwd() + '/mails/email_compra.html', (err, html)=>{
                                
            let rest_html = ejs.render(html, {orden: orden, dventa:dventa});
    
            var template = handlebars.compile(rest_html);
            var htmlToSend = template({op:true});
    
            var mailOptions = {
                from: 'diegoalonssoac@gmail.com',
                to: orden.cliente.email,
                subject: 'Confirmación de compra ' + orden._id,
                html: htmlToSend
            };
          
            transporter.sendMail(mailOptions, function(error, info){
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });
        
        });
    } catch (error) {
        console.log(error);
    }
}


/* Inician Mensajes*/


const obtener_mensajes_admin = async function (req, res) {
    if (req.user) {
        let data = req.body
        let reg = await Contacto.find().sort({ createdAt: -1 })
        res.status(200).send({ data: reg })
    } else {
        res.status(500).send({ message: 'No Acces' })
    }
}

const cerrar_mensaje_admin = async function (req, res) {
    if (req.user) {
        let data = req.body
            let id = req.params['id']
            let reg = await Contacto.findByIdAndUpdate({ _id: id }, { estado: 'Cerrado' })
            res.status(200).send({ data: reg })
    } else {
        res.status(500).send({ message: 'No Acces' })
    }
}


/*Finaliza mensajes */


/**Inicia Calculadora Solar */

const registro_producto_calculadora_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        var reg = await bateria.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}


const registro_controlador_calculadora_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        var reg = await controlador.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_panel_calculadora_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        var reg = await panel_solar.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const registro_inversor_calculadora_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        var reg = await inversor.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}





//listar_productos_calculadora_admin
listar_productos_calculadora_admin = async function(req,res){
    console.log('productos a listar en calculadora')
    if(req.user){
        var productos = await Producto.find({"usar_en_calculadora":"Si"});
        res.status(200).send({data:productos});
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}


obtener_producto_calculadora_admin = async function(req,res){
    var id = req.params['id'];
    if(req.user){
        if(req.params.tipo=='controlador'){
            console.log(id)
            try {
                var reg = await controlador.find({producto:id}).populate('producto');
                res.status(200).send({data:reg});
            } catch (error) {
                res.status(200).send({data:undefined});
            }

        }
        
    }else{
        res.status(500).send({message: 'NoAccess'});
    } 
}

const actualizar_controlador_calculadora_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        let data = req.body;
        if(req.files){            
        }else{
            //NO HAY IMAGEN
           let reg = await controlador.findByIdAndUpdate({_id:id},{
               producto: data.producto,
               tipo: data.tipo,
               amperaje: data.amperaje,
               max_potencia_paneles:data.max_potencia_paneles

           });
           res.status(200).send({data:reg});
        }
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}



//Peticiones API
consulta_Pvgis=function(req,res){
    lat=req.params.lat
    lon=req.params.lon
    peakpower=req.params.peakpower
    batterysize=req.params.atterysize
    consumptionday=req.params.consumptionday
    cutoff=req.params.cutoff

    const ruta='https://re.jrc.ec.europa.eu/api/SHScalc?lat='+lat+'&lon='+lon+'&peakpower='+peakpower+'&batterysize='+batterysize+'&consumptionday='+consumptionday+'&cutoff='+cutoff+'&outputformat=json'
const promesa=new Promise((resolve,reject)=>{

    https.get(ruta, res => {
        let data = ""
     
        res.on("data", d => {
          data += d
        })
        res.on("end", () => {
            console.log(data)
         resolve(data)
        })
      })
    })

promesa.then(respuesta=>{
   res.status(200).send({data:JSON.parse(respuesta)})
   //res.status(200).send({data:respuesta})
})
.catch(error=>{
    res.status(500).send({message:'Error al realizar la consulta de eficiencias'})
})
}

//Inicia consulta de HSP
consulta_hsp=function(req,res){
    lat=req.params.lat
    lon=req.params.lon
    angle=req.params.angle
//https://re.jrc.ec.europa.eu/api/MRcalc?lat=45&lon=8&horirrad=1&outputformat=json&startyear=2016
    const ruta='https://re.jrc.ec.europa.eu/api/MRcalc?lat='+lat+'&lon='+lon+'&selectrad=1'+'&angle='+angle+'&outputformat=json&startyear=2015'
    const promesa=new Promise((resolve,reject)=>{
        https.get(ruta, res => {
            let data = ""
            res.on("data", d => {
              data += d
            })
            res.on("end", () => {
                console.log(data)
             resolve(data)
            })
          })
        })
    
    promesa.then(respuesta=>{
       res.status(200).send({data:JSON.parse(respuesta)})
    })
    .catch(error=>{
        res.status(500).send({message:'Error al realizar la consulta de HSP'})
    })
}

/**Finaliza Calculadora Solar */

module.exports = {
    login_admin,
    eliminar_etiqueta_admin,
    listar_etiquetas_admin,
    get_categorias,/**Añadido para listar categorias */
    agregar_etiqueta_admin,
    registro_producto_admin,
    listar_productos_admin,
   
    obtener_producto_admin,
    listar_etiquetas_producto_admin,
    eliminar_etiqueta_producto_admin,
    agregar_etiqueta_producto_admin,
    obtener_portada,
    actualizar_producto_admin,
    listar_variedades_admin,
    actualizar_producto_variedades_admin,
    agregar_nueva_variedad_admin,
    eliminar_variedad_admin,
    listar_inventario_producto_admin,
    registro_inventario_producto_admin,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
    verificar_token,
    cambiar_vs_producto_admin,
    obtener_config_admin,
    actualizar_config_admin,
    pedido_compra_cliente,
    obtener_ventas_admin,
    obtener_detalles_ordenes_cliente,
    marcar_finalizado_orden,
    eliminar_orden_admin,
    marcar_envio_orden,
    confirmar_pago_orden,
    registro_compra_manual_cliente,
    listar_variedades_productos_admin,
    obtener_mensajes_admin,
    cerrar_mensaje_admin,

    /*Calculadora*/
    registro_producto_calculadora_admin,
    registro_controlador_calculadora_admin,
    registro_panel_calculadora_admin,
    registro_inversor_calculadora_admin,

    listar_productos_calculadora_admin,
    obtener_producto_calculadora_admin,
    actualizar_controlador_calculadora_admin,

    consulta_Pvgis,
    consulta_hsp,
}