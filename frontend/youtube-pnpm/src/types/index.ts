export interface Video {
  id: number
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  category_id: number
  owner_id: number
  created_at: string
}

export interface Category {
  id: number
  title: string
}

export interface Comment {
  id: number
  content: string
  video_id: number
  user_id: number
  username?: string
}

export interface User {
  id: number
  username: string
  email: string
  profile_picture_url?: string
}