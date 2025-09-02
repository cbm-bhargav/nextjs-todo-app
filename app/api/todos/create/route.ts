// import { prisma } from '@/lib/prisma'
// import { NextRequest, NextResponse } from 'next/server'
// import jwt from 'jsonwebtoken'
// import { getJwtConfig } from '@/lib/jwt-config'

// export async function POST(req: NextRequest) {
//   const { clientSecret } = await getJwtConfig();

//   const token = req.cookies.get('token')?.value
//   if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

//   //const { userId }: any = jwt.verify(token, process.env.JWT_SECRET!)
//   const { userId }: any = jwt.verify(token, clientSecret!)
//   const { title } = await req.json()

//   const todo = await prisma.todo.create({
//     data: {
//       title,
//       userId,
//     },
//   })

//   return NextResponse.json(todo, { status: 201 })
// }

// POST Route - @/app/api/todos/create/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { validateTokenAndGetUserId } from '@/lib/jwt-utils'

export async function POST(req: NextRequest) {
  const validation = await validateTokenAndGetUserId(req)
  
  if (!validation.success) {
    return validation.response
  }
  
  const { userId } = validation

  try {
    const body = await req.json()
    const { title } = body
    
    // Validate title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 })
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        userId,
      },
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 })
    }
    console.error('Todo creation error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}