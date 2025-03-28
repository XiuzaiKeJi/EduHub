import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createTeachingPlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  objectives: z.string().min(1),
  courseId: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("未授权", { status: 401 })
    }

    const json = await req.json()
    const body = createTeachingPlanSchema.parse(json)

    const teachingPlan = await db.teachingPlan.create({
      data: {
        title: body.title,
        description: body.description,
        objectives: body.objectives,
        courseId: body.courseId,
      },
    })

    return NextResponse.json(teachingPlan)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse("内部服务器错误", { status: 500 })
  }
} 