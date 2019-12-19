import React from 'react';
import {
  ScrollView,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import ActivityItem from './ActivityButton';

export default class ActivityList extends React.Component {
    state = {
        data: this.props.data,
        swiping: false
    }

    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }

    componentDidUpdate(prevProps) {
        if(prevProps !== this.props) {
            this.setState({data: this.props.data});
        }
    }

    cleanFromScreen(id) {
        const data = this.state.data.filter(item => {
            return item.id !== id;
        });
        this.setState({ data });
    }


    renderItems() {
        return this.state.data.map((item) => {
            return (
                <ActivityItem
                    key={item.id}
                    swipingCheck={(swiping) => this.setState({ swiping })}
                    message={item.message}
                    calorie={item.calorie}
                    date={item.date}
                    duration={item.duration}
                    id={item.id}
                    cleanFromScreen={(id) => this.cleanFromScreen(id)}
                    leftButtonPressed={() => console.log('left button pressed')}
                    deleteButtonPressed={() => console.log('delete button pressed')}
                    editButtonPressed={() => console.log('edit button pressed')}
                    navigation={item.navigation}
                />
            );
        });
    }
    render() {
        return (
            <ScrollView scrollEnabled={!(this.state.swiping)}>
                {this.renderItems()}
            </ScrollView>
        );
    }
}