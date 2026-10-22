import CarroFormModal from "@/components/carro-form-modal";
import { useCarros, useEliminarCarro } from "@/hooks/use-carros";
import type { Carro } from "@/types/carro";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function App(){
  // Controla el modal del formulario y el carro en edición (null = agregar)
  const [modalVisible,setModalVisible]=useState(false)
  const [carroEditando,setCarroEditando]=useState<Carro|null>(null)

  //GET DE TanStack Query para manejar carga de cache y estados
  const {data:carros=[],isLoading,error}=useCarros()
  const {mutate:eliminarCarro,isPending:eliminando,isError:errorEliminar,variables:eliminandoVars}=useEliminarCarro()
  const [mensajeExito,setMensajeExito]=useState<string|null>(null)

  const eliminar=(id:string)=>{
    setMensajeExito(null)
    eliminarCarro({id},{onSuccess:()=>setMensajeExito('Carro eliminado correctamente')})
  }

  const abrirAgregar=()=>{
    setCarroEditando(null)
    setModalVisible(true)
  }

  const abrirEditar=(carro:Carro)=>{
    setCarroEditando(carro)
    setModalVisible(true)
  }

  if(isLoading) return <Text> Cargando ...</Text>

  if(error) return <Text>Error: {error?.message}</Text>

  return(
    <View style={styles.container}>
      <Text style={styles.titulo}>
        <Text style={styles.tituloPatio}>PATIO</Text>
        <Text style={styles.tituloTuerca}>TUERCA</Text>
      </Text>
      <Pressable style={styles.botonPrimario} onPress={abrirAgregar}>
        <Text style={styles.botonTexto}>Agregar</Text>
      </Pressable>

      {errorEliminar&&<Text style={styles.mensajeError}>No se pudo eliminar el carro</Text>}
      {!errorEliminar&&mensajeExito&&<Text style={styles.mensajeExito}>{mensajeExito}</Text>}

      <FlatList
        data={carros}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.marca} {item.modelo}</Text>
            <Text style={styles.cardText}>ID: {item.id}</Text>
            <Text style={styles.cardText}>Color: {item.color}</Text>
            <Text style={styles.cardText}>Año: {item.anio}</Text>
            <Text style={styles.cardPrice}>${item.precio}</Text>
            <View style={styles.cardAcciones}>
              <Pressable
                style={[styles.botonPrimario,styles.botonSecundario,eliminando&&{opacity:0.5}]}
                disabled={eliminando}
                onPress={()=>eliminar(item.id)}
              >
                {eliminando&&eliminandoVars?.id===item.id
                  ?<ActivityIndicator size="small" color="#008B8B"/>
                  :<Text style={styles.botonSecundarioTexto}>Eliminar</Text>}
              </Pressable>
              <Pressable style={styles.botonPrimario} onPress={()=>abrirEditar(item)}>
                <Text style={styles.botonTexto}>Editar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Modal con el formulario (componente aparte) */}
      <CarroFormModal
        visible={modalVisible}
        carro={carroEditando}
        onClose={()=>setModalVisible(false)}
        onSuccess={setMensajeExito}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#FDE8EC' },
  botonPrimario: {
    backgroundColor: '#E52E2E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  titulo: { fontSize: 32, fontWeight: '900', letterSpacing: 1, marginHorizontal: 16, marginBottom: 12,justifyContent: 'center', alignItems: 'center' },
  tituloPatio: { color: '#E52E2E' },
  tituloTuerca: { color: '#008B8B' },
  botonTexto: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  botonSecundario: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#008B8B', marginHorizontal: 0 },
  botonSecundarioTexto: { fontSize: 14, fontWeight: '700', color: '#008B8B' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#E52E2E',
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  cardText: { fontSize: 12, fontWeight: '400', color: '#6B7280', marginBottom: 2 },
  cardPrice: { fontSize: 16, fontWeight: '700', color: '#1E3A8A', marginTop: 6 },
  mensajeExito: { color: '#047857', fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  mensajeError: { color: '#E52E2E', fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  cardAcciones: { flexDirection: 'row', gap: 8, marginTop: 10 },
})
