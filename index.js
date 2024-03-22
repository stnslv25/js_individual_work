const fs = require('fs')

class TransactionAnalyzer {
    transactions = [];
    
    constructor(transactionsArray){
        this.transactions = transactionsArray;
    }

    addTransactions(transaction){
        this.transactions.push(transaction);
    }

    getAllTransactions(){
        return this.transactions;
    }

    addToAllString() {
        this.transactions.forEach((item) => {
            if(!('string' in item)){
                item.string = function(){ return JSON.stringify(item) }
            }
        })
    }

    getUniqueTransactionType(type){
       const uniqueSet = new Set();

       this.transactions.forEach(item => {
        if (item.transaction_type === type) {
            uniqueSet.add(item);
        }})

       return Array.from(uniqueSet);
    }

    calculateTotalAmount(){
        return this.transactions.reduce((acc,val) => {
            return acc + val.transaction_amount;
        }, 0);
    }

    calculateTotalAmountByDate(year, month, day) {
        return this.transactions.reduce((acc, val) => {
            const date = new Date();
            date.setFullYear(year);
            date.setMonth(month - 1); // In JS month start with 0
            date.setDate(day);
    
            const transactionDate = new Date(val.transaction_date);
    
            if (
                transactionDate.getDate() === date.getDate() &&
                transactionDate.getMonth() === date.getMonth() &&
                transactionDate.getFullYear() === date.getFullYear()
            ) {
                return acc + val.transaction_amount;
            } else {
                return acc;
            }
        }, 0);
    }

    getTransactionByType(type){
        return this.transactions.find(item => item.transaction_type == type) || {};
    }

    getTransactionsInDateRange(startDate, endDate) {
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }

    getTransactionsByMerchant(merchantName){
        return this.transactions.reduce((acc, val) => {
            if(val.merchant_name == merchantName){
                acc.push(val);
            }
            return acc;
        }, [])
    }

    calculateAverageTransactionAmount() {
        return this.calculateTotalAmount() / this.transactions.length;
    }

    getTransactionsByAmountRange(minAmount, maxAmount){
        return this.transactions.reduce((acc, val) => {
            if(val.transaction_amount >= minAmount && val.transaction_amount <= maxAmount){
                acc.push(val);
            }
            return acc;
        }, [])
    }

    calculateTotalDebitAmount(){
        return this.transactions.reduce((acc, val) => {
            if(val.transaction_type == 'debit'){
                return acc + val.transaction_amount;
            }
            return acc;
        }, 0)
    }

    findMostTransactionsMonth(arr){
        const monthCount = {};
        if(arr == undefined){
            arr = this.transactions;
        }

        arr.forEach((item) => {
            const month = new Date(item.transaction_date).getMonth() + 1;

            if(month in monthCount){
                monthCount[month] = monthCount[month] + 1;
            }else{
                monthCount[month] = 1;
            }
        })

        let mostTransactionsMonth = [];
        let maxTransactionCount = 0;
    
        for (const month in monthCount) {
            if (monthCount[month] > maxTransactionCount) {
                maxTransactionCount = monthCount[month];
            }
        }

        for(const month in monthCount){
            if(monthCount[month] == maxTransactionCount){
                mostTransactionsMonth.push(parseInt(month))
            }
        }
    
        return mostTransactionsMonth.length == 1 ? mostTransactionsMonth[0] : mostTransactionsMonth;
    }

    findMostDebitTransactionMonth(){
        return this.findMostTransactionsMonth(this.transactions.filter(item => item.transaction_type == 'debit'));
    }

    mostTransactionTypes(){
        const debitLength = this.transactions.filter(item => item.transaction_type == 'debit').length;
        const creditLength = this.transactions.filter(item => item.transaction_type == 'credit').length;

        if(debitLength == creditLength){
            return 'equal'
        }else{
            return debitLength > creditLength ? 'debit' : 'credit';
        }
    }

    getTransactionsBeforeDate(date){
        return this.transactions.filter(item => {
            return new Date(item.transaction_date) < date;
        })
    }

    findTransactionById(id){
        return this.transactions.find(item => item.transaction_id == id) || {};
    }

    mapTransactionDescriptions(){
        return this.transactions.map(item => {
            return item.transaction_description;
        })
    }
}

let jsonData = [];

const data = fs.readFileSync('transaction.json', 'utf8');
jsonData = JSON.parse(data);

const analyzer = new TransactionAnalyzer(jsonData);
analyzer.addToAllString();

// console.log(analyzer.getUniqueTransactionType('debit'));
// console.log(analyzer.calculateTotalAmount());
// console.log(analyzer.calculateTotalAmountByDate(2019, 4, 30));
// console.log(analyzer.getTransactionByType('credit'));
// console.log(analyzer.getTransactionsInDateRange(new Date('2019-04-28'), new Date())) 
// console.log(analyzer.getTransactionsByMerchant('DoughnutShop789'));
// console.log(analyzer.calculateAverageTransactionAmount());
// console.log(analyzer.getTransactionsByAmountRange(80,100));
// console.log(analyzer.calculateTotalDebitAmount());
// console.log(analyzer.findMostTransactionsMonth());
// console.log(analyzer.findMostDebitTransactionMonth());
// console.log(analyzer.mostTransactionTypes());
// console.log(analyzer.getTransactionsBeforeDate(new Date('2019-01-06')))
// console.log(analyzer.findTransactionById(26))
// console.log(analyzer.mapTransactionDescriptions());



