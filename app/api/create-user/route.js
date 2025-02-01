import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { models } from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    // Check if user exists
    const existingUser = await models.User.findOne({ mailId: data.mailId });

    if (existingUser) {
      // Update existing user
      const updatedUser = await models.User.findOneAndUpdate(
        { mailId: data.mailId },
        data,
        { new: true, runValidators: true }
      );

      return NextResponse.json(
        { message: 'User updated successfully', user: updatedUser },
        { status: 200 }
      );
    }

    // Create new user
    const user = new models.User(data);
    await user.save();

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating/updating user' },
      { status: 500 }
    );
  }
}