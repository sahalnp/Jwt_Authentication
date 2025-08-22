import mongoose from "mongoose";
const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  refreshtoken: { type: String, required: true },
}, { timestamps: true });

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
