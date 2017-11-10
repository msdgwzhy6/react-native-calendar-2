/**
 * A standard react Component for App be created by WebStorm
 * Author: suming
 * Date: 2017/10/30
 * Time: 上午10:22
 *
 */

import React, { Component, PropTypes } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'

export default class YearInput extends Component {
  constructor (props) {
    super(props)
    let defaultValue = props.defaultValue
    this.state = {
      year: defaultValue && defaultValue.getFullYear(),
      month: defaultValue && defaultValue.getMonth(),
      date: defaultValue && defaultValue.getDate(),
    }
  }

  onDateChange ({ year, month, date }) {
    year = year === '' ?undefined:parseInt(year)||this.state.year
    month = month ==='' ?undefined:(parseInt(month)>=1 && parseInt(month)<=12)?
      parseInt(month)-1:this.state.month
    date = date ==='' ?undefined:(parseInt(date)>=0 && parseInt(date)<=31)?
      parseInt(date):this.state.date
    let changeDate = new Date(year,month,date)
    this.props.onDateChange&&this.props.onDateChange(changeDate)
    this.setState({year,month,date})
  }

  render () {
    let {year, month, date} = this.state

    return <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={year>0?year+'':''}
        onChange={(e) => this.onDateChange({year:e.nativeEvent.text})}
        maxLength={4}
        keyboardType='numeric'
        placeholder='年' />
      <TextInput
        style={styles.input}
        value={month+1>0?month+1+'':''}
        onChange={(e) => this.onDateChange({month:e.nativeEvent.text})}
        maxLength={2}
        keyboardType='numeric'
        placeholder='月' />
      <TextInput
        style={styles.input}
        value={date>0?date+'':''}
        onChange={(e) => this.onDateChange({date:e.nativeEvent.text})}
        maxLength={2}
        keyboardType='numeric'
        placeholder='日' />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    margin: 4,
    borderColor: 'blue',
    borderWidth: StyleSheet.hairlineWidth || 1,
    textAlign: 'center',
    fontSize:14,
  }
})

YearInput.propTypes = {
  defaultValue: PropTypes.object
}