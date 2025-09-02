// import { prisma } from '@/lib/prisma'
// import { NextRequest, NextResponse } from 'next/server'
// import jwt from 'jsonwebtoken'
// import { getJwtConfig } from '@/lib/jwt-config'

// export async function PUT(req: NextRequest) {
//   const { clientSecret } = await getJwtConfig();

//   const token = req.cookies.get('token')?.value
//   if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

//   const { userId }: any = jwt.verify(token, clientSecret!)
//   const { id, title, completed } = await req.json()

//   const todo = await prisma.todo.updateMany({
//     where: {
//       id,
//       userId, // only allow editing own todo
//     },
//     data: { title, completed },
//   })

//   return NextResponse.json({ message: 'Updated', todo }, { status: 200 })
// }

// PUT Route - @/app/api/todos/update/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { validateTokenAndGetUserId } from '@/lib/jwt-utils'

export async function PUT(req: NextRequest) {
  const validation = await validateTokenAndGetUserId(req)
  
  if (!validation.success) {
    return validation.response
  }
  
  const { userId } = validation

  try {
    const { id, title, completed } = await req.json()
    
    const todoId = parseInt(id, 10)
    if (isNaN(todoId)) {
      return NextResponse.json({ message: 'Invalid todo ID' }, { status: 400 })
    }

    const todo = await prisma.todo.updateMany({
      where: {
        id: todoId,
        userId,
      },
      data: { title, completed },
    })

    return NextResponse.json({ message: 'Updated', todo }, { status: 200 })
  } catch (error) {
    console.error('Update todo error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}