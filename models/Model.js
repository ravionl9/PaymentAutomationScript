class Model {
    constructor(collection) {
        this.collection = collection;
    }

    store(data) {
        return new Promise((resolve, reject) => {
            const collectionObject = new this.collection(data);

            collectionObject.save((err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }
}

module.exports = Model;