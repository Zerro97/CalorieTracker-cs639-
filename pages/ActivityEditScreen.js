import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, ScrollView, 
    SafeAreaView, AsyncStorage, Button, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';

export default class ActivityEditScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: {},
            name: null,
            duration: null,
            date: null,
            calories: null,
        };

        this.editActivity = this.editActivity.bind(this);
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

    async editActivity() {
        const token =  await AsyncStorage.getItem('token');
        const id = this.props.navigation.getParam("id");

        if(this.state.date === null) {
            var date = new Date().getDate(); //Current Date
            var month = new Date().getMonth() + 1; //Current Month
            var year = new Date().getFullYear(); //Current Year
            var hours = new Date().getHours(); //Current Hours
            var min = new Date().getMinutes(); //Current Minutes
            var sec = new Date().getSeconds(); //Current Seconds
            this.setState({
              date: year + '/' + month + '/' + date + ' ' + hours + ':' + min + ':' + sec,
            });
        }
        if(this.state.name === null) {
            this.setState({name: "New Activity"});
        }
        if(this.state.calories === null) {
            this.setState({calories: 0});
        }
        if(this.state.duration === null) {
            this.setState({duration: 0});
        }

        console.log(this.state);
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                duration: this.state.duration,
                date: this.state.date,
                calories: this.state.calories,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
        })
        .catch((error) => {
            console.error("Error:" + error);
        });
    
        let activity = {
            name: this.state.name,
            duration: this.state.duration,
            date: this.state.date,
            calories: this.state.calories,
        }
        this.setState({activity:activity});
        this.props.navigation.navigate('Activity', {activity: activity});
      }
      
    async componentDidMount(){
        /*const token =  await AsyncStorage.getItem('token');

        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                duration: this.state.duration,
                date: this.state.date,
                calories: this.state.calories,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
        })
        .catch((error) => {
            console.error("Error:" + error);
        });*/
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
                      <Text style={styles.sectionHeading}>Edit Activity</Text>
                    </View>
    
                    <TextInput placeholder="Name:" onChangeText={val => this.handleChange('name', val)} style={styles.input}/>
                    <TextInput placeholder="Duration(Min):" onChangeText={val => this.handleChange('duration', val)} style={styles.input} keyboardType={'numeric'}/>
                    <TextInput placeholder="Calories:" onChangeText={val => this.handleChange('calories', val)} style={styles.input} keyboardType={'numeric'}/>

                    <DatePicker
                        style={styles.dateBox}
                        date={this.state.date} //initial date from state
                        mode="date" //The enum of date, datetime and time
                        placeholder="Select date"
                        format="DD-MM-YYYY"
                        minDate="01-01-2017"
                        maxDate="01-01-2020"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        customStyles={{
                            dateText: {
                                color: "#af4448",
                                fontSize: 20
                            },
                            placeholderText: {
                                color: "#af4448"
                            },
                            dateTouchBody: {
                                backgroundColor: "white",
                            },
                            dateInput: {
                                borderWidth: 0,
                                borderRadius: 5,
                            }
                        }}
                        onDateChange={date => {
                            this.setState({ date: date });
                        }}
                    />

                    <TouchableOpacity style={styles.btnContainer} onPress={this.editActivity}>
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
    dateBox: {
        height: 40,
        marginBottom: 20,
        width: "100%",
    }
});