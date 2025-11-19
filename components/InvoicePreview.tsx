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
    // Removed 'overflow-hidden' and 'style={{ aspectRatio... }}' to allow full content expansion
    <div className="bg-white w-full max-w-[210mm] mx-auto shadow-2xl text-slate-800 relative flex flex-col min-h-[297mm]">
      
      {/* Decorative Top Bar */}
      <div className="h-3 w-full bg-indigo-600"></div>

      <div className="p-12 flex-grow">
        {/* Header Section */}
        <header className="flex justify-between items-start mb-12">
          <div className="flex flex-col items-start">
             <div className="text-indigo-600 mb-4">
                <CompanyLogoIcon className="w-20 h-20" />
             </div>
             <h2 className="font-bold text-2xl text-slate-800">{businessInfo.name || 'اسم الشركة'}</h2>
             <div className="text-sm text-slate-500 mt-2 space-y-1">
               <p>{businessInfo.address || 'عنوان الشركة'}</p>
               <p>{businessInfo.email || 'email@company.com'}</p>
               <p>{businessInfo.phone || '000-000-0000'}</p>
             </div>
          </div>
          
          <div className="text-end">
            <h1 className="text-5xl font-extrabold text-indigo-600 select-none">
              فاتورة
            </h1>
            <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[200px]">
                <div className="mb-2">
                    <span className="block text-xs font-bold text-indigo-600">رقم الفاتورة</span>
                    <span className="font-mono text-lg font-bold text-slate-800">#{invoice.invoiceNumber || '000'}</span>
                </div>
                <div className="mb-2">
                    <span className="block text-xs font-bold text-indigo-600">التاريخ</span>
                    <span className="text-sm font-medium text-slate-700">{invoice.invoiceDate || '-'}</span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-red-500">تاريخ الاستحقاق</span>
                    <span className="text-sm font-medium text-slate-700">{invoice.dueDate || '-'}</span>
                </div>
            </div>
          </div>
        </header>

        {/* Client Info Section */}
        <section className="mb-12">
           <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 mb-3">فاتورة إلى</h3>
              <div className="flex flex-col space-y-1">
                  <span className="text-xl font-bold text-slate-800">{clientInfo.name || 'اسم العميل'}</span>
                  <span className="text-slate-600">{clientInfo.address || 'عنوان العميل'}</span>
                  <span className="text-indigo-600 font-medium text-sm">{clientInfo.email || 'client@email.com'}</span>
              </div>
           </div>
        </section>

        {/* Items Table */}
        <section className="mb-10">
          <table className="w-full text-start">
            <thead>
              <tr className="border-b-2 border-indigo-100">
                <th className="py-3 text-start text-xs font-bold text-indigo-900 w-1/2">الوصف</th>
                <th className="py-3 text-center text-xs font-bold text-indigo-900">الكمية</th>
                <th className="py-3 text-end text-xs font-bold text-indigo-900">السعر</th>
                <th className="py-3 text-end text-xs font-bold text-indigo-900">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 text-slate-700 font-medium">{item.name || 'بند بدون اسم'}</td>
                  <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-4 text-end text-slate-600 font-mono">ج.م {item.price.toFixed(2)}</td>
                  <td className="py-4 text-end text-slate-800 font-bold font-mono">ج.م {(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
              {invoice.items.length === 0 && (
                  <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 italic bg-slate-50/50 rounded-b-lg">لا توجد بنود مضافة حالياً</td>
                  </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Totals Section */}
        <section className="flex justify-end mb-12">
           <div className="w-full max-w-sm bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-slate-600">
                  <span className="font-medium">المجموع الفرعي</span>
                  <span className="font-mono">ج.م {subtotal.toFixed(2)}</span>
              </div>
              
              {invoice.discountRate > 0 && (
                <div className="flex justify-between items-center text-green-600">
                    <span className="font-medium text-sm">خصم ({invoice.discountRate}%)</span>
                    <span className="font-mono text-sm">- ج.م {discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-800">الإجمالي المستحق</span>
                      <span className="text-2xl font-bold text-indigo-600 font-mono">ج.م {total.toFixed(2)}</span>
                  </div>
              </div>
           </div>
        </section>

        {/* Notes Section */}
        {(invoice.notes) && (
            <section className="mb-8 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-400 mb-2">ملاحظات وشروط</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{invoice.notes}</p>
            </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 p-8 text-center mt-auto">
          <p className="text-indigo-600 font-bold mb-1 text-lg">شكراً لتعاملكم معنا</p>
          <p className="text-slate-400 text-xs">تم إنشاء هذه الفاتورة بواسطة Absoft</p>
      </footer>
      
      {/* Decorative Bottom Bar */}
      <div className="h-2 w-full bg-indigo-600"></div>
    </div>
  );
};