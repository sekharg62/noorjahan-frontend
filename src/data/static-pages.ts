import { siteConfig } from "@/lib/site-config";

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface QaItem {
  id: string;
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
}

export interface ContentSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export type StaticPageLayout =
  | "centered"
  | "sections"
  | "privacy"
  | "faq"
  | "qa"
  | "stores"
  | "contact"
  | "terms";

export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  layout: StaticPageLayout;
  intro?: string;
  lastUpdated?: string;
  paragraphs?: string[];
  sections?: ContentSection[];
  faqs?: FaqItem[];
  qaItems?: QaItem[];
  stores?: StoreLocation[];
  termsSections?: ContentSection[];
  termsDataUses?: string[];
  storesFooterNote?: string;
  contactIntro?: string;
}

const brand = siteConfig.brandName;
const short = siteConfig.shortName;
const currency = siteConfig.shipping.currencySymbol;
const freeShipping = siteConfig.shipping.freeShippingThreshold;
const careEmail =
  siteConfig.contact.customerCareEmail ?? siteConfig.contact.email;
export const LOCAL_FLAT_SHIPPING = 150;
const localFlatShipping = LOCAL_FLAT_SHIPPING;

export const shippingQaItems: QaItem[] = [
  {
    id: "delivery-time",
    question: "What is the delivery time?",
    answer:
      "Local order delivery takes 3–5 days, depending on the size and availability of the product. Orders are processed within 24 hours and are generally scheduled for delivery the following working day. Timely delivery is subject to availability of stock and payment confirmation. In certain cases, we may request payment verification before processing your order.",
  },
  {
    id: "delivery-charges",
    question:
      "What are the delivery charges for local and international orders?",
    answer: `${brand} provides free shipping for orders above ${currency}${freeShipping.toFixed(2)}. For orders under ${currency}${freeShipping.toFixed(2)}, a flat rate of ${currency}${localFlatShipping.toFixed(2)} will be charged. For international orders, courier rates are shown at checkout based on your location and the weight of your order.`,
  },
  {
    id: "price-includes-shipping",
    question: "Does the price of the order include shipping?",
    answer:
      "We indicate shipping charges separately on the checkout page as part of your order summary. The final amount charged will include applicable shipping fees.",
  },
  {
    id: "delivery-status",
    question: "How do I check the delivery status?",
    answer:
      "On dispatch, you will receive a tracking ID for your order by email and SMS. Use the links below to track local and international shipments with your tracking number.",
    links: [
      {
        label: "PostEx tracking (Bangladesh)",
        href: "https://postex.pk/tracking",
      },
      {
        label: "DHL express tracking (international)",
        href: "https://www.dhl.com/en/express/tracking.html",
      },
    ],
  },
  {
    id: "shipping-method",
    question: "What manner of shipping do you use?",
    answer:
      "We ship across Bangladesh through trusted courier partners including PostEx and Steadfast. International orders are shipped via DHL. Packages typically arrive in 2–4 working days for local delivery and 7–10 working days for international delivery, depending on your destination.",
  },
  {
    id: "delivery-attempts",
    question:
      "How many times will the courier agent attempt to deliver my order if I am unavailable?",
    answer:
      "Our delivery partners make two attempts to deliver your parcel. Please ensure your address, city, and contact number are entered correctly when placing an order. After a second failed attempt, the parcel will be returned to us.",
  },
];

