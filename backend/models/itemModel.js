import mongoose from 'mongoose';


const { Schema } = mongoose;

const ItemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Item = mongoose.model('Item', ItemSchema);
  export default Item;