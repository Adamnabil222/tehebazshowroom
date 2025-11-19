import React from 'react';
import type { Invoice, BusinessInfo, ClientInfo } from '../types';
import { CompanyLogoIcon } from './Icons';

interface InvoicePreviewProps {
  invoice: Invoice;
  businessInfo: BusinessInfo;
  clientInfo: ClientInfo;
  subtotal: number;
  discountAmount: number;
  total: number;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ 
  invoice, 
  businessInfo,
  clientInfo,
  subtotal,
  discountAmount,
  total
}) => {
  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg w-full max-w-4xl mx-auto my-auto border">
      <header className="flex justify-between items-start pb-8 border-b-2 border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">فاتورة</h1>
          <p className="text-slate-500 mt-1">فاتورة رقم: {invoice.invoiceNumber || 'INV-001'}</p>
        </div>
        <div className="text-indigo-600">
            <CompanyLogoIcon className="w-24 h-24" />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">الفاتورة من</h2>
          <p className="font-bold text-slate-700">{businessInfo.name || 'شركتك'}</p>
          <p className="text-slate-600">{businessInfo.address || '123 شارع الأعمال، المدينة'}</p>
          <p className="text-slate-600">{businessInfo.email || 'company@email.com'}</p>
          <p className="text-slate-600">{businessInfo.phone || '(123) 456-7890'}</p>
        </div>
        <div>
          <p className="font-bold text-slate-700">{clientInfo.name || 'اسم العميل'}</p>
          <p className="text-slate-600">{clientInfo.address || '456 شارع العميل، المدينة'}</p>
          <p className="text-slate-600">{clientInfo.email || 'client@email.com'}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">تاريخ الفاتورة</h2>
            <p className="font-bold text-slate-700">{invoice.invoiceDate || new Date().toLocaleDateString()}</p>
        </div>
        <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">تاريخ الاستحقاق</h2>
            <p className="font-bold text-slate-700">{invoice.dueDate || new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="mt-8">
        <table className="w-full text-start">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm uppercase">
              <th className="p-3 font-semibold rounded-s-lg">البند</th>
              <th className="p-3 font-semibold text-center">الكمية</th>
              <th className="p-3 font-semibold text-end">السعر</th>
              <th className="p-3 font-semibold text-end rounded-e-lg">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map(item => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="p-3 font-medium text-slate-800">{item.name || 'وصف البند'}</td>
                <td className="p-3 text-slate-600 text-center">{item.quantity}</td>
                <td className="p-3 text-slate-600 text-end">ج.م {item.price.toFixed(2)}</td>
                <td className="p-3 text-slate-800 font-medium text-end">ج.م {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
            {invoice.items.length === 0 && (
                 <tr className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-400 italic">لا توجد بنود بعد...</td>
                    <td className="p-3 text-slate-400 text-center">0</td>
                    <td className="p-3 text-slate-400 text-end">ج.م 0.00</td>
                    <td className="p-3 text-slate-400 font-medium text-end">ج.م 0.00</td>
                 </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="flex justify-end mt-8">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-slate-600">
            <span>المجموع الفرعي</span>
            <span>ج.م {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>الخصم ({invoice.discountRate}%)</span>
            <span className="text-green-600">-ج.م {discountAmount.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-200 my-2"></div>
          <div className="flex justify-between font-bold text-slate-800 text-lg">
            <span>المجموع الإجمالي</span>
            <span>ج.م {total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <footer className="mt-12">
        <h3 className="text-lg font-semibold text-slate-700">ملاحظات</h3>
        <p className="text-slate-500 mt-2 text-sm">{invoice.notes || 'شكراً لتعاملكم معنا.'}</p>
      </footer>
    </div>
  );
};
