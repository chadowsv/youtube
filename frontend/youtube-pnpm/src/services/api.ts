const API = 'http://34.205.28.202:8000/api'

// ── Videos ──────────────────────────────────────────────
export const getVideos = () =>
  fetch(`${API}/videos/`).then(r => r.json())

export const getVideoById = (id: number) =>
  fetch(`${API}/videos/${id}`).then(r => r.json())

export const getVideosByCategory = (categoryId: number) =>
  fetch(`${API}/videos/category/${categoryId}`).then(r => r.json())

export const getVideosByUser = (userId: number) =>
  fetch(`${API}/videos/user/${userId}`).then(r => r.json())

export const createVideo = (data: object) =>
  fetch(`${API}/videos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const deleteVideo = (id: number) =>
  fetch(`${API}/videos/${id}`, { method: 'DELETE' })

export const updateThumbnail = (id: number, thumbnailUrl: string) =>
  fetch(`${API}/videos/${id}/thumbnail?thumbnail_url=${encodeURIComponent(thumbnailUrl)}`, {
    method: 'PATCH',
  }).then(r => r.json())

// ── Categories ──────────────────────────────────────────
export const getCategories = () =>
  fetch(`${API}/categories/`).then(r => r.json())

// ── Comments ────────────────────────────────────────────
export const getCommentsByVideo = (videoId: number) =>
  fetch(`${API}/comments/video/${videoId}`).then(r => r.json())

export const createComment = (data: object) =>
  fetch(`${API}/comments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const deleteComment = (id: number) =>
  fetch(`${API}/comments/${id}`, { method: 'DELETE' })

export const editComment = (id: number, content: string) =>
  fetch(`${API}/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  }).then(r => r.json())

// ── Users ───────────────────────────────────────────────
export const login = (email: string, password: string) =>
  fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(r => r.json())

export const register = (data: object) =>
  fetch(`${API}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const getUserById = (id: number) =>
  fetch(`${API}/users/${id}`).then(r => r.json())