export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface BusinessInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  email: string;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  discountRate: number;
}