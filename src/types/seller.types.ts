export interface SellerLoginFormData {
  email: string;
  password: string;
}

export interface SellerRegisterFormData {
  sellerName: string;
  email: string;
  password: string;
  phoneNumber: string;
  shopName: string;
  gstNumber?: string;
  businessAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}