import React from 'react';
import { View, Dimensions, StyleSheet, Text, ScrollView, SafeAreaView, AsyncStorage } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import List from '../components/MealList';

export default class FoodScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            date: null,
            id: null,
            token: null,

            foods: [],
            calories: null,
            carbohydrates: null,
            protein: null,
            fat: null,
        };

        this.moveToCreate = this.moveToCreate.bind(this);
        this.parseFood = this.parseFood.bind(this);
        this.parseName = this.parseName.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.parseStats = this.parseStats.bind(this);

        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
      }
      
    async componentDidMount(){
        const token = await AsyncStorage.getItem('token');
        const mealId = this.props.navigation.getParam("mealId");

        this.setState({token: token});
       
        // Get meals
        await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId, {
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

        // Get foods data
        await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId + '/foods', {
            method: 'GET',
            headers: {'x-access-token': this.state.token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({foods: responseJson.foods});
        })
        .catch((error) => {
            console.error("Error:" + error);
        });

        this.parseStats();

        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
            // Get meals
            await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
                method: 'GET',
                headers: {'x-access-token': this.state.token},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({responseJson});
            })
            .catch((error) => {
                console.error("Error:" + error);
            });

            // Get foods data
            await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId + '/foods', {
                method: 'GET',
                headers: {'x-access-token': this.state.token},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({foods: responseJson.foods});
            })
            .catch((error) => {
                console.error("Error:" + error);
            });

            this.parseStats();
        });
    }

    moveToCreate() {
        this.props.navigation.navigate('FoodCreate', {mealId: this.state.id});
    }

    async delete(id) {
        const token = await AsyncStorage.getItem('token');
        const mealId = this.props.navigation.getParam("mealId");

        await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId + '/foods/' + id, {
          method: 'DELETE',
          headers: {'x-access-token': token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
        })
        .catch((error) => {
          console.error("Error:" + error);
        });

        let foods = this.state.foods;
        let newFoods = [];

        for(let i=0; i<foods.length; i++) {
            if(foods[i].id !== id) {
                newFoods.push(foods[i]);
            }
        }

        this.setState({foods: newFoods});
    }

    async update(id) {
        const mealId = this.props.navigation.getParam("mealId");
        this.props.navigation.navigate('FoodEdit', {id:id, mealId:mealId});
    }

    parseFood() {
        if(this.state.token === undefined) {
            return;
        }

        let foods = this.state.foods;
        if(foods.length === 0) {
            return;
        }

        let cards = [];
        for(let i=0; i<foods.length; i++) {
            cards.push(
                <View key={i} style={styles.foodContainer}>
                    <View style={{padding: 5, flex: 1}}>
                        <Text style={{fontWeight: 'bold',}}>{foods[i].name}</Text>
                        <Text>Cal:{foods[i].calories}  C:{foods[i].carbohydrates}  P:{foods[i].protein}  F:{foods[i].fat}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.update(foods[i].id)} style={{backgroundColor: '#ffd859', flex:1, width: 50, justifyContent:"center"}}>
                        <Text style={{textAlign:"center"}}>EDIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.delete(foods[i].id)} style={{backgroundColor: '#ff4f4f', flex:1, width: 70, justifyContent:"center"}}>
                        <Text style={{textAlign:"center"}}>DELETE</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return cards;
    }

    parseStats() {
        let foods = this.state.foods;

        let calories = 0;
        let carbohydrates = 0;
        let protein = 0;
        let fat = 0;

        for(let i=0; i<foods.length; i++) {
            calories += foods[i].calories;
            carbohydrates += foods[i].carbohydrates;
            protein += foods[i].protein;
            fat += foods[i].fat;
        }

        this.setState({calories: calories});
        this.setState({carbohydrates: carbohydrates});
        this.setState({protein: protein});
        this.setState({fat: fat});
    }

    parseName() {
        let str = this.state.name;

        if(str !== null) {
            return str;
        } else {
            return "New Meal"
        }  
    }

    parseDate() {
        let str = this.state.date;

        if(str !== null){
            return str.substring(0,10);
        } else {
            return
        }
    }

    render() {
        return (
            <ScrollView style={{height: "100%", width: "100%"}}>
                <SafeAreaView style={{backgroundColor: "#ffcdd2", height: "100%"}}>
                    <View style={{alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: "#af4448"}}>
                        <Text style={{color: "white", fontSize: 30}}>Calorie Tracking App</Text>
                    </View>

                    <View style={{backgroundColor: "#ffcdd2"}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={styles.sectionHeading}>{this.parseName()}</Text>
                            <Text style={styles.dateText}>{this.parseDate()}</Text>
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
                            <View style={{marginTop: 10, alignItems: "center"}}>
                                <Text style={{fontSize: 30}}>{this.state.calories}</Text>
                                <Text style={{fontSize: 20, fontWeight: "bold"}}>Calories</Text>
                            </View>
                            
                            <View style={{flexDirection: "row", marginVertical: 10}}>
                                <View style={{flex:1, alignItems: "center"}}>
                                    <Text style={{fontSize: 20}}>{this.state.carbohydrates}</Text>
                                    <Text style={{fontWeight: "bold"}}>Carbs</Text>
                                </View>
                                <View style={{flex:1, alignItems: "center", marginTop: 20}}>
                                    <Text style={{fontSize: 20}}>{this.state.protein}</Text>
                                    <Text style={{fontWeight: "bold"}}>Protein</Text>
                                </View>
                                <View style={{flex:1, alignItems: "center"}}>
                                    <Text style={{fontSize: 20}}>{this.state.fat}</Text>
                                    <Text style={{fontWeight: "bold"}}>Fat</Text>
                                </View>
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

                        <View style={{backgroundColor: "#ffcdd2"}}>
                            <View style={{alignItems: "center"}}>
                                <Text style={{fontWeight: "bold", fontSize: 20, marginVertical: 15}}>Foods</Text>
                            </View>
                            {this.parseFood()}

                            <TouchableOpacity style={styles.btnContainer} onPress={this.moveToCreate}>
                                <Text style={styles.btnText}>Add Food</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    sectionHeading: {
        marginTop: 8,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dateText: {
        color: "grey",
        fontSize: 16,
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
    foodContainer: {
        backgroundColor: "white",
        width: "100%",

        flexDirection: "row",
        justifyContent: "center",
    }
});