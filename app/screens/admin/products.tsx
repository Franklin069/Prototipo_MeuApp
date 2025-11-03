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
  Alert,
  Image 
} from 'react-native';
import { useProducts, Product } from '../../../contexts/ProductContext';

export default function ProductManagement() {
  const { products, createProduct, updateProduct, deleteProduct } = useProducts();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    inStock: true,
  });

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        inStock: true,
      });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.description) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Erro', 'Preço deve ser um número válido maior que zero');
      return;
    }

    const productData = {
      name: formData.name,
      price: price,
      description: formData.description,
      image: formData.image || 'https://via.placeholder.com/150',
      category: formData.category || 'Geral',
      inStock: formData.inStock,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      createProduct(productData);
    }
    
    setModalVisible(false);
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o produto ${product.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteProduct(product.id) },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={[styles.productStock, !item.inStock && styles.outOfStock]}>
          {item.inStock ? '✅ Em estoque' : '❌ Fora de estoque'}
        </Text>
      </View>
      <View style={styles.productActions}>
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
        <Text style={styles.title}>Gerenciar Produtos</Text>
        <Pressable style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Novo Produto</Text>
        </Pressable>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        style={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do produto *"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Preço *"
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Descrição *"
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={styles.input}
              placeholder="URL da imagem"
              value={formData.image}
              onChangeText={(text) => setFormData({...formData, image: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Categoria"
              value={formData.category}
              onChangeText={(text) => setFormData({...formData, category: text})}
            />

            <View style={styles.switchContainer}>
              <Text>Em estoque:</Text>
              <Switch
                value={formData.inStock}
                onValueChange={(value) => setFormData({...formData, inStock: value})}
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
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  productStock: {
    fontSize: 12,
    color: '#28a745',
  },
  outOfStock: {
    color: '#dc3545',
  },
  productActions: {
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
    maxHeight: '80%',
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