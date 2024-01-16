const TAG = 'UserService.js ';
const { UserSchema } = require('../models/model');
const { User } = require('../configs/DatabaseConfig');
const md5 = require('md5');
// const uniqueShortId = require('../configs/uniqueShortId');
// const redisService = require('../services/redisService');

class UserService {
    constructor() {
        //   this.httpDao = new HttpDao();
    }
    createUser(input) {
        return new Promise(async (resolve, reject) => {
            try {
                // const { email, password } = input;
                console.log("in createUser service", input)
                if (!input.email || !input.password) {
                    return reject({ http_code: 401, message: 'email and password are required' });
                }
                const hashedPassword = md5(input.password);
                console.log(`in ${TAG} createUser`);
                const user = new UserSchema();
                user.email = input.email;
                user.first_name = input.first_name;
                user.last_name = input.last_name;
                user.password = hashedPassword;
                // user.shortUser = uniqueShortId.generate();
                // user.count = input.count ? input.count : 0;
                const res = await User.create(user);
                resolve(makeResult(201, res));
            } catch (e) {
                console.log(`${TAG} error : ${e}`);
                reject(e);
            }
        });
    }

    getUser(input) {
        return new Promise(async (resolve, reject) => {
            try {
                // let redisRes = await redisService.getRedis(input.id)
                // if (redisRes) {
                //     console.log("Found in redis", input.id, redisRes)
                //     resolve(makeResult(201, { redisRes }));
                // } else {
                // console.log("Not found in redis, searching in DB...")
                console.log("in user service", input)
                // const { username, password } = input;
                if (!input.email || !input.password) {
                    return reject({ http_code: 401, message: 'email and password are required' });
                }
                const hashedPassword = md5(input.password);
                const user = await User.findOne({ where: { email: input.email } });
                console.log("db user", user)
                if (!user) {
                    return reject(makeResult(401, "no record found"))
                }
                if (user.password != hashedPassword) {
                    return reject(makeResult(401, "wrong password"))
                }
                // let insertRes = await redisService.insertRedis(res);
                // if (insertRes) {
                //     console.log(insertRes)
                //     const newRes = await User.findOne({ where: { shortUser: insertRes.delKey } });
                //     newRes.count = insertRes.delCount
                //     const updateDbRes = await newRes.save({ fields: ['count'] });
                // }
                resolve(makeResult(201, { email: user.email, first_name: user.first_name, last_name: user.last_name }));
                // }
            } catch (e) {
                console.log(`${TAG} error : ${e}`);
                reject(e);
            }
        });
    }
}

const userService = new UserService();
module.exports = userService;