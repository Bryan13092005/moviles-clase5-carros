//importar cliente y tipo carro
import { client } from "./client";
import {Carro} from '@/types/carro';

//servicio carrosService, para centralizar las operaciones de la entidad carro retornando una promesa con un arreglo de objetos
//poner metodos async para interactual con la API

export const carrosService={
    getAll: async():Promise<Carro[]>=>{
        const {data}=await client.get<Carro[]>('/patio')
        return data
    },

    add: async(marca:string):Promise<Carro>=>{
        const {data} = await client.post<Carro>('/patio',{marca})
        return data
    }
}