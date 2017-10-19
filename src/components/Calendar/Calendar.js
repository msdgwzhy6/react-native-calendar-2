/**
 * A standard react Component for App be created by WebStorm
 * Author: suming
 * Date: 2017/10/19
 * Time: 下午2:37
 *
 */

import React, { Component } from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'
import calendar from './utils/calendar'

const columnHeaders = ['日', '一', '二', '三', '四', '五', '六']

export default class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentDate:new Date()
    };
  }

  measureView (event) {
    console.log(event)
  }

  render () {
    let animal = calendar.getAnimal(2017)
    console.log(animal)
    return <View onLayout={this.measureView}>
      {this.renderColumnHeaders()}
      {this.renderDateRows()}
    </View>
  }

  renderColumnHeaders () {
    return <View style={styles.columnHeadersContainer}>
      {columnHeaders.map((item,index) =>{
        let itemStyle = {
          width:45,
          height:'100%',
          justifyContent:'center',
          borderWidth:1
        }
        itemStyle.borderBottomWidth=0
        if(index!==0) itemStyle.borderLeftWidth=0
        return  <View
          key= {item}
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
    let firstDate = new Date(this.state.currentDate)
    firstDate.setDate(1)
    let a = []
    let cursorDate = new Date(firstDate)
    cursorDate.setDate(1-firstDate.getDay())
    for (let i = 0; i < 5; i++) {
      let row = []
      for (let i = 0; i < 7; i++) {
        row.push(calendar.solar2lunar(cursorDate.getFullYear(),cursorDate.getMonth()+1,cursorDate.getDate()))
        cursorDate.setDate(cursorDate.getDate()+1)
      }
      a.push(row)
    }
    return <View>
      {
        a.map((item,index1) => <View
          key= {index1}
          style={styles.rowContainer}>
            {item.map((item,index2) =>{
              let itemStyle = {
                width:45,
                height:'100%',
                justifyContent:'center',
                borderWidth:1
              }
              if(index1!==0) itemStyle.borderTopWidth=0
              if(index2!==0) itemStyle.borderLeftWidth=0
              return <View
                key= {item.IDayCn+ index2}
                style={itemStyle}>
                <Text
                  style={styles.itemText}>
                  {item.cDay+'\n'+(item.isTerm?item.Term:item.IDayCn)}
                </Text>
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
    
  },
  columnHeadersContainer:{
    flexDirection: 'row',
    height:45,
  },
  rowContainer: {
    flexDirection: 'row',
    height:45,
  },
  itemText:{
    fontSize:12,
    textAlign:'center',
    textAlignVertical:'center',
    padding:0,
  }
})