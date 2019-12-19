import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, AsyncStorage } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import List from '../components/MealList';

export default class MealScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meals: [],
        };

        this.moveToCreate = this.moveToCreate.bind(this);
        this.parseMeal = this.parseMeal.bind(this);
      }
      
    async componentDidMount(){
        const token = await AsyncStorage.getItem('token')
        this.setState({token: token});
       
        await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
            method: 'GET',
            headers: {'x-access-token': this.state.token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({meals: responseJson.meals});
        })
        .catch((error) => {
            console.error("Error:" + error);
        });

        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
            let meals = this.props.navigation.getParam('meals');
            console.log(meals);

            await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
                method: 'GET',
                headers: {'x-access-token': this.state.token},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({meals: responseJson.meals});
            })
            .catch((error) => {
                console.error("Error:" + error);
            });
        });
    }

    moveToCreate() {
        this.props.navigation.navigate('MealCreate');
    }

    parseMeal() {
        if(this.state.token === undefined) {
            return;
        }

        let meals = this.state.meals;

        if(meals.length === 0) {
            return;
        }

        let data = [];

        for(let i=0; i<meals.length; i++){
            data.push(
                {
                    id: meals[i].id,
                    date: meals[i].date,
                    message: meals[i].name, 
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
                            <Text style={styles.sectionHeading}>Meals</Text>
                        </View>

                        {this.parseMeal()}

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
});