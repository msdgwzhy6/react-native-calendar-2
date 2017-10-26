/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2017/10/25
 * Time: 下午3:35
 *
 */
 
export default class CalendarManager {

  constructor(punchDates, markDates){
    this.punchDates = []
    this.markDates = []
    if(Array.isArray(punchDates)){
      for (let i = 0; i < punchDates.length; i++) {
        let date = punchDates[i] instanceof Date ? punchDates[i] :new Date(punchDates[i].toString())
        !isNaN(date.getTime())&&this.punchDates.push(date)
      }

    }
    if(Array.isArray(markDates)){
      for (let i = 0; i < markDates.length; i++) {
        let mark = markDates[i]
        let date = mark.date instanceof Date ? mark.date : new Date(mark.date.toString())
        !isNaN(date.getTime())&&this.markDates.push({
          ...mark,
          date
        })
      }
    }
  }

  /**
   * 是否已经签到
   * @param date
   * @returns {boolean}
   */
  isHasPunchByDay(date){
    for (let i = 0; i < this.punchDates.length; i++) {
      let punchDate = this.punchDates[i]
      if(date.getFullYear() === punchDate.getFullYear()
         && date.getMonth() === punchDate.getMonth()
         && date.getDate() === punchDate.getDate()){
        return true
      }
    }
    return false
  }

  /**
   * 获取备注
   * @param date
   * @returns {*}
   */
  getMarkByDay(date){
    for (let i = 0; i < this.markDates.length; i++) {
      let markDay = this.markDates[i].date
      if(date.getFullYear() === markDay.getFullYear()
        && date.getMonth() === markDay.getMonth()
        && date.getDate() === markDay.getDate()){
        return this.markDates[i]
      }
    }
    return undefined
  }

}