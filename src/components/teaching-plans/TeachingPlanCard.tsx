import { TeachingPlan } from '@/types/teaching-plan'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, BookIcon, ListIcon, FileTextIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface TeachingPlanCardProps {
  plan: TeachingPlan & { 
    _count?: { 
      progress: number
      resources: number
    } 
  }
  onClick?: () => void
}

const TeachingPlanCard = ({ plan, onClick }: TeachingPlanCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <span className="text-lg line-clamp-2">{plan.title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-2">
        {plan.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {plan.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          {plan.semester && (
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{plan.semester}</span>
            </Badge>
          )}
          
          {plan.academicYear && (
            <Badge variant="outline" className="flex items-center gap-1">
              <BookIcon className="h-3 w-3" />
              <span>{plan.academicYear}</span>
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ListIcon className="h-3 w-3" />
            <span>{plan._count?.progress ?? 0}项进度</span>
          </div>
          <div className="flex items-center gap-1">
            <FileTextIcon className="h-3 w-3" />
            <span>{plan._count?.resources ?? 0}份资源</span>
          </div>
        </div>
        <span>{formatDate(new Date(plan.createdAt))}</span>
      </CardFooter>
    </Card>
  )
}

export default TeachingPlanCard 