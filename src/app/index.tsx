import { useState } from "react";
import { View, Text, TextInput, FlatList, Button,Alert } from "react-native";
import {Carro} from '@/types/carro'
import { carrosService } from "@/api/carros.service";
import { useCarros, useAgregarCarro } from "@/hooks/use-carros";

export default function App(){
  const [marca,setMarca]=useState('')

  //GET DE TanStack Query para manejar carga de cache y estados
  const {data:carros=[],isLoading,error}=useCarros()

  //POST  se invalida carros de la cache

  const {mutate:agregarCarro}=useAgregarCarro()

  //agregar nuevo carro
  const agregar=async ()=>{
    if(marca===''||marca===null){
      Alert.alert('ERROR','ingrese una marca')
      return
    }
    //agregar y limpiar
    agregarCarro(marca,{onSuccess:()=>{setMarca('')}})
  }

  //isloading (es true durante la primera carga cuando no hay datos, por ello mostramosun texto en lugar de la pantalla con la lista vacia)

  if(isLoading) return <Text> Cargando ...</Text>

  if(error) return <Text>Error: {error?.message}</Text>

  //si get fallo (sin red, servidor caido, etc) error trae la excepcion y no seguimos al return principal
  return(
    <View style={{flex:1,paddingTop:60,backgroundColor:'#fff'}}>
      <TextInput
      value={marca} onChangeText={setMarca} style={{borderWidth:3}} placeholder="Ingrese una marca"
      />
      <Button title='Agregar' onPress={agregar}/>

      <FlatList
      data={carros}
      keyExtractor={item=>item.id}
      renderItem={
        ({item})=><Text>{item.id} - {item.marca}</Text>
      }
      />
    </View>
  )
}