import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import {Carro} from '@/types/carro';
import { carrosService } from "@/api/carros.service";
import { useCarros, useAgregarCarro } from "@/hooks/use-carros";

export default function Explore(){
  //misma query key que index porque comparten la cache con esta vista, pero mientras los datos este frescos

  
  const {data:carros=[]}=useCarros()
  
  return(
    <View style={{flex:1,paddingTop:60,backgroundColor:'#fff'}}>
      <FlatList
      data={carros}
      keyExtractor={item=>item.id}
      renderItem={({item})=>
        <Text>{item.id} - {item.marca}</Text>
      }/>
    </View>
  )
}