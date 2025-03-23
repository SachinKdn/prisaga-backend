import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/user";
import { hashPassword } from "../services/user.service";
import { Location } from "../interfaces/location";
import { UserRole } from "../interfaces/enum";

export const locationSchema = new Schema<Location>({
    area: { type: String, required: false },
    postalCode: { type: Number, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
  });
  
  const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    location: { type: locationSchema, required: false },
    password: { type: String, required: false },
    role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.USER },
    linkedin: { type: String, required: false },
    createdBy: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency'
    }
  }, { timestamps: true });

// // Hash the password before saving the user document
// userSchema.pre<IUserDocument>("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await hashPassword(this.password);
//     }
//     next();
// });
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      console.log("Password Modified")
      this.password = await hashPassword(this.password);
    }
    next();
  });


// Export the Mongoose model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
