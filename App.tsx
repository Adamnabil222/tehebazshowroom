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
  notes: 'شكراً لتعاملكم معنا!',
  discountRate: 0,
};

const initialBusinessInfo: BusinessInfo = {
  name: 'شركتك ذ.م.م',
  address: '123 الشارع الرئيسي, أي مدينة, الولايات المتحدة 12345',
  email: 'contact@yourcompany.com',
  phone: '(555) 123-4567'
};

const initialClientInfo: ClientInfo = {
  name: 'شركة العميل',
  address: '456 شارع أوك, مدينة ما, الولايات المتحدة 54321',
  email: 'contact@clientco.com'
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
  
  const handleExportPDF = () => {
    if (!invoicePreviewRef.current) return;
    setIsExporting(true);
    const element = invoicePreviewRef.current;
    
    // Temporarily increase scale for better quality
    element.style.transform = 'scale(1.5)';
    element.style.transformOrigin = 'top left';

    const opt = {
      margin: 0.5,
      filename: `فاتورة-${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).html2pdf().set(opt).from(element).save().then(() => {
      element.style.transform = 'scale(1)';
      setIsExporting(false);
    });
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
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100/50 font-sans text-slate-800">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">SalesEase</h1>
            <p className="text-slate-500 mt-2 text-lg">أنشئ فواتير احترافية في ثوانٍ</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
          <div className="lg:sticky lg:top-8">
            <div ref={invoicePreviewRef}>
              <InvoicePreview
                  invoice={invoice}
                  businessInfo={businessInfo}
                  clientInfo={clientInfo}
                  subtotal={subtotal}
                  discountAmount={discountAmount}
                  total={total}
              />
            </div>
             <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full max-w-xs flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:bg-indigo-300"
                >
                  <DownloadIcon className="w-5 h-5"/>
                  {isExporting ? 'جاري التصدير...' : 'تصدير كـ PDF'}
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all"
                >
                  <WhatsAppIcon className="w-6 h-6"/>
                  مشاركة عبر واتساب
                </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SalesEase. صُمم للبساطة والكفاءة.</p>
      </footer>
    </div>
  );
}

export default App;
