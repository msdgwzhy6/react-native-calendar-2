/**
 * A standard react Component for App be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 下午3:52
 *
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Calendar from '../Calendar/Calendar'

export default class Punches extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Calendar/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});