export const storeLocations: StoreLocation[] = [
  {
    id: "gulshan-dhaka",
    name: "GULSHAN AVENUE — DHAKA",
    address:
      "House 12, Road 108, Gulshan Avenue, Gulshan-2, Dhaka 1212, Bangladesh",
    phone: "+880-2-55012345",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Gulshan+Avenue+Dhaka+Bangladesh",
  },
  {
    id: "banani-dhaka",
    name: "BANANI — DHAKA",
    address: "Road 11, Block C, Banani, Dhaka 1213, Bangladesh",
    phone: "+880-2-55023456",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Banani+Dhaka+Bangladesh",
  },
  {
    id: "bashundhara-dhaka",
    name: "BASHUNDHARA CITY — DHAKA",
    address:
      "Shop 42, Level 3, Bashundhara City Shopping Mall, Panthapath, Dhaka 1205, Bangladesh",
    phone: "+880-2-55034567",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Bashundhara+City+Dhaka",
  },
  {
    id: "dhanmondi-dhaka",
    name: "DHANMONDI — DHAKA",
    address: "House 8, Road 27 (Old), Dhanmondi, Dhaka 1209, Bangladesh",
    phone: "+880-2-55045678",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Dhanmondi+Dhaka+Bangladesh",
  },
  {
    id: "chittagong",
    name: "GEC CIRCLE — CHITTAGONG",
    address: "Plot 15, CDA Avenue, GEC Circle, Chattogram 4000, Bangladesh",
    phone: "+880-31-2556789",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=GEC+Circle+Chittagong+Bangladesh",
  },
  {
    id: "sylhet",
    name: "ZINDABAZAR — SYLHET",
    address: "Zindabazar Main Road, Sylhet 3100, Bangladesh",
    phone: "+880-821-712345",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Zindabazar+Sylhet+Bangladesh",
  },
];

const termsDataUses = [
  "To create your personal account on our website (e.g. your name and email address)",
  "To process your orders (e.g. your name, address, and payment details)",
  "To send text message notifications of delivery status (e.g. your mobile phone number)",
  "To send you marketing offers such as newsletters and our catalogues (e.g. your email address, wish lists, your name and your postal address)",
  "To contact you in the event of any problem with the delivery of your items (e.g. telephone number, address)",
  "To answer your queries and to inform you of new or changed services (e.g. your email address)",
  "To notify winners in promotions (e.g. your email address, name, home address and telephone number)",
  "Managing your account by carrying out credit checks (e.g. name, address, date of birth)",
  "Disclosing your data to fraud prevention agencies",
  "To analyze your personal data to provide you with relevant marketing offers and information (e.g. name, buying habits)",
  "To validate that you are of legal age for shopping online (e.g. date of birth)",
];

export const faqItems: FaqItem[] = [
  {
    id: "order-how",
    question: "How do I place an order?",
    answer:
      "Browse our collections, select your size, add items to cart, and complete checkout with your delivery address. Choose cash on delivery (COD) to place your order. You will receive confirmation once your order is received.",
  },
  {
    id: "order-payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer, mobile banking, and cash on delivery within Bangladesh where available. International customers may pay via approved methods shared at checkout.",
  },
  {
    id: "order-change",
    question: "Can I change or cancel my order?",
    answer:
      "Orders can be changed or cancelled within 24 hours of placement if they have not been processed for dispatch. Contact customer care with your order number as soon as possible.",
  },
  {
    id: "shipping-time",
    question: "How long does delivery take?",
    answer:
      "Delivery within Bangladesh typically takes 3–7 business days depending on your city. International delivery times vary by destination and are confirmed when you place your order.",
  },
  {
    id: "shipping-free",
    question: `Do you offer free shipping?`,
    answer: `Yes. Enjoy free shipping on orders over ${currency}${freeShipping.toFixed(2)} within Bangladesh. Shipping charges for orders below this amount are calculated at checkout.`,
  },
  {
    id: "shipping-track",
    question: "How can I track my order?",
    answer:
      "Once your order is dispatched, you will receive tracking information by SMS or email. You can also visit our Track Your Order page or contact customer care for updates.",
  },
  {
    id: "product-unstitched",
    question: "What is included in an unstitched suit?",
    answer:
      "Unstitched suits typically include fabric for shirt/kameez, trouser/salwar, and dupatta as described on the product page. Embellishments and stitching are not included unless stated.",
  },
  {
    id: "product-size",
    question: "How do I choose the right size?",
    answer:
      "Ready-to-wear sizes are listed on each product (XS, S, M, L, XL, or Free Size). For unstitched pieces, fabric length and width are shown in the description. Contact us if you need sizing guidance.",
  },
  {
    id: "product-soldout",
    question: "An item is sold out. Will it be restocked?",
    answer:
      "Limited pieces may not be restocked. Join our newsletter or follow us on social media for new collection launches and restock announcements.",
  },
  {
    id: "return-policy",
    question: "What is your exchange and refund policy?",
    answer:
      "Unworn items with original tags and packaging may be exchanged within 7 days of delivery. Refunds apply to defective or incorrect items only. See our Exchange & Refund page for full details.",
  },
  {
    id: "return-process",
    question: "How do I request a return or exchange?",
    answer:
      "Email customer care with your order number, reason, and photos if applicable. Our team will guide you through pickup or drop-off at the nearest store.",
  },
  {
    id: "contact-hours",
    question: "How can I reach customer service?",
    answer: `${short} customer service is available via phone, WhatsApp, and email. We aim to respond within 24–48 hours on business days.`,
  },
];

