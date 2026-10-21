//tab de expo router define la navegación de tipo stack
//importamos queryClient y QueryClientProvider para configurar y proveer el cliente de queries en toda ña app
import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//instancia de query client apara administrar la cache y ciclo de vida de query/mutations

const qc=new QueryClient()

//componente para envolver la navegación dentro del queryclient provider, con esto todos los componente hijos pueden usar use query y use mutation, es el punto de integvracion ente TanStack Query y la navegación de expo

export default function Layout(){
  return(
    //proveedor y cliente como prop
    <QueryClientProvider client={qc}>
      <Tabs>
        <Tabs.Screen name="index" options={{title:'HOME'}} />
        <Tabs.Screen name="explore" options={{title:'EXPLORE'}}/>
      </Tabs>
    </QueryClientProvider>
  )
}