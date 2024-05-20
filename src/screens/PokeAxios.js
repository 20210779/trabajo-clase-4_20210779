import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TextInput} from 'react-native';
import axios from 'axios';

// Obtiene el ancho de la pantalla del dispositivo.
const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

export default function PokemonAxios() {
  const [pokemon, setPokemon] = useState([]);
  const [nPokemon, setNPokemon]=useState(0); //La api comenzará mostrando solamente 25 pokemones

  const getPokemon = async (nPokemon =10) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${nPokemon}`);
      const dataPokemon = response.data;
      setPokemon(dataPokemon.results);
    } catch (error) {
      console.log("Hubo un error listando los pokemones", error);
    }
  }

  useEffect(() => {
    console.log("Cambio el valor de nPokemon")
    getPokemon(nPokemon);
  }, [nPokemon]);

  const getPokemonDescription = async (pokemonName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
      const data = response.data;
      // Obtenemos la descripción del primer idioma disponible
      const description = data.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
      return description;
    } catch (error) {
      console.error("Error obteniendo la descripción del Pokémon:", error);
      return '';
    }
  }

  const renderItem = async ({ item }) => {
    const description = await getPokemonDescription(item.name);
    return (
      <View style={styles.card}>
        <Image
          style={styles.image}
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split('/')[6]}.png` }}
        />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List of Pokémon</Text>
      <View>
      <Text>
      Ingrese el numero de pokemones a cargar: 
      </Text>
      <TextInput
      placeholder='5'
      onChangeText={setNPokemon}
      value={nPokemon}
      />
      </View>
      
      <FlatList
        data={pokemon}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    margin: 5,
    width: WIDTH / numColumns - 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
});