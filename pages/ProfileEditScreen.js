import React from 'react';
import { Button, KeyboardAvoidingView, SafeAreaView, StyleSheet,
  Text, TextInput, ScrollView, View, AsyncStorage } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ProfileEditScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        token: null,
        username: null,

        password: null,
        firstName: null,
        lastName: null,
        goalDailyCalories: null,
        goalDailyProtein: null,
        goalDailyCarbohydrates: null,
        goalDailyFat: null,
        goalDailyActivity: null,
    };


    this.updateProfile = this.updateProfile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /*componentDidUpdate() {

  }*/

  async componentDidMount(){
    const token =  await AsyncStorage.getItem('token');
    const username =  await AsyncStorage.getItem('username');

    this.setState({token: token});
    this.setState({username: username});

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
          method: 'GET',
          headers: {'x-access-token': this.state.token},
      })
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState(responseJson);
      })
      .catch((error) => {
          console.error("Error:" + error);
      });
    });
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
  
  async updateProfile() {
    if(this.state.firstName === null) {
      this.setState({firstName: "..."});
    }
    if(this.state.lastName === null) {
      this.setState({lastName: "..."});
    }
    if(this.state.goalDailyCalories === null) {
      this.setState({goalDailyCalories: 0});
    }
    if(this.state.goalDailyCarbohydrates=== null) {
      this.setState({goalDailyCarbohydrates: 0});
    }
    if(this.state.goalDailyProtein === null) {
      this.setState({goalDailyProtein: 0});
    }
    if(this.state.goalDailyFat === null) {
      this.setState({goalDailyFat: 0});
    }
    if(this.state.goalDailyActivity === null) {
      this.setState({goalDailyActivity: 0});
    }


    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.state.token,
      },
      body: JSON.stringify({
        firstName: this.state.firstName,        
        lastName: this.state.lastName,     
        goalDailyCalories: this.state.goalDailyCalories,   
        goalDailyProtein: this.state.goalDailyProtein,
        goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
        goalDailyFat: this.state.goalDailyFat,   
        goalDailyActivity: this.state.goalDailyActivity, 
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log("Edit", responseJson);
    })
    .catch((error) => {
      console.error(error);
    });

    this.props.navigation.navigate('Profile', {didChange: 'true'});
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
                  <Text style={styles.sectionHeading}>Profile Edit</Text>
                </View>

                <TextInput placeholder="First Name" onChangeText={val => this.handleChange('firstName', val)} style={styles.input}/>
                <TextInput placeholder="Last Name" onChangeText={val => this.handleChange('lastName', val)} style={styles.input}/>
                <TextInput placeholder="Goal Daily Calories:" onChangeText={val => this.handleChange('goalDailyCalories', val, "float")} style={styles.input} keyboardType={'numeric'}/>
                <TextInput placeholder="Goal Daily Protein:" onChangeText={val => this.handleChange('goalDailyProtein', val, "float")} style={styles.input} keyboardType={'numeric'}/>
                <TextInput placeholder="Goal Daily Carbohydrates:" onChangeText={val => this.handleChange('goalDailyCarbohydrates', val, "float")} style={styles.input} keyboardType={'numeric'}/>
                <TextInput placeholder="Goal Daily Fat:" onChangeText={val => this.handleChange('goalDailyFat', val, "float")} style={styles.input} keyboardType={'numeric'}/>
                <TextInput placeholder="Goal Daily Activity:" onChangeText={val => this.handleChange('goalDailyActivity', val, "float")} style={styles.input} keyboardType={'numeric'}/>

                <TouchableOpacity style={styles.btnContainer} onPress={this.updateProfile}>
                    <Text style={styles.btnText}>Update</Text>
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
});