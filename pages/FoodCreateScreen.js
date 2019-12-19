import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, ScrollView, 
    SafeAreaView, AsyncStorage, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class FoodCreateScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            food: {},
            name: null,
            calories: null,
            protein: null,
            carbohydrates: null,
            fat: null,
        };

        this.createFood = this.createFood.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(key, val, type="string") {
        let newVal;

        if(type === "float") {
            newVal = String(val);
            this.setState({ [key]: newVal})
        } else {
            this.setState({ [key]: val})
        }
    }

    async createFood() {
        const token =  await AsyncStorage.getItem('token');
        const mealId = this.props.navigation.getParam("mealId");

        if(this.state.name === null) {
            this.setState({name: "New Food"});
        }

        await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId + '/foods', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                calories: this.state.calories,
                protein: this.state.protein,
                carbohydrates: this.state.carbohydrates,
                fat: this.state.fat,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
        })
        .catch((error) => {
            console.error("Error:" + error);
        });
    
        let food = {
            name: this.state.name,
            calories: this.state.calories,
            protein: this.state.protein,
            carbohydrates: this.state.carbohydrates,
            fat: this.state.fat,
        }
        this.setState({food:food});
        this.props.navigation.navigate('Food', {food: food});
      }
      
    async componentDidMount(){

    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={15}>
            <ScrollView>
              <SafeAreaView style={styles.container}>
                <View style={styles.inner}>
                  <View style={{alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: "#af4448"}}>
                      <Text style={{color: "white", fontSize: 30}}>Calorie Tracking App</Text>
                  </View>
    
                  <View style={{padding: 24}}>
                    <View style={{marginBottom: 20, alignItems: 'center', justifyContent: 'center', height: 50}}>
                      <Text style={styles.sectionHeading}>Create Food</Text>
                    </View>
    
                    <TextInput placeholder="Name:" onChangeText={val => this.handleChange('name', val)} style={styles.input}/>
                    <TextInput placeholder="Calories:" onChangeText={val => this.handleChange('calories', val)} style={styles.input} keyboardType={'numeric'}/>
                    <TextInput placeholder="Protein:" onChangeText={val => this.handleChange('protein', val)} style={styles.input} keyboardType={'numeric'}/>
                    <TextInput placeholder="Carbohydrate:" onChangeText={val => this.handleChange('carbohydrates', val)} style={styles.input} keyboardType={'numeric'}/>
                    <TextInput placeholder="Fat:" onChangeText={val => this.handleChange('fat', val)} style={styles.input} keyboardType={'numeric'}/>

                    <TouchableOpacity style={styles.btnContainer} onPress={this.createFood}>
                        <Text style={styles.btnText}>Create Food</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
            </ScrollView>
          </KeyboardAvoidingView>
    
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffcdd2",
        flex: 1,
    },
    sectionHeading: {
      margin: 8,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    inner: {
        flex: 1,
        justifyContent: "flex-end",
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
    },
    input: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    btnContainer: {
        backgroundColor: "#af4448",
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
    },
    btnText: {
        color: "white",
        fontSize: 20,
    },
    dateBox: {
        height: 40,
        marginBottom: 20,
        width: "100%",
    },
});