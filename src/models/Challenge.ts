import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
    title: string;
    description: string;
    category: string;
    points: number;
    flag: string;
    file_url?: string;
    external_link?: string;
    is_hidden: boolean;
    created_at: Date;
    updated_at: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: { type: String, required: true, trim: true },
        points: { type: Number, required: true, min: 0 },
        flag: { type: String, required: true, select: false }, // Hidden by default
        file_url: { type: String },
        external_link: { type: String },
        is_hidden: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
