import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { bancoExterno } from './firebaseConnection';
import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot, collection, setDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lastDocId, setLastDocId] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function pegarDados() {
      // Obter o último documento para definir o próximo ID
      const cadastrosRef = collection(bancoExterno, "cadastros");
      const q = query(cadastrosRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const lastId = parseInt(doc.id);
        setLastDocId(lastId);
      });
    }
    pegarDados();
  }, []);

  async function addBancoExterno() {
    const nextId = (lastDocId + 1).toString();
    await setDoc(doc(bancoExterno, "cadastros", nextId), {
      id: nextId,
      Nome: nome,
      Email: email,
      Senha: senha,
    });
    setLastDocId(parseInt(nextId));
    setNome('');
    setEmail('');
    setSenha('');
    setSuccessMessage('Produto adicionado com sucesso!');
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 25, marginBottom: 20}}>Adicionar Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="digite um Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="digite o E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite A senha"
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={addBancoExterno}>
        <Text style={styles.buttonText}>Cadastre</Text>
      </TouchableOpacity>

      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '80%',
    borderRadius:15,
    backgroundColor: '#fff',
    
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    alignItems: 'center',
    borderRadius:15,
    elevation:10,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  successMessage: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
});
