


//cosntructores
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
//Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function(){

    /*
        1= Americano * 1.15
        2= Asiatico * 1.05
        3= Europa * 1.35
    */

    let cantidad;
    const base = 2000;
    
    switch(this.marca){
        case '1':
            cantidad = base * 1.15;
        break;

        case '2':
            cantidad = base * 1.05;
        break;

        case '3':
            cantidad = base * 1.35;
        break;
    }

    //Leer el año
    const diferencia = new Date().getFullYear() - this.year;
    
    //Cada año que la diferencia es mayor, el costo va a reducir un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        Si el seguro es basico se multiplica por un 30% mas
        Si el seguro es Completo se multiplica por un 50% mas
    */

        if(this.tipo === 'basico'){
            cantidad *= 1.30;
        }else{
            cantidad *= 1.50;
        }

        return cantidad;
}




function UI(){}

//llena las opciones de los años
UI.prototype.llenarOpciones = ()=>{
    const max = new Date().getFullYear(),
            min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Muestra validaciones en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo)=>{

    eliminarAlerta();

    const div = document.createElement('DIV');
    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }

    div.classList.add('mt-10');
    div.textContent = mensaje;

    //Insertar en HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(()=>{
        div.remove();
    },3000)
}

function eliminarAlerta(){
    const existe = document.querySelector('.error');
    const correcto = document.querySelector('.correcto');
    if(existe){
        existe.remove();
    }if(correcto){
        correcto.remove();
    }  
}

UI.prototype.mostrarResultado = (tolal,seguro) =>{

    const {marca, year, tipo} = seguro;

    let TextoMarca;
    switch(marca){
        case '1':
            TextoMarca = 'Americano';
        break;

        case '2':
            TextoMarca = 'Asiatico';
        break;

        case '3': 
            TextoMarca = 'Europeo';
        break;

        default:
            break;
    }

    //Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${TextoMarca} </span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year} </span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo} </span></p>
        <p class="font-bold">Total <span class="font-normal">$ ${tolal} </span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    
    //Mostrar el spinner 
    const spinner = document.querySelector('#cargando');
    spinner.style.display= 'block';
    
    setTimeout(()=>{
        spinner.style.display = 'none'; //Se remueve el spinner 
        resultadoDiv.appendChild(div);//Pero se muestra el resultado
    },3000)
};


//instanciar UI

const ui = new UI();




document.addEventListener('DOMContentLoaded', ()=>{
    ui.llenarOpciones();//Llenar el select con los años
});


eventsListenners();
function eventsListenners(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();
    
    //Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    
    //Leer el año seleccionado
    const year = document.querySelector('#year').value;

    //Leer el tipo seleccionado
    const tipo = document.querySelector('input[name="tipo"]:checked').value;


    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligarotorios', 'error');
        return;
    }
        ui.mostrarMensaje('Cotizando...', 'exito');

        //Ocultar las cotizaciones previas
        const resultado = document.querySelector('#resultado div');
        if(resultado != null){
            resultado.remove();
        }

        const seguro = new Seguro(marca, year, tipo);
        const tolal = seguro.cotizarSeguro();
        
        ui.mostrarResultado(tolal, seguro);
}
