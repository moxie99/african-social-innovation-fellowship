import { LucideIcon } from 'lucide-react'
export type ModuleDataType = {
  id: string
  url: string
  icon: LucideIcon
  title: string
  duration: string
  format: string
  level: string
  description: string
  keyQuestions: string[]
  content: {
    heading: string
    content1: string
    content2: string
    content3: string
    content4: string
    content5: string
    content6: string
    content7: string
    content8: string
    content9: string
    content10: string
    content11: string
  }
  lessons: Lesson[]
  modAss: string[]
  addResouces: string[]
  disscForPrompt: string[]
}

interface Lesson {
  title: string
  desc: string
  fullDesc: string
  items: string[]
  example: string[]
  assignment: string[]
}
