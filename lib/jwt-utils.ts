// ./lib/jwt-utils.ts
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { getJwtConfig } from '@/lib/jwt-config'

export interface JwtPayload {
  userId: number  // Changed from string to number
  email?: string
  role?: string
  iat?: number
  exp?: number
}

function isValidJwtPayload(payload: unknown): payload is JwtPayload {
  console.log('=== JWT Payload Validation ===')
  console.log('Payload:', payload)
  console.log('Payload type:', typeof payload)
  
  // First check if it's an object
  if (typeof payload !== 'object' || payload === null) {
    console.log('Payload is not an object')
    return false
  }
  
  // Now we can safely cast and check properties
  const obj = payload as Record<string, unknown>
  
  const isValid = (
    'userId' in obj &&
    typeof obj.userId === 'number' &&
    obj.userId > 0
  )
  
  console.log('Is valid payload:', isValid)
  return isValid
}

export async function validateTokenAndGetUserId(req: NextRequest): Promise<{
  success: true
  userId: number
} | {
  success: false
  response: NextResponse
}> {
  console.log('=== JWT Validation Start ===')
  
  const { clientSecret } = await getJwtConfig()
  console.log('Client secret exists:', !!clientSecret)
  
  const token = req.cookies.get('token')?.value
  console.log('Token from cookie:', !!token)
  
  if (!token) {
    console.log('No token found')
    return {
      success: false,
      response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    console.log('Attempting JWT verification...')
    const decoded = jwt.verify(token, clientSecret)
    console.log('JWT verification successful')
    
    if (!isValidJwtPayload(decoded)) {
      console.log('JWT payload validation failed')
      return {
        success: false,
        response: NextResponse.json({ message: 'Invalid token payload' }, { status: 401 })
      }
    }
    
    const userId = decoded.userId  // No parseInt needed since it's already a number
    console.log('Validated userId:', userId)

    console.log('JWT validation successful, userId:', userId)
    return { success: true, userId }
  } catch (error) {
    console.error('JWT verification error:', error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('JWT error type:', error.constructor.name)
      console.log('JWT error message:', error.message)
      return {
        success: false,
        response: NextResponse.json({ message: 'Invalid token' }, { status: 401 })
      }
    }
    return {
      success: false,
      response: NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
  }
}