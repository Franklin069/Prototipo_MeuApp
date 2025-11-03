import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';

export default function AdminHome() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👑 Painel Administrativo</Text>
      <Text style={styles.subtitle}>Bem-vindo, {user?.name}!</Text>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.adminButton} 
          onPress={() => router.push('/screens/admin/users')}
        >
          <Text style={styles.buttonText}>👥 Gerenciar Usuários</Text>
        </Pressable>

        <Pressable 
          style={styles.adminButton} 
          onPress={() => router.push('/screens/admin/products')}
        >
          <Text style={styles.buttonText}>📦 Gerenciar Produtos</Text>
        </Pressable>

        <Pressable 
          style={styles.regularButton} 
          onPress={() => router.push('/screens/home')}
        >
          <Text style={styles.buttonText}>🏠 Ir para Home</Text>
        </Pressable>

        <Pressable 
          style={styles.regularButton} 
          onPress={() => router.push('/screens/products')}
        >
          <Text style={styles.buttonText}>🛍️ Ver Produtos</Text>
        </Pressable>

        <Pressable 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>🚪 Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  adminButton: {
    backgroundColor: '#ff6b35',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  regularButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});