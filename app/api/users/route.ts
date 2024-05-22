import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../db/mongodb';
import User from '../../../models/user';

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const filter = searchParams.get('filter') || '';
  const skip = (page - 1) * limit;
  const query = filter ? { status: filter } : {};

  const users = await User.find(query).skip(skip).limit(limit);
  const total = await User.countDocuments(query);

  return NextResponse.json({ users, total });
}
