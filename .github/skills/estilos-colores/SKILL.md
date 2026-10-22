---
name: estilos-colores
description: Úsala siempre que crees o modifiques colores, estilos o pantallas de la aplicación.
---
# Skill: estilo-colores

Documento de especificación de estilos visuales, paleta de colores, tipografía, botones y componentes React Native / Web basados en la identidad visual de la plataforma.

---

## 1. Paleta de Colores

### Colores Principales
* **Primario / Brand Red:** `#E52E2E` (Rojo vibrante representativo de la marca y botones de acción principal)
* **Secundario / Teal:** `#008B8B` (Turquesa/Verde azulado usado en iconos e interacciones alternativas)
* **Acento / Accent Dark:** `#1E3A8A` (Azul oscuro profundo para etiquetas de categoría o textos secundarios con peso)

### Neutrales y Superficie
* **Fondo / Background Light:** `#F8F9FA` / `#FFFFFF`
* **Superficie / Card Background:** `#FFFFFF`
* **Texto Principal:** `#1F2937` (Gris oscuro de alta legibilidad)
* **Texto Secundario / Muted:** `#6B7280` (Gris medio para detalles como tiempo de lectura o fechas)
* **Borde / Separadores:** `#E5E7EB`

---

## 2. Tipografía

* **Fuente:** Sans-Serif moderna (Inter, System Default, Robuto o SF Pro).

### Escala de Tamaños
* **Category Label:** `fontSize: 12`, `fontWeight: '600'`, `color: '#1E3A8A'`
* **Card Title:** `fontSize: 16`, `fontWeight: '700'`, `lineHeight: 22`, `color: '#1F2937'`
* **Metadata / Footer:** `fontSize: 12`, `fontWeight: '400'`, `color: '#6B7280'`
* **Button Text:** `fontSize: 14`, `fontWeight: '700'`, `color: '#FFFFFF'`

---

## 3. Botones (Pill / Capsule Style)

Los botones principales utilizan forma de píldora totalmente redondeada (`borderRadius: 9999` o `height / 2`).

### Estilo del Botón Principal
```javascript
const primaryButton = {
  backgroundColor: '#E52E2E',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 9999,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
};
```

---

## 4. Tarjetas para FlatList (Cards)

Las tarjetas de noticias o productos consisten en un contenedor blanco con esquinas redondeadas, sombra tenue y división vertical entre la imagen superior y la información textual inferior.

### Especificación Estructural
* **Border Radius Contenedor:** `12px`
* **Border Radius Imagen:** `12px` (únicamente en esquinas superiores `borderTopLeftRadius` y `borderTopRightRadius`)
* **Aspect Ratio Imagen:** `16:9` o `3:2`
* **Shadow:** Sombra sutil con dispersión baja (`elevation: 3` en Android / `shadowOpacity: 0.08` en iOS).

### Ejemplo de Estilo en React Native / StyleSheet

```javascript
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    width: 280, // Ajustable según diseño horizontal o grid
    marginRight: 16,
    marginBottom: 16,
    // Sombras
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
});
```

---

## 5. Integración con FlatList

```jsx
import React from 'react';
import { FlatList, View, Text, Image, TouchableOpacity } from 'react-native';

const renderItem = ({ item }) => (
  <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
    <View style={styles.cardImageWrapper}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardCategory}>{item.category}</Text>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardFooter}>{item.readTime}</Text>
    </View>
  </TouchableOpacity>
);

export const NewsList = ({ data }) => (
  <FlatList
    data={data}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id}
    renderItem={renderItem}
    contentContainerStyle={{ paddingHorizontal: 16 }}
  />
);
```