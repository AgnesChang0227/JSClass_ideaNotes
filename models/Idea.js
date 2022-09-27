import mongoose from "mongoose";

const {Schema} = mongoose;

const IdeaSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            required: true,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true,//original true
        },
        date: {
            type: Date,
            default:Date.now,
        },
    }
);
const Idea = mongoose.model("ideas",IdeaSchema);
export default Idea;