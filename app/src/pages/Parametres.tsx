import { useState, useCallback } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

/* ─── shadcn/ui ─── */
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/sonner'
import { Badge } from '@/components/ui/badge'


/* ─── Lucide icons ─── */
import {
  User,
  Tag,
  SlidersHorizontal,
  Shield,
  Camera,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Monitor,
  Smartphone,
  Download,
  AlertTriangle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Laptop,
  Save,
  Globe,
  Bell,
  ShoppingCart,
  Home,
  Car,
  UtensilsCrossed,
  Heart,
  Plane,
  Lightbulb,
  Gamepad2,
  GraduationCap,
  Briefcase,
  TrendingUp,
  DollarSign,
  Gift,
  SmartphoneIcon,
  MonitorSmartphone,
  Music,
  Landmark,
  PiggyBank,
  Banknote,
  BadgeDollarSign,
  Coins,
  Target,
  Wallet,
  Settings,
  ChevronRight,
} from 'lucide-react'

/* ─── Mock data ─── */
import {
  mockUserProfile,
  mockExpenseCategories,
  mockIncomeCategories,
  defaultNotificationSettings,
  mockActiveSessions,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from '@/data/mockData'
import type {
  Category,
  UserProfile,
  NotificationSettings,
  ActiveSession,
} from '@/data/mockData'

/* ─── Animation helpers ─── */
const tabContentVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

/* ─── Icon map ─── */
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  ShoppingCart,
  Home,
  Car,
  Utensils: UtensilsCrossed,
  Heart,
  Plane,
  Lightbulb,
  Gamepad2,
  GraduationCap,
  Briefcase,
  TrendingUp,
  DollarSign,
  Gift,
  Smartphone: SmartphoneIcon,
  Monitor: MonitorSmartphone,
  Music,
  Landmark,
  PiggyBank,
  Banknote,
  BadgeDollarSign,
  Coins,
  Target,
  Wallet,
  User,
}

function getIconComponent(iconName: string) {
  return iconMap[iconName] || Wallet
}

/* ═════════════════════════════════════════════════════════════════
   SECTION — Profile
   ═════════════════════════════════════════════════════════════════ */

