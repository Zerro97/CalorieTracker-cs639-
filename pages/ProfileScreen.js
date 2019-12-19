import React from 'react';
import { Button, KeyboardAvoidingView, SafeAreaView, StyleSheet,
  Text, TextInput, ScrollView, View, AsyncStorage } from "react-native";
  import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            /*username: null,

            firstName: null,
            lastName: null,
            goalDailyCalories: null,
            goalDailyProtein: null,
            goalDailyCarbohydrates: null,
            goalDailyFat: null,
            goalDailyActivity: null,*/
        };

        this._isMounted = false;
        this.logOut = this.logOut.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);

        this.moveToEdit = this.moveToEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillUnmount(){
      this._isMounted = false;
      this.focusListener.remove();
    }

    async componentDidMount(){
      this._isMounted = true;

        const token =  await AsyncStorage.getItem('token');
        const username =  await AsyncStorage.getItem('username');

        this.setState({token: token});

        await fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
            method: 'GET',
            headers: {'x-access-token': token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState(responseJson);
        })
        .catch((error) => {
            console.error("Error:" + error);
        });

        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
          fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
              method: 'GET',
              headers: {'x-access-token': token},
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

    logOut() {
      if(!this._isMounted) {
        return;
      }
  
      let keys = ['token', 'username', 'meals'];
      AsyncStorage.multiRemove(keys, (err) => {
        //console.log(err);
      });
  
      this.props.navigation.navigate("LogIn");
    }
  
    deleteAccount() {
      if(!this._isMounted) {
        return;
      }
  
      let keys = ['token', 'username', 'meals'];
      AsyncStorage.multiRemove(keys, (err) => {
        //console.log(err);
      });

      fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
        method: 'DELETE',
        headers: {'x-access-token': this.state.token},
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.error("Error:" + error);
      });
  
      this.props.navigation.navigate("LogIn");
    }

    handleChange(key, val) {
        this.setState({ [key]: val})
    }
  
    moveToEdit() {
        this.props.navigation.navigate('ProfileEdit');
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


              <View style={{backgroundColor: "#ffcdd2"}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.sectionHeading}>Profile</Text>
                </View>

                <View style={{paddingHorizontal: 36, marginVertical:10}}>
                  <Text style={{fontSize:15}}>Username: {this.state.username}</Text>
                  <Text style={{fontSize:15}}>Full Name: {this.state.lastName} {this.state.firstName}</Text>
                </View>


                <View style={{backgroundColor: "#ffa4a2"}}>
                    <View style={{
                        width: "100%",
                        height: 20,
                        backgroundColor: "#ffcdd2",   
                        borderRadius: "100%",
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                    }}/>
                </View>

                <View style={{backgroundColor: "#ffa4a2", alignItems: "center"}}>
                  <Text style={{fontSize: 25, fontWeight: "bold", marginTop: 10}}>Daily Goals</Text>
                  <View style={{marginTop: 10, alignItems: "center"}}>
                      <Text style={{fontSize: 30, color: "white", fontWeight: "bold"}}>{this.state.goalDailyCalories}</Text>
                      <Text style={{fontSize: 20, fontWeight: "bold"}}>Calories</Text>
                  </View>
                  <View style={{flexDirection: "row", marginVertical: 10}}>
                    <View style={{flex:1, alignItems: "center"}}>
                        <Text style={{fontSize: 20, color: "white", fontWeight: "bold"}}>{this.state.goalDailyCarbohydrates}</Text>
                        <Text style={{fontWeight: "bold"}}>Carbs</Text>
                    </View>
                    <View style={{flex:1, alignItems: "center", marginTop: 20}}>
                        <Text style={{fontSize: 20, color: "white", fontWeight: "bold"}}>{this.state.goalDailyProtein}</Text>
                        <Text style={{fontWeight: "bold"}}>Protein</Text>
                    </View>
                    <View style={{flex:1, alignItems: "center"}}>
                        <Text style={{fontSize: 20, color: "white", fontWeight: "bold"}}>{this.state.goalDailyFat}</Text>
                        <Text style={{fontWeight: "bold"}}>Fat</Text>
                    </View>
                  </View>
                  <View style={{flex:1, alignItems: "center", marginTop: 10}}>
                        <Text style={{fontSize: 20, color: "white", fontWeight: "bold"}}>{this.state.goalDailyActivity}</Text>
                        <Text style={{fontWeight: "bold"}}>Activity</Text>
                    </View>
                </View>

                <View style={{
                    width: "100%",
                    height: 20,
                    backgroundColor: "#ffa4a2",   
                    borderRadius: "100%",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                }}/>

                <TouchableOpacity style={styles.btnContainer} onPress={this.moveToEdit}>
                  <Text style={styles.btnText}>Edit Profile</Text>
                </TouchableOpacity>


              <View style={{marginTop:20, paddingVertical: 10, backgroundColor: "#ffa4a2", flexDirection: "row", justifyContent: "space-evenly"}}>
                <TouchableOpacity style={styles.btnContainer2} onPress={this.logOut}>
                  <Text style={styles.btnText}>Log Out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnContainer2} onPress={this.deleteAccount}>
                  <Text style={styles.btnText}>Delete Account</Text>
                </TouchableOpacity>
              </View>

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
    fontSize: 25,
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
  btnContainer2: {
    backgroundColor: "#af4448",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  btnText: {
    color: "white",
    fontSize: 20,
  },
});