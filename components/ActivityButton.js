import React from 'react';
import {View,Text,Dimensions,Animated,PanResponder,TouchableOpacity,Easing,AsyncStorage,StyleSheet} from 'react-native';
import { Icon } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const RIGHT_BUTTON_THRESHOLD = SCREEN_WIDTH / 15;
const FORCE_TO_OPEN_THRESHOLD = SCREEN_WIDTH / 3.5;
const FORCING_DURATION = 350;
const SCROLL_THRESHOLD = SCREEN_WIDTH / 15;
const LEFT_BUTTONS_THRESHOLD = SCREEN_WIDTH / 7;

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.parseDuration = this.parseDuration.bind(this);
    this.parseActivity = this.parseActivity.bind(this);
    this.parseCalorie = this.parseCalorie.bind(this);
    this.parseDate = this.parseDate.bind(this);

    this.deletePressed = this.deletePressed.bind(this);
    this.editPressed = this.editPressed.bind(this);

    const position = new Animated.ValueXY(0, 0);
    this.scrollStopped = false;

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        this.position.setOffset({ x: this.position.x._value, y: 0 });
        this.position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (event, gesture) => {
          if (gesture.dx >= SCROLL_THRESHOLD) {
              this.enableScrollView(true);
              const x = gesture.dx - SCROLL_THRESHOLD;
              this.position.setValue({ x, y: 0 });
          } else if (gesture.dx <= -SCROLL_THRESHOLD) {
              this.enableScrollView(true);
              const x = gesture.dx + SCROLL_THRESHOLD;
              this.position.setValue({ x, y: 0 });
          }
      },
      onPanResponderRelease: (event, gesture) => {
        this.position.flattenOffset(); // adding animated value to the offset value then it reset the offset to 0.
          if (gesture.dx > 0) {
            this.userSwipedRight(gesture);
          } else {
            this.userSwipedLeft(gesture);
          }
      },
      onPanResponderTerminate: () => {
        Animated.spring(this.position, {
          toValue: { x: 0, y: 0 }
        }).start();
      }
    });

    this.position = position;
    this.panResponder = panResponder;
  }

  getRightButtonProps() {
      const opacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH/4, -35],
        outputRange: [1, 0]
      });
      const width = this.position.x.interpolate({
        inputRange: [-70, 0],
        outputRange: [70, 0]
      });
      const transform = [{
        translateX: this.position.x.interpolate({
          inputRange: [0, SCREEN_WIDTH],
          outputRange: [0, SCREEN_WIDTH]
        })
      }];
      return {
         opacity,
         width,
         transform,
      };
  }

  getLeftButtonProps() {
    const opacity = this.position.x.interpolate({
      inputRange: [35, 75, 320],
      outputRange: [0, 1, 0.25]
    });
    const width = this.position.x.interpolate({
      inputRange: [0, 20],
      outputRange: [0, 20]
    });
    return {
      opacity,
      width
    };
  }

  resetPosition() {
    Animated.timing(this.position, {
      toValue: { x: 0, y: 0 },
      duration: 200
    }).start();
  }

  completeSwipe(dimension, callback) {
    /*const x = dimension === 'right' ? SCREEN_WIDTH : SCREEN_WIDTH;
    Animated.timing(this.position, {
      toValue: { x, y: 0 },
      duration: FORCING_DURATION
    }).start(() => this.props.cleanFromScreen(this.props.id));
    callback();*/
  }

  enableScrollView(isEnabled) {
      if (this.scrollView !== isEnabled) {
          this.props.swipingCheck(isEnabled);
          this.scrollView = isEnabled;
        }
  }

  userSwipedLeft(gesture) {
    if (gesture.dx <= -(RIGHT_BUTTON_THRESHOLD)) {
      this.showButton('left');
    } else {
      this.resetPosition();
    }
  }

  userSwipedRight(gesture) {
    if (gesture.dx >= LEFT_BUTTONS_THRESHOLD) {
      this.showButton('right');
    } else {
      this.resetPosition();
    }
  }

  showButton(side) {
    const x = side === 'right' ? SCREEN_WIDTH / 4 : -SCREEN_WIDTH / 4; // 4 from 4.5
    Animated.timing(this.position, {
      toValue: { x, y: 0 },
      duration: 400,
      easing: Easing.out(Easing.quad)
    }).start(() => this.enableScrollView(false));
  }

  async deletePressed() {
    const token = await AsyncStorage.getItem('token');

    this.props.cleanFromScreen(this.props.id);

    fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.props.id, {
      method: 'DELETE',
      headers: {'x-access-token': token},
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
    })
    //.start(() => this.props.cleanFromScreen(this.props.id))
    .catch((error) => {
      console.error("Error:" + error);
    });
  }

  editPressed() {
    //console.log(this.props);
    this.props.navigation.navigate('ActivityEdit', {id: this.props.id});
  }

  parseActivity() {
    let str = this.props.message;

    if(str !== null) {
      return str;
    } else {
      return "New Activity"
    }  
  }

  parseCalorie() {
    let str = this.props.calorie;

    if(str !== null) {
      return "(" + str + ")";
    } else {
      return
    }    
  }

  parseDate() {
    let str = this.props.date;

    if(str !== null){
      return str.substring(0,10);
    } else {
      return
    }
  }

  parseDuration() {
    let str = this.props.duration;

    if(str !== null){
      return str;
    } else {
      return "0";
    }
  }

  render() {
    const { containerStyle, leftButtonContainer, textContainer, rightButtonContainer } = styles;
    return (
      <View style={containerStyle}>
        {/* LEFT */}
        <Animated.View style={[leftButtonContainer, this.getLeftButtonProps()]}>
          <TouchableOpacity style={styles.centerContent} onPress={this.deletePressed}>
            <Icon type="font-awesome" name="trash"/>
          </TouchableOpacity>
        </Animated.View>

        {/* CENTER */}
        <Animated.View style={[textContainer, this.position.getLayout()]}{...this.panResponder.panHandlers}>
          <Text style={styles.textStyle}>{this.parseActivity()}{this.parseCalorie()}</Text>
          <Text style={{fontSize: 15, color: "grey"}}>{this.parseDate()}</Text>
          <Text style={{marginTop: 5, fontSize: 18, color: "#af4448"}}>{this.parseDuration()} min</Text>
        </Animated.View>

        {/* RIGHT */}
        <Animated.View style={[rightButtonContainer, this.getRightButtonProps()]}>
          <TouchableOpacity style={styles.centerContent} onPress={this.editPressed}>
            <Icon type="font-awesome" name="edit"/>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

//<Animated.View style={[rightButtonContainer, { backgroundColor: '#FFC400' }, this.getRightButtonProps()]}>

const styles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    marginBottom: 10,
    elevation: 3
  },
  textContainer: {
    paddingHorizontal: 30,
    paddingVertical: 35,
    width: SCREEN_WIDTH / 1.03,
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: 'white',
    elevation: 3,
    zIndex: 2
  },
  textStyle: {
    fontSize: 25,
    color: "#af4448",
  },
  rightButtonContainer: {
    borderRadius: 7,
    backgroundColor: '#FFC400',
    position: 'absolute',
    elevation: 3,
    height: 145,
    left: SCREEN_WIDTH-10,
    zIndex: 1,
  },
  leftButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    borderRadius: 7,
    backgroundColor: '#D50000',
    position: 'absolute',
    elevation: 3,
    height: 145,
  },
});

export default Item;