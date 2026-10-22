//importar los hooks de tanstack query
//useQuery para consultas get
//use mutation para operacion CRUD
//use query client para interactuar con la cache
import {useQuery, useMutation,useQueryClient} from '@tanstack/react-query';
import { carrosService } from '@/api/carros.service';
import { Carro } from '@/types/carro';

//definir una constante key para identificar las query relacionadas con carros como primary Key
const KEY=['carros']

export function useCarros(){
    return useQuery({
        queryKey: KEY,
        queryFn: ()=>{
            console.log('get ejecutado con TanStack')
            return carrosService.getAll()
        },
        //stale time no significa cuando tiempo se guarda en cache sino cuanto tiempo los datos son frescos apra nuestra app, puede varias segun la logica de negocio
        staleTime:1000*60*5//5min miliseg*seg*min
    })
}

//hook personalizado para agreagar carro
//usa use mutation que llama al servicio para añadir
//onsuccess invalida la query de carros que hay actualmente en cache para refrescar auto,aticamente
export function useAgregarCarro(){
    const qc= useQueryClient()
    return useMutation({
        //mutationFn recibe un solo argumento: un objeto con las variables de la mutacion
        mutationFn: ({marca,modelo,color,precio,anio}:{marca:string,modelo:string,color:string,precio:number,anio:number})=>carrosService.add(marca,modelo,color,precio,anio),
        onSuccess:()=>{qc.invalidateQueries({queryKey:KEY})}
    })
}

export function useActualizarCarro(){
    const qc= useQueryClient()
    return useMutation({
        mutationFn: ({marca,modelo,color,precio,anio,id}:{marca:string,modelo:string,color:string,precio:number,anio:number,id:string})=>carrosService.update(marca,modelo,color,precio,anio,id),
        onSuccess:()=>{qc.invalidateQueries({queryKey:KEY})}
    })
}

export function useEliminarCarro(){
    const qc= useQueryClient()
    return useMutation({
        mutationFn: ({id}:{id:string})=>carrosService.delete(id),
        //actualizacion optimista: se modifica la cache inmediatamente antes de la mutacion
        onMutate: async ({id}:{id:string})=>{
            //cancelar refetches en curso para que no sobrescriban la actualizacion optimista
            await qc.cancelQueries({queryKey:KEY})
            //guardar copia del estado anterior para poder rollback en caso de error
            const previousCarros = qc.getQueryData<Carro[]>(KEY)
            //actualizar la cache de forma optimista quitando el carro eliminado
            qc.setQueryData<Carro[]>(KEY, (old = []) => old.filter((carro) => carro.id !== id))
            //retornar el snapshot del estado anterior para usarlo en onError
            return { previousCarros }
        },
        //si la mutacion falla se revierte el cambio optimista en la cache
        onError:(error, variables, context)=>{
            qc.setQueryData<Carro[]>(KEY, context?.previousCarros)
        },
        //si la mutacion termina (exitoso o fallido) se invalida la query para sincronizar con el servidor
        onSettled:()=>{qc.invalidateQueries({queryKey:KEY})}
    })
}