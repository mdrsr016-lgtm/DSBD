// ============================================================
// DSBD AI Chatbot Engine — ToS, Privacy & Project Knowledge
// Bilingual (English + Bangla), simple-language answers
// ============================================================

export type ChatbotReply = { text: string; options?: string[] }

interface KnowledgeTopic {
  id: string
  keywords: string[]
  en: string
  bn: string
}

// ── Detect reply language from message text or UI preference ─
export function detectReplyLanguage(text: string, uiBengali: boolean): boolean {
  if (/[\u0980-\u09FF]/.test(text)) return true
  if (/[a-zA-Z]/.test(text) && !/[\u0980-\u09FF]/.test(text)) return false
  return uiBengali
}

// ── Score how well a user message matches a knowledge topic ───
function scoreTopic(query: string, topic: KnowledgeTopic): number {
  const q = query.toLowerCase().trim()
  let score = 0

  for (const kw of topic.keywords) {
    const k = kw.toLowerCase()
    if (q.includes(k)) score += k.length >= 5 ? 4 : 2
    if (k.length >= 4 && q.split(/\s+/).some(w => w.includes(k) || k.includes(w))) score += 1
  }

  return score
}

// ── Full knowledge base ───────────────────────────────────────
const TOPICS: KnowledgeTopic[] = [
  {
    id: 'what-is-dsbd',
    keywords: [
      'what is dsbd', 'what is this', 'about dsbd', 'about app', 'about project',
      'platform', 'app', 'application', 'software', 'website',
      'ডিএসবিডি', 'কী', 'কি', 'কি জিনিস', 'সম্পর্কে', 'প্ল্যাটফর্ম', 'অ্যাপ',
      'daily budget', 'savings', 'ledger', 'financial', 'money manager',
      'বাজেট', 'সঞ্চয়', 'খাতা', 'টাকা',
    ],
    en: '🏦 What is DSBD? — Super simple answer:\n\nDSBD means **Digital Savings and Budget Dashboard**. Think of it as your **digital money notebook** on your phone or computer.\n\nWith DSBD you can:\n• Track how much money you earn and spend (Budget)\n• See your loans and payments (Loans)\n• Keep everything safe in one place\n\nIt is a **government-recognized** platform. Real people called **Area Agents** help you sign up and stay safe.',
    bn: '🏦 DSBD কী? — খুব সহজ ভাষায়:\n\nDSBD মানে **ডিজিটাল সঞ্চয় ও বাজেট ড্যাশবোর্ড**। এটা আপনার ফোন বা কম্পিউটারে থাকা একটি **ডিজিটাল টাকার খাতা**।\n\nDSBD দিয়ে আপনি:\n• কত টাকা আয় ও খরচ করছেন দেখতে পারবেন (বাজেট)\n• ঋণ ও কিস্তি দেখতে পারবেন (ঋণ)\n• সব কিছু এক জায়গায় নিরাপদে রাখতে পারবেন\n\nএটি **সরকার-স্বীকৃত** প্ল্যাটফর্ম। **এলাকা এজেন্ট** নামের লোকেরা আপনাকে নিবন্ধন ও নিরাপত্তায় সাহায্য করেন।',
  },
  {
    id: 'terms-overview',
    keywords: [
      'terms of service', 'terms', 'tos', 'rules', 'conditions', 'agreement', 'contract',
      'শর্তাবলী', 'পরিষেবার শর্ত', 'নিয়ম', 'চুক্তি',
    ],
    en: '📋 Terms of Service — explained like you are 5:\n\nThese are the **rules for using DSBD**. By using the app, you agree to follow them.\n\n**The 4 main rules:**\n1️⃣ **Welcome** — DSBD is for registered users only.\n2️⃣ **Your account = your job** — Keep your password secret. You are responsible for your account.\n3️⃣ **Money stuff** — All payments follow official DSBD rules. No hidden tricks.\n4️⃣ **Rules can change** — We may update terms and will tell you first.\n\nAsk me about any rule — I will explain it even more simply!',
    bn: '📋 পরিষেবার শর্তাবলী — ৫ বছরের বাচ্চাকে যেভাবে বোঝানো হয়:\n\nএগুলো DSBD ব্যবহারের **নিয়ম**। অ্যাপ ব্যবহার করলে আপনি এই নিয়ম মানতে সম্মত হন।\n\n**৪টি মূল নিয়ম:**\n1️⃣ **স্বাগতম** — DSBD শুধু নিবন্ধিত ব্যবহারকারীদের জন্য।\n2️⃣ **অ্যাকাউন্ট = আপনার দায়িত্ব** — পাসওয়ার্ড গোপন রাখুন। অ্যাকাউন্টের দায়িত্ব আপনার।\n3️⃣ **টাকার ব্যাপার** — সব লেনদেন সরকারি DSBD নিয়মে হয়। লুকানো চার্জ নেই।\n4️⃣ **নিয়ম বদলাতে পারে** — আমরা শর্ত আপডেট করতে পারি, আগে জানানো হবে।\n\nযেকোনো নিয়ম সম্পর্কে জিজ্ঞেস করুন — আরও সহজে বুঝিয়ে দেব!',
  },
  {
    id: 'tos-intro',
    keywords: [
      'introduction', 'welcome', 'getting started', 'who can use', 'eligibility',
      'ভূমিকা', 'স্বাগত', 'কে ব্যবহার', 'শুরু',
    ],
    en: '👋 Rule 1 — Introduction (super simple):\n\nDSBD welcomes **registered users**. You cannot use someone else\'s account.\n\nThink of it like a bank account — it is **only for you**. When you sign up, you agree to follow DSBD\'s rules. That is what the Terms of Service are for.',
    bn: '👋 নিয়ম ১ — ভূমিকা (খুব সহজ):\n\nDSBD **নিবন্ধিত ব্যবহারকারীদের** স্বাগতম জানায়। অন্য কারো অ্যাকাউন্ট ব্যবহার করা যাবে না।\n\nএটা ব্যাংক অ্যাকাউন্টের মতো — **শুধু আপনার জন্য**। নিবন্ধন করলে DSBD-এর নিয়ম মানতে সম্মত হন। এটাই পরিষেবার শর্তাবলী।',
  },
  {
    id: 'account-security',
    keywords: [
      'account', 'password', 'security', 'safe', 'hack', 'stolen', 'unauthorized', 'login',
      'responsibility', 'duty', 'protect', 'secret', 'share password',
      'অ্যাকাউন্ট', 'পাসওয়ার্ড', 'নিরাপত্তা', 'সুরক্ষা', 'দায়িত্ব', 'হ্যাক', 'চুরি', 'লগইন',
    ],
    en: '🔐 Account Security — plain and simple:\n\n**Your account = your responsibility.**\n\n✅ DO:\n• Keep your password **secret** (like a house key)\n• Use a strong password (6+ characters)\n• Tell your Area Agent if something looks wrong\n\n❌ DON\'T:\n• Share your password with friends or family\n• Let others use your account\n• Use easy passwords like "123456"\n\nIf someone gets into your account without permission, **contact your Area Agent right away**.',
    bn: '🔐 অ্যাকাউন্ট নিরাপত্তা — সহজ ভাষায়:\n\n**আপনার অ্যাকাউন্ট = আপনার দায়িত্ব।**\n\n✅ করুন:\n• পাসওয়ার্ড **গোপন** রাখুন (বাড়ির চাবির মতো)\n• শক্তিশালী পাসওয়ার্ড ব্যবহার করুন (৬+ অক্ষর)\n• কিছু ভুল লাগলে এলাকা এজেন্টকে বলুন\n\n❌ করবেন না:\n• পাসওয়ার্ড কাউকে দেবেন না\n• অন্য কেউ আপনার অ্যাকাউন্ট ব্যবহার করতে দেবেন না\n• "123456" এর মতো সহজ পাসওয়ার্ড ব্যবহার করবেন না\n\nঅনুমতি ছাড়া কেউ ঢুকলে **সঙ্গে সঙ্গে এলাকা এজেন্টকে জানান**।',
  },
  {
    id: 'transactions-fees',
    keywords: [
      'transaction', 'fee', 'fees', 'payment', 'charge', 'cost', 'money', 'pay', 'hidden',
      'লেনদেন', 'ফি', 'খরচ', 'পেমেন্ট', 'চার্জ', 'টাকা', 'লুকানো',
    ],
    en: '💰 Transactions & Fees — no confusing words:\n\n• Every money move on DSBD follows **official government rules**.\n• Your **Area Agent tells you about any fees BEFORE** anything happens.\n• **No hidden charges** — what you see is what you get.\n• You can see all past transactions in your **Dashboard**.\n\nSimple rule: **Nobody takes your money secretly on DSBD.**',
    bn: '💰 লেনদেন ও ফি — জটিল শব্দ ছাড়া:\n\n• DSBD-এ প্রতিটি টাকার লেনদেন **সরকারি নিয়ম** অনুসরণ করে।\n• লেনদেনের **আগে** আপনার **এলাকা এজেন্ট** সব ফি জানাবে।\n• **লুকানো চার্জ নেই** — যা দেখেন তাই পাবেন।\n• সব পুরনো লেনদেন **ড্যাশবোর্ডে** দেখতে পারবেন।\n\nসহজ নিয়ম: **DSBD-এ কেউ গোপনে আপনার টাকা নেয় না।**',
  },
  {
    id: 'terms-changes',
    keywords: [
      'change terms', 'update terms', 'modify', 'new rules', 'terms change', 'policy change',
      'শর্ত পরিবর্তন', 'নিয়ম বদল', 'আপডেট', 'নতুন নিয়ম',
    ],
    en: '🔄 When Rules Change — easy to understand:\n\n• DSBD **can update** the Terms of Service anytime.\n• We **tell you before** any big change.\n• If you keep using DSBD after a change, it means you **accept the new rules**.\n• Confused? Ask your **Area Agent** — they will explain in simple words.',
    bn: '🔄 নিয়ম বদলালে — সহজে বুঝুন:\n\n• DSBD **যেকোনো সময়** শর্তাবলী আপডেট করতে পারে।\n• বড় কোনো পরিবর্তনের **আগে** আপনাকে জানানো হবে।\n• পরিবর্তনের পরেও DSBD ব্যবহার করলে মানে আপনি **নতুন নিয়ম মেনে নিয়েছেন**।\n• বুঝতে পারছেন না? **এলাকা এজেন্টকে** জিজ্ঞেস করুন — সহজ ভাষায় বুঝিয়ে দেবেন।',
  },
  {
    id: 'privacy-overview',
    keywords: [
      'privacy policy', 'privacy', 'personal data', 'my information', 'my info',
      'গোপনীয়তা', 'গোপনীয়তা নীতি', 'ব্যক্তিগত তথ্য', 'আমার তথ্য',
    ],
    en: '🛡️ Privacy Policy — what it means for YOU:\n\nPrivacy = **we protect your personal information**.\n\n**4 simple promises:**\n1️⃣ We only collect info we **really need**.\n2️⃣ We use it **only to help you** (not for ads).\n3️⃣ We **lock it up safe** with strong security.\n4️⃣ We **never sell** your data to anyone.\n\nYour data belongs to **you**. We are just the safe keeper.',
    bn: '🛡️ গোপনীয়তা নীতি — আপনার জন্য কী মানে:\n\nগোপনীয়তা = **আমরা আপনার ব্যক্তিগত তথ্য রক্ষা করি**।\n\n**৪টি সহজ প্রতিশ্রুতি:**\n1️⃣ শুধু **প্রয়োজনীয়** তথ্য নিই।\n2️⃣ শুধু **আপনাকে সাহায্য** করতে ব্যবহার করি (বিজ্ঞাপনের জন্য নয়)।\n3️⃣ শক্তিশালী নিরাপত্তায় **তালাবদ্ধ** রাখি।\n4️⃣ কাউকে তথ্য **বিক্রি করি না**।\n\nআপনার তথ্য **আপনার**। আমরা শুধু নিরাপদ রক্ষক।',
  },
  {
    id: 'data-collection',
    keywords: [
      'collect', 'gather', 'what data', 'what info', 'what information', 'store', 'take my',
      'সংগ্রহ', 'কী তথ্য', 'কোন তথ্য', 'তথ্য নেয়', 'ডেটা',
    ],
    en: '📥 What info does DSBD collect? — simple list:\n\nWe only take what we **need to help you**:\n\n• **Name, email, phone** — to make your account\n• **Budget & loan details** — to show your money info\n• **Your area/location** — to find your nearest Area Agent\n\nWe do **NOT** collect random stuff we do not need. Less data = more safe for you.',
    bn: '📥 DSBD কী তথ্য নেয়? — সহজ তালিকা:\n\nশুধু **আপনাকে সাহায্য** করতে যা লাগে তাই নিই:\n\n• **নাম, ইমেইল, ফোন** — অ্যাকাউন্ট তৈরি করতে\n• **বাজেট ও ঋণের তথ্য** — টাকার হিসাব দেখাতে\n• **আপনার এলাকা** — কাছের এলাকা এজেন্ট খুঁজে দিতে\n\nঅপ্রয়োজনীয় কিছু **নিই না**। কম তথ্য = আপনার জন্য বেশি নিরাপদ।',
  },
  {
    id: 'data-use',
    keywords: [
      'use data', 'use info', 'why collect', 'why need', 'purpose', 'what for', 'advertis',
      'ব্যবহার', 'কেন তথ্য', 'কেন নেয়', 'উদ্দেশ্য', 'বিজ্ঞাপন',
    ],
    en: '🔍 Why do we use your info? — honest answer:\n\nWe use your data **only for these reasons**:\n\n• To run your account (login, settings)\n• To show your budgets and loans\n• To connect you with your Area Agent\n• To make DSBD better (without showing your name to anyone)\n\n**We NEVER use your data for advertising.** Your info is not for sale.',
    bn: '🔍 আপনার তথ্য কেন ব্যবহার করি? — সত্যি উত্তর:\n\nআপনার তথ্য **শুধু এই কারণে** ব্যবহার করি:\n\n• অ্যাকাউন্ট চালাতে (লগইন, সেটিংস)\n• বাজেট ও ঋণ দেখাতে\n• এলাকা এজেন্টের সাথে যুক্ত করতে\n• DSBD ভালো করতে (আপনার নাম কাউকে দেখাই না)\n\n**বিজ্ঞাপনের জন্য তথ্য ব্যবহার করি না।** আপনার তথ্য বিক্রির জন্য নয়।',
  },
  {
    id: 'data-security',
    keywords: [
      'data safe', 'data security', 'encrypt', 'protect data', 'secure', 'breach', 'leak',
      'ডেটা নিরাপদ', 'তথ্য সুরক্ষা', 'এনক্রিপ্ট', 'ফাঁস', 'লিক',
    ],
    en: '🔒 Is your data safe? **YES!** — here is how:\n\n• Your info is **encrypted** (locked with a secret code — like a safe)\n• Only **approved staff** can see your data\n• We **test security regularly** to find problems early\n• If anything suspicious happens, **we tell you immediately**\n\nThink of it like a locked bank vault for your information.',
    bn: '🔒 আপনার তথ্য কি নিরাপদ? **হ্যাঁ!** — কীভাবে:\n\n• আপনার তথ্য **এনক্রিপ্টেড** (গোপন কোডে তালাবদ্ধ — সেফের মতো)\n• শুধু **অনুমোদিত কর্মীরা** তথ্য দেখতে পারেন\n• নিয়মিত **নিরাপত্তা পরীক্ষা** করি\n• সন্দেহজনক কিছু হলে **সঙ্গে সঙ্গে জানাবো**\n\nএটা আপনার তথ্যের জন্য তালাবদ্ধ ব্যাংক ভল্টের মতো।',
  },
  {
    id: 'third-party',
    keywords: [
      'third party', 'sell data', 'share data', 'give data', 'who sees', 'company', 'facebook', 'google',
      'তৃতীয় পক্ষ', 'বিক্রি', 'শেয়ার', 'কে দেখে', 'কোম্পানি',
    ],
    en: '🚫 Do we sell your data? **ABSOLUTELY NOT!**\n\n• We **never** give your info to companies without your permission\n• **Nobody can buy** your personal data from us\n• The **only exception**: if the **government legally requires** it (like a court order)\n• **You stay in control** of your own information\n\nYour data is **yours**, not a product we sell.',
    bn: '🚫 আমরা কি তথ্য বিক্রি করি? **একদম না!**\n\n• আপনার অনুমতি ছাড়া কোম্পানিকে তথ্য **দিই না**\n• কেউ আমাদের কাছ থেকে আপনার তথ্য **কিনতে পারে না**\n• **একমাত্র ব্যতিক্রম**: **সরকার আইন অনুযায়ী** চাইলে (আদালতের আদেশের মতো)\n• তথ্যের **নিয়ন্ত্রণ আপনার** হাতে\n\nআপনার তথ্য **আপনার**, বিক্রির পণ্য নয়।',
  },
  {
    id: 'user-rights',
    keywords: [
      'my rights', 'right to', 'delete data', 'remove data', 'access data', 'close account', 'erase',
      'অধিকার', 'মুছে ফেল', 'ডেটা মুছ', 'অ্যাকাউন্ট বন্ধ', 'তথ্য দেখ',
    ],
    en: '⚖️ Your Rights — you have power over your data:\n\n• **See** your own data anytime — just ask\n• **Fix** wrong information\n• **Close** your account if you want to stop\n• **Delete** your data (through your Area Agent)\n\nTo do any of these, talk to your **Area Agent**. They will help you step by step.',
    bn: '⚖️ আপনার অধিকার — তথ্যের উপর আপনার ক্ষমতা আছে:\n\n• যেকোনো সময় **নিজের তথ্য দেখুন** — জিজ্ঞেস করলেই হবে\n• ভুল তথ্য **ঠিক করুন**\n• চাইলে অ্যাকাউন্ট **বন্ধ করুন**\n• তথ্য **মুছে ফেলুন** (এলাকা এজেন্টের মাধ্যমে)\n\nএগুলো করতে **এলাকা এজেন্টের** সাথে কথা বলুন। ধাপে ধাপে সাহায্য করবেন।',
  },
  {
    id: 'cookies',
    keywords: [
      'cookie', 'cookies', 'track', 'tracking', 'browser', 'spy',
      'কুকি', 'ট্র্যাক', 'নজরদারি',
    ],
    en: '🍪 Cookies — what are they? (super simple):\n\nCookies are tiny files that help DSBD **remember you are logged in**.\n\n• We only use **essential cookies** (needed for the app to work)\n• We do **NOT** track you for ads\n• We do **NOT** spy on what you do on other websites\n\nThat is it. Nothing scary.',
    bn: '🍪 কুকি কী? (খুব সহজ):\n\nকুকি হলো ছোট ফাইল যা DSBD-কে **মনে রাখতে** সাহায্য করে আপনি লগইন করেছেন।\n\n• শুধু **প্রয়োজনীয় কুকি** ব্যবহার করি (অ্যাপ চালাতে লাগে)\n• বিজ্ঞাপনের জন্য **ট্র্যাক করি না**\n• অন্য ওয়েবসাইটে কী করেন **দেখি না**\n\nএটুকুই। ভয়ের কিছু নেই।',
  },
  {
    id: 'budget',
    keywords: [
      'budget', 'income', 'expense', 'spending', 'save', 'daily', 'weekly', 'monthly',
      'বাজেট', 'আয়', 'খরচ', 'সঞ্চয়', 'দৈনিক', 'সাপ্তাহিক', 'মাসিক',
    ],
    en: '💼 Budget Feature — how to use it:\n\n1. **Sign in** to your account\n2. Go to the **Budget** section in your Dashboard\n3. See your **daily, weekly, and monthly** money plans\n4. Add income and expenses to track spending\n\n**Privacy note:** Your budget data is **private** — only you and authorized staff can see it. We never share it with advertisers.',
    bn: '💼 বাজেট ফিচার — কীভাবে ব্যবহার করবেন:\n\n1. অ্যাকাউন্টে **সাইন ইন** করুন\n2. ড্যাশবোর্ডে **বাজেট** বিভাগে যান\n3. **দৈনিক, সাপ্তাহিক, মাসিক** টাকার পরিকল্পনা দেখুন\n4. আয় ও খরচ যোগ করে হিসাব রাখুন\n\n**গোপনীয়তা নোট:** বাজেট তথ্য **ব্যক্তিগত** — শুধু আপনি ও অনুমোদিত কর্মী দেখতে পারেন। বিজ্ঞাপনদাতাদের দিই না।',
  },
  {
    id: 'loans',
    keywords: [
      'loan', 'loans', 'borrow', 'installment', 'emi', 'debt', 'owe', 'repay', 'interest',
      'ঋণ', 'কিস্তি', 'ধার', 'সুদ', 'বকেয়া', 'পরিশোধ',
    ],
    en: '🏦 Loans Feature — simple guide:\n\n1. **Sign in** to DSBD\n2. Open the **Loans** section in your Dashboard\n3. See loan amount, **installments**, and what you still owe\n\n**Privacy note:** Loan details are **confidential**. We protect them under our Privacy Policy. Only you, your Agent, and authorized staff can access them.',
    bn: '🏦 ঋণ ফিচার — সহজ গাইড:\n\n1. DSBD-তে **সাইন ইন** করুন\n2. ড্যাশবোর্ডে **ঋণ** বিভাগ খুলুন\n3. ঋণের পরিমাণ, **কিস্তি**, ও বকেয়া দেখুন\n\n**গোপনীয়তা নোট:** ঋণের তথ্য **গোপন**। গোপনীয়তা নীতি অনুযায়ী রক্ষা করি। শুধু আপনি, এজেন্ট, ও অনুমোদিত কর্মী দেখতে পারেন।',
  },
  {
    id: 'register',
    keywords: [
      'register', 'sign up', 'signup', 'create account', 'new account', 'join',
      'নিবন্ধন', 'অ্যাকাউন্ট তৈরি', 'যোগ দিন', 'নতুন',
    ],
    en: '📝 How to Create an Account:\n\nYou **cannot** sign up alone online. Here is why — **to keep you safe**:\n\n1. Contact your **Area Agent**\n2. They **verify your identity** (make sure you are really you)\n3. They create your account for you\n\nThis protects your data and follows our **Terms of Service** and **Privacy Policy**.',
    bn: '📝 অ্যাকাউন্ট কীভাবে তৈরি করবেন:\n\nঅনলাইনে একা নিবন্ধন করা **যায় না**। কারণ — **আপনার নিরাপত্তার জন্য**:\n\n1. আপনার **এলাকা এজেন্টের** সাথে যোগাযোগ করুন\n2. তারা **পরিচয় যাচাই** করবেন (আপনি সত্যিই আপনি কিনা)\n3. তারা আপনার অ্যাকাউন্ট তৈরি করবেন\n\nএতে আপনার তথ্য সুরক্ষিত থাকে এবং **শর্তাবলী** ও **গোপনীয়তা নীতি** মেনে চলা হয়।',
  },
  {
    id: 'password-reset',
    keywords: [
      'forgot password', 'reset password', 'lost password', 'change password', 'password help',
      'পাসওয়ার্ড ভুলে', 'পাসওয়ার্ড রিসেট', 'পাসওয়ার্ড বদল', 'পাসওয়ার্ড সাহায্য',
    ],
    en: '🔑 Forgot Your Password? — do this:\n\n1. Click **"Forgot password?"** on the login page\n2. Contact your **Area Agent**\n3. They verify who you are and reset it **safely**\n\nWe do this to protect your account — it is part of our **security rules** in the Terms of Service.',
    bn: '🔑 পাসওয়ার্ড ভুলে গেছেন? — এটা করুন:\n\n1. লগইন পেজে **"পাসওয়ার্ড ভুলে গেছেন?"** ক্লিক করুন\n2. আপনার **এলাকা এজেন্টের** সাথে যোগাযোগ করুন\n3. তারা পরিচয় যাচাই করে **নিরাপদে** রিসেট করবেন\n\nএটা আপনার অ্যাকাউন্ট রক্ষা করতে — **শর্তাবলীর** নিরাপত্তা নিয়মের অংশ।',
  },
  {
    id: 'area-agent',
    keywords: [
      'agent', 'area agent', 'find agent', 'contact', 'help', 'support', 'helpline', 'near me', 'location', 'gps',
      'এজেন্ট', 'এলাকা এজেন্ট', 'সাহায্য', 'যোগাযোগ', 'হেল্পলাইন', 'কাছে',
    ],
    en: '👤 Area Agents — who are they?\n\nArea Agents are **real DSBD staff** who help people in your area.\n\nThey can:\n• Register new accounts\n• Reset passwords\n• Explain fees and rules\n• Help with problems\n\n**To find yours:** Click "Forgot password?" → "Find your Area Agent" → Allow GPS. The app shows agents near you (Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barisal, and more).',
    bn: '👤 এলাকা এজেন্ট — তারা কে?\n\nএলাকা এজেন্ট হলেন **আসল DSBD কর্মী** যারা আপনার এলাকায় মানুষকে সাহায্য করেন।\n\nতারা পারেন:\n• নতুন অ্যাকাউন্ট খুলতে\n• পাসওয়ার্ড রিসেট করতে\n• ফি ও নিয়ম বুঝিয়ে দিতে\n• সমস্যায় সাহায্য করতে\n\n**খুঁজে পেতে:** "পাসওয়ার্ড ভুলে গেছেন?" → "এলাকা এজেন্ট খুঁজুন" → GPS চালু করুন। কাছের এজেন্ট দেখাবে (ঢাকা, চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা, বরিশাল ইত্যাদি)।',
  },
  {
    id: 'sign-in',
    keywords: [
      'sign in', 'signin', 'login', 'log in', 'how to access', 'dashboard access',
      'সাইন ইন', 'লগইন', 'প্রবেশ', 'ঢোকা',
    ],
    en: '🔓 How to Sign In:\n\n1. Enter your **email** and **password**\n2. Click **Sign In**\n3. You go to your **Dashboard**\n\nBy signing in, you agree to our **Terms of Service**. Your login info is protected by our **Privacy Policy**.',
    bn: '🔓 কীভাবে সাইন ইন করবেন:\n\n1. **ইমেইল** ও **পাসওয়ার্ড** দিন\n2. **সাইন ইন** ক্লিক করুন\n3. **ড্যাশবোর্ডে** যাবেন\n\nসাইন ইন করলে **পরিষেবার শর্তাবলী** মেনে নেন। লগইন তথ্য **গোপনীয়তা নীতি** দিয়ে সুরক্ষিত।',
  },
  {
    id: 'dashboard',
    keywords: [
      'dashboard', 'overview', 'home page', 'main page', 'summary',
      'ড্যাশবোর্ড', 'সারাংশ', 'মূল পেজ',
    ],
    en: '📊 Your Dashboard — what is inside:\n\nAfter login, you see a **summary** of everything:\n• **Budget** — income and spending\n• **Loans** — what you owe and paid\n• Quick overview of your finances\n\nAll dashboard data is **private and encrypted** per our Privacy Policy.',
    bn: '📊 আপনার ড্যাশবোর্ড — ভিতরে কী আছে:\n\nলগইনের পর **সারাংশ** দেখবেন:\n• **বাজেট** — আয় ও খরচ\n• **ঋণ** — বকেয়া ও পরিশোধ\n• আর্থিক অবস্থার দ্রুত চিত্র\n\nসব ড্যাশবোর্ড তথ্য **গোপন ও এনক্রিপ্টেড** — গোপনীয়তা নীতি অনুযায়ী।',
  },
  {
    id: 'language',
    keywords: [
      'language', 'bengali', 'bangla', 'english', 'translate', 'ভাষা', 'বাংলা', 'ইংরেজি',
    ],
    en: '🌐 Language Support:\n\nDSBD works in **English** and **বাংলা (Bangla)**!\n\n• Click the **⚙️ Settings** button (bottom-right)\n• Choose **Language** to switch\n• This chatbot understands **both languages** — type in English or Bangla anytime!',
    bn: '🌐 ভাষা সহায়তা:\n\nDSBD **ইংরেজি** ও **বাংলা** — দুটোতেই কাজ করে!\n\n• **⚙️ সেটিংস** বোতাম (নিচে ডানে) ক্লিক করুন\n• **ভাষা** বেছে নিন\n• এই চ্যাটবট **দুই ভাষাই** বোঝে — ইংরেজি বা বাংলায় যেকোনো সময় লিখুন!',
  },
  {
    id: 'government',
    keywords: [
      'government', 'official', 'legal', 'law', 'authorized', 'gov', 'recognized',
      'সরকার', 'সরকারি', 'আইনি', 'আইন', 'স্বীকৃত',
    ],
    en: '🏛️ Is DSBD official? **Yes!**\n\nDSBD is a **government-recognized** digital platform. Area Agents work under official DSBD rules.\n\nAll transactions follow **government policies**. Your data may only be shared with authorities if **required by law** — explained in our Privacy Policy.',
    bn: '🏛️ DSBD কি সরকারি? **হ্যাঁ!**\n\nDSBD একটি **সরকার-স্বীকৃত** ডিজিটাল প্ল্যাটফর্ম। এলাকা এজেন্টরা সরকারি DSBD নিয়মে কাজ করেন।\n\nসব লেনদেন **সরকারি নীতি** অনুসরণ করে। আপনার তথ্য শুধু **আইন অনুযায়ী** কর্তৃপক্ষের সাথে শেয়ার হতে পারে — গোপনীয়তা নীতিতে ব্যাখ্যা করা আছে।',
  },
]

