const bcrypt = require('bcryptjs');
export default (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        bcrypt.hash(password, 10, function (err:any, hash: string) {
            if (err) return reject(err);

            resolve(hash);
        });
    });
};