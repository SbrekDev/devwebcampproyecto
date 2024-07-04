(function(){

    const horas = document.querySelector('#horas');


    if(horas){

        const categoria = document.querySelector('[name="categoria_id"]');
        const dias =document.querySelectorAll('[name="dia"]');
        const inputHiddenDia =document.querySelector('[name="dia_id"]');
        const inputHiddenHora =document.querySelector('[name="hora_id"]');
        const horaSeleccionada = document.querySelector(`[data-hora-id="${inputHiddenHora.value}"]`);

        if(horaSeleccionada) {
            horaSeleccionada.onclick = seleccionarHora
        }

        categoria.addEventListener('change', terminoBusqueda);
        dias.forEach(dia => dia.addEventListener('change', terminoBusqueda));

        const busquedaActual = {
            categoria: +categoria.value,
            dia: +inputHiddenDia.value
        }

        let busqueda = {
            categoria_id: +categoria.value || '',
            dia: +inputHiddenDia.value || ''
        }
        

        if(!Object.values(busqueda).includes('')){

            async function iniciarApp() {
                await buscarEventos();
                // resaltar la hora actual
    
                const id = inputHiddenHora.value;
    
                const horaSeleccionada = document.querySelector(`[data-hora-id="${id}"]`);
    
                horaSeleccionada.classList.remove('horas__hora--deshabilitada');
                horaSeleccionada.classList.add('horas__hora--seleccionada');

                horaSeleccionada.onclick = seleccionarHora;
            }

            iniciarApp();


        }



        function terminoBusqueda(e){
            busqueda[e.target.name] = e.target.value;

            // reiniciar los campos ocltos y el campo de horas
            inputHiddenHora.value = '';
            inputHiddenDia.value = '';

            // deshabilitar la hora previa
            const horaPrevia = document.querySelector('.horas__hora--seleccionada');
            if(horaPrevia){
                horaPrevia.classList.remove('horas__hora--seleccionada');
            }

            if(Object.values(busqueda).includes('')){
                return;
            }

            if(busquedaActual.categoria === busqueda.categoria_id && busquedaActual.dia === parseInt(busqueda.dia)) {
                (async () => {
                    await buscarEventos()
                    horaSeleccionada.classList.remove('horas__hora--deshabilitada')
                    horaSeleccionada.classList.add('horas__hora--seleccionada')
                })()
            } else {
                buscarEventos()
            }
        }

        async function buscarEventos(){
            const { dia, categoria_id } = busqueda;
            const url = `/api/eventos-horario?dia_id=${dia}&categoria_id=${categoria_id}`;
            
            const resultado = await fetch(url);
            const eventos = await resultado.json();
            obtenerHorasDisponibles(eventos);
        }

        function obtenerHorasDisponibles(eventos){

            // reiniciar las horas

            const listadoHoras = document.querySelectorAll('#horas li');
            listadoHoras.forEach(li => li.classList.add('horas__hora--deshabilitada'));


            // comprobar eventos ya tomados y quitar la variable deshabilitado
            const horasTomadas = eventos.map( evento => evento.hora_id);

            const listadoHorasArray = Array.from(listadoHoras);

            const resultado = listadoHorasArray.filter( li => !horasTomadas.includes(li.dataset.horaId));
            resultado.forEach( li => li.classList.remove('horas__hora--deshabilitada'))




            const horasDisponibles = document.querySelectorAll('#horas li:not(.horas__hora--deshabilitada)');
            horasDisponibles.forEach( hora => hora.addEventListener('click', seleccionarHora))
            const horasDeshabilitadas = document.querySelectorAll('.horas__hora--deshabilitada');
            horasDeshabilitadas.forEach(hora => hora.removeEventListener('click', seleccionarHora));
        }

        function seleccionarHora(e){

            // deshabilitar la hora previa
            const horaPrevia = document.querySelector('.horas__hora--seleccionada');
            if(horaPrevia){
                horaPrevia.classList.remove('horas__hora--seleccionada');
            }

            // agreagr clse de seleccionado
            e.target.classList.add('horas__hora--seleccionada');

            inputHiddenHora.value = e.target.dataset.horaId;

            // llenar el campo oculto dia
            inputHiddenDia.value = document.querySelector('[name="dia"]:checked').value;
        }
    }

})();