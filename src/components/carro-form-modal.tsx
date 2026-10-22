import { useActualizarCarro, useAgregarCarro } from "@/hooks/use-carros";
import type { Carro } from "@/types/carro";
import { useForm } from "@tanstack/react-form";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// Solo letras (con tildes/ñ), números y espacios: sin caracteres especiales
const TEXTO_VALIDO=/^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ ]+$/
// Año máximo permitido: el siguiente al actual (modelos del año próximo)
const ANIO_MAX=new Date().getFullYear()+1

// Validador para marca, modelo y color: obligatorio y sin caracteres especiales
const validarTexto=(nombre:string)=>({value}:{value:string})=>{
  const v=value.trim()
  if(!v) return `${nombre} es obligatorio`
  if(!TEXTO_VALIDO.test(v)) return `${nombre} solo admite letras y números, sin caracteres especiales`
  return undefined
}
// Validador del año: obligatorio, entero y en el rango (2000, ANIO_MAX]
const validarAnio=({value}:{value:string})=>{
  if(!value.trim()) return 'El año es obligatorio'
  if(!/^\d+$/.test(value.trim())) return 'El año debe ser un número entero'
  const n=Number(value)
  if(n<=2000||n>ANIO_MAX) return `El año debe ser mayor a 2000 y menor o igual a ${ANIO_MAX}`
  return undefined
}
// Validador del precio: obligatorio, numérico y mayor a 5000
const validarPrecio=({value}:{value:string})=>{
  if(!value.trim()) return 'El precio es obligatorio'
  const n=Number(value)
  if(Number.isNaN(n)) return 'El precio debe ser un número'
  if(n<=5000) return 'El precio debe ser mayor a 5000'
  return undefined
}

type Props={
  visible:boolean
  // Carro a editar; null significa modo "agregar"
  carro:Carro|null
  onClose:()=>void
  // Se llama con un mensaje cuando el guardado fue exitoso
  onSuccess:(mensaje:string)=>void
}

// Modal con el formulario de agregar/editar carro
export default function CarroFormModal({visible,carro,onClose,onSuccess}:Props){
  return(
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* El formulario se monta solo al abrir, así siempre inicia con valores frescos */}
          {visible&&<Formulario carro={carro} onClose={onClose} onSuccess={onSuccess}/>}
        </View>
      </View>
    </Modal>
  )
}

function Formulario({carro,onClose,onSuccess}:{carro:Carro|null,onClose:()=>void,onSuccess:(mensaje:string)=>void}){
  const agregar=useAgregarCarro()
  const actualizar=useActualizarCarro()
  const {mutateAsync:agregarCarro}=agregar
  const {mutateAsync:actualizarCarro}=actualizar
  const mutacion=carro?actualizar:agregar
  const guardando=mutacion.isPending

  // Los campos numéricos se manejan como texto y se convierten al enviar
  const form=useForm({
    defaultValues:{
      marca:carro?.marca??'',
      modelo:carro?.modelo??'',
      color:carro?.color??'',
      anio:carro?String(carro.anio):'',
      precio:carro?String(carro.precio):'',
    },
    onSubmit:async ({value})=>{
      const datos={
        marca:value.marca.trim(),
        modelo:value.modelo.trim(),
        color:value.color.trim(),
        anio:Number(value.anio),
        precio:Number(value.precio),
      }
      try{
        if(carro) await actualizarCarro({...datos,id:carro.id})
        else await agregarCarro(datos)
        onSuccess(carro?'Carro actualizado correctamente':'Carro agregado correctamente')
        onClose()
      }catch{
        // El error se muestra con mutacion.isError
      }
    },
  })

  // Renderiza un campo con label, input y mensaje de error debajo
  const campo=(name:'marca'|'modelo'|'color'|'anio'|'precio',label:string,placeholder:string,validator:({value}:{value:string})=>string|undefined,keyboardType?:'numeric')=>(
    <form.Field
      name={name}
      // onMount valida al inicio para que el botón nazca deshabilitado
      validators={{onMount:validator,onChange:validator,onBlur:validator}}
    >
      {(field)=>{
        // El error se muestra solo tras tocar el campo o intentar enviar
        const mostrar=(field.state.meta.isTouched||form.state.submissionAttempts>0)&&field.state.meta.errors.length>0
        return(
          <View style={styles.campo}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              keyboardType={keyboardType}
              style={[styles.input,mostrar&&styles.inputError]}
              placeholder={placeholder}
              placeholderTextColor="#6B7280"
            />
            {mostrar&&<Text style={styles.error}>{String(field.state.meta.errors[0])}</Text>}
          </View>
        )
      }}
    </form.Field>
  )

  return(
    <>
      <Text style={styles.titulo}>{carro?'Editar carro':'Agregar carro'}</Text>
      {campo('marca','Marca','Ingrese una marca',validarTexto('La marca'))}
      {campo('modelo','Modelo','Ingrese un modelo',validarTexto('El modelo'))}
      {campo('color','Color','Ingrese un color',validarTexto('El color'))}
      {campo('anio','Año','Ingrese el año del carro',validarAnio,'numeric')}
      {campo('precio','Precio','Ingrese el precio',validarPrecio,'numeric')}

      {mutacion.isError&&(
        <Text style={styles.error}>No se pudo guardar el carro: {mutacion.error.message}</Text>
      )}

      <View style={styles.acciones}>
        <Pressable style={[styles.boton,styles.botonSecundario,guardando&&styles.botonDeshabilitado]} disabled={guardando} onPress={onClose}>
          <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
        </Pressable>
        {/* Botón deshabilitado si el formulario es inválido o se está enviando */}
        <form.Subscribe selector={(s)=>[s.canSubmit,s.isSubmitting] as const}>
          {([canSubmit,isSubmitting])=>{
            const enviando=isSubmitting||guardando
            const deshabilitado=!canSubmit||enviando
            return(
              <Pressable
                style={[styles.boton,deshabilitado&&styles.botonDeshabilitado]}
                disabled={deshabilitado}
                onPress={()=>form.handleSubmit()}
              >
                {enviando&&<ActivityIndicator color="#FFFFFF" size="small"/>}
                <Text style={styles.botonTexto}>
                  {enviando?' Guardando...':carro?'Actualizar':'Guardar'}
                </Text>
              </Pressable>
            )
          }}
        </form.Subscribe>
      </View>
    </>
  )
}

const styles=StyleSheet.create({
  overlay:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(0,0,0,0.4)'},
  sheet:{backgroundColor:'#FFFFFF',borderTopLeftRadius:20,borderTopRightRadius:20,padding:20},
  titulo:{fontSize:18,fontWeight:'700',color:'#1F2937',marginBottom:12},
  campo:{marginBottom:10},
  label:{fontSize:12,fontWeight:'600',color:'#1E3A8A',marginBottom:4},
  input:{borderWidth:1,borderColor:'#E5E7EB',borderRadius:8,paddingHorizontal:12,paddingVertical:8,color:'#1F2937',backgroundColor:'#F8F9FA'},
  inputError:{borderColor:'#E52E2E'},
  error:{color:'#E52E2E',fontSize:12,marginTop:2},
  acciones:{flexDirection:'row',justifyContent:'flex-end',gap:8,marginTop:8},
  boton:{flexDirection:'row',backgroundColor:'#E52E2E',paddingVertical:10,paddingHorizontal:20,borderRadius:9999,alignItems:'center',justifyContent:'center'},
  botonDeshabilitado:{opacity:0.4},
  botonTexto:{fontSize:14,fontWeight:'700',color:'#FFFFFF'},
  botonSecundario:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E5E7EB'},
  botonSecundarioTexto:{fontSize:14,fontWeight:'700',color:'#6B7280'},
})
