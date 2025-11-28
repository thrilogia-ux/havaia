import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet } from 'react-native';

// Pantallas (por ahora placeholders)
const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Gentum.ar</Text>
    <Text style={styles.subtitle}>Bienvenido a la comunidad</Text>
  </View>
);

const ExperienciasScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Experiencias</Text>
    <Text style={styles.subtitle}>Descubrí actividades en Buenos Aires</Text>
  </View>
);

const GruposScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Grupos</Text>
    <Text style={styles.subtitle}>Conectá con otros viajeros</Text>
  </View>
);

const ComunidadScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Comunidad</Text>
    <Text style={styles.subtitle}>Foros y chats temáticos</Text>
  </View>
);

const PerfilScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Mi Perfil</Text>
    <Text style={styles.subtitle}>Configuración y preferencias</Text>
  </View>
);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Experiencias') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Grupos') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Comunidad') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#0066cc',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Experiencias" component={ExperienciasScreen} />
      <Tab.Screen name="Grupos" component={GruposScreen} />
      <Tab.Screen name="Comunidad" component={ComunidadScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});




