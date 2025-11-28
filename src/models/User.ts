import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'player';
    created_at: Date;
    updated_at: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password_hash: { type: String, required: true },
        role: { type: String, enum: ['admin', 'player'], default: 'player' },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