function ProfileSection() {
  const [profile, setProfile] = useState<UserProfile>({ ...mockUserProfile })
  const [saved, setSaved] = useState(false)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    setSaved(true)
    toast.success('Profil mis a jour avec succes')
    setTimeout(() => setSaved(false), 2000)
  }

  const updateField = (field: keyof UserProfile, value: string | number) => {
    setProfile((prev: UserProfile) => ({ ...prev, [field]: value }))
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Informations personnelles ── */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Informations personnelles</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Gerez vos informations de profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-warm-gray border-[3px] border-warm-white shadow-md flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-neutral-400" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={16} className="text-white mb-0.5" />
                    <span className="text-[10px] text-white font-medium">Changer</span>
                  </div>
                </div>
                <div>
                  <p className="font-body text-neutral-200 font-medium">{profile.name}</p>
                  <p className="font-caption text-neutral-400">{profile.email}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setProfile((p: UserProfile) => ({ ...p, avatar: undefined }))
                      toast.success('Avatar supprime')
                    }}
                    className="font-caption text-danger hover:text-danger/80 mt-1 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="h-px bg-warm-gray" />

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">NOM COMPLET</Label>
                  <Input
                    value={profile.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
                    placeholder="Jean Dupont"
                    className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">EMAIL</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)}
                    placeholder="jean@email.com"
                    className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">TELEPHONE</Label>
                  <Input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold h-11 rounded-[10px] px-6 transition-all hover:-translate-y-px hover:shadow-card-hover"
              >
                {saved ? (
                  <span className="flex items-center gap-2">
                    <Check size={16} /> Enregistre
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={16} /> Enregistrer les modifications
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Revenus mensuels ── */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Revenus mensuels</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Utilise pour calculer vos taux d&apos;epargne
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                toast.success('Revenus mensuels mis a jour')
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">REVENU MENSUEL NET</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-neutral-400">
                      {profile.currency === 'EUR' ? '€' : profile.currency === 'USD' ? '$' : profile.currency === 'GBP' ? '£' : 'Fr'}
                    </span>
                    <Input
                      type="number"
                      value={profile.monthlyIncome || ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateField('monthlyIncome', Number(e.target.value))
                      }
                      placeholder="3200"
                      className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15 pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">DEVISE PREFEREE</Label>
                  <Select
                    value={profile.currency}
                    onValueChange={(val: string) => updateField('currency', val as 'EUR' | 'USD' | 'GBP' | 'CHF')}
                  >
                    <SelectTrigger className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CHF">CHF (Fr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold h-11 rounded-[10px] px-6 transition-all hover:-translate-y-px hover:shadow-card-hover"
              >
                <Save size={16} className="mr-2" />
                Enregistrer
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═════════════════════════════════════════════════════════════════
   SECTION — Categories
   ═════════════════════════════════════════════════════════════════ */

function CategoryIcon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const Icon = getIconComponent(name)
  return <Icon size={size} className={className} />
}

function ColorPicker({
  selected,
  onChange,
}: {
  selected: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_COLORS.map((color: string) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'w-7 h-7 rounded-full transition-all duration-150 border-2',
            selected === color
              ? 'border-neutral-100 scale-110 shadow-sm'
              : 'border-transparent hover:scale-105'
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

function IconPicker({
  selected,
  onChange,
}: {
  selected: string
  onChange: (icon: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORY_ICONS.map((icon: string) => {
        const Icon = getIconComponent(icon)
        return (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(icon)}
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150',
              selected === icon
                ? 'bg-accent-gold/15 text-accent-gold ring-1 ring-accent-gold'
                : 'bg-warm-cream text-neutral-400 hover:bg-warm-gray hover:text-neutral-300'
            )}
          >
            <Icon size={18} />
          </button>
        )
      })}
    </div>
  )
}

function CategoryItem({
  category,
  onUpdate,
  onDelete,
}: {
  category: Category
  onUpdate: (cat: Category) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Category>({ ...category })

  const handleSaveEdit = () => {
    if (!editForm.name.trim()) {
      toast.error('Le nom est obligatoire')
      return
    }
    onUpdate(editForm)
    setEditing(false)
    toast.success('Categorie mise a jour')
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="border-b border-warm-gray last:border-0"
    >
      {editing ? (
        <div className="py-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="font-overline text-neutral-300">NOM</Label>
            <Input
              value={editForm.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              className="h-10 rounded-[10px] border-neutral-500 focus:border-accent-gold"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-overline text-neutral-300">COULEUR</Label>
            <ColorPicker selected={editForm.color} onChange={(c) => setEditForm((f) => ({ ...f, color: c }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-overline text-neutral-300">ICONE</Label>
            <IconPicker selected={editForm.icon} onChange={(i) => setEditForm((f) => ({ ...f, icon: i }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="font-overline text-neutral-300">BUDGET MENSUEL (OPTIONNEL)</Label>
            <Input
              type="number"
              value={editForm.budget || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditForm((f) => ({ ...f, budget: e.target.value ? Number(e.target.value) : undefined }))
              }
              placeholder="500"
              className="h-10 rounded-[10px] border-neutral-500 focus:border-accent-gold"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEdit}
              className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 rounded-lg"
            >
              <Check size={14} className="mr-1" /> Enregistrer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditForm({ ...category })
                setEditing(false)
              }}
              className="text-neutral-400 hover:text-neutral-200 rounded-lg"
            >
              <X size={14} className="mr-1" /> Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 py-3.5 min-h-[56px]">
          {/* Color dot */}
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: category.color }}
          />
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg bg-warm-cream flex items-center justify-center shrink-0">
            <CategoryIcon name={category.icon} size={18} className="text-neutral-200" />
          </div>
          {/* Name */}
          <div className="flex-1 min-w-0">
            <span className="font-body text-neutral-100 font-medium">{category.name}</span>
            {category.isDefault && (
              <Badge
                variant="secondary"
                className="ml-2 bg-warm-cream text-neutral-400 font-caption text-[10px] px-1.5 py-0"
              >
                Defaut
              </Badge>
            )}
          </div>
          {/* Budget */}
          {category.budget && (
            <span className="font-body-sm text-neutral-400 hidden sm:block">
              Budget: {category.budget.toLocaleString('fr-FR')}€/mois
            </span>
          )}
          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => {
                if (category.isDefault) {
                  toast.error('Les categories par defaut ne peuvent pas etre supprimees')
                  return
                }
                onDelete(category.id)
              }}
              disabled={category.isDefault}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                category.isDefault
                  ? 'text-neutral-500 cursor-not-allowed'
                  : 'text-neutral-400 hover:text-danger hover:bg-danger-light'
              )}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function CategoriesSection() {
  const [activeType, setActiveType] = useState<'expense' | 'income'>('expense')
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([...mockExpenseCategories])
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([...mockIncomeCategories])
  const [sheetOpen, setSheetOpen] = useState(false)

  const categories = activeType === 'expense' ? expenseCategories : incomeCategories

  const handleAdd = (newCat: Omit<Category, 'id'>) => {
    const cat: Category = { ...newCat, id: `cat-${Date.now()}` }
    if (activeType === 'expense') {
      setExpenseCategories((prev) => [...prev, cat])
    } else {
      setIncomeCategories((prev) => [...prev, cat])
    }
    setSheetOpen(false)
    toast.success('Categorie ajoutee avec succes')
  }

  const handleUpdate = (updated: Category) => {
    if (updated.type === 'expense') {
      setExpenseCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    } else {
      setIncomeCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    }
  }

  const handleDelete = (id: string) => {
    if (activeType === 'expense') {
      setExpenseCategories((prev) => prev.filter((c) => c.id !== id))
    } else {
      setIncomeCategories((prev) => prev.filter((c) => c.id !== id))
    }
    toast.success('Categorie supprimee')
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="font-h3 text-neutral-100">
                  Categories de {activeType === 'expense' ? 'depenses' : 'revenus'}
                </CardTitle>
                <CardDescription className="font-body-sm text-neutral-300 mt-1">
                  Organisez vos {activeType === 'expense' ? 'depenses' : 'revenus'} par categorie.
                  Les categories par defaut ne peuvent pas etre supprimees.
                </CardDescription>
              </div>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-neutral-500 text-neutral-200 hover:border-accent-gold hover:bg-warm-white rounded-[10px] h-10"
                  >
                    <Plus size={16} className="mr-1.5" />
                    Ajouter une categorie
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md bg-warm-white border-warm-gray">
                  <AddCategorySheet
                    type={activeType}
                    onAdd={handleAdd}
                    onClose={() => setSheetOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </CardHeader>
          <CardContent>
            {/* Type toggle */}
            <div className="flex gap-1 p-1 bg-warm-cream rounded-lg w-fit mb-5">
              <button
                onClick={() => setActiveType('expense')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  activeType === 'expense'
                    ? 'bg-accent-gold text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                Depenses
              </button>
              <button
                onClick={() => setActiveType('income')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  activeType === 'income'
                    ? 'bg-accent-gold text-neutral-100 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                Revenus
              </button>
            </div>

            {/* Category list */}
            <AnimatePresence mode="popLayout">
              {categories.map((cat) => (
                <CategoryItem
                  key={cat.id}
                  category={cat}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>

            {categories.length === 0 && (
              <div className="py-12 text-center">
                <Tag size={40} className="text-neutral-400 mx-auto mb-3" />
                <p className="font-body text-neutral-300">Aucune categorie</p>
                <p className="font-body-sm text-neutral-400 mt-1">
                  Ajoutez votre premiere categorie
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ── Add Category Sheet content ── */

function AddCategorySheet({
  type,
  onAdd,
  onClose,
}: {
  type: 'income' | 'expense'
  onAdd: (cat: Omit<Category, 'id'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(CATEGORY_COLORS[0])
  const [icon, setIcon] = useState(CATEGORY_ICONS[0])
  const [budget, setBudget] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Le nom est obligatoire'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onAdd({
      name: name.trim(),
      type,
      color,
      icon,
      budget: budget ? Number(budget) : undefined,
      isDefault: false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <SheetHeader className="px-0 pt-2">
        <SheetTitle className="font-h3 text-neutral-100">Nouvelle categorie</SheetTitle>
        <SheetDescription className="font-body-sm text-neutral-300">
          Creez une nouvelle categorie de {type === 'expense' ? 'depenses' : 'revenus'}.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 py-6">
        <div className="space-y-1.5">
          <Label className="font-overline text-neutral-300">NOM *</Label>
          <Input
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
            }}
            placeholder="ex: Voyages"
            className={cn(
              'h-11 rounded-[10px] focus:border-accent-gold focus:ring-accent-gold/15',
              errors.name ? 'border-danger' : 'border-neutral-500'
            )}
          />
          {errors.name && <p className="font-caption text-danger">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="font-overline text-neutral-300">COULEUR</Label>
          <ColorPicker selected={color} onChange={setColor} />
        </div>

        <div className="space-y-1.5">
          <Label className="font-overline text-neutral-300">ICONE</Label>
          <IconPicker selected={icon} onChange={setIcon} />
        </div>

        {type === 'expense' && (
          <div className="space-y-1.5">
            <Label className="font-overline text-neutral-300">BUDGET MENSUEL (OPTIONNEL)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-neutral-400">€</span>
              <Input
                type="number"
                value={budget}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBudget(e.target.value)}
                placeholder="500"
                className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15 pl-8"
              />
            </div>
          </div>
        )}
      </div>

      <SheetFooter className="px-0 pb-2">
        <div className="flex gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-[10px] border-neutral-500 text-neutral-200 hover:bg-warm-cream"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 rounded-[10px] bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold"
          >
            Ajouter
          </Button>
        </div>
      </SheetFooter>
    </form>
  )
}

/* ═════════════════════════════════════════════════════════════════
   SECTION — Preferences
   ═════════════════════════════════════════════════════════════════ */

function PreferencesSection() {
  const [settings, setSettings] = useState<NotificationSettings>({ ...defaultNotificationSettings })
  const [language, setLanguage] = useState<'fr' | 'en'>(mockUserProfile.language)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings((prev: NotificationSettings) => {
      const next = { ...prev, [key]: !prev[key] }
      toast.success('Preference mise a jour')
      return next
    })
  }

  const handleExport = () => {
    const data = JSON.stringify({ profile: mockUserProfile, settings }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fintrack-data.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Donnees exportees')
  }

  const handleDeleteAll = () => {
    if (confirmText !== 'SUPPRIMER') {
      toast.error('Veuillez taper SUPPRIMER pour confirmer')
      return
    }
    setDeleteDialogOpen(false)
    setConfirmText('')
    toast.success('Toutes les donnees ont ete supprimees')
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Apparence ── */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Apparence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Theme selector */}
            <div className="space-y-2">
              <Label className="font-overline text-neutral-300">THEME</Label>
              <div className="flex gap-3">
                {[
                  { value: 'light' as const, label: 'Clair', Icon: Sun },
                  { value: 'dark' as const, label: 'Sombre', Icon: Moon },
                  { value: 'system' as const, label: 'Systeme', Icon: Laptop },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setTheme(value)
                      toast.success(`Theme : ${label}`)
                    }}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                      theme === value
                        ? 'border-accent-gold bg-accent-gold/5 text-accent-gold'
                        : 'border-neutral-500 bg-transparent text-neutral-400 hover:border-neutral-300 hover:text-neutral-300'
                    )}
                  >
                    <Icon size={22} />
                    <span className="font-body-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <Label className="font-overline text-neutral-300">LANGUE</Label>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-neutral-400" />
                <Select
                  value={language}
                  onValueChange={(val: 'fr' | 'en') => {
                    setLanguage(val)
                    toast.success('Langue mise a jour')
                  }}
                >
                  <SelectTrigger className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Francais</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Notifications ── */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[
                { key: 'budgetAlerts' as keyof NotificationSettings, label: 'Alertes de budget' },
                { key: 'goalReminders' as keyof NotificationSettings, label: "Rappels d'objectifs" },
                { key: 'weeklySummary' as keyof NotificationSettings, label: 'Recapitulatif hebdomadaire' },
                { key: 'emailNotifications' as keyof NotificationSettings, label: 'Notifications par email' },
                { key: 'pushNotifications' as keyof NotificationSettings, label: 'Notifications push' },
                { key: 'securityAlerts' as keyof NotificationSettings, label: 'Alertes de securite', disabled: true },
              ].map(({ key, label, disabled }) => {
                const keyStr = key as string
                return (
                <div
                  key={keyStr}
                  className="flex items-center justify-between py-3.5 border-b border-warm-gray last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Bell size={16} className={disabled ? 'text-neutral-400' : 'text-neutral-300'} />
                    <Label
                      htmlFor={keyStr}
                      className={cn(
                        'font-body text-neutral-200 cursor-pointer',
                        disabled && 'text-neutral-400'
                      )}
                    >
                      {label}
                    </Label>
                  </div>
                  <Switch
                    id={keyStr}
                    checked={!!settings[key]}
                    onCheckedChange={() => toggleSetting(key)}
                    disabled={disabled}
                    className="data-[state=checked]:bg-accent-gold"
                  />
                </div>
              )})}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Donnees ── */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Donnees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-neutral-500 text-neutral-200 hover:border-accent-gold hover:bg-warm-white rounded-[10px] h-11"
            >
              <Download size={16} className="mr-2" />
              Exporter toutes mes donnees
            </Button>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-danger hover:text-danger hover:bg-danger-light rounded-[10px] h-11"
                >
                  <Trash2 size={16} className="mr-2" />
                  Supprimer toutes les donnees
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-warm-white border-warm-gray rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="font-h3 text-danger flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Supprimer toutes les donnees
                  </DialogTitle>
                  <DialogDescription className="font-body-sm text-neutral-300">
                    Cette action est irreversible. Toutes vos transactions, categories et objectifs seront definitivement supprimes.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <p className="font-body-sm text-neutral-300">
                    Tapez <strong className="text-neutral-100">SUPPRIMER</strong> pour confirmer :
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmText(e.target.value)}
                    placeholder="SUPPRIMER"
                    className="h-11 rounded-[10px] border-neutral-500 focus:border-danger focus:ring-danger/15"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteDialogOpen(false)
                      setConfirmText('')
                    }}
                    className="border-neutral-500 text-neutral-200 rounded-[10px]"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleDeleteAll}
                    className="bg-danger hover:bg-danger/90 text-white rounded-[10px]"
                  >
                    Supprimer definitivement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

/* ═════════════════════════════════════════════════════════════════
   SECTION — Security
   ═════════════════════════════════════════════════════════════════ */

function SecuritySection() {
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [sessions, setSessions] = useState<ActiveSession[]>([...mockActiveSessions])
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const getPasswordStrength = (pwd: string): { label: string; color: string; width: number } => {
    if (!pwd) return { label: '', color: '', width: 0 }
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    const labels = ['Faible', 'Moyen', 'Bon', 'Fort']
    const colors = ['bg-danger', 'bg-warning', 'bg-accent-gold', 'bg-success']
    return {
      label: labels[score - 1] || 'Faible',
      color: colors[score - 1] || 'bg-danger',
      width: ((score + 1) / 5) * 100,
    }
  }

  const strength = getPasswordStrength(passwordForm.new)

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (!passwordForm.current) errors.current = 'Mot de passe actuel requis'
    if (!passwordForm.new) errors.new = 'Nouveau mot de passe requis'
    if (passwordForm.new.length < 8) errors.new = 'Minimum 8 caracteres'
    if (passwordForm.new !== passwordForm.confirm) errors.confirm = 'Les mots de passe ne correspondent pas'
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }
    setPasswordErrors({})
    setPasswordForm({ current: '', new: '', confirm: '' })
    toast.success('Mot de passe mis a jour avec succes')
  }

  const handleRevoke = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    toast.success('Session revoquee')
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'SUPPRIMER') {
      toast.error('Veuillez taper SUPPRIMER pour confirmer')
      return
    }
    setDeleteAccountDialog(false)
    setDeleteConfirmText('')
    toast.success('Compte supprime')
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Mot de passe ── */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              {[
                { key: 'current', label: 'MOT DE PASSE ACTUEL' },
                { key: 'new', label: 'NOUVEAU MOT DE PASSE' },
                { key: 'confirm', label: 'CONFIRMER LE MOT DE PASSE' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">{label}</Label>
                  <div className="relative">
                    <Input
                      type={showPassword[key] ? 'text' : 'password'}
                      value={passwordForm[key as keyof typeof passwordForm]}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPasswordForm((prev) => ({ ...prev, [key]: e.target.value }))
                        if (passwordErrors[key]) setPasswordErrors((prev) => ({ ...prev, [key]: '' }))
                      }}
                      className={cn(
                        'h-11 rounded-[10px] pr-10',
                        passwordErrors[key] ? 'border-danger' : 'border-neutral-500',
                        'focus:border-accent-gold focus:ring-accent-gold/15'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                    >
                      {showPassword[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordErrors[key] && (
                    <p className="font-caption text-danger">{passwordErrors[key]}</p>
                  )}
                  {key === 'new' && passwordForm.new && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 rounded-full bg-warm-gray overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${strength.width}%` }}
                          transition={{ duration: 0.3 }}
                          className={cn('h-full rounded-full', strength.color)}
                        />
                      </div>
                      <p className={cn('font-caption', strength.color.replace('bg-', 'text-'))}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <Button
                type="submit"
                className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold h-11 rounded-[10px] px-6 transition-all hover:-translate-y-px hover:shadow-card-hover"
              >
                Mettre a jour
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── 2FA ── */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Authentification a deux facteurs</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Securisez votre compte avec la 2FA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-body text-neutral-200 font-medium">Activer la 2FA</p>
                <p className="font-body-sm text-neutral-400">
                  {twoFAEnabled
                    ? 'Protection activee'
                    : 'Recommande pour plus de securite'}
                </p>
              </div>
              <Switch
                checked={twoFAEnabled}
                onCheckedChange={() => {
                  setTwoFAEnabled((prev) => !prev)
                  toast.success(twoFAEnabled ? '2FA desactivee' : '2FA activee')
                }}
                className="data-[state=checked]:bg-accent-gold"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Sessions actives ── */}
      <motion.div variants={staggerItem}>
        <Card className="shadow-card border-warm-gray">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Sessions actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 py-3.5 border-b border-warm-gray last:border-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-warm-cream flex items-center justify-center shrink-0">
                    {session.browser === 'Safari' || session.os === 'iOS' ? (
                      <Smartphone size={18} className="text-neutral-300" />
                    ) : (
                      <Monitor size={18} className="text-neutral-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-neutral-200 font-medium">
                        {session.browser} sur {session.os}
                      </span>
                      {session.isCurrent && (
                        <Badge className="bg-accent-gold/15 text-accent-gold border-0 font-caption text-[10px]">
                          Cet appareil
                        </Badge>
                      )}
                    </div>
                    <p className="font-body-sm text-neutral-400">
                      {session.location} • {session.ip}
                    </p>
                    <p className="font-caption text-neutral-400">{session.lastActive}</p>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevoke(session.id)}
                      className="font-body-sm text-danger hover:text-danger/80 transition-colors shrink-0"
                    >
                      Revoguer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Danger zone ── */}
      <motion.div variants={staggerItem}>
        <div className="rounded-xl border border-danger/30 bg-danger-light/30 p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-danger" />
            <h4 className="font-h4 text-danger">Zone de danger</h4>
          </div>
          <p className="font-body-sm text-danger/80 mb-4">
            Ces actions sont irreversibles
          </p>

          <Dialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
            <DialogTrigger asChild>
              <Button className="bg-danger hover:bg-danger/90 text-white rounded-[10px] h-11">
                <Trash2 size={16} className="mr-2" />
                Supprimer mon compte
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-warm-white border-warm-gray rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-h3 text-danger flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Supprimer mon compte
                </DialogTitle>
                <DialogDescription className="font-body-sm text-neutral-300">
                  Cette action est definitive. Votre compte et toutes vos donnees seront definitivement supprimes.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <p className="font-body-sm text-neutral-300">
                  Tapez <strong className="text-neutral-100">SUPPRIMER</strong> pour confirmer :
                </p>
                <Input
                  value={deleteConfirmText}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDeleteConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="h-11 rounded-[10px] border-neutral-500 focus:border-danger focus:ring-danger/15"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteAccountDialog(false)
                    setDeleteConfirmText('')
                  }}
                  className="border-neutral-500 text-neutral-200 rounded-[10px]"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  className="bg-danger hover:bg-danger/90 text-white rounded-[10px]"
                >
                  Supprimer definitivement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═════════════════════════════════════════════════════════════════ */

type TabValue = 'profil' | 'categories' | 'preferences' | 'securite'

const tabsConfig: { value: TabValue; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { value: 'profil', label: 'Profil', Icon: User },
  { value: 'categories', label: 'Categories', Icon: Tag },
  { value: 'preferences', label: 'Preferences', Icon: SlidersHorizontal },
  { value: 'securite', label: 'Securite', Icon: Shield },
]

export default function Parametres() {
  const [activeTab, setActiveTab] = useState<TabValue>('profil')

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'profil':
        return <ProfileSection />
      case 'categories':
        return <CategoriesSection />
      case 'preferences':
        return <PreferencesSection />
      case 'securite':
        return <SecuritySection />
    }
  }, [activeTab])

  return (
    <>
      <Toaster position="top-right" richColors />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      >
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings size={24} className="text-accent-gold" />
          <h1 className="font-h2 text-neutral-100">Parametres</h1>
        </div>

        {/* Tabbed layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar tab nav */}
          <nav className="lg:w-[200px] shrink-0">
            <div className="lg:sticky lg:top-4 flex lg:flex-col gap-1 p-1 bg-warm-white rounded-xl shadow-card border border-warm-gray overflow-x-auto">
              {tabsConfig.map(({ value, label, Icon }) => {
                const isActive = activeTab === value
                return (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={cn(
                      'flex items-center gap-2.5 px-4 h-10 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0',
                      isActive
                        ? 'bg-accent-gold/10 text-accent-gold lg:border-l-2 lg:border-accent-gold'
                        : 'text-neutral-400 hover:bg-warm-cream hover:text-neutral-200 border-l-2 border-transparent'
                    )}
                  >
                    <Icon size={18} className={isActive ? 'text-accent-gold' : 'text-neutral-400'} />
                    <span>{label}</span>
                    <ChevronRight
                      size={14}
                      className={cn(
                        'ml-auto transition-opacity hidden lg:block',
                        isActive ? 'opacity-50 text-accent-gold' : 'opacity-0'
                      )}
                    />
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-[800px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  )
}
