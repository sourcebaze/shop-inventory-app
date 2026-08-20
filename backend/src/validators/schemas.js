import Joi from "joi";
const id = Joi.string().hex().length(24);
const email = Joi.string().email({ tlds: { allow: false } });
export const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: email.required(),
  password: Joi.string().min(6).max(100).required(),
});
export const loginSchema = Joi.object({
  email: email.required(),
  password: Joi.string().required(),
});
export const userSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: email.required(),
  password: Joi.string().min(6).max(100).optional(),
  role: Joi.string().valid("owner", "manager", "staff").required(),
  isActive: Joi.boolean().optional(),
});
export const productSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  SKU: Joi.string().min(2).max(50).required(),
  category: id.required(),
  supplier: id.allow(null, "").optional(),
  buyingPrice: Joi.number().min(0).required(),
  sellingPrice: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(0).required(),
  minimumStock: Joi.number().integer().min(0).required(),
  description: Joi.string().allow("").max(1000).optional(),
  image: Joi.string().allow("").optional(),
});
export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  description: Joi.string().allow("").max(500).optional(),
  isActive: Joi.boolean().optional(),
});
export const supplierSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  phone: Joi.string().allow("").max(30).optional(),
  email: email.allow("").optional(),
  address: Joi.string().allow("").max(250).optional(),
  isActive: Joi.boolean().optional(),
});
export const customerSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  phone: Joi.string().allow("").max(30).optional(),
  email: email.allow("").optional(),
  address: Joi.string().allow("").max(250).optional(),
  isActive: Joi.boolean().optional(),
});
export const stockSchema = Joi.object({
  productId: id.required(),
  quantity: Joi.number().integer().min(1).required(),
  note: Joi.string().allow("").max(300).optional(),
});
export const adjustmentSchema = Joi.object({
  productId: id.required(),
  newQuantity: Joi.number().integer().min(0).required(),
  note: Joi.string().allow("").max(300).optional(),
});
export const saleSchema = Joi.object({
  customerId: id.allow(null, "").optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: id.required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
  discount: Joi.number().min(0).default(0),
  paymentMethod: Joi.string()
    .valid("Cash", "Transfer", "POS", "Card")
    .required(),
});
export const settingsSchema = Joi.object({
  shopName: Joi.string().min(2).max(120).required(),
  shopAddress: Joi.string().allow("").max(250).optional(),
  shopPhone: Joi.string().allow("").max(30).optional(),
  currency: Joi.string().default("NGN"),
  defaultMinimumStock: Joi.number().integer().min(0).required(),
});
