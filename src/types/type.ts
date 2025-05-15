import { LucideIcon } from 'lucide-react'

type Lesson = {
  title: string
  desc: string
  fullDesc: string
  items: string[]
  example: string[]
  assignment: string[]
}

type ModuleContent = {
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

export type Module = {
  id: string
  section: string
  imgUrl: string
  imgUrl2: string
  url: string
  icon: LucideIcon // ✅ Proper type for lucide-react icons
  title: string
  duration: string
  Format: string
  level: string
  description: string
  keyQuestions: string[]
  content: ModuleContent
  lessons: Lesson[]
  modAss: string[]
  addResouces: string[]
  disscForPrompt: string[]
}


export interface UserData {
  name: string
  email: string
  score: number
  certificateDownloaded?: boolean
  certificateDownloadDate?: string
  examCode?: string
  totalQuestions?: string | number
  status?: string | number
  attempts?: string | number
  submittedAt: string
  id?: string
}
