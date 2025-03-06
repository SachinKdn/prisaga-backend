import mongoose, { Types } from "mongoose";
import { BaseSchema } from "../helper/response";


const Schema = mongoose.Schema;

export interface IToken extends BaseSchema {
userId:Types.ObjectId; 
accessToken:string;
refreshToken:string;
expireAt:Date
}

const TokenSchema = new Schema<IToken>(
  {
   userId : {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   accessToken:{type:String ,required:true},
   refreshToken : {type : String  ,required:true},
   expireAt : {type : Date  ,required:true}

  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model<IToken>(
  "TokenSchema",
  TokenSchema
);