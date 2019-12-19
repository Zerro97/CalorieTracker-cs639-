import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, AsyncStorage } from 'react-native';
import { Card, DataTable } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackedBarChart, XAxis } from 'react-native-svg-charts';
import moment from "moment";

import * as shape from 'd3-shape'
import * as scale from 'd3-scale'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [],
      meals: [],
      foods: [],

      username: null,
    };

    this.parseActivityTable = this.parseActivityTable.bind(this);
    this.parseMealTable = this.parseMealTable.bind(this);
  }

  async componentDidMount(){
    const token =  await AsyncStorage.getItem('token');
    const username =  await AsyncStorage.getItem('username');

    this.setState({token: token});
    this.setState({username: username});

    // Get User Information
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


    // Get Activity Information
    await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
        method: 'GET',
        headers: {'x-access-token': token},
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({activities: responseJson.activities});
    })
    .catch((error) => {
        console.error("Error:" + error);
    });


    // Get Meal Information
    await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
        method: 'GET',
        headers: {'x-access-token': token},
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({meals: responseJson.meals});
    })
    .catch((error) => {
      console.error("Error:" + error);
    });


    // Get Food Information
    let meals = this.state.meals;
    let foods = [];
    for(let i=0; i<meals.length; i++) {
      await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meals[i].id + '/foods/', {
        method: 'GET',
        headers: {'x-access-token': token},
      })
      .then((response) => response.json())
      .then((responseJson) => {
        foods.push(responseJson);
      })
      .catch((error) => {
        console.error("Error:" + error);
      });
    }
    this.setState({foods: foods});


    // Update screen when in focus
    this.focusListener = this.props.navigation.addListener('didFocus', async() => {
      // Get User Information
      await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
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


      // Get Activity Information
      await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
          method: 'GET',
          headers: {'x-access-token': token},
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({activities: responseJson.activities});
      })
      .catch((error) => {
          console.error("Error:" + error);
      });


      // Get Meal Information
      await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
        method: 'GET',
        headers: {'x-access-token': token},
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({meals: responseJson.meals});
      })
      .catch((error) => {
        console.error("Error:" + error);
      });


      // Get Food Information
      let meals = this.state.meals;
      let foods = [];
      for(let i=0; i<meals.length; i++) {
        await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meals[i].id + '/foods/', {
          method: 'GET',
          headers: {'x-access-token': token},
        })
        .then((response) => response.json())
        .then((responseJson) => {
          foods.push(responseJson);
        })
        .catch((error) => {
          console.error("Error:" + error);
        });
      }
      this.setState({foods: foods});
    });
  }

  parseActivityTable() {
    let rows = [];

    let activities = this.state.activities;
    let curDate = new Date();

    if(activities.length === 0) {
      return;
    }

    for(let i=0; i<activities.length; i++){
      let actDate = new Date(activities[i].date.substring(0,4), activities[i].date.substring(5,7)-1, activities[i].date.substring(8,10));
 
      let actMoment = moment(actDate);
      let curMoment = moment(curDate);
      let dateDiff = curMoment.diff(actMoment, 'days');

      if(dateDiff < 7 && curMoment >= actMoment) {
        rows.push(
          <DataTable.Row key={i}>
            <DataTable.Cell>{activities[i].name}</DataTable.Cell>
            <DataTable.Cell numeric>{activities[i].date}</DataTable.Cell>
            <DataTable.Cell numeric>{activities[i].duration}</DataTable.Cell>
            <DataTable.Cell numeric>{activities[i].calories}</DataTable.Cell>
          </DataTable.Row>
        )
      }
    }

    return rows;
  }

  parseMealTable() {
    let rows = [];
    let curDate = new Date();

    let meals = this.state.meals;
    let foods = this.state.foods;

    if(meals.length == 0 || foods.length == 0){
      return;
    }

    for(let i=0; i<meals.length; i++) {
      let calories = 0;
      let carbohydrates = 0;
      let protein = 0;
      let fat = 0;

      if(foods[i].foods !== null) {
        for(let j=0; j<foods[i].foods.length; j++){
          calories += foods[i].foods[j].calories;
          carbohydrates += foods[i].foods[j].carbohydrates;
          protein += foods[i].foods[j].protein;
          fat += foods[i].foods[j].fat;
        }
      }

      let mealDate = new Date(meals[i].date.substring(0,4), meals[i].date.substring(5,7)-1, meals[i].date.substring(8,10));
 
      let mealMoment = moment(mealDate);
      let curMoment = moment(curDate);
      let dateDiff = curMoment.diff(mealMoment, 'days');

      let mealDatePartial = meals[i].date.substring(5,7) + "-" + meals[i].date.substring(8,10);

      if(dateDiff < 7 && curMoment >= mealMoment) {
        rows.push(
          <DataTable.Row key={i}>
            <DataTable.Cell>{meals[i].name}</DataTable.Cell>
            <DataTable.Cell>{mealDatePartial}</DataTable.Cell>
            <DataTable.Cell numeric>{calories}</DataTable.Cell>
            <DataTable.Cell numeric>{protein}</DataTable.Cell>
            <DataTable.Cell numeric>{carbohydrates}</DataTable.Cell>
            <DataTable.Cell numeric>{fat}</DataTable.Cell>
          </DataTable.Row>
        )
      }
    }

    return rows;
  }

  getTotalBurned() {
    let curDate = new Date()

    let activities = this.state.activities;
    let totalCalorie = 0;

    for(let i=0; i<activities.length; i++) {
      if(
        String(curDate.getDate()) === activities[i].date.substring(8,10) &&
        String(curDate.getMonth()+1) === activities[i].date.substring(5,7) &&
        String(curDate.getFullYear()) === activities[i].date.substring(0,4)
      ){
        totalCalorie += activities[i].calories;
      }
    }

    return String(totalCalorie);
  }

  getTotalEaten() {
    let curDate = new Date()

    let meals = this.state.meals;
    let foods = this.state.foods;
    let totalCalorie = 0;

    if(foods === null) {
      return "0";
    }

    for(let i=0; i<meals.length; i++){
      if(foods[i] !== undefined){
        if(foods[i].foods !== null) {
          if(
            String(curDate.getDate()) === meals[i].date.substring(8,10) &&
            String(curDate.getMonth()+1) === meals[i].date.substring(5,7) &&
            String(curDate.getFullYear()) === meals[i].date.substring(0,4)
          ){
            for(let j=0; j<foods[i].foods.length; j++){
              totalCalorie += foods[i].foods[j].calories;
            }
          }
        }
      } 
    }

    return String(totalCalorie);
  }

  getRemaining() {
    let curDate = new Date()

    // Calorie Burned
    let activities = this.state.activities;
    let totalCalorie = 0;
    let leftCalorie = 0;

    for(let i=0; i<activities.length; i++) {
      if(
        String(curDate.getDate()) === activities[i].date.substring(8,10) &&
        String(curDate.getMonth()+1) === activities[i].date.substring(5,7) &&
        String(curDate.getFullYear()) === activities[i].date.substring(0,4)
      ){
        totalCalorie += activities[i].calories;
      }
    }

    // Calorie Eaten
    let meals = this.state.meals;
    let foods = this.state.foods;
    let eatenCalorie = 0;

    if(foods !== null) {
      for(let i=0; i<meals.length; i++){
        if(foods[i] !== undefined){
          if(foods[i].foods !== null) {
            if(
              String(curDate.getDate()) === meals[i].date.substring(8,10) &&
              String(curDate.getMonth()+1) === meals[i].date.substring(5,7) &&
              String(curDate.getFullYear()) === meals[i].date.substring(0,4)
            ){
              for(let j=0; j<foods[i].foods.length; j++){
                eatenCalorie += foods[i].foods[j].calories;
              }
            }
          }
        } 
      }
    }

    leftCalorie = parseInt(this.state.goalDailyCalories) - totalCalorie + eatenCalorie;
    
    return String(leftCalorie);
  }

  displayDate(){
    let dateVar = new Date();
    let date = dateVar.getFullYear() + "-" + dateVar.getMonth() + "-" + dateVar.getDate();

    return date;
  }

  render() {
    const fill = 'rgb(134, 65, 244)';
    const colors = ['#8800cc', '#aa00ff', '#cc66ff', '#eeccff'];
    const mealKeys = ['calories', 'carbohydrates', 'protein', 'fat'];

    /*const svgs = [
        { onPress: () => console.log('calories') },
        { onPress: () => console.log('carbohydrates') },
        { onPress: () => console.log('protein') },
        { onPress: () => console.log('fat') },
    ]*/

    let activities = this.state.activities;
    let meals = this.state.meals;
    let foods = this.state.foods;
    
    let activityData = [];
    let mealData = [];

    let labelDate = [];
    let curDate = new Date();
    let lastMonth = new Date(curDate.getFullYear(), curDate.getMonth()-1, 0);

    // Get activity keys
    let actKeys = [];
    for(let i=0; i<7; i++){
      let parseDate = new Date(curDate.getFullYear(), curDate.getMonth()+1, curDate.getDate()-6+i);
      let dateStr = parseDate.getMonth() + '-' + parseDate.getDate();

      for(let j=0; j<activities.length; j++) {
        let actDateStr = activities[j].date.substring(5,10);
  
        if(actDateStr === dateStr){
          if(activities[j].name !== null){
            actKeys.push(activities[j].name);
          }
        }
      }
    }

    // Loop through past 7 days
    for(let i=0; i<7; i++) {
      // Date variable for past 7 days
      let parseDate = new Date(curDate.getFullYear(), curDate.getMonth()+1, curDate.getDate()-6+i);

      // Date for x-axix labels
      let dateStr = parseDate.getMonth() + '-' + parseDate.getDate();
      labelDate.push(dateStr);


      // Activity data objects to display (per day)
      let dataObj = {};
      let hasData = false;



      // Get activity data
      for(let j=0; j<activities.length; j++) {
        let actDateStr = activities[j].date.substring(5,10);

        // If there is activity on one of 7 days
        if(actDateStr === dateStr){
          dataObj[activities[j].name] = activities[j].calories;
          hasData = true;
        } 
      }
      if(hasData) {
        activityData.push(dataObj);
      } else {
        let emptyData = {};
        for(let j=0; j<actKeys.length; j++) {
          emptyData[actKeys[j]] = 0;
        }
        activityData.push(emptyData);
      }

      // Meal data objects to display (per day)
      let mealObj = {} 
      hasData = false;

      // Get meal data
      if(meals.length != 0 || foods.length != 0){
        mealObj = {
          calories: 0,
          carbohydrates: 0,
          protein: 0,
          fat: 0,
        }

        for(let i=0; i<meals.length; i++){
          let mealDateStr = meals[i].date.substring(5,10);

          if(foods[i] !== undefined && foods[i].foods !== null) {
            if(mealDateStr === dateStr){
              for(let j=0; j<foods[i].foods.length; j++){
                mealObj.calories += foods[i].foods[j].calories;
                mealObj.carbohydrates += foods[i].foods[j].carbohydrates;
                mealObj.protein += foods[i].foods[j].protein;
                mealObj.fat += foods[i].foods[j].fat;
              }
              hasData = true;
            }
          }
        }
      }
      if(hasData) {
        mealData.push(mealObj);
      } else {
        let emptyData = {
          calories: 0,
          carbohydrates: 0,
          protein: 0,
          fat: 0,
        }
        mealData.push(emptyData);
      }
    }

    return (
      <ScrollView style={{height: "100%", width: "100%"}}>
        <SafeAreaView style={{backgroundColor: "#ffcdd2", height: "100%"}}>
          <View style={{alignItems: 'center', justifyContent: 'center', width: "100%", height: 100, backgroundColor: "#af4448"}}>
              <Text style={{color: "white", fontSize: 30}}>Calorie Tracking App</Text>
          </View>

            <View style={{alignItems: "center", backgroundColor: "#ffa4a2", width: "100%", paddingVertical: 20}}>
              <Text style={styles.sectionHeading}>Overview (Today)</Text>
              <Text style={{color: "grey", marginBottom: 10}}>{this.displayDate()}</Text>

              <Text style={styles.textStyle2}>{this.getRemaining()}</Text>
              <Text style={styles.textStyle1}>Calories Left</Text>
              <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, width: "100%", height: 50}}>
                <View style={{}}>
                  <Text style={styles.textStyle2}>{this.getTotalEaten()}</Text>
                  <Text style={styles.textStyle1}>Calories Eaten</Text>
                </View>
                <View style={{}}>
                  <Text style={styles.textStyle2}>{this.getTotalBurned()}</Text>
                  <Text style={styles.textStyle1}>Calories Burned</Text>
                </View>
              </View>
            </View>
            
            <View style={{alignItems: "center", padding: 10, marginBottom: 10}}>
              <Text style={{fontSize: 25, fontWeight: "bold"}}>Statistics</Text>
              <Text style={{color: "grey"}}>{this.displayDate()}</Text>
            </View>

            <Card style={{padding: 10, marginBottom: 15,}}>
              <Text style={styles.cardHeading}>Activities (Past 7 days)</Text>
              <DataTable style={{marginBottom: 20}}>
                <DataTable.Header>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title numeric>Date</DataTable.Title>
                  <DataTable.Title numeric>Duration</DataTable.Title>
                  <DataTable.Title numeric>Calories</DataTable.Title>
                </DataTable.Header>
                {this.parseActivityTable()}
              </DataTable>

              <Text style={styles.cardHeading}>Calories</Text>
              <StackedBarChart
                style={{ height: 200 }}
                keys={actKeys}
                colors={colors}
                data={activityData}
                showGrid={false}
                contentInset={{ top: 30, bottom: 30 }}
              />
              <XAxis
                style={{ marginTop: 10 }}
                data={activityData}
                formatLabel={(value, index) => labelDate[index]}
                contentInset={{ left: 20, right: 20 }}
                svg={{ fontSize: 10, fill: 'black' }}
              />
            </Card>

            <Card style={{padding: 10, marginBottom: 15,}}>
              <Text style={styles.cardHeading}>Meals (Past 7 days)</Text>
              <DataTable style={{marginBottom: 20}}>
                <DataTable.Header>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title>Date</DataTable.Title>
                  <DataTable.Title numeric>Cal</DataTable.Title>
                  <DataTable.Title numeric>Protein</DataTable.Title>
                  <DataTable.Title numeric>Carbs</DataTable.Title>
                  <DataTable.Title numeric>Fat</DataTable.Title>
                </DataTable.Header>
                {this.parseMealTable()}
              </DataTable>

              <Text style={styles.cardHeading}>Nutrition Information</Text>
              <StackedBarChart
                style={{ height: 200 }}
                keys={mealKeys}
                colors={colors}
                data={mealData}
                showGrid={false}
                contentInset={{ top: 30, bottom: 30 }}
              />
              <XAxis
                style={{ marginTop: 10 }}
                data={mealData}
                formatLabel={(value, index) => labelDate[index]}
                contentInset={{ left: 20, right: 20 }}
                svg={{ fontSize: 10, fill: 'black' }}
              />
            </Card>
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
  cardHeading: {
      marginTop: 5,
      marginBottom: 5,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  textStyle1: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle2: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "white",
  },
  btnContainer: {
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