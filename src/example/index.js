/**
 * A standard react Component for App be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 下午3:52
 *
 */

import React, { Component } from 'react'
import {
  Button,
  StyleSheet, Text,
  View
} from 'react-native'
import Calendar from '../Calendar/Calendar'
import MarkModal from './components/MarkModal'
import { punchHelper } from './utils/PunchHelper'
import { PunchRule, PunchTask } from './bean'

const punchDates = ['2017-10-22', '2017-10-23', '2017-10-24']
const markDates = [
  {
    date: '2017-10-22',
    content: '。。。。'
  },
  {
    date: '2017-10-25',
    content: 'DDDDD'
  }
]

export default class Punches extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selectDate: undefined,
      currentTask: undefined
    }
  }

  componentDidMount(){
    punchHelper.getAllTask()
      .then((tasks) => {
        console.log('suming-log',tasks)
      })
      .catch((error) => {
        console.log('suming-log',error)
      })
  }

  onSelectDayChange (date) {
    this.setState({
      selectDate: date
    })
  }

  showMarkDialog(date){
    this.markDialog.show(date)
  }

  createNewTask(){
    let rule = new PunchRule('全天', 0, 24)
    let task = new PunchTask('测试','测试描述',[rule])
    punchHelper.createNewTask(task)
      .then((result) => {
        if(!result){
          this.setState({
            currentTask: task
          })
        }
      })
      .catch((error) => {
        console.log('suming-log',error)
      })
  }

  punch(){
    punchHelper.punchDate(this.state.currentTask.id)
  }

  render () {
    return (
      <View style={styles.container}>
        <Button onPress={this.createNewTask.bind(this)} title='新建'/>
        {/*<Calendar*/}
          {/*punchDates={punchDates}*/}
          {/*markDates={markDates}*/}
          {/*onLongPressDate={this.showMarkDialog.bind(this)}*/}
          {/*onSelectDate={this.onSelectDayChange.bind(this)} />*/}
        <Button onPress={this.punch.bind(this)} title='签到'/>
        {/*{this.renderDateDetail()}*/}
        <MarkModal
          ref = {(ref) => this.markDialog = ref}
        />
      </View>
    )
  }

  renderDateDetail () {
    // let lunar = calendar.solar2lunar(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())
    if (this.state.selectDate) {
      let { lunar, mark } = this.state.selectDate
      return <View>
        <Text>
          {
            `
          生肖：${lunar.Animal}
          农历日期：${lunar.gzYear}年 ${lunar.isLeap ? '闰' : ''}${lunar.gzMonth}月 ${lunar.gzDay}日
          星座：${lunar.astro}
          备注：${mark ? mark.content : '无'}`
          }
        </Text>
      </View>
    } else return <View />

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
})