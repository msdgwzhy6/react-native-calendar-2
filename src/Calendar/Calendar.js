/**
 * A standard react Component for App be created by WebStorm
 * Author: suming
 * Date: 2017/10/19
 * Time: 下午2:37
 *
 */

import React, { Component, PropTypes } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Button, TouchableWithoutFeedback } from 'react-native'
import calendar from './utils/calendar'
import Dropdown from './Dropdown'
import CalendarManager from './utils/CalendarHelper'

const allYears = [];
(() => {
  for (let i = 0; i <= 200; i++) {
    allYears.push(1900 + i)
  }

})()
const allMonth = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const allDays = ['日', '一', '二', '三', '四', '五', '六']

export default class Calendar extends Component {

  constructor (props) {
    super(props)
    let { punchDates, markDates } = props
    this.calendarManager = new CalendarManager(punchDates, markDates)
    this.state = {
      currentDate: new Date()
    }
  }

  componentDidMount(){
    this.onSelectedDate(this.state.currentDate)
  }

  onSelectedDate(date){
    let lunar = calendar.solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate())
    let mark = this.calendarManager.getMarkByDay(date)
    this.props.onSelectDate&&this.props.onSelectDate({
      lunar,
      mark
    })
  }

  onDateLongPress (date) {
    this.props.onLongPressDate&&this.onLongPressDate(date)
  }

  onYearChange (value) {
    let year = parseInt(value)
    this.setState((pre) => {
      let newDate = new Date(pre.currentDate)
      newDate.setYear(year)
      return {
        currentDate: newDate
      }
    })
  }

  onMonthChange (value) {
    let month = parseInt(value) - 1
    this.setState((pre) => {
      let newDate = new Date(pre.currentDate)
      newDate.setMonth(month)
      return {
        currentDate: newDate
      }
    })
  }

  onDateChange (value) {
    this.setState({
      currentDate: value
    })
  }

  onMonthMinus () {
    let month = this.state.currentDate.getMonth()
    let year = this.state.currentDate.getFullYear()
    if (month - 1 < 0) {
      this.onMonthChange(11)
      this.onYearChange(year - 1)
    } else {
      this.onMonthChange(month)
    }
  }

  onMonthPlus () {
    let month = this.state.currentDate.getMonth()
    let year = this.state.currentDate.getFullYear()
    if (month + 1 > 11) {
      this.onMonthChange(1)
      this.onYearChange(year + 1)
    } else {
      this.onMonthChange(month + 2)
    }
  }

  backToday () {
    this.onDateChange(new Date())
  }

  render () {
    return <View>
      {this.renderFilterViews()}
      {this.renderColumnHeaders()}
      {this.renderDateRows()}
    </View>
  }

  renderFilterViews () {
    let currentDate = this.state.currentDate
    return <View style={styles.rowContainer}>
      <Dropdown options={allYears}
                style={styles.dropdown}
                onSelect={this.onYearChange.bind(this)}
                value={currentDate.getFullYear() + ''}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
      />
      <TouchableOpacity
        onPress={this.onMonthMinus.bind(this)}
      >
        <Text style={{
          fontSize: 18,
        }}>
          {'<'}
        </Text>
      </TouchableOpacity>
      <Dropdown options={allMonth}
                style={styles.dropdown}
                onSelect={this.onMonthChange.bind(this)}
                value={(currentDate.getMonth() + 1) + '月'}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_dropdown}
      />
      <TouchableOpacity
        onPress={this.onMonthPlus.bind(this)}
      >
        <Text style={{
          fontSize: 18,
        }}>
          {'>'}
        </Text>
      </TouchableOpacity>

      <Button
        onPress={this.backToday.bind(this)}
        title='返回今天' />
    </View>
  }

  renderColumnHeaders () {
    return <View style={styles.columnHeadersContainer}>
      {allDays.map((item, index) => {
          let itemStyle = {
            width: 45,
            height: '100%',
            justifyContent: 'center',
            borderWidth: 1
          }
          itemStyle.borderBottomWidth = 0
          if (index !== 0) itemStyle.borderLeftWidth = 0
          return <View
            key={item}
            style={itemStyle}>
            <Text key={item} style={styles.itemText}>
              {item}
            </Text>
          </View>
        }
      )}
    </View>
  }

  renderDateRows () {
    //得到当月第一天是星期几
    let currentDate = this.state.currentDate
    let firstDate = new Date(currentDate)
    firstDate.setDate(1)
    let a = []
    let cursorDate = new Date(firstDate)
    cursorDate.setDate(1 - firstDate.getDay())
    for (let i = 0; i < 5; i++) {
      let row = []
      for (let i = 0; i < 7; i++) {
        row.push(calendar.solar2lunar(cursorDate.getFullYear(), cursorDate.getMonth() + 1, cursorDate.getDate()))
        cursorDate.setDate(cursorDate.getDate() + 1)
      }
      a.push(row)
    }
    return <View>
      {
        a.map((item, index1) => <View
            key={index1}
            style={styles.rowContainer}>
            {item.map((item, index2) => {
                let itemStyle = {
                  width: 45,
                  height: '100%',
                  justifyContent: 'center',
                  borderWidth: 1
                }
                let itemTextStyle = {
                  color: 'black'
                }
                //item border
                if (index1 !== 0) itemStyle.borderTopWidth = 0
                if (index2 !== 0) itemStyle.borderLeftWidth = 0
                //today and selectDay
                if (item.isToday) {
                  itemStyle.backgroundColor = 'red'
                } else if (currentDate.getFullYear() === item.cYear
                  && currentDate.getMonth() === item.cMonth - 1
                  && currentDate.getDate() === item.cDay) {
                  itemStyle.backgroundColor = 'green'
                }
                //not current month's day
                if (currentDate.getMonth() !== item.cMonth - 1) {
                  itemTextStyle.color = 'gray'
                }
                let date = new Date(item.cYear, item.cMonth - 1, item.cDay)
              return<View style={styles.itemStyle}>
                <TouchableOpacity
                  onPress={() => this.onDateChange(date)}
                  onLongPress={() => this.onDateLongPress(date)}
                  key={index2}
                  style={itemStyle}>
                  <Text
                    style={[styles.itemText, itemTextStyle]}>
                    {item.cDay + '\n' + (item.isTerm ? item.Term : item.IDayCn)}
                  </Text>
                </TouchableOpacity>
                  {this.calendarManager.isHasPunchByDay(date)&& <View style={styles.punchDate}/>}
                </View>
              }
            )}
          </View>
        )
      }
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  columnHeadersContainer: {
    flexDirection: 'row',
    height: 45,
  },
  rowContainer: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center'
  },
  punchDate:{
    position:'absolute',
    width:'100%',
    height:'100%',
    top:0,
    left:0,
  },
  itemText: {
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 0,
  },
  dropdown: {
    width: 45,
    height: 25,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'blue',
  },
  dropdown_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_dropdown: {
    width: 45,
    borderColor: 'blue',
    borderWidth: 2,
    borderRadius: 3,
  }
})

Calendar.propTypes = {
  punchDates: PropTypes.array,  // 格式为可解析的时间字符串即可
  markDates: PropTypes.array,  // 格式为{ date , content}
  weekStart: PropTypes.number,  // 每星期从第几天开始{1-7}
  onSelectDate: PropTypes.func,  // 每次选中日期时回调，初始化时会回调一次
  onLongPressDate: PropTypes.func,  //长按日期时调用
}