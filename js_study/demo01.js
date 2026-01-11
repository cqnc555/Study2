'use strict';

let xiaoming = {
    name: '小明',
    birth: 1990,
    age: function () {
        let that = this; // 在方法内部一开始就捕获this
        function getAgeFromBirth() {
            let y = new Date().getFullYear();
            return y - that.birth; // 用that而不是this
        }
        return getAgeFromBirth();
    }
};

// xiaoming.age(); // 25


console.log(xiaoming.age)

console.log(xiaoming.age())
// console.log("123")