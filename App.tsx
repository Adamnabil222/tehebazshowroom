import React, { useState, useMemo, useCallback, useRef } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import type { Invoice, InvoiceItem, BusinessInfo, ClientInfo } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DownloadIcon, WhatsAppIcon } from './components/Icons';

const getTodayDate = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initialInvoice: Invoice = {
  invoiceNumber: 'INV-001',
  invoiceDate: getTodayDate(),
  dueDate: getTodayDate(),
  items: [{ id: crypto.randomUUID(), name: 'خدمات تصميم الويب', quantity: 1, price: 1500 }],
  notes: 'يرجى تحويل المبلغ خلال 14 يوم من تاريخ الاستحقاق.',
  discountRate: 0,
};

const initialBusinessInfo: BusinessInfo = {
  name: 'شركتك التقنية',
  address: 'الرياض، المملكة العربية السعودية',
  email: 'billing@techcompany.com',
  phone: '+966 55 123 4567'
};

const initialClientInfo: ClientInfo = {
  name: 'مؤسسة العميل المتميز',
  address: 'جدة، المملكة العربية السعودية',
  email: 'accounts@client.com'
};

function App() {
  const [invoice, setInvoice] = useLocalStorage<Invoice>('invoiceData', initialInvoice);
  const [businessInfo, setBusinessInfo] = useLocalStorage<BusinessInfo>('businessInfo', initialBusinessInfo);
  const [clientInfo, setClientInfo] = useLocalStorage<ClientInfo>('clientInfo', initialClientInfo);
  const [isExporting, setIsExporting] = useState(false);

  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  const addItem = useCallback(() => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: crypto.randomUUID(), name: '', quantity: 1, price: 0 }]
    }));
  }, [setInvoice]);

  const updateItem = useCallback(<K extends keyof InvoiceItem>(id: string, field: K, value: InvoiceItem[K]) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  }, [setInvoice]);

  const removeItem = useCallback((id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  }, [setInvoice]);
  
  const clearInvoice = useCallback(() => {
      setInvoice({
          ...initialInvoice,
          items: [],
          invoiceNumber: `INV-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      });
      setClientInfo(initialClientInfo);
  }, [setInvoice, setClientInfo]);

  const { subtotal, discountAmount, total } = useMemo(() => {
    const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const discountAmount = subtotal * (invoice.discountRate / 100);
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  }, [invoice.items, invoice.discountRate]);
  
  const handleExportPDF = async () => {
    if (!invoicePreviewRef.current) return;
    setIsExporting(true);
    
    const element = invoicePreviewRef.current;

    // Options for html2pdf
    const opt = {
      margin: 0,
      filename: `فاتورة-${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      // @ts-ignore
      if (window.html2pdf) {
         // @ts-ignore
         await window.html2pdf().set(opt).from(element).save();
      } else {
        alert("مكتبة PDF غير محملة بشكل صحيح. يرجى تحديث الصفحة.");
      }
    } catch (error) {
      console.error("فشل تصدير PDF:", error);
      alert("حدث خطأ غير متوقع أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = () => {
    const itemsText = invoice.items
      .map(
        (item) =>
          `- ${item.name || 'بند'}: ${item.quantity} × ج.م ${item.price.toFixed(2)} = *ج.م ${(item.quantity * item.price).toFixed(2)}*`
      )
      .join('\n');

    const message = `
*فاتورة من ${businessInfo.name || 'شركتك'}*

*رقم الفاتورة:* ${invoice.invoiceNumber || 'INV-001'}
*التاريخ:* ${invoice.invoiceDate}
*تاريخ الاستحقاق:* ${invoice.dueDate}

*إلى:* ${clientInfo.name || 'اسم العميل'}

---
*البنود:*
${itemsText}
${invoice.items.length === 0 ? '_لا توجد بنود بعد..._' : ''}
---
*المجموع الفرعي:* ج.م ${subtotal.toFixed(2)}
*الخصم (${invoice.discountRate}%):* -ج.م ${discountAmount.toFixed(2)}
*المجموع الإجمالي:* *ج.م ${total.toFixed(2)}*

---
*ملاحظات:*
${invoice.notes || 'شكراً لتعاملكم معنا.'}
    `
      .trim()
      .replace(/^\s+/gm, '');

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 font-sans text-slate-800">
      
      {/* Sidebar Editor (Scrollable) */}
      <aside className="w-full md:w-[450px] lg:w-[500px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 h-full">
        
        <div className="p-5 border-b border-slate-100 bg-white z-10 flex justify-between items-center">
           <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">SalesEase</h1>
           <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">محرر الفواتير</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-white">
             <InvoiceForm
              invoice={invoice}
              setInvoice={setInvoice}
              businessInfo={businessInfo}
              setBusinessInfo={setBusinessInfo}
              clientInfo={clientInfo}
              setClientInfo={setClientInfo}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
              clearInvoice={clearInvoice}
            />
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3 z-10">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="w-5 h-5"/>
              {isExporting ? 'جاري المعالجة...' : 'تصدير الفاتورة (PDF)'}
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-600 border border-green-200 font-bold rounded-lg hover:bg-green-50 focus:outline-none transition-all"
            >
              <WhatsAppIcon className="w-5 h-5"/>
              إرسال واتساب
            </button>
        </div>
      </aside>

      {/* Main Preview Area (Full Screen, Scrollable) */}
      <main className="flex-1 relative bg-slate-200/80 overflow-y-auto p-8 md:p-12 flex justify-center items-start">
         <div className="w-fit mx-auto drop-shadow-2xl my-auto">
            <div ref={invoicePreviewRef} className="min-w-[210mm]">
              <InvoicePreview
                  invoice={invoice}
                  businessInfo={businessInfo}
                  clientInfo={clientInfo}
                  subtotal={subtotal}
                  discountAmount={discountAmount}
                  total={total}
              />
            </div>
         </div>
         
         {/* Footer for large screen attribution */}
         <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none mix-blend-multiply">
             <p className="text-slate-400 text-sm opacity-60">معاينة مباشرة للفاتورة</p>
         </div>
      </main>

    </div>
  );
}

export default App;