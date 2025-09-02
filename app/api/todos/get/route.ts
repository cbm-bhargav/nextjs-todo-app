// import { prisma } from '@/lib/prisma'
// import { NextRequest, NextResponse } from 'next/server'
// import jwt from 'jsonwebtoken'
// import { getJwtConfig } from '@/lib/jwt-config'

// export async function GET(req: NextRequest) {
//   const { clientSecret } = await getJwtConfig();

//   const token = req.cookies.get('token')?.value
//   if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

//   const { userId }: any = jwt.verify(token, clientSecret!)

//   const todos = await prisma.todo.findMany({
//     where: { userId },
//     orderBy: { createdAt: 'desc' },
//   })

//   return NextResponse.json(todos)
// }

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { validateTokenAndGetUserId } from '@/lib/jwt-utils'

export async function GET(req: NextRequest) {
  console.log('=== DEBUG: GET /api/todos/get ===')
  
  // Debug: Check if token exists
  const token = req.cookies.get('token')?.value
  console.log('Token exists:', !!token)
  console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'No token')
  
  // Debug: Check cookies
  console.log('All cookies:', req.cookies.getAll())
  
  const validation = await validateTokenAndGetUserId(req)
  
  if (!validation.success) {
    console.log('Validation failed, returning response')
    return validation.response
  }
  
  console.log('Validation successful, userId:', validation.userId)
  
  const { userId } = validation

  try {
    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    console.log('Found todos:', todos.length)
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}