const GREETING_PATTERNS = /^(hi|hello|hey|yo|sup|good\s*(morning|afternoon|evening|night)|howdy|hola|namaste|salam|assalam|as-salam|হ্যালো|হাই|নমস্কার|আসসালাম|সালাম|কেমন|কি খবর|কেমন আছ)/i
const THANKS_PATTERNS = /thank|thanks|thx|ty|ধন্যবাদ|থ্যাংকস|শুকরিয়া|জাজাকাল্লাহ/i
const BYE_PATTERNS = /bye|goodbye|see you|later|exit|quit|বিদায়|আলবিদা|চলি|যাচ্ছি/i

const QUICK_OPTIONS = {
  en: ['What are the Terms of Service?', 'Explain Privacy Policy', 'Is my data safe?', 'What is DSBD?'],
  bn: ['পরিষেবার শর্তাবলী কী?', 'গোপনীয়তা নীতি বলুন', 'আমার তথ্য নিরাপদ?', 'DSBD কী?'],
}

function universalFallback(bn: boolean): string {
  return bn
    ? '💡 আপনার প্রশ্নের উত্তর — সহজ ভাষায়:\n\nDSBD ব্যবহার করলে দুটি গুরুত্বপূর্ণ জিনিস মানতে হয়:\n\n📋 **পরিষেবার শর্তাবলী (নিয়ম):**\n• অ্যাকাউন্টের নিরাপত্তা আপনার দায়িত্ব\n• সব লেনদেন সরকারি নিয়মে হয়, লুকানো চার্জ নেই\n• নিয়ম বদলালে আগে জানানো হবে\n\n🛡️ **গোপনীয়তা নীতি (তথ্য সুরক্ষা):**\n• শুধু প্রয়োজনীয় তথ্য নিই\n• তথ্য বিজ্ঞাপনের জন্য ব্যবহার করি না\n• তথ্য বিক্রি করি না — এনক্রিপশনে সুরক্ষিত\n\nনির্দিষ্ট বিষয়ে জিজ্ঞেস করুন — যেমন "পাসওয়ার্ড", "ঋণ", "এজেন্ট", "ডেটা"!'
    : '💡 Here is your answer — in the simplest words:\n\nWhen you use DSBD, two important things apply:\n\n📋 **Terms of Service (the rules):**\n• You must keep your account safe\n• All money moves follow official rules — no hidden fees\n• We tell you before any rule changes\n\n🛡️ **Privacy Policy (data protection):**\n• We only collect info we need\n• We never use your data for ads\n• We never sell your data — it is encrypted and safe\n\nAsk about anything specific — like "password", "loans", "agent", or "data"!'
}

