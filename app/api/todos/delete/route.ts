// import { prisma } from '@/lib/prisma'
// import { NextRequest, NextResponse } from 'next/server'
// import jwt from 'jsonwebtoken'
// import { getJwtConfig } from '@/lib/jwt-config'

// export async function DELETE(req: NextRequest) {
//   const { clientSecret } = await getJwtConfig();

//   const token = req.cookies.get('token')?.value
//   if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

//   const { userId }: any = jwt.verify(token, clientSecret!)
//   const { id } = await req.json()

//   const deleted = await prisma.todo.deleteMany({
//     where: {
//       id,
//       userId, // only delete own todos
//     },
//   })

//   return NextResponse.json({ message: 'Deleted', deleted }, { status: 200 })
// }

// DELETE Route - @/app/api/todos/delete/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { validateTokenAndGetUserId } from '@/lib/jwt-utils'

export async function DELETE(req: NextRequest) {
  const validation = await validateTokenAndGetUserId(req)
  
  if (!validation.success) {
    return validation.response
  }
  
  const { userId } = validation

  try {
    const { id } = await req.json()
    
    const todoId = parseInt(id, 10)
    if (isNaN(todoId)) {
      return NextResponse.json({ message: 'Invalid todo ID' }, { status: 400 })
    }

    const deleted = await prisma.todo.deleteMany({
      where: {
        id: todoId,
        userId,
      },
    })

    return NextResponse.json({ message: 'Deleted', deleted }, { status: 200 })
  } catch (error) {
    console.error('Delete todo error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}