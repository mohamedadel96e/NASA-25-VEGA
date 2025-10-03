export default function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}