function greetingReply(bn: boolean): ChatbotReply {
  return {
    text: bn
      ? 'হ্যালো! 👋 আমি DSBD AI সহকারী।\n\nআমি **পরিষেবার শর্তাবলী**, **গোপনীয়তা নীতি**, এবং DSBD সম্পর্কে **সব কিছু** সহজ ভাষায় বুঝিয়ে দিতে পারি।\n\nইংরেজি বা বাংলায় যেকোনো প্রশ্ন করুন!'
      : 'Hello! 👋 I am the DSBD AI Assistant.\n\nI can explain our **Terms of Service**, **Privacy Policy**, and **everything about DSBD** in very simple words.\n\nAsk me anything — in English or Bangla!',
    options: bn ? QUICK_OPTIONS.bn : QUICK_OPTIONS.en,
  }
}

function thanksReply(bn: boolean): ChatbotReply {
  return {
    text: bn
      ? '😊 আপনাকে স্বাগতম! আরও কোনো প্রশ্ন থাকলে জিজ্ঞেস করুন — শর্তাবলী, গোপনীয়তা, বা DSBD সম্পর্কে যেকোনো কিছু।'
      : '😊 You are welcome! Ask me anything else — about terms, privacy, or DSBD.',
    options: bn ? QUICK_OPTIONS.bn.slice(0, 2) : QUICK_OPTIONS.en.slice(0, 2),
  }
}

