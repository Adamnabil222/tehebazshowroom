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
    <div className="space-y-8">
      
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-800">بيانات الفاتورة</h2>
        <button
          onClick={clearInvoice}
          className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
        >
          مسح الكل
        </button>
      </div>
      
      {/* Basic Details */}
      <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">رقم الفاتورة</label>
            <input name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInvoiceChange} className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">تاريخ الفاتورة</label>
            <input name="invoiceDate" value={invoice.invoiceDate} onChange={handleInvoiceChange} type="date" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">تاريخ الاستحقاق</label>
            <input name="dueDate" value={invoice.dueDate} onChange={handleInvoiceChange} type="date" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
      </div>

      {/* From Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            بيانات شركتك (من)
        </h3>
        <div className="space-y-2">
            <input name="name" value={businessInfo.name} onChange={handleBusinessInfoChange} placeholder="اسم الشركة" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <input name="address" value={businessInfo.address} onChange={handleBusinessInfoChange} placeholder="العنوان" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <div className="grid grid-cols-2 gap-2">
                <input name="email" value={businessInfo.email} onChange={handleBusinessInfoChange} placeholder="البريد الإلكتروني" type="email" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input name="phone" value={businessInfo.phone} onChange={handleBusinessInfoChange} placeholder="رقم الهاتف" type="tel" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
        </div>
      </div>

      {/* To Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            بيانات العميل (إلى)
        </h3>
        <div className="space-y-2">
            <input name="name" value={clientInfo.name} onChange={handleClientInfoChange} placeholder="اسم العميل" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <input name="address" value={clientInfo.address} onChange={handleClientInfoChange} placeholder="عنوان العميل" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <input name="email" value={clientInfo.email} onChange={handleClientInfoChange} placeholder="البريد الإلكتروني" type="email" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      </div>

      {/* Items Section */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3">المنتجات / الخدمات</h3>
        <div className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative group">
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                    <TrashIcon className="w-4 h-4"/>
                  </button>
              </div>
              
              <div className="mb-2">
                 <label className="text-[10px] text-slate-400 font-bold uppercase">الوصف</label>
                 <input name="name" value={item.name} onChange={(e) => handleItemChange(item.id, e)} placeholder="اسم الخدمة أو المنتج" className="w-full p-1.5 bg-white border border-slate-200 rounded text-sm focus:border-indigo-500 outline-none" />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase">الكمية</label>
                    <input name="quantity" value={item.quantity} onChange={(e) => handleItemChange(item.id, e)} type="number" className="w-full p-1.5 bg-white border border-slate-200 rounded text-sm text-center focus:border-indigo-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase">السعر</label>
                    <input name="price" value={item.price} onChange={(e) => handleItemChange(item.id, e)} type="number" className="w-full p-1.5 bg-white border border-slate-200 rounded text-sm text-center focus:border-indigo-500 outline-none"/>
                  </div>
                  <div>
                     <label className="text-[10px] text-slate-400 font-bold uppercase">الإجمالي</label>
                     <div className="p-1.5 bg-slate-100 rounded text-sm text-center font-bold text-slate-600">
                        {(item.quantity * item.price).toFixed(2)}
                     </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-3 w-full py-2 flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-sm font-bold transition-colors">
          <PlusCircleIcon className="w-4 h-4" />
          إضافة بند جديد
        </button>
      </div>
      
      {/* Footer Details */}
      <div className="pt-4 border-t border-slate-100">
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">نسبة الخصم (%)</label>
                <input name="discountRate" value={invoice.discountRate} onChange={handleInvoiceChange} type="number" placeholder="0" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ملاحظات / شروط</label>
              <textarea name="notes" value={invoice.notes} onChange={handleInvoiceChange} placeholder="أدخل أي ملاحظات إضافية هنا..." rows={3} className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
            </div>
        </div>
      </div>

    </div>
  );
};