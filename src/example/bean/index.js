/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 下午2:44
 *
 */

import { generateUUID } from '../utils/Utils'

export class PunchTask {
  constructor(title, desc, rules) {
    this.id = generateUUID()
    this.title = title
    this.desc = desc
    this.createdAt = new Date()
    this.rules = rules
    this.punchDates = []
  }

  punchToDate(){
    let date = new Date()
    for (let i = 0; i < this.punchDates.length; i++) {
        if(date.toDateString() === this.punchDates[i].toDateString()){
          //已经签到了
          return false
        }
    }
    this.punchDates.push(date)
    return true
  }

  toString(){
    return this.title
  }
}

export class PunchRule {
  constructor(startTime, endTime) {
    this.id = generateUUID()
    this.starTime = startTime
    this.endTime = endTime
  }
}