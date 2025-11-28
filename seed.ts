import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Define schemas inline to avoid import issues in standalone script
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'player'], default: 'player' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const ChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    points: { type: Number, required: true },
    flag: { type: String, required: true },
    file_url: { type: String },
    external_link: { type: String },
    is_hidden: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Challenge.deleteMany({});
        console.log('Cleared existing data');

        // Create Admin User
        const adminPassword = await hash('admin123', 10);
        await User.create({
            username: 'admin',
            email: 'admin@ctf.local',
            password_hash: adminPassword,
            role: 'admin',
        });
        console.log('Created admin user: admin@ctf.local / admin123');

        // Create Sample Challenges
        const challenges = [
            {
                title: 'Welcome to the CTF',
                description: 'Welcome to our CTF event! This is a sanity check challenge.\n\nThe flag is: `CTF{welcome_to_the_game}`',
                category: 'Misc',
                points: 10,
                flag: 'CTF{welcome_to_the_game}',
                is_hidden: false,
            },
            {
                title: 'Base64 Madness',
                description: 'Can you decode this message?\n\n`Q1RGe2Jhc2U2NF9pc19ub3RfZW5jcnlwdGlvbn0=`',
                category: 'Crypto',
                points: 50,
                flag: 'CTF{base64_is_not_encryption}',
                is_hidden: false,
            },
            {
                title: 'Hidden in Plain Sight',
                description: 'Sometimes the answer is right in front of you. Check the HTML source code of this page (hypothetically).',
                category: 'Web',
                points: 100,
                flag: 'CTF{inspect_element_master}',
                is_hidden: false,
            },
            {
                title: 'Math Whiz',
                description: 'What is the answer to life, the universe, and everything? Format: `CTF{number}`',
                category: 'Misc',
                points: 20,
                flag: 'CTF{42}',
                is_hidden: false,
            },
            {
                title: 'Secret Agent',
                description: 'This challenge is only for elite hackers. You need to find the secret agent.',
                category: 'Forensics',
                points: 200,
                flag: 'CTF{007_bond}',
                is_hidden: true, // Hidden challenge
            },
        ];

        await Challenge.insertMany(challenges);
        console.log(`Created ${challenges.length} challenges`);

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
