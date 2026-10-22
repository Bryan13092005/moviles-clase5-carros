import { useAgregarCarro, useCarros, useEliminarCarro, useActualizarCarro } from "@/hooks/use-carros";
import { useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function App(){
  const [marca,setMarca]=useState('')
  const [modelo,setModelo]=useState('')
  const [color,setColor]=useState('')
  const [anio,setAnio]=useState(0)
  const [precio,setPrecio]=useState(0.00)
  const [labelBotonAgregar,setLabelBotonAgregar]=useState('Agregar')
  const [idActual,setIdActual]=useState('')



  //GET DE TanStack Query para manejar carga de cache y estados
  const {data:carros=[],isLoading,error}=useCarros()

  //POST  se invalida carros de la cache

  const {mutate:agregarCarro}=useAgregarCarro()
  const {mutate:eliminarCarro}=useEliminarCarro()
  const {mutate:actualizarCarro}=useActualizarCarro()

  const seteoValores=()=>{
    setAnio(2000)
    setColor('')
    setMarca('')
    setPrecio(5000.00)
    setModelo('')
    setIdActual('')
  }
  //agregar nuevo carro
  const agregar=async ()=>{
    if(marca===''||marca===null){
      Alert.alert('ERROR','ingrese una marca')
      return
    }
    
    if(modelo===''||modelo===null){
      Alert.alert('ERROR','ingrese un modelo')
      return
    }
    
    if(anio<2000||marca===null){
      Alert.alert('ERROR','ingrese un año valido')
      return
    }
    
    if(precio<5000||marca===null){
      Alert.alert('ERROR','ingrese un precio valido (mayor a 5000)')
      return
    }
    
    if(color===''||marca===null){
      Alert.alert('ERROR','ingrese un color')
      return
    }
    //agregar y limpiar
    agregarCarro({marca,modelo,color,precio,anio},{onSuccess:()=>{seteoValores()}})


  }

  const editar=async (idActual:string)=>{
    if(marca===''||marca===null){
      Alert.alert('ERROR','ingrese una marca')
      return
    }
    
    if(modelo===''||modelo===null){
      Alert.alert('ERROR','ingrese un modelo')
      return
    }
    
    if(anio<2000||marca===null){
      Alert.alert('ERROR','ingrese un año valido')
      return
    }
    
    if(precio<5000||marca===null){
      Alert.alert('ERROR','ingrese un precio valido (mayor a 5000)')
      return
    }
    
    if(color===''||marca===null){
      Alert.alert('ERROR','ingrese un color')
      return
    }

    actualizarCarro({marca,modelo,color,precio,anio,id:idActual},{onSuccess:()=>{seteoValores(); setLabelBotonAgregar('Agregar')}})
  }

  const rellenarValores=(item:{marca:string,modelo:string,color:string,precio:number,anio:number})=>{
    setMarca(item.marca)
    setModelo(item.modelo)
    setColor(item.color)
    setPrecio(item.precio)
    setAnio(item.anio)
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
      <TextInput
      value={modelo} onChangeText={setModelo} style={{borderWidth:3}} placeholder="Ingrese un modelo"
      />
      <TextInput
      value={color} onChangeText={setColor} style={{borderWidth:3}} placeholder="Ingrese un color"
      />
      <TextInput
      value={anio ? anio.toString() : ''} onChangeText={(text)=>setAnio(Number(text)||0)} style={{borderWidth:3}} placeholder="Ingrese el año del carro"
      />
      <TextInput
      value={precio ? precio.toString():''} onChangeText={(text)=>setPrecio(Number(text)||0)} style={{borderWidth:3}} placeholder="Ingrese el precio"
      />
      <Button title={labelBotonAgregar} onPress={labelBotonAgregar==='Agregar'?agregar:()=>editar(idActual)}/>

      <FlatList
      data={carros}
      keyExtractor={item=>item.id}
      renderItem={
        ({item})=>(
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.marca} {item.modelo}</Text>
            <Text style={styles.cardText}>ID: {item.id}</Text>
            <Text style={styles.cardText}>Color: {item.color}</Text>
            <Text style={styles.cardText}>Año: {item.anio}</Text>
            <Text style={styles.cardPrice}>${item.precio}</Text>
            <Button title='Eliminar' onPress={()=>{
              seteoValores()
              eliminarCarro({id:item.id})}}/>
            <Button title='Editar' onPress={()=>{
              rellenarValores(item)
              setLabelBotonAgregar('Actualizar Valores')
              setIdActual(item.id)
            }}/> 
          </View>
        )
      }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 6,
  },
})