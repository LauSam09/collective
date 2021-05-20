export class DateService {
  /** Returns an int representing the day of the week. 0 = Monday, 1 = Tuesday, etc.*/
  static getCurrentDay() {
    const day = (new Date()).getDay() // Returns day based on 0 = Sunday.
    return day === 0 ? 6 : day - 1;
  }
}