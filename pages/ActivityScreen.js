import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, AsyncStorage } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import List from '../components/ActivityList';

export default class ActivityScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
        };

        this.moveToCreate = this.moveToCreate.bind(this);
        this.parseActivity = this.parseActivity.bind(this);
    }
      
    async componentDidMount(){
        const token = await AsyncStorage.getItem('token')
        this.setState({token: token});
       
        await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: {'x-access-token': this.state.token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({activities: responseJson.activities});
        })
        .catch((error) => {
            console.error("Error:" + error);
        });

        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
            await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'GET',
                headers: {'x-access-token': this.state.token},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({activities: responseJson.activities});
            })
            .catch((error) => {
                console.error("Error:" + error);
            });
        });
    }

    moveToCreate() {
        this.props.navigation.navigate('ActivityCreate');
    }

    parseActivity() {
        //console.log("parse", this.state.activities);
        if(this.state.token === undefined) {
            return;
        }

        let activities = this.state.activities;

        if(activities.length === 0) {
            return;
        }

        let data = [];
        //console.log(activities, activities.length);
        for(let i=0; i<activities.length; i++){
            data.push(
                {
                    id: activities[i].id,
                    date: activities[i].date,
                    message: activities[i].name, 
                    calorie: activities[i].calories,
                    duration: activities[i].duration, 
                    navigation: this.props.navigation,
                }
            )
        }

        let cards = [];
        cards.push(
            <List key="1" data={data}/>
        );

        return cards;
    }

    render() {
        return (
            <ScrollView style={{height: "100%", width: "100%"}}>
                <SafeAreaView style={{backgroundColor: "#ffcdd2", height: "100%"}}>
                    <View style={{alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: "#af4448"}}>
                        <Text style={{color: "white", fontSize: 30}}>Calorie Tracking App</Text>
                    </View>

                    <View>
                        <View style={{marginBottom: 20, alignItems: 'center', justifyContent: 'center', height: 50}}>
                            <Text style={styles.sectionHeading}>Activities</Text>
                        </View>

                        {this.parseActivity()}

                        <TouchableOpacity style={styles.btnContainer} onPress={this.moveToCreate}>
                            <Text style={styles.btnText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    sectionHeading: {
        margin: 8,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    storyHeading: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    btnContainer: {
        backgroundColor: "#af4448",
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 50,
    },
    btnText: {
        color: "white",
        fontSize: 20,
    },
    activityBox: {
        flex: 1,
        height: 80,
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    actionBox: {
        backgroundColor: "#af4448",
        justifyContent: 'center',
        color: 'white',
        height: "100%",
        width: "100%",
    }
});

        /*for(let i=0; i<activities.length; i++){
            cards.push(
                <Card style={{padding: 10, marginVertical: 5}}>
                    <Text style={styles.storyHeading}>Name: {activities[i].name + "\n"}</Text>
                    <Text style={{paddingTop: 20, fontSize: 14}}>
                        Duration: {activities[i].duration + "\n"}
                        Date: {activities[i].date + "\n"}
                        Calories: {activities[i].calories + "\n"}
                    </Text>
                </Card>
            )
        }*/