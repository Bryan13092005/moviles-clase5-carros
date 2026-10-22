//importar los hooks de tanstack query
//useQuery para consultas get
//use mutation para operacion CRUD
//use query client para interactuar con la cache
import {useQuery, useMutation,useQueryClient} from '@tanstack/react-query';
import { carrosService } from '@/api/carros.service';

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
        onSuccess:()=>{qc.invalidateQueries({queryKey:KEY})}
    })
}