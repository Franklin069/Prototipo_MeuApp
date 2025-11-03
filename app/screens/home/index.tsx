import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';

export default function Home() {
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Home!</Text>
      {user && (
        <Text style={styles.subtitle}>Olá, {user.name}!</Text>
      )}
      
      <Pressable 
        style={styles.button} 
        onPress={() => { 
          router.push('/screens/products'); 
        }}
      >
        <Text style={styles.buttonText}>Ver Produtos</Text>
      </Pressable>

      {isAdmin && (
        <Pressable 
          style={[styles.button, styles.adminButton]} 
          onPress={() => { 
            router.push('/screens/admin'); 
          }}
        >
          <Text style={styles.buttonText}>👑 Painel Admin</Text>
        </Pressable>
      )}
      
      <Pressable 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>

      {user && (
        <Pressable 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    minWidth: 200,
  },
  adminButton: {
    backgroundColor: '#ff6b35',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    minWidth: 200,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    minWidth: 200,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});