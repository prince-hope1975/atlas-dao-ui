export function isImage(url: string) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}
export function isVideo(url: string) {
  return /\.(mp4|mkv)$/.test(url);
}
