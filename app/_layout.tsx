import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { ProductProvider } from '../contexts/ProductContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Início',
              headerStyle: { backgroundColor: '#f4511e' },
              headerTintColor: '#fff',
            }} 
          />
          <Stack.Screen 
            name="screens/home/index" 
            options={{ title: 'Home' }} 
          />
          <Stack.Screen 
            name="screens/login/index" 
            options={{ title: 'Login' }} 
          />
          <Stack.Screen 
            name="screens/products/index" 
            options={{ title: 'Produtos' }} 
          />
          <Stack.Screen 
            name="screens/products/[id]" 
            options={{ title: 'Detalhes do Produto' }} 
          />
          <Stack.Screen 
            name="screens/admin/index" 
            options={{ title: 'Administração' }} 
          />
          <Stack.Screen 
            name="screens/admin/users" 
            options={{ title: 'Gerenciar Usuários' }} 
          />
          <Stack.Screen 
            name="screens/admin/products" 
            options={{ title: 'Gerenciar Produtos' }} 
          />
        </Stack>
      </ProductProvider>
    </AuthProvider>
  );
}