export const money=(value=0)=>`₦${Number(value).toLocaleString('en-NG',{minimumFractionDigits:0,maximumFractionDigits:2})}`;
export const dateTime=(value)=>new Date(value).toLocaleString('en-NG',{dateStyle:'medium',timeStyle:'short'});
export const dateOnly=(value)=>new Date(value).toLocaleDateString('en-NG',{dateStyle:'medium'});
export const getError=(e,fallback='Something went wrong')=>e?.response?.data?.message||fallback;
