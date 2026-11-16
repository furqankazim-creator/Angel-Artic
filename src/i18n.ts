/**
 * Arabic interface. Keys are the exact English UI strings; anything not listed stays in English.
 * Translations are a first draft and need review by a native Arabic speaker before launch.
 * Practice words and sound lists are English; Arabic speech-sound content is not included.
 */
import { ES } from './locales/es.ts';
import { UR } from './locales/ur.ts';

export type Lang = 'en' | 'ar' | 'es' | 'ur';
export const RTL_LANGS: Lang[] = ['ar', 'ur'];
export const isRtl = (l?: Lang) => !!l && RTL_LANGS.includes(l);

export const AR: Record<string, string> = {
  // tabs & nav
  Sounds: 'الأصوات', Practice: 'تمرين', Play: 'لعب', Talk: 'تحدّث', Parents: 'الأهل', Profile: 'الملف',
  '‹ All sounds': '‹ كل الأصوات', Start: 'البداية', Middle: 'الوسط', End: 'النهاية', '▶': '▶',
  // home
  "Hi {name}! Pick a sound and let's practise!": 'مرحبًا {name}! اختر صوتًا ولنتدرّب!',
  'Compare recordings': 'مقارنة التسجيلات', 'Listen to the first and the latest try of the same word, side by side.': 'استمع إلى أول محاولة وآخر محاولة لنفس الكلمة جنبًا إلى جنب.', 'First try': 'المحاولة الأولى', 'Latest try': 'آخر محاولة', '▶ Play': '▶ تشغيل',
  'Not enough recordings yet': 'لا توجد تسجيلات كافية بعد', 'Practise a word at least twice and it will appear here.': 'تمرّن على الكلمة مرتين على الأقل وستظهر هنا.',
  Early: 'مبكّرة', Intermediate: 'متوسطة', Late: 'متأخرة',
  '📅 Daily': '📅 يومي', '🎮 Play & Rewards': '🎮 لعب ومكافآت',
  'Free plan: /p/, /s/ and /r/. Ask a grown-up about Pro for all 17 sounds.': 'الخطة المجانية: ‎/p/‎ و ‎/s/‎ و ‎/r/‎. اسأل أحد البالغين عن الخطة المدفوعة لفتح الأصوات الـ 17.',
  // practice
  '🎤 Say the word': '🎤 قل الكلمة', '💬 Say the sentence': '💬 قل الجملة', '🔊 Listen': '🔊 استمع', '👀 Watch mouth': '👀 شاهد الفم',
  '🎤 My Turn — Say it!': '🎤 دوري — قلها!', '🐢 Hear it slowly': '🐢 أسمعها ببطء', '← Prev word': '← الكلمة السابقة', 'Next word →': 'الكلمة التالية →',
  '🧩 Quiz': '🧩 اختبار', '👄 Watch Mouth': '👄 شاهد الفم', '📅 Daily Challenge': '📅 تحدّي اليوم', '🔊 Hear the word': '🔊 اسمع الكلمة',
  '👄 Watch the mouth': '👄 شاهد حركة الفم',
  'Free plan: 10 scored tries a day. No-sound tries never use these up.': 'الخطة المجانية: ١٠ محاولات محسوبة يوميًا. المحاولات بلا صوت لا تُحسب.',
  'Lips together': 'الشفتان معًا', 'Tongue tip on the ridge': 'طرف اللسان على الحافة', 'Tongue tip taps the bumpy ridge': 'طرف اللسان يطرق الحافة الخشنة',
  'Back of tongue touches the soft roof': 'مؤخرة اللسان تلمس سقف الفم الليّن', 'Top teeth on bottom lip': 'الأسنان العليا على الشفة السفلى',
  'Tiny gap: air hisses through': 'فتحة صغيرة: يمرّ الهواء بصفير', 'Tiny gap: air buzzes through': 'فتحة صغيرة: يمرّ الهواء بطنين',
  'Tongue bunches up, touches nothing': 'اللسان يتجمّع ولا يلمس شيئًا', 'Lips pushed out, air hushes through': 'الشفتان للأمام والهواء يمرّ بهمس',
  'Tongue taps, then slides to shhh': 'اللسان يطرق ثم ينزلق إلى شـشش', 'Tongue tip peeks between teeth': 'طرف اللسان بين الأسنان',
  // record & feedback
  'Your turn': 'دورك', 'Tap the mic and say it!': 'اضغط الميكروفون وقلها!', Listening: 'أستمع', 'Hearing you': 'أسمعك', 'Too quiet': 'الصوت خافت',
  'Back to word': 'العودة إلى الكلمة', 'No score for this one. It does not count against you.': 'لا درجة لهذه المحاولة. لن تُحسب عليك.',
  'Brilliant! 🎉': 'رائع! 🎉', 'Nice try!': 'محاولة جميلة!', '🔁 Try again': '🔁 حاول مرة أخرى', 'Done ✓': 'تم ✓',
  'Amazing! You said it so well!': 'مذهل! قلتها بشكل رائع!', 'So close! Great trying!': 'قريب جدًا! محاولة ممتازة!', "Good try! Let's listen first, then try together.": 'محاولة جيدة! لنستمع أولًا ثم نجرّب معًا.',
  'GROWN-UP SCORING (labelled parent-scored)': 'تقييم الأهل (يُسجَّل كتقييم الأهل)', Correct: 'صحيح', Almost: 'تقريبًا', 'Try Again': 'حاول مجددًا',
  // mic check
  'Mic Check': 'فحص الميكروفون', '🎙️ Mic Check': '🎙️ فحص الميكروفون', "🎙️ Let's test the microphone": '🎙️ لنجرّب الميكروفون',
  'Press the button and say "hello" out loud. A grown-up can watch the meter. It must turn green.': 'اضغط الزر وقل «مرحبًا» بصوت عالٍ. يمكن للأهل مراقبة المؤشر. يجب أن يصبح أخضر.',
  '✅ I can hear you!': '✅ أسمعك!', 'The microphone works. Silence will never get a score.': 'الميكروفون يعمل. الصمت لا يحصل على درجة أبدًا.',
  'The microphone is switched off. A grown-up can allow it in Settings.': 'الميكروفون مغلق. يمكن للأهل السماح به من الإعدادات.',
  '▶ Run Mic Check': '▶ ابدأ فحص الميكروفون', 'Not tested yet': 'لم يُفحص بعد',
  // onboarding
  'Welcome to Angel Artic!': 'أهلًا بك في أنجل آرتيك! 👶', "Set up your child's profile in under a minute. A grown-up should do this part.": 'أنشئ ملف طفلك في أقل من دقيقة. هذه الخطوة للأهل.',
  "Child's first name": 'اسم الطفل الأول', Age: 'العمر', '3–4 years': '٣–٤ سنوات', '5–6 years': '٥–٦ سنوات', '7–8 years': '٧–٨ سنوات',
  'Sounds to work on (tap any)': 'الأصوات المراد التدرّب عليها (اضغط أي صوت — قد يقترحها أخصائي النطق)',
  'Daily practice goal': 'هدف التمرين اليومي', '5 words': '٥ كلمات', '10 words': '١٠ كلمات', '15 words': '١٥ كلمة',
  'Parent PIN (4 numbers) — locks the Parent Hub, plans & settings': 'الرمز السري للأهل (٤ أرقام) — يقفل منطقة الأهل والخطط والإعدادات',
  'Recovery word (optional) — unlocks grown-up areas if you forget the PIN': 'كلمة الاسترداد (اختيارية) — تفتح منطقة الأهل إذا نسيت الرمز',
  'Start practising →': 'ابدأ التمرين ←',
  '🔒 Safe by design: no ads in child mode, no chat, no social features, and recordings never leave this device. Child mode only shows practice, play and the AAC board — settings and reports sit behind your parent PIN.': '🔒 آمن بالتصميم: لا إعلانات في وضع الطفل، ولا محادثات، ولا ميزات اجتماعية، والتسجيلات لا تغادر هذا الجهاز. وضع الطفل يعرض التمرين واللعب ولوحة التواصل فقط — والخطط والإعدادات والتقارير خلف رمز الأهل.',
  // pin
  'Grown-ups only 🔒': 'للكبار فقط 🔒', 'Enter your parent PIN to open progress, plans and settings. Child mode never shows this area.': 'أدخل الرمز السري للأهل لفتح التقدّم والخطط والإعدادات. وضع الطفل لا يعرض هذه المنطقة أبدًا.',
  'That PIN is not right. Try again.': 'الرمز غير صحيح. حاول مجددًا.', 'Forgot your PIN?': 'نسيت الرمز؟', 'Type the recovery word you set in Settings.': 'اكتب كلمة الاسترداد التي حددتها في الإعدادات.',
  Unlock: 'فتح', 'That is not the recovery word.': 'هذه ليست كلمة الاسترداد.',
  'No recovery word was set. Deleting and reinstalling the app resets the PIN but erases all progress.': 'لم تُحدَّد كلمة استرداد. حذف التطبيق وإعادة تثبيته يعيد الرمز لكن يمحو كل التقدّم.',
  // parent hub
  'Parent Hub': 'منطقة الأهل', 'Accuracy, last 14 days': 'الدقة خلال آخر ١٤ يومًا', 'Mastery per sound': 'الإتقان لكل صوت', 'Attempt log': 'سجل المحاولات',
  'No tries yet.': 'لا محاولات بعد.', Tools: 'الأدوات', '📚 Custom Words (Pro)': '📚 كلمات مخصصة (Pro)', '📈 Weekly Report (Pro)': '📈 التقرير الأسبوعي (Pro)',
  '⭐ Free vs Pro': '⭐ المجاني مقابل Pro', '⚙️ Settings': '⚙️ الإعدادات', 'Privacy & Terms': 'الخصوصية والشروط', '🎧 Compare recordings': '🎧 مقارنة التسجيلات',
  // talk
  'Communication 💬': 'التواصل 💬', 'Meet Angel Talk ›': 'تعرّف على أنجل توك ›', 'A voice for every child.': 'صوت لكل طفل.',
  'Tap pictures to speak! For children who need a voice right now: English & Arabic voices, 14,000+ symbols, and calm communication tools.': 'اضغط على الصور للتحدث! للأطفال الذين يحتاجون وسيلة تواصل فورية: أصوات بالعربية والإنجليزية وأكثر من ١٤ ألف رمز.',
  '💬 Tap to learn more': '💬 اضغط لمعرفة المزيد',
  'Angel Talk 💬': 'تحدّث مع أنجل 💬', 'Your sentence…': 'جملتك…', '🔊 Speak it': '🔊 انطقها', Clear: 'مسح',
  'Tap pictures to build a sentence, then tap Speak.': 'اضغط على الصور لبناء جملة ثم اضغط انطقها.',
  'Free plan includes the first 12 words. 🔒 words unlock with Pro (Parent Hub → Free vs Pro).': 'الخطة المجانية تشمل أول ١٢ كلمة. الكلمات 🔒 تُفتح مع Pro (منطقة الأهل ← المجاني مقابل Pro).',
  // rewards
  'Play & Rewards': 'لعب ومكافآت', 'Adventure map 🗺️': 'خريطة المغامرة 🗺️', 'Master words to open new worlds. Tap a world to start its quest.': 'أتقن الكلمات لفتح عوالم جديدة. اضغط على عالم لبدء مهمته.',
  '🎯 Daily Mission': '🎯 مهمة اليوم', 'Say these 3 words today.': 'قل هذه الكلمات الثلاث اليوم.', 'Say it': 'قلها', Stickers: 'الملصقات', 'Dress-up': 'الملابس', 'XP is never spent or lost.': 'نقاط الخبرة لا تُصرف ولا تضيع أبدًا.',
  'Your quest': 'مهمتك', '+20 XP bonus earned. New worlds open as you master more words.': 'حصلت على +٢٠ نقطة خبرة. تُفتح عوالم جديدة كلما أتقنت كلمات أكثر.',
  'Daily Challenge': 'تحدّي اليوم', '5 words, 5 sounds ⭐': '٥ كلمات، ٥ أصوات ⭐', 'Finish all five for 25 bonus XP.': 'أكمل الخمس لتحصل على ٢٥ نقطة خبرة إضافية.', '🎉 Challenge complete! +25 XP': '🎉 اكتمل التحدّي! +٢٥ نقطة',
  // profile
  Children: 'الأطفال', 'Add child': 'إضافة طفل', '+ Add a child': '+ إضافة طفل', '+ Add a child (Pro)': '+ إضافة طفل (Pro)', 'Free plan: 1 child profile. Pro: unlimited.': 'الخطة المجانية: ملف طفل واحد. Pro: بلا حدود.',
  // settings
  Settings: 'الإعدادات', Accessibility: 'إمكانية الوصول', 'Bigger text': 'نص أكبر', 'Calm mode (no animations)': 'الوضع الهادئ (بدون حركة)', 'High contrast': 'تباين عالٍ', 'Slower speech': 'كلام أبطأ',
  'Change PIN': 'تغيير الرمز', 'Save PIN': 'حفظ الرمز', 'PIN recovery word': 'كلمة استرداد الرمز', 'Save recovery word': 'حفظ كلمة الاسترداد',
  'If you forget the PIN, this word unlocks grown-up areas. Pick something a child would not guess.': 'إذا نسيت الرمز، فهذه الكلمة تفتح منطقة الأهل. اختر شيئًا لا يخمّنه الطفل.',
  'Real pronunciation scoring (Azure)': 'تقييم النطق الحقيقي (Azure)', 'Save Azure settings': 'حفظ إعدادات Azure',
  'Run Mic Check again': 'إعادة فحص الميكروفون', "Delete this child's data": 'حذف بيانات هذا الطفل', 'Developer: Pro preview': 'للمطوّر: معاينة Pro', 'Preview Pro features': 'معاينة ميزات Pro',
  Language: 'اللغة',
  // phase 3
  'Backup & restore': 'النسخ الاحتياطي والاستعادة', '📤 Export backup': '📤 تصدير نسخة احتياطية', 'Restore from backup': 'الاستعادة من نسخة احتياطية',
  'Keeps progress safe if you change phone. Everything stays on your device unless you choose to share it. The backup never includes your PIN or keys.': 'يحفظ التقدّم إذا غيّرت هاتفك. كل شيء يبقى على جهازك ما لم تختر مشاركته. النسخة لا تتضمن الرمز السري ولا المفاتيح.',
  'Translations change the app screens only. Practice words are English. Drafts need review by a native speaker.': 'الترجمة تغيّر شاشات التطبيق فقط. كلمات التمرين بالإنجليزية. الترجمات مسودّات تحتاج مراجعة متحدث أصلي.',
  '📄 Share PDF report': '📄 مشاركة التقرير (PDF)',
  '📷 Add photo': '📷 إضافة صورة', '🎙 Record voice': '🎙 تسجيل الصوت', '📷 Photo added ✓': '📷 أُضيفت الصورة ✓', '🎙 Voice added ✓': '🎙 أُضيف الصوت ✓', '⏹ Stop recording': '⏹ إيقاف التسجيل',
  // pro screens
  'Custom Words': 'كلمات مخصصة', 'Weekly Report': 'التقرير الأسبوعي', 'Add word': 'إضافة كلمة', Remove: 'حذف',
  "Add your own therapy or family words to a sound's deck.": 'أضف كلمات العائلة أو التدريب إلى مجموعة الصوت.',
  'No tries this week yet.': 'لا محاولات هذا الأسبوع بعد.', 'Share report (CSV)': 'مشاركة التقرير (CSV)', '⭐ This is a Pro feature': '⭐ هذه ميزة Pro', 'Pro is planned but not on sale yet.': 'Pro مخطّط له وغير متاح للشراء بعد.', 'See Free vs Pro': 'عرض المجاني مقابل Pro',
  'Free vs Pro': 'المجاني مقابل Pro', Free: 'مجاني',
  'Pro is the planned full version. Payments are not switched on yet, so Pro cannot be bought today.': 'Pro هو الإصدار الكامل المخطّط له. الدفع غير مفعّل بعد، لذا لا يمكن شراء Pro اليوم.',
  'No-sound tries never use up the daily 10. Scores are practice feedback, not a diagnosis, and never replace a speech-language pathologist.': 'المحاولات بلا صوت لا تستهلك الـ ١٠ اليومية. الدرجات ملاحظات تدريبية وليست تشخيصًا ولا تغني عن أخصائي النطق واللغة.',
  // legal
  'Privacy in one minute': 'الخصوصية في دقيقة', 'Terms in one minute': 'الشروط في دقيقة', 'Summary only. Have a lawyer review the full policy before a store launch.': 'ملخّص فقط. اطلب من محامٍ مراجعة السياسة الكاملة قبل الإطلاق.',
  // mascot
  'Angel Artic': 'أنجل آرتيك',
};

const dict = (lang?: Lang): Record<string, string> | null => (lang === 'ar' ? AR : lang === 'es' ? ES : lang === 'ur' ? UR : null);

export function tr(lang: Lang | undefined, s: string, vars?: Record<string, string | number>): string {
  const base = dict(lang)?.[s] ?? s;
  return vars ? base.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? '')) : base;
}

export function translateChildren(lang: Lang | undefined, children: any): any {
  const d = dict(lang);
  if (!d) return children;
  if (typeof children === 'string') return d[children.trim()] ?? children;
  if (Array.isArray(children) && children.every((c) => typeof c === 'string' || typeof c === 'number')) {
    const whole = children.join('');
    if (d[whole.trim()]) return d[whole.trim()];
    return children.map((c) => (typeof c === 'string' ? d[c.trim()] ?? c : c));
  }
  return children;
}
