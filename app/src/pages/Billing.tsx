import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { mockInvoices, mockPaymentMethods, mockBillingInfo, monthlySpending } from '@/data/saasData';
import { cn } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  CreditCard,
  Bitcoin,
  Smartphone,
  Download,
  Receipt,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  Star,
} from 'lucide-react';

/* ─── Animations ─── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

/* ─── Helpers ─── */
const methodIcons: Record<string, typeof CreditCard> = {
  card: CreditCard,
  crypto: Bitcoin,
  mobile: Smartphone,
};

const statusBadgeClass = {
  paid: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
};

export default function Billing() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([...mockPaymentMethods]);
  const [billingForm, setBillingForm] = useState({ ...mockBillingInfo });
  const [addMethodOpen, setAddMethodOpen] = useState(false);
  const [invoicePage, setInvoicePage] = useState(0);

  const totalSpent = mockInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const invoicesPerPage = 5;
  const totalPages = Math.ceil(mockInvoices.length / invoicesPerPage);
  const paginatedInvoices = mockInvoices.slice(
    invoicePage * invoicesPerPage,
    (invoicePage + 1) * invoicesPerPage
  );

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Billing information saved');
  };

  const handleDownloadPDF = (invoiceId: string) => {
    toast.success(`PDF downloaded for invoice ${invoiceId}`);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isDefault: pm.id === id }))
    );
    toast.success('Default payment method updated');
  };

  const handleRemoveMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    toast.success('Payment method removed');
  };

  const handleAddMethod = (type: 'card' | 'crypto' | 'mobile') => {
    const newMethod = {
      id: `pm-${Date.now()}`,
      type,
      label: type === 'card' ? 'Mastercard' : type === 'crypto' ? 'Ethereum' : 'Apple Pay',
      last4: type === 'card' ? '8888' : type === 'crypto' ? 'b2c4' : '6789',
      expiry: type === 'card' ? '09/27' : undefined,
      isDefault: false,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    setAddMethodOpen(false);
    toast.success('Payment method added');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="font-body text-neutral-300">Please sign in to view billing.</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* ═══════ Header ═══════ */}
      <motion.div variants={item}>
        <h1 className="font-h2 text-neutral-100" style={{ fontSize: 28 }}>
          Billing
        </h1>
        <p className="font-body text-neutral-300 mt-1">Manage your payments and invoices</p>
      </motion.div>

      {/* ═══════ Total Spent Card ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent-gold/15 flex items-center justify-center">
                  <DollarSign size={22} className="text-accent-gold" />
                </div>
                <div>
                  <p className="font-overline text-neutral-300">TOTAL SPENT WITH FINTRACK</p>
                  <p className="font-h2 text-neutral-100" style={{ fontSize: 28 }}>
                    ${totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Mini bar chart */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-end gap-2 h-16">
                  {monthlySpending.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-accent-gold/80 rounded-t-sm"
                        style={{ height: `${(m.amount / 15) * 60}px` }}
                      />
                      <span className="font-caption text-neutral-400">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════ Payment Methods ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="font-h3 text-neutral-100">Payment Methods</CardTitle>
                <CardDescription className="font-body-sm text-neutral-300">
                  Manage how you pay for FinTrack
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setAddMethodOpen(true)}
                className="border-neutral-500 text-neutral-200 hover:border-accent-gold hover:bg-warm-white rounded-lg h-10"
              >
                <Plus size={16} className="mr-1.5" />
                Add Payment Method
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((pm) => {
              const Icon = methodIcons[pm.type];
              return (
                <div
                  key={pm.id}
                  className={cn(
                    'flex items-center justify-between rounded-xl border p-4',
                    pm.isDefault ? 'border-accent-gold bg-accent-gold/5' : 'border-warm-gray bg-warm-cream'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-gold/15 flex items-center justify-center">
                      <Icon size={18} className="text-accent-gold" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-body text-neutral-200 font-medium">{pm.label}</p>
                        {pm.isDefault && (
                          <Badge
                            variant="outline"
                            className="border-accent-gold text-accent-gold font-caption text-[10px]"
                          >
                            <Star size={10} className="mr-0.5 fill-accent-gold" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="font-caption text-neutral-400">
                        &bull;&bull;&bull;&bull; {pm.last4}
                        {pm.expiry && <span> &middot; Exp {pm.expiry}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!pm.isDefault && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(pm.id)}
                          className="text-neutral-300 hover:text-accent-gold hover:bg-accent-gold/10 rounded-lg h-8 font-body-sm"
                        >
                          Set as Default
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMethod(pm.id)}
                          className="text-neutral-400 hover:text-danger hover:bg-danger-light rounded-lg h-8"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════ Invoice History ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Receipt size={20} className="text-accent-gold" />
              <CardTitle className="font-h3 text-neutral-100">Invoice History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-warm-gray">
                    <TableHead className="font-overline text-neutral-400">Date</TableHead>
                    <TableHead className="font-overline text-neutral-400">Description</TableHead>
                    <TableHead className="font-overline text-neutral-400">Amount</TableHead>
                    <TableHead className="font-overline text-neutral-400">Status</TableHead>
                    <TableHead className="font-overline text-neutral-400">Method</TableHead>
                    <TableHead className="font-overline text-neutral-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((inv) => {
                    const pm = paymentMethods.find((p) => p.id === inv.paymentMethod);
                    const Icon = pm ? methodIcons[pm.type] : CreditCard;
                    return (
                      <TableRow key={inv.id} className="border-warm-gray">
                        <TableCell className="font-body-sm text-neutral-200">
                          {new Date(inv.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="font-body-sm text-neutral-200">
                          {inv.description}
                        </TableCell>
                        <TableCell className="font-body-sm text-neutral-200 font-medium">
                          ${inv.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('font-caption capitalize', statusBadgeClass[inv.status])}
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {pm && (
                            <div className="flex items-center gap-1.5 text-neutral-400">
                              <Icon size={14} />
                              <span className="font-caption">&bull;&bull;&bull;&bull; {pm.last4}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(inv.id)}
                            className="text-neutral-300 hover:text-accent-gold hover:bg-accent-gold/10 rounded-lg h-8 font-body-sm"
                          >
                            <Download size={14} className="mr-1" />
                            PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={invoicePage === 0}
                  onClick={() => setInvoicePage((p) => Math.max(0, p - 1))}
                  className="border-neutral-500 text-neutral-200 rounded-lg h-9"
                >
                  Previous
                </Button>
                <span className="font-caption text-neutral-400">
                  Page {invoicePage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={invoicePage >= totalPages - 1}
                  onClick={() => setInvoicePage((p) => Math.min(totalPages - 1, p + 1))}
                  className="border-neutral-500 text-neutral-200 rounded-lg h-9"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════ Billing Information ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-accent-gold" />
              <CardTitle className="font-h3 text-neutral-100">Billing Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveBilling} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">FULL NAME</Label>
                  <Input
                    value={billingForm.fullName}
                    onChange={(e) => setBillingForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">EMAIL</Label>
                  <Input
                    type="email"
                    value={billingForm.email}
                    onChange={(e) => setBillingForm((f) => ({ ...f, email: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">COMPANY (OPTIONAL)</Label>
                  <Input
                    value={billingForm.company || ''}
                    onChange={(e) => setBillingForm((f) => ({ ...f, company: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">ADDRESS</Label>
                  <Input
                    value={billingForm.address}
                    onChange={(e) => setBillingForm((f) => ({ ...f, address: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">CITY</Label>
                  <Input
                    value={billingForm.city}
                    onChange={(e) => setBillingForm((f) => ({ ...f, city: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">POSTAL CODE</Label>
                  <Input
                    value={billingForm.postalCode}
                    onChange={(e) => setBillingForm((f) => ({ ...f, postalCode: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">COUNTRY</Label>
                  <Select
                    value={billingForm.country}
                    onValueChange={(val) => setBillingForm((f) => ({ ...f, country: val }))}
                  >
                    <SelectTrigger className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">TAX ID / VAT (OPTIONAL)</Label>
                  <Input
                    value={billingForm.taxId || ''}
                    onChange={(e) => setBillingForm((f) => ({ ...f, taxId: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold h-11 rounded-lg px-6"
              >
                Save
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═════════════════ Add Payment Method Dialog ═════════════════ */}
      <Dialog open={addMethodOpen} onOpenChange={setAddMethodOpen}>
        <DialogContent className="bg-warm-white border-warm-gray rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-h3 text-neutral-100">Add Payment Method</DialogTitle>
            <DialogDescription className="font-body-sm text-neutral-300">
              Choose how you want to pay
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            {[
              { type: 'card' as const, label: 'Credit Card', desc: 'Visa, Mastercard, Amex', Icon: CreditCard },
              { type: 'crypto' as const, label: 'Crypto', desc: 'BTC, ETH, USDC', Icon: Bitcoin },
              { type: 'mobile' as const, label: 'Mobile Money', desc: 'Apple Pay, Google Pay', Icon: Smartphone },
            ].map(({ type, label, desc, Icon }) => (
              <button
                key={type}
                onClick={() => handleAddMethod(type)}
                className="flex items-center gap-4 rounded-xl border border-warm-gray bg-warm-cream p-4 hover:border-accent-gold hover:shadow-card transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-gold/15 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-accent-gold" />
                </div>
                <div>
                  <p className="font-body text-neutral-200 font-medium">{label}</p>
                  <p className="font-caption text-neutral-400">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
