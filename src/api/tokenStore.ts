let userToken: string | null = null;
let sellerToken: string | null = null;
let adminToken: string | null = null;

let userTokenSetter: ((token: string | null) => void) | null = null;
let sellerTokenSetter: ((token: string | null) => void) | null = null;
let adminTokenSetter: ((token: string | null) => void) | null = null;

export const setUserToken = (token: string | null) => {
  userToken = token;
};

export const setSellerToken = (token: string | null) => {
  sellerToken = token;
};

export const setAdminToken = (token: string | null) => {
  adminToken = token;
};

export const getUserToken = () => userToken;
export const getSellerToken = () => sellerToken;
export const getAdminToken = () => adminToken;

export const registerUserTokenSetter = (fn: (token: string | null) => void) => {
  userTokenSetter = fn;
};
export const registerSellerTokenSetter = (fn: (token: string | null) => void) => {
  sellerTokenSetter = fn;
};
export const registerAdminTokenSetter = (fn: (token: string | null) => void) => {
  adminTokenSetter = fn;
};

export const getUserTokenSetter = () => userTokenSetter;
export const getSellerTokenSetter = () => sellerTokenSetter;
export const getAdminTokenSetter = () => adminTokenSetter;