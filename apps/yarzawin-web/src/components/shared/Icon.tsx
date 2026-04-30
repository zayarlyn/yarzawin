import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Quote,
  List,
  Image,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Search,
  Trash2,
  Pencil,
  Eye,
  Check,
  Sun,
  Notebook,
} from 'lucide-react'

const ICONS = {
  Bold,
  Italic,
  Underline,
  Heading2,
  Quote,
  List,
  Image,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Search,
  Trash2,
  Pencil,
  Eye,
  Check,
  Sun,
  Notebook,
}

export type IconName = keyof typeof ICONS

type Props = { name: IconName; size?: number }

export function Icon({ name, size = 16 }: Props) {
  const Comp = ICONS[name]
  return <Comp size={size} strokeWidth={1.6} style={{ flexShrink: 0 }} />
}
