import { FC } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Teacher } from '@/types/teacher'
import { 
  User, 
  Mail, 
  BookOpen, 
  Award, 
  MapPin,
  Phone,
  Clock,
  Briefcase,
  GraduationCap,
  Book,
  Star,
  Calendar,
  FileText
} from 'lucide-react'

interface TeacherDetailProps {
  teacher: Teacher
}

export const TeacherDetail: FC<TeacherDetailProps> = ({ teacher }) => {
  return (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{teacher.user?.name}</CardTitle>
              {teacher.title && <CardDescription>{teacher.title}</CardDescription>}
            </div>
            <Badge variant="outline">{teacher.user?.department || '未分配部门'}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {teacher.user?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>{teacher.user.email}</span>
                </div>
              )}
              {teacher.contactInfo && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span>联系方式：{teacher.contactInfo}</span>
                </div>
              )}
              {teacher.officeLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span>办公室：{teacher.officeLocation}</span>
                </div>
              )}
              {teacher.officeHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>办公时间：{teacher.officeHours}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {teacher.specialties && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span>专业领域：{teacher.specialties}</span>
                </div>
              )}
              {teacher.subjects && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span>教授科目：{teacher.subjects}</span>
                </div>
              )}
              {teacher.education && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span>教育背景：{teacher.education}</span>
                </div>
              )}
            </div>
          </div>

          {teacher.bio && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">个人简介</h3>
              <p className="text-muted-foreground whitespace-pre-line">{teacher.bio}</p>
            </div>
          )}

          {teacher.experience && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">工作经验</h3>
              <p className="text-muted-foreground whitespace-pre-line">{teacher.experience}</p>
            </div>
          )}

          {teacher.achievements && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">成就与奖项</h3>
              <p className="text-muted-foreground whitespace-pre-line">{teacher.achievements}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 资质和评价选项卡 */}
      <Tabs defaultValue="qualifications">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qualifications">教师资质</TabsTrigger>
          <TabsTrigger value="evaluations">教师评价</TabsTrigger>
        </TabsList>
        <TabsContent value="qualifications" className="pt-4">
          {teacher.qualifications && teacher.qualifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacher.qualifications.map((qualification) => (
                <Card key={qualification.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{qualification.name}</CardTitle>
                    <CardDescription>颁发机构：{qualification.issuer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>颁发日期: {format(new Date(qualification.issueDate), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                      </div>
                      {qualification.expiryDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>过期日期: {format(new Date(qualification.expiryDate), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                        </div>
                      )}
                      {qualification.description && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">{qualification.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>暂无资质信息</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="evaluations" className="pt-4">
          {teacher.evaluations && teacher.evaluations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {teacher.evaluations.map((evaluation) => (
                <Card key={evaluation.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{evaluation.course?.name || '未指定课程'}</CardTitle>
                        <CardDescription>
                          评价日期: {format(new Date(evaluation.evaluationDate), 'yyyy年MM月dd日', { locale: zhCN })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">评分:</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < evaluation.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {evaluation.comment && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">评价内容</h4>
                        <p className="text-sm text-muted-foreground">{evaluation.comment}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {evaluation.strengths && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">优势</h4>
                          <p className="text-sm text-muted-foreground">{evaluation.strengths}</p>
                        </div>
                      )}
                      {evaluation.weaknesses && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">有待改进</h4>
                          <p className="text-sm text-muted-foreground">{evaluation.weaknesses}</p>
                        </div>
                      )}
                      {evaluation.recommendations && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">建议</h4>
                          <p className="text-sm text-muted-foreground">{evaluation.recommendations}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>暂无评价信息</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 