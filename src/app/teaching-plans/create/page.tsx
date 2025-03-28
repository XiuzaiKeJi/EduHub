import { Metadata } from "next"
import { TeachingPlanForm } from "@/components/features/teaching-plans/teaching-plan-form"

export const metadata: Metadata = {
  title: "创建教学计划",
  description: "创建新的教学计划",
}

export default function CreateTeachingPlanPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">创建教学计划</h1>
        <p className="text-muted-foreground">
          填写以下信息创建新的教学计划
        </p>
      </div>
      <TeachingPlanForm />
    </div>
  )
} 