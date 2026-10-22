import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useCarros } from "@/hooks/use-carros";

export default function Explore(){
  //misma query key que index porque comparten la cache con esta vista, pero mientras los datos este frescos
  const {data:carros=[]}=useCarros()
  const [ordenPrecio, setOrdenPrecio] = useState<"asc" | "desc">("asc")
  const carrosOrdenados = [...carros].sort((a, b) =>
    ordenPrecio === "asc" ? a.precio - b.precio : b.precio - a.precio
  )

  return(
    <View style={styles.container}>
      <Text style={styles.titulo}>
        <Text style={styles.tituloPatio}>PATIO </Text>
        <Text style={styles.tituloTuerca}>TUERCA</Text>
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ordenar precio: de ${ordenPrecio === "asc" ? "menor a mayor" : "mayor a menor"}`}
        accessibilityHint="Toca para cambiar el orden de los precios"
        onPress={() => setOrdenPrecio(orden => orden === "asc" ? "desc" : "asc")}
        style={styles.sortButton}
      >
        <Text style={styles.sortButtonText}>
          Precio: {ordenPrecio === "asc" ? "menor a mayor ↑" : "mayor a menor ↓"}
        </Text>
      </Pressable>
      <FlatList
        data={carrosOrdenados}
        keyExtractor={item=>item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({item})=>(
          <View style={styles.card}>
            <Text style={styles.cardCategory}>{item.anio} · {item.color}</Text>
            <Text style={styles.cardTitle}>{item.marca} {item.modelo}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardId}>ID: {item.id}</Text>
              <Text style={styles.cardPrice}>${item.precio}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#FDE8EC' },
  titulo: { fontSize: 32, fontWeight: '900', letterSpacing: 1, marginHorizontal: 16, marginBottom: 12 },
  tituloPatio: { color: '#E52E2E' },
  tituloTuerca: { color: '#008B8B' },
  sortButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 9999,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sortButtonText: { color: '#1F2937', fontSize: 14, fontWeight: '700' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#008B8B',
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCategory: { fontSize: 12, fontWeight: '600', color: '#1E3A8A', marginBottom: 6 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', lineHeight: 22, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardId: { fontSize: 12, color: '#6B7280' },
  cardPrice: { fontSize: 16, fontWeight: '700', color: '#E52E2E' },
})