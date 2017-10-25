/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 下午2:44
 *
 */


export class PunchTask {
  constructor(title, desc) {
    this.title = title
    this.desc = desc
    this.createdAt = new Date()
    this.rules = [
    ]
  }
}

export class PunchRule {
  constructor(name, startTime, endTime) {
    this.name = name
    this.starTime = startTime
    this.endTime = endTime
  }
}