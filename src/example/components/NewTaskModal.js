/**
 * A standard react Component for App be created by WebStorm
 * Author: suming
 * Date: 2017/10/30
 * Time: 上午9:58
 *
 */

import React, { Component } from 'react'
import { View, StyleSheet, Modal, Text, TextInput, Button } from 'react-native'
import YearInput from './YearInput'
import { PAGE_WIDTH } from '../../Calendar/constants'

export default class NewTaskModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      title:undefined,
      desc:undefined,
      startTime:new Date(),
      endTime:undefined
    };
  }

  componentDidMount(){
    this.callback = undefined
  }

  show (callback) {
    this.setState({
      visible: true
    })
    this.callback = callback
  }

  close () {
    this.setState({
      visible: false
    })
  }

  onTaskTitleChange(title){
    this.setState({
      title
    })
  }

  onTaskDescChange(desc){
    this.setState({
      desc
    })
  }

  onStartTimeChange(date){
    this.setState({
      startTime: date
    })
  }

  onEndTimeChange(date){
    this.setState({
      endTime: date
    })
  }

  onSubmit () {
    //检查表单是否填写错误
    let {title, desc, startTime, endTime} = this.state
    if(title === undefined || title === ''){
      alert('标题不可为空')
      return
    }
    if(desc === undefined || desc === ''){
      alert('描述不可为空')
      return
    }
    if(!startTime||isNaN(startTime.getTime()) || startTime.getFullYear()<1900 || startTime.getFullYear()>2100){
      alert('请输入合法的起始日期(1900-2100)')
      return
    }
    if(!endTime||isNaN(endTime.getTime()) || endTime.getFullYear()<1900 || endTime.getFullYear()>2100){
      alert('请输入合法的结束日期(1900-2100)')
      return
    }
    this.callback&&this.callback({
      title,
      desc,
      startTime,
      endTime
    })
    this.close()
  }

  render () {
    return<Modal
      animationType={'fade'}
      transparent={true}
      visible={this.state.visible}
      onRequestClose={this.close.bind(this)}
    >
      <View style={styles.container}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>新建任务</Text>
          <View style={styles.dateContainer}>
            <Text>任务标题：</Text>
            <TextInput
              onChange={(e) => this.onTaskTitleChange(e.nativeEvent.text)}
              style={styles.input}/>
          </View>
          <View style={styles.dateContainer}>
            <Text>任务描述：</Text>
            <TextInput
              onChange={(e) => this.onTaskDescChange(e.nativeEvent.text)}
              style={styles.input}/>
          </View>
          <View style={styles.dateContainer}>
            <Text>起始日期：</Text>
            <YearInput
              defaultValue={this.state.startTime}
              onDateChange={this.onStartTimeChange.bind(this)}
            />
          </View>
          <View style={styles.dateContainer}>
            <Text>结束日期：</Text>
            <YearInput
              onDateChange={this.onEndTimeChange.bind(this)}
            />
          </View>
          {/*<Text>日期筛选</Text>(不选则是不筛选，工作日、指定日期、周末)*/}
          {/*<Text>起始时间</Text><Text>结束时间</Text>(不选则是全天都可签到，选择了则是在规定时间内才可签到)*/}
          <Button
            style={styles.button}
            title='确定'
            onPress={this.onSubmit.bind(this)} />
        </View>
      </View>
    </Modal>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  dialogContainer: {
    width: PAGE_WIDTH - 48,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 16
  },
  title: {
    fontSize: 15,
    marginBottom: 4
  },
  dateContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'100%'
  },
  input:{
    fontSize:16,
    height:24,
    flex:1,
    margin:4,
  },
  button: {}
})