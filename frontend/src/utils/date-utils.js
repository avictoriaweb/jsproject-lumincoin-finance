export class DateUtils {
    static formatDateForTransactionsTable(date) {
       if(date) {
           const [year, month, day] = date.split('-');

        return `${day}.${month}.${year}`;}

    }
}