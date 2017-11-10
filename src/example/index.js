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
  StyleSheet,
  Text,
  View
} from 'react-native'
import Calendar from '../Calendar/Calendar'
import MarkModal from './components/MarkModal'
import { punchHelper } from './utils/PunchHelper'
import { PunchRule, PunchTask } from './bean'
import Dropdown from '../Calendar/Dropdown'
import NewTaskModal from './components/NewTaskModal'
import { maskHelper } from './utils/MaskHelper'

export default class Punches extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selectDate: undefined,
      currentTask: undefined,
      taskList:[],
      maskDates:[]
    }
  }

  componentDidMount(){
    punchHelper.getAllTask()
      .then((tasks) => {
        tasks.length>0 && this.setState({
          currentTask:tasks[0],
          taskList:tasks
        })
      })
      .catch((error) => {
        console.log('suming-log',error)
      })
    maskHelper.getAllMaskDates()
      .then((masks) => {
        this.setState({
          maskDates:masks
        })
      })
  }

  onSelectDayChange (date) {
    this.setState({
      selectDate: date
    })
  }

  showMarkDialog(date,maskDate){
    this.markDialog.show(maskDate && maskDate.content, (content) => {
      maskHelper.maskDate({
        date,
        content
      })
        .then((result) => {
          if(!result){
            return maskHelper.getAllMaskDates()
          }else throw new Error('未知异常')
        })
        .then((masks) => {
          this.setState((pre) => {
            let newState = {
              maskDates:masks
            }
            if(date.toLocaleDateString() === pre.selectDate.toLocaleDateString()){
              newState.selectDate = pre.selectDate
              newState.selectDate.mask.content = content
            }
            return newState
          })
          alert('签到成功')
        })
        .catch((error) => {
          console.log('suming-log',error)
        })
    })
  }

  createNewTask({title,desc, startTime, endTime}){
    let rule = new PunchRule( startTime.toLocaleString(), endTime.toLocaleString())
    let task = new PunchTask(title,desc,[rule])
    punchHelper.createNewTask(task)
      .then((result) => {
        if(!result){
          this.setState((pre) => {
            let newTasks = pre.taskList.slice()
            newTasks.push(task)
            return {
              taskList:newTasks,
              currentTask: task
            }
          })
        }
      })
      .catch((error) => {
        console.log('suming-log',error)
      })
  }

  punch(){
    if(this.state.currentTask){
      punchHelper.punchDate(this.state.currentTask.id)
        .then((task) => {
          alert('签到成功')
          this.setState({
            currentTask:task
          })
        })
        .catch((error) => {
          alert(error)
        })
    }else {
      alert('你还没有创建签到任务')
    }
  }

  onTaskChange(value){
    this.setState({
      currentTask:value
    })
  }

  render () {
    let punchDates = this.state.currentTask&&this.state.currentTask.punchDates||[]
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text>签到列表</Text>
          <Dropdown options={this.state.taskList}
                    style={styles.dropdown}
                    onSelect={this.onTaskChange.bind(this)}
                    value={this.state.currentTask}
                    textStyle={styles.dropdown_text}
                    dropdownItemStyle={{height:36}}
                    dropdownStyle={styles.dropdown_dropdown}
          />
          <Button onPress={() => {this.taskDialog.show(this.createNewTask.bind(this))}} title='新建任务'/>
        </View>
        <Calendar
          punchDates={punchDates}
          markDates={this.state.maskDates}
          onLongPressDate={this.showMarkDialog.bind(this)}
          onSelectDate={this.onSelectDayChange.bind(this)} />
        <Button onPress={this.punch.bind(this)} title='签到'/>
        {this.renderDateDetail()}
        <MarkModal
          ref = {(ref) => this.markDialog = ref}
        />
        <NewTaskModal ref = {(ref) => this.taskDialog = ref}/>
      </View>
    )
  }

  renderDateDetail () {
    if (this.state.selectDate) {
      let { lunar, mark } = this.state.selectDate
      return <View>
        <Text>
          {
            `
          生肖：${lunar.Animal}
          天干地支：${lunar.gzYear}年${lunar.gzMonth}月${lunar.gzDay}日
          农历日期：${lunar.lYear}年 ${lunar.isLeap ? '闰' : ''}${lunar.lMonth}月 ${lunar.lDay}日
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
  },
  titleContainer:{
    flexDirection:'row',
    alignItems:'center'
  },
  dropdown: {
    width: 180,
    height: 25,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'blue',
  },
  dropdown_text: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_dropdown: {
    width: 180,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 3,
  }
})