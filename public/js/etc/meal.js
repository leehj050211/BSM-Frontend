const mealView = Vue.createApp({
    data() {
        return {
            morning:'',
            lunch:'',
            dinner:'',
            hover:2
        }
    },
    methods: {
        setHover: function(hover) {
            this.hover = hover;
        }
    }
}).mount('.meals');
let times, today, day, date, month, year, mealDate;
let mealTable = [];
const dayTable = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
times = new Date();
today = new Date(times);
const mealRefresh = () => {
    $('.loading').classList.add("on");
    day = dayTable[today.getDay()];
    date = today.getDate();
    month = today.getMonth()+1;
    year = today.getFullYear();
    ajax({
        method:'get',
        url:`/meal/${year}-${month}-${date}`,
        errorCallback:(data) => {
            mealRender();
            if (data.statusCode == 404) {
                return true;
            }
        },
        callback:(data) => {
            if (data.meal != null) {
                const meal = data.meal;
                mealTable[year+'-'+month+'-'+date] = {
                    'morning':meal.morning?.replaceAll('<br/>', '\n'),
                    'lunch':meal.lunch?.replaceAll('<br/>', '\n'),
                    'dinner':meal.dinner?.replaceAll('<br/>', '\n')
                };
            }
            mealRender();
        }
    })
}
const mealRender = () => {
    $('.meal_date').innerHTML = (today.getMonth()+1)+'월'+today.getDate()+'일 '+day;
    if (mealTable.hasOwnProperty(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())) {
        mealView.morning = mealTable[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['morning'];
        mealView.lunch = mealTable[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['lunch'];
        mealView.dinner = mealTable[today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()]['dinner'];
    } else {
        mealView.morning = null;
        mealView.lunch = null;
        mealView.dinner = null;
    }
}
window.addEventListener('DOMContentLoaded', () => {
    mealRefresh();
})