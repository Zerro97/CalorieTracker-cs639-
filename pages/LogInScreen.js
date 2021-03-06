import React from 'react';
import { Button, KeyboardAvoidingView, SafeAreaView, StyleSheet,
  Text, TextInput, ScrollView, View, Image, AsyncStorage } from "react-native";
import base64 from 'react-native-base64';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class LogInScreen extends React.Component { 
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
    };

    this.logIn = this.logIn.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.switchScreen = this.switchScreen.bind(this);
  }

  handleChange(key, val) {
    this.setState({ [key]: val})
  }

  switchScreen() {
    this.props.navigation.navigate('SignUp');
  }

  async logIn() {
    let username = this.state.username;
    let password = this.state.password;
    
    let key;
    let token;

    await fetch('https://mysqlcs639.cs.wisc.edu/login', {
      method: 'GET',
      headers: {'Authorization': 'Basic ' + base64.encode(username + ":" + password)},
    })
    .then((response) => response.json())
    .then((responseJson) => {
      key = Object.keys(responseJson)[0];
      token = Object.values(responseJson)[0];
    })
    .catch((error) => {
      console.error(error);
    }); 

    if(key === "token") {
      // Save username and token persistently
      AsyncStorage.setItem('username', username);
      AsyncStorage.setItem('token', token);

      // For initializing meals array
      //let meals = [];
      /*let newMeal = {};
      newMeal.name = null;
      newMeal.date = null;
      newMeal.calories = null;
      newMeal.carbohydrates = null;
      newMeal.protein = null;
      newMeal.fat = null;
      meals.push(newMeal);*/

      //AsyncStorage.setItem('meals', JSON.stringify(meals));
      
      this.props.navigation.navigate('Home');
    } else {
      alert("Wrong username or password!");
    }
  }

    render() {
      return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={60}>
          <View style={styles.topContainer}>
            <Image
              style={{width: 160, height: 160}}
              source={require('../assets/tracker_logo.png')}
            />
          
            <View style={{padding: 24}}>
              <TextInput placeholder="Username" placeholderTextColor="#ffffff" onChangeText={val => this.handleChange('username', val)} style={styles.inputBox}/>
              <TextInput placeholder="Password" secureTextEntry={true} placeholderTextColor="#ffffff" onChangeText={val => this.handleChange('password', val)} style={styles.inputBox}/>

              <TouchableOpacity style={styles.btnContainer} onPress={this.logIn}>
                <Text style={styles.btnText}>Log In</Text>
              </TouchableOpacity>

              <Text>Don't have an account yet?</Text>
              <TouchableOpacity onPress={this.switchScreen}>
                <Text style={{fontWeight:'500', color:'grey'}}>Signup</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      );
    }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    backgroundColor: "#ffcdd2",
    color: "white",
    fontSize: 16,
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
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
});