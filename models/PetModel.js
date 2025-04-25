import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const petSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },  
    type: { 
        type: String, 
        required: true 
    },  
    age: { 
        type: Number, 
        required: true 
    },  
    sex: { 
        type: String, 
        enum: ['macho', 'hembra'], 
        required: true 
    },  
    description: { 
        type: String, 
        required: true 
    },
    caretaker: { 
        type: String, 
        required: true 
    }, 
    image: { 
        type: String, 
        required: false 
    }
});

const Pet = mongoose.model('pets', petSchema);

export default Pet;