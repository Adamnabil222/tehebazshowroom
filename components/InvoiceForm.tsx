import React from 'react';
import type { Invoice, InvoiceItem, BusinessInfo, ClientInfo } from '../types';
import { TrashIcon, PlusCircleIcon } from './Icons';

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  clientInfo: ClientInfo;
  setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo>>;
  addItem: () => void;
  updateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  removeItem: (id: string) => void;
  clearInvoice: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  setInvoice,
  businessInfo,
  setBusinessInfo,
  clientInfo,
  setClientInfo,
  addItem,
  updateItem,
  removeItem,
  clearInvoice,
}) => {
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: name === 'discountRate' ? parseFloat(value) || 0 : value }));
  };
  
  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumeric = name === 'quantity' || name === 'price';
    updateItem(id, name as keyof InvoiceItem, isNumeric ? parseFloat(value) || 0 : value);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">تعديل الفاتورة</h2>
        <button
          onClick={clearInvoice}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-semibold transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
          مسح الكل
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-600 border-b pb-2">من (معلومات شركتك)</h3>
          <input name="name" value={businessInfo.name} onChange={handleBusinessInfoChange} placeholder="اسم الشركة" className="w-full p-2 border rounded-md" />
          <input name="address" value={businessInfo.address} onChange={handleBusinessInfoChange} placeholder="عنوان الشركة" className="w-full p-2 border rounded-md" />
          <input name="email" value={businessInfo.email} onChange={handleBusinessInfoChange} placeholder="البريد الإلكتروني للشركة" type="email" className="w-full p-2 border rounded-md" />
          <input name="phone" value={businessInfo.phone} onChange={handleBusinessInfoChange} placeholder="رقم هاتف الشركة" type="tel" className="w-full p-2 border rounded-md" />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-600 border-b pb-2">إلى (معلومات العميل)</h3>
          <input name="name" value={clientInfo.name} onChange={handleClientInfoChange} placeholder="اسم العميل" className="w-full p-2 border rounded-md" />
          <input name="address" value={clientInfo.address} onChange={handleClientInfoChange} placeholder="عنوان العميل" className="w-full p-2 border rounded-md" />
          <input name="email" value={clientInfo.email} onChange={handleClientInfoChange} placeholder="البريد الإلكتروني للعميل" type="email" className="w-full p-2 border rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-600">رقم الفاتورة</label>
            <input name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInvoiceChange} className="w-full p-2 border rounded-md mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">تاريخ الفاتورة</label>
            <input name="invoiceDate" value={invoice.invoiceDate} onChange={handleInvoiceChange} type="date" className="w-full p-2 border rounded-md mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">تاريخ الاستحقاق</label>
            <input name="dueDate" value={invoice.dueDate} onChange={handleInvoiceChange} type="date" className="w-full p-2 border rounded-md mt-1" />
          </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-600 border-b pb-2 mb-4">البنود</h3>
        <div className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 sm:col-span-5">
                 {index === 0 && <label className="text-xs text-slate-500">وصف البند</label>}
                 <input name="name" value={item.name} onChange={(e) => handleItemChange(item.id, e)} placeholder="اسم البند" className="w-full p-2 border rounded-md" />
              </div>
              <div className="col-span-4 sm:col-span-2">
                {index === 0 && <label className="text-xs text-slate-500">الكمية</label>}
                <input name="quantity" value={item.quantity} onChange={(e) => handleItemChange(item.id, e)} type="number" placeholder="1" className="w-full p-2 border rounded-md"/>
              </div>
              <div className="col-span-4 sm:col-span-2">
                {index === 0 && <label className="text-xs text-slate-500">السعر</label>}
                <input name="price" value={item.price} onChange={(e) => handleItemChange(item.id, e)} type="number" placeholder="0.00" className="w-full p-2 border rounded-md"/>
              </div>
              <div className="col-span-3 sm:col-span-2">
                {index === 0 && <label className="text-xs text-slate-500">الإجمالي</label>}
                <p className="p-2 text-slate-700 font-medium">{(item.quantity * item.price).toFixed(2)}</p>
              </div>
              <div className="col-span-1 flex justify-end">
                {index === 0 && <div className="h-4"></div>}
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 mt-2 sm:mt-0">
                  <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
          <PlusCircleIcon className="w-5 h-5" />
          إضافة بند
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-600">ملاحظات</label>
          <textarea name="notes" value={invoice.notes} onChange={handleInvoiceChange} placeholder="شكراً لتعاملكم معنا!" rows={3} className="w-full p-2 border rounded-md mt-1"></textarea>
        </div>
        <div>
          <div>
            <label className="block text-sm font-medium text-slate-600">نسبة الخصم (%)</label>
            <input name="discountRate" value={invoice.discountRate} onChange={handleInvoiceChange} type="number" placeholder="0" className="w-full p-2 border rounded-md mt-1" />
          </div>
        </div>
      </div>

    </div>
  );
};
