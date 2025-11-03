import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Pressable, 
  StyleSheet, 
  Modal, 
  TextInput, 
  Switch,
  Alert 
} from 'react-native';
import { useAuth, User } from '../../../contexts/AuthContext';

export default function UserManagement() {
  const { users, createUser, updateUser, deleteUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile: 'user' as 'admin' | 'user',
    active: true,
  });

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
        profile: user.profile,
        active: user.active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        profile: 'user',
        active: true,
      });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      createUser(formData);
    }
    
    setModalVisible(false);
  };

  const handleDelete = (user: User) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o usuário ${user.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteUser(user.id) },
      ]
    );
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <Text style={[styles.userProfile, item.profile === 'admin' && styles.adminProfile]}>
            {item.profile === 'admin' ? '👑 Admin' : '👤 Usuário'}
          </Text>
          <Text style={[styles.userStatus, !item.active && styles.inactiveStatus]}>
            {item.active ? '✅ Ativo' : '❌ Inativo'}
          </Text>
        </View>
      </View>
      <View style={styles.userActions}>
        <Pressable style={styles.editButton} onPress={() => openModal(item)}>
          <Text style={styles.buttonText}>✏️</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={() => handleDelete(item)}>
          <Text style={styles.buttonText}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Usuários</Text>
        <Pressable style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Novo Usuário</Text>
        </Pressable>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        style={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
            />

            <View style={styles.switchContainer}>
              <Text>Administrador:</Text>
              <Switch
                value={formData.profile === 'admin'}
                onValueChange={(value) => 
                  setFormData({...formData, profile: value ? 'admin' : 'user'})
                }
              />
            </View>

            <View style={styles.switchContainer}>
              <Text>Ativo:</Text>
              <Switch
                value={formData.active}
                onValueChange={(value) => setFormData({...formData, active: value})}
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    padding: 10,
  },
  userCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  userProfile: {
    fontSize: 12,
    color: '#007AFF',
  },
  adminProfile: {
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 12,
    color: '#28a745',
  },
  inactiveStatus: {
    color: '#dc3545',
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
});