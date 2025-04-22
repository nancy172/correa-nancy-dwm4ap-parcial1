import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const mySchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
    }
});

const User = mongoose.model('users', mySchema);

export default User;