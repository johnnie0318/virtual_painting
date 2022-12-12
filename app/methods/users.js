const Users = require('../models/users');

const addUser = async(data) => {
    if(!data.firstname || !data.lastname || !data.email) {
        console.log(data);
        console.log(`Data is undefined in addUser`);
        return false;
    }

    //Check if user username already exists
    feedback = await Users.exists({ email: data.email });
    if (feedback) {
        console.log(`user exist while add User: ${data.firstname} ${data.lastname}`);
        const updateInfo = await Users.updateOne({email: data.email}, {firstname: data.firstname, lastname: data.lastname});
        if (updateInfo) {
            console.log("User data updated")  // Success
            return true;
        } else {
            console.log(updateInfo)      // Failure
            return true;
        }
    }

    const user = new Users(data);
    
    const insertInfo = await user.save();
    if (insertInfo) {
        console.log("User data inserted")  // Success
        return true;
    } else {
        console.log(insertInfo)      // Failure
        return false;
    }
}

const deleteUser = async(data) => {
    if(!data.email) {
        console.log(`Data is undefined in deleteUser`);
        return false;
    }

    //Check if user username not exists
    feedback = await Users.exists({ email: data.email });
    if (!feedback) {
        error = 'User not  exists, Try again!';
        console.log('error while delete User: ', error);
        return false;
    }

    const deleteInfo = await Users.deleteOne({email: data.email});
    if (deleteInfo) {
        console.log("User data deleted")  // Success
        return true;
    } else {
        console.log(deleteInfo)      // Failure
        return true;
    }
}

const getUserList = async() => {
    const result = await Users.find();
    if (!result) return [];
    return result;
}

module.exports = {
    addUser,
    deleteUser,
    getUserList,
};