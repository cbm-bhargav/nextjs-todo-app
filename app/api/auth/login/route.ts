//app/api/auth/login/route.ts
import { prisma } from '@/lib/prisma'
import jwt from "jsonwebtoken"
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs';
import { getJwtConfig } from '@/lib/jwt-config'

export async function POST(req: Request) {
  const { clientSecret } = await getJwtConfig();

  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials 401' }, { status: 401 })
  }

  const isMatch = await bcrypt.compare(password, user.password); // Compare raw password with hashed

  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.id }, clientSecret!, { expiresIn: '7d' })

  const response = NextResponse.json({ message: 'Login successful' }, { status: 200 })
  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