export const staticPages: StaticPage[] = [
  {
    slug: "about-us",
    title: "About Us",
    description: `Learn about ${brand} — premium fabrics, unstitched suits, and designer fashion.`,
    layout: "centered",
    paragraphs: [
      `Inspired by history and charmed by nature, ${brand} is a celebration of vintage Pakistani fashion — representing the pinnacle of craftsmanship, unsurpassed quality of fabrics, and attention to detail in every lawn, print, and ready-to-wear piece we offer.`,
      `The ${short} woman is free from the shackles of the fickle world, with a timeless approach to fashion; she is confident of her past and grounded enough in her roots to embrace tradition in its purest form.`,
    ],
  },
  {
    slug: "stores",
    title: "Stores",
    description: `Find ${brand} store locations across Bangladesh.`,
    layout: "stores",
    stores: storeLocations,
    storesFooterNote: `Visit ${brand} across Bangladesh for premium fabrics, unstitched collections, and ready-to-wear designer outfits.`,
  },
  {
    slug: "contact-us",
    title: "Contact Us",
    description: `Contact ${brand} for orders, shipping, and customer care.`,
    layout: "contact",
    contactIntro: `${brand} customer service team will require 24/48 hours to get back to you.`,
  },
  {
    slug: "shipping",
    title: "Shipping",
    description: `Shipping, delivery times, and courier information for ${brand}.`,
    layout: "qa",
    qaItems: shippingQaItems,
  },
  {
    slug: "customer-care",
    title: "Customer Care",
    description: `Customer care and support at ${brand}.`,
    layout: "sections",
    intro:
      "Our customer care team is here to help with orders, product questions, and after-sales support.",
    sections: [
      {
        id: "hours",
        heading: "Response time",
        paragraphs: [
          "We respond to emails and WhatsApp messages within 24–48 hours on business days.",
          "For urgent order issues, please call our helpline during store hours.",
        ],
      },
      {
        id: "help",
        heading: "How we can help",
        bullets: [
          "Order placement and payment queries",
          "Size and product information",
          "Shipping and delivery updates",
          "Exchange, refund, and quality concerns",
        ],
      },
    ],
  },
  {
    slug: "exchange-refund",
    title: "Exchange & Refund",
    description: "Exchange and refund policy for online and store purchases.",
    layout: "sections",
    sections: [
      {
        id: "exchange",
        heading: "Exchanges",
        paragraphs: [
          "Unworn items with original tags, packaging, and receipt may be exchanged within 7 days of delivery for another size or style of equal value, subject to availability.",
        ],
        bullets: [
          "Sale items may be exchanged only where stated on the product page",
          "Custom or altered pieces cannot be exchanged",
          "Exchanges at any NOORJAHAN store in Bangladesh with proof of purchase",
        ],
      },
      {
        id: "refund",
        heading: "Refunds",
        paragraphs: [
          "Refunds are issued for defective, damaged, or incorrectly shipped items. Refund requests must be reported within 48 hours of delivery with photos where applicable.",
          "Approved refunds are processed within 7–14 business days to the original payment method.",
        ],
      },
    ],
  },
  {
    slug: "track-order",
    title: "Track Your Order",
    description: "Track your NOORJAHAN order status.",
    layout: "sections",
    sections: [
      {
        id: "track",
        heading: "Order tracking",
        paragraphs: [
          "When your order is dispatched, you will receive a tracking link by SMS or email.",
          "If you have not received tracking information within 3 business days of ordering, please contact customer care with your order number and registered phone number.",
        ],
        bullets: [
          "Order confirmed — payment received and order queued",
          "Processing — items being prepared for dispatch",
          "Shipped — handed to courier with tracking ID",
          "Delivered — order received at your address",
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: `How ${brand} collects, uses, and protects your personal information.`,
    layout: "privacy",
    lastUpdated: "June 2026",
    intro: `${brand}'s top priority is your privacy when you shop with us. This policy explains what personal information we collect, how we use it, who may access it, and what rights you have regarding your data.`,
    sections: [
      {
        id: "scope",
        heading: "",
        paragraphs: [
          "This Privacy Policy does not apply to websites maintained by other companies or organizations to which we link. We are not responsible for personal information you submit to third parties via external links. Please read the privacy policy of any other site before submitting your details.",
          `Your access and use of this website constitute your acceptance of our Privacy Policy and Terms and Conditions.`,
        ],
      },
      {
        id: "use",
        heading: "Use of information",
        paragraphs: [
          `${brand} collects personal information when you place an order, register an account, subscribe to our newsletter, or contact customer care. By registering or placing an order, you consent to the collection of your personal data as described below.`,
          "When you order with us, we may hold your name, email address, phone numbers, home address, shipping address, and billing details for order processing. Saved payment details are never shared with third parties and are used only to process your order through our payment service provider. We may obtain information from authentication or identity checks, including your telephone number, which may be shared with our courier for delivery services.",
        ],
        bullets: [
          "To create and manage your personal account",
          "To process orders and payments",
          "To send delivery status updates by SMS or email",
          "To send marketing offers such as newsletters and catalogues (where you have opted in)",
          "To contact you about problems with delivery of your items",
          "To answer queries and inform you of new or changed services",
          "To notify winners in promotions",
          "To carry out credit checks when managing your account",
          "To disclose data to fraud prevention agencies where required",
          "To analyze data and provide relevant offers (e.g. name, purchase history)",
          "To verify you are of legal age to shop online",
        ],
      },
      {
        id: "security",
        heading: "Online security",
        paragraphs: [
          "Customer information including name, billing details, and shipping addresses is necessary to process card and mobile banking transactions and is used in fraud detection. All payment and shipping data is kept secure and confidential. Only authorized personnel may access this data. We do not share, lease, or sell your personal information without your consent.",
          "Your personal information is protected by SSL (Secure Sockets Layer), which encrypts sensitive data transmitted between your browser and our servers. Online security may be applied again when you use a new payment method or account.",
        ],
      },
      {
        id: "cookies",
        heading: "Cookies",
        paragraphs: [
          "A cookie is a small text file stored on your computer or mobile device. We use cookies to improve your visit — for example, to remember preferences and whether you are logged in. We do not use cookies to store payment card numbers or to sell data to third-party advertisers.",
          "We may use session cookies for product filters and login status, and persistent cookies for start-page preferences. You can delete cookies at any time through your browser settings.",
        ],
      },
      {
        id: "retention",
        heading: "Data retention",
        paragraphs: [
          "We keep your data only as long as needed to provide our services or as required by law, after which it is deleted. We cannot remove data when there is a legal storage requirement (e.g. bookkeeping) or an ongoing contractual relationship.",
          "Non-personal data may be combined with personal data as permitted by law. We do not sell your details to third-party marketing companies.",
        ],
      },
      {
        id: "rights",
        heading: "Your rights",
        paragraphs: [
          "You may request information about the personal data we hold about you. If your data is incorrect, incomplete, or irrelevant, you can ask us to correct or remove it, subject to legal obligations.",
          `For further help, see our FAQs or email ${careEmail}. You may also contact customer care by phone or WhatsApp using the details on our Contact Us page.`,
        ],
      },
    ],
  },
  {
    slug: "faqs",
    title: "FAQs",
    description: "Frequently asked questions about orders, shipping, sizing, and returns.",
    layout: "faq",
    intro: `Find answers to common questions about shopping at ${short}. For further help, visit Contact Us or reach our customer care team.`,
    faqs: faqItems,
  },
  {
    slug: "international",
    title: "International",
    description: "International orders and shipping from NOORJAHAN.",
    layout: "sections",
    sections: [
      {
        id: "orders",
        heading: "International orders",
        paragraphs: [
          `${brand} ships to selected countries worldwide. Available products, shipping costs, and delivery times are shown at checkout for your destination.`,
        ],
        bullets: [
          "Prices may be displayed in BDT; your bank may apply currency conversion",
          "Customs duties and import taxes are the buyer's responsibility unless stated",
          "International orders are final sale unless the item is defective",
        ],
      },
      {
        id: "support",
        heading: "International customer support",
        paragraphs: [
          "Contact us via WhatsApp or email for international order assistance. Include your country and preferred delivery address for accurate quotes.",
        ],
      },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms and Conditions",
    description: `Terms and conditions for shopping at ${brand}.`,
    layout: "terms",
    termsDataUses,
    termsSections: [
      {
        id: "retention",
        heading: "",
        paragraphs: [
          `We will only keep your data for as long as necessary to carry out our services to you or as long as we are required by law. After this your personal data will be deleted. We cannot remove your data when there is a legal storage requirement, such as bookkeeping rules or when there is a legal ground to keep the data, such as an ongoing contractual relationship.`,
          "Non-personal data is used as described above and in other ways as permitted by applicable laws, including combining non-personal data with personal data. Lastly, we do not sell your details to third-party marketing companies.",
        ],
      },
      {
        id: "rights",
        heading: "Your rights",
        paragraphs: [
          "You have the right to request information about the personal data we hold on you. If your data is incorrect, incomplete or irrelevant you can ask to have the information corrected or removed.",
        ],
      },
    ],
  },
];

export const checkoutCopy = {
  title: "Checkout",
  shippingSection: "Delivery address",
  paymentSection: "Payment method",
  paymentCod: "Cash on delivery (COD)",
  paymentCodHint: "Pay with cash when your order is delivered.",
  placeOrder: "Place order",
  placeOrderError: "Could not place your order. Please try again.",
  orderSummary: "Order summary",
  subtotal: "Subtotal",
  shipping: "Shipping",
  shippingFree: "Free",
  total: "Total",
  emptyCart: "Your cart is empty.",
  continueShopping: "Continue shopping",
  fields: {
    fullName: "Full name",
    phone: "Phone number",
    email: "Email address (optional)",
    addressLine: "Street address",
    city: "City",
    district: "District / area",
    postalCode: "Postal code",
    pincode: "Pincode",
    alternativePh: "Alternative phone (optional)",
    notes: "Delivery notes (optional)",
  },
  addresses: {
    title: "Saved addresses",
    selectHint: "Choose a delivery address for this order.",
    addNew: "Add new address",
    edit: "Edit",
    delete: "Delete",
    save: "Save address",
    cancel: "Cancel",
    saving: "Saving…",
    deleting: "Deleting…",
    deleteConfirm: "Delete this address?",
    empty: "You have no saved addresses yet. Add one to continue.",
    selected: "Selected for delivery",
    addressError: "Could not save address. Please try again.",
    deleteError: "Could not delete address. Please try again.",
    selectError: "Please select a delivery address.",
  },
  success: {
    title: "Thank you for your order",
    subtitle:
      "Your order has been placed successfully. We will contact you if we need any further details.",
    confirmed: "Confirmed",
    orderId: "Order number",
    orderDate: "Order date",
    payment: "Payment method",
    paymentCod: "Cash on delivery (COD)",
    payOnDelivery: "Pay when your order arrives",
    delivery: "Delivery address",
    itemsOrdered: "Items ordered",
    subtotal: "Subtotal",
    shipping: "Shipping",
    shippingFree: "Free",
    total: "Total paid on delivery",
    whatsNext: "What happens next",
    step1: "Order confirmed",
    step1Detail: "We have received your order and payment method (COD).",
    step2: "Processing",
    step2Detail: "Your items are being prepared for dispatch within 24 hours.",
    step3: "Delivery",
    step3Detail: "Estimated delivery in 3–5 business days within Bangladesh.",
    trackHint:
      "Save your order number — you can use it on the Track Order page to check your delivery status.",
    orders: "My orders",
    addresses: "Saved addresses",
    noOrders: "No orders yet.",
    noAddresses: "No saved addresses yet.",
    help:
      "Questions about your order? Contact our customer care team — we respond within 24–48 hours.",
    notFound: "We could not find this order. It may have expired from your browser session.",
    continueShopping: "Continue shopping",
    trackOrder: "Track your order",
    contactUs: "Contact us",
  },
} as const;

export const accountCopy = {
  login: {
    title: "Login",
    subtitle: "If you have an account with us, please log in.",
    phoneLabel: "Phone number",
    passwordLabel: "Password",
    submit: "Sign in",
    submitLoading: "Signing in…",
    error: "Invalid phone number or password. Please try again.",
    noAccount: "Don't have an account?",
    createAccount: "Create an account",
    forgotPassword: "Forgot your password?",
  },
  register: {
    title: "Create an account",
    subtitle:
      "Enter your information below to proceed. If you already have an account, please log in instead.",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    phoneLabel: "Phone number",
    emailLabel: "Email address (optional)",
    passwordLabel: "Password",
    submit: "Create an account",
    submitLoading: "Creating account…",
    success: "Your account has been created. You can now sign in.",
    error: "Could not create your account. Please try again.",
    hasAccount: "Already have an account?",
    login: "Login",
  },
  recover: {
    title: "Reset your password",
    subtitle: "We will send you an email to reset your password",
    emailLabel: "Email address",
    submit: "Submit",
    cancel: "Cancel",
    success:
      "If an account exists for this email, you will receive reset instructions shortly.",
  },
  formNotice:
    "Account sign-in is not connected to a live backend yet. Your details are not stored — contact customer care for order help.",
  profile: {
    title: "My account",
    welcome: "Welcome back",
    details: "Account details",
    name: "Name",
    phone: "Phone",
    email: "Email",
    notProvided: "Not provided",
    quickLinks: "Quick links",
    wishlist: "My wishlist",
    trackOrder: "Track an order",
    shop: "Continue shopping",
    logout: "Log out",
    loading: "Loading your account…",
    orders: "My orders",
    addresses: "Saved addresses",
    noOrders: "No orders yet.",
    noAddresses: "No saved addresses yet.",
    manageAddresses: "Manage addresses",
  },
  manageAddresses: {
    title: "Manage addresses",
    subtitle: "Add, edit, or delete your saved delivery addresses.",
    backToProfile: "← Back to account",
  },
} as const;

const pagesBySlug = new Map(staticPages.map((p) => [p.slug, p]));

export function getStaticPageBySlug(slug: string): StaticPage | undefined {
  return pagesBySlug.get(slug);
}

export function getAllStaticPageSlugs(): string[] {
  return staticPages.map((p) => p.slug);
}
