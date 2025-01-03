import { z } from "zod";


const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;


const cvcRegex = /^[0-9]{3,4}$/;


const phoneNumberRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;


// const cardNumberRegex = /^[0-9]{13,19}$/;






// Zod schema for the Checkout Form
export const CheckoutFormSchema = z.object({
  financing: z.string().min(1, { message: "Financing is required." }),
  
  product_id: z.string().min(1, { message: "Product ID is required." }),
  product_name: z.string().min(1, { message: "Product name is required." }),
  product_price: z.number().min(1, { message: "Product price is required." }),
  product_qty: z.number().min(1, { message: "Product quantity is required." }),
  
  shipping_method_id: z.string().min(1, { message: "Shipping method is required." }),
  // zone_id: z.string().min(1, { message: "Zone ID is required." }),
  
  contact_first_name: z.string().min(1, { message: "First name is required." }),
  contact_last_name: z.string().min(1, { message: "Last name is required." }),
  contact_company_name: z.string().min(1, { message: "Company name is required." }),
  
  contact_phone_number: z.union([
    z.string().regex(phoneNumberRegex, { message: "Invalid phone number." }),
    z.number(),
  ]).or(z.literal("")), 
  
  contact_email: z.string().email({ message: "Invalid email address." }),
  contact_industry: z.string().min(1, { message: "Industry is required." }),
  // contact_job_title: z.string().min(1, { message: "Job title is required." }),
  
  payment_name_on_card: z.string().min(1, { message: "Name on card is required." }),
  // payment_card_number: z.string().regex(cardNumberRegex, { message: "Invalid card number." }),
  // payment_expiry: z.string()
  //   .regex(expiryDateRegex, { message: "Expiration date must be in MM/YY format." }),
  payment_card_number: z
  .string()
  .min(1, { message: "Card number is required." })
  .transform((val) => val.replace(/\D/g, "")) 
  .refine(
    (digits) => digits.length >= 16 && digits.length <= 19,
    {
      message: "Invalid card number.",
    }
  ),
  // payment_expiry: z
  // .string()
  // .min(1, { message: "Expiration date must be in MM/YY format." })
  // .regex(expiryDateRegex, {
  //   message: "Expiration date must be in MM/YY format (e.g. 01/25).",
  // })
  // .refine((val) => {
 
  //   const [mmStr, yyStr] = val.split("/");
  //   if (!mmStr || !yyStr) return false;

  //   const mm = parseInt(mmStr, 10);         // month
  //   let yy = parseInt(yyStr, 10);           // two-digit year


  //   if (mm < 1 || mm > 12) return false;

  //   const now = new Date();
  //   const currentFullYear = now.getFullYear();   // e.g. 2025
  //   const currentMonth = now.getMonth() + 1;     // 1-based month
  //   // Derive the century from the current full year:
  //   const currentCentury = Math.floor(currentFullYear / 100) * 100;

  //   // Build the 4-digit year from the 2-digit input. 
  //   // For simple use cases, assume the card must be in the same century:
  //   const fullYear = currentCentury + yy;         // e.g. 2000 + 24 => 2024

  //   // If that full year is already less than the current year, it’s expired.
  //   if (fullYear < currentFullYear) {
  //     return false;
  //   }


  //   if (fullYear === currentFullYear && mm < currentMonth) {
  //     return false;
  //   }

  //   return true;
  // }, {
  //   message: "Your card is expired.",
  // }),

payment_expiry: z
  .string().min(1,{message:"Expiration date must be in MM/YY format."})
  .regex(expiryDateRegex, {
    message: "Expiration date must be in MM/YY format.",
  })
  .refine((val) => {
//check that the card is not expired.
    // val is 'MM/YY'
    const [mmStr, yyStr] = val.split("/");
    if (!mmStr || !yyStr) return false;

    const mm = parseInt(mmStr, 10);
    let yy = parseInt(yyStr, 10);


    const currentYearFull = new Date().getFullYear(); 
    // const currentYearShort = currentYearFull % 100;   
    const century = Math.floor(currentYearFull / 100) * 100; 

    yy = century + yy; 


    const cardDate = new Date(yy, mm - 1); 
    const now = new Date();

    return cardDate >= new Date(now.getFullYear(), now.getMonth());
  }, {
    message: "Your card is expired.",
  }),
    
    
  payment_cvc: z.string()
    .regex(cvcRegex, { message: "Enter valid CVC." }),
  
  billing_same_as_delivery: z.boolean(),
  
  billing_address_street: z.string().min(1, { message: "Billing street address is required." }),
  billing_address_city: z.string().min(1, { message: "Billing city is required." }),
  billing_address_state: z.string().min(1, { message: "Billing state is required." }),
  billing_address_zip_code: z.string().min(1, { message: "Billing zip code is required." }),
  billing_address_country: z.string().min(1, { message: "Billing country is required." }),
  
  // delivery_cost: z.string().min(1, { message: "Delivery cost is required." }).optional(),
  delivery_address_street: z.string().min(1, { message: "Delivery address is required." }),
  delivery_address_city: z.string().min(1, { message: "Delivery city is required." }),
  delivery_address_state_id: z.string().min(1, { message: "Delivery state ID is required." }),
  delivery_address_zip_code: z.string().min(1, { message: "Delivery zip code is required." }),
  delivery_address_country: z.string().min(1, { message: "Delivery country is required." }),
  
  // estimated_delivery_date: z.string().min(1, { message: "Estimated delivery date is required." }),
  // pickup_location_name: z.string().min(1, { message: "Pickup location name is required." }),
  // pickup_location_address: z.string().min(1, { message: "Pickup location address is required." }),
  // pickup_scheduled_date: z.string().min(1, { message: "Pickup scheduled date is required." }),
  
  // payment_type: z.string().min(1, { message: "Payment type is required." }),
  product_total_cost: z.number().min(1, { message: "Product total cost is required." }),
  // non_refundable_deposit: z.string().min(1, { message: "Non-refundable deposit is required." }).optional(),
  
  i_understand_deposit_is_non_refundable: z.boolean()
    .refine(val => val === true, { message: "You must understand that the deposit is non-refundable." }),
});