function byeReply(bn: boolean): ChatbotReply {
  return {
    text: bn
      ? 'বিদায়! 👋 মনে রাখবেন — DSBD-এ আপনার তথ্য নিরাপদ এবং নিয়ম সব সময় স্বচ্ছ। আবার জিজ্ঞেস করতে পারেন!'
      : 'Goodbye! 👋 Remember — on DSBD your data is safe and the rules are always clear. Come back anytime!',
  }
}

// ── Main reply engine ─────────────────────────────────────────
export function getChatbotReply(text: string, uiBengali: boolean): ChatbotReply {
  const trimmed = text.trim()
  if (!trimmed) {
    const bn = uiBengali
    return { text: universalFallback(bn), options: bn ? QUICK_OPTIONS.bn : QUICK_OPTIONS.en }
  }

  const bn = detectReplyLanguage(trimmed, uiBengali)
  const q = trimmed.toLowerCase()

  if (GREETING_PATTERNS.test(q)) return greetingReply(bn)
  if (THANKS_PATTERNS.test(q)) return thanksReply(bn)
  if (BYE_PATTERNS.test(q)) return byeReply(bn)

  let bestTopic: KnowledgeTopic | null = null
  let bestScore = 0

  for (const topic of TOPICS) {
    const score = scoreTopic(q, topic)
    if (score > bestScore) {
      bestScore = score
      bestTopic = topic
    }
  }

  if (bestTopic && bestScore >= 2) {
    return {
      text: bn ? bestTopic.bn : bestTopic.en,
      options: bn ? QUICK_OPTIONS.bn : QUICK_OPTIONS.en,
    }
  }

  // Weak or no match — still answer with ToS + Privacy overview (never say "I don't understand")
  if (bestTopic && bestScore >= 1) {
    const intro = bn
      ? 'আপনার প্রশ্নের সাথে সম্পর্কিত তথ্য:\n\n'
      : 'Here is info related to your question:\n\n'
    return {
      text: intro + (bn ? bestTopic.bn : bestTopic.en),
      options: bn ? QUICK_OPTIONS.bn : QUICK_OPTIONS.en,
    }
  }

  return {
    text: universalFallback(bn),
    options: bn ? QUICK_OPTIONS.bn : QUICK_OPTIONS.en,
  }
}

export function getChatbotWelcome(uiBengali: boolean): ChatbotReply {
  return greetingReply(uiBengali)
}
