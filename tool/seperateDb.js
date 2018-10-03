const db = require('./newLocal.json');
const fs = require('fs');
const _ = require('lodash');

let newDb;
newDb = db.map((city) => {
    delete city.code;

    return {...city, districts: city.districts.map(d => {
        delete d.code;
        let array = [];
        d.school.forEach((c) => {
            c.school.forEach((s) => {
                if (s.id !== '99999') {
                    const check = array.find((t, key) => {
                        return t.id === s.id;
                    });
                    if (!check) {
                        array.push({
                            id: s.id,
                            name: s.name,
                            class: [c.id],
                        });
                    } else {
                        array = array.map((temp, k) => {
                            if (temp.id === s.id) {
                                temp.class = _.union(temp.class, [c.id]);
                            }
                            return temp;
                        });
                    }
                }
            })
        });
        d.schools = array;
        delete d.school;
        return d;
    })};
});

fs.writeFileSync('newLocal.json', JSON.stringify(newDb))
console.log('done!');
