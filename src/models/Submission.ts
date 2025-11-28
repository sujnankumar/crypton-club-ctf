import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
    user_id: mongoose.Types.ObjectId;
    challenge_id: mongoose.Types.ObjectId;
    submitted_flag: string;
    is_correct: boolean;
    points_awarded: number;
    timestamp: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        challenge_id: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
        submitted_flag: { type: String, required: true },
        is_correct: { type: Boolean, required: true },
        points_awarded: { type: Number, default: 0 },
        timestamp: { type: Date, default: Date.now },
    }
);

// Compound index to quickly check if a user has solved a challenge
SubmissionSchema.index({ user_id: 1, challenge_id: 1, is_correct: 1 });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
