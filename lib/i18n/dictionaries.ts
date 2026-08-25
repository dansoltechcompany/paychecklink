export type Locale =
  | "en"
  | "es"
  | "zh"
  | "vi"
  | "tl"
  | "fr"
  | "ko"
  | "ar";

export interface LocaleMeta {
  code: Locale;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
}

/** Most spoken languages in the US (Census / ACS-oriented) */
export const LOCALES: LocaleMeta[] = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "es", label: "Spanish", nativeLabel: "Español", dir: "ltr" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", dir: "ltr" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", dir: "ltr" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog", dir: "ltr" },
  { code: "fr", label: "French", nativeLabel: "Français", dir: "ltr" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
];

export type TranslationKey =
  | "nav.home"
  | "nav.salary"
  | "nav.takeHome"
  | "nav.hourly"
  | "nav.tax"
  | "nav.states"
  | "nav.menu"
  | "nav.close"
  | "theme.light"
  | "theme.dark"
  | "theme.toggle"
  | "lang.label"
  | "calc.enterDetails"
  | "calc.payType"
  | "calc.salary"
  | "calc.hourly"
  | "calc.grossPay"
  | "calc.hourlyRate"
  | "calc.payFrequency"
  | "calc.hoursPerWeek"
  | "calc.overtimeHours"
  | "calc.filingStatus"
  | "calc.single"
  | "calc.married"
  | "calc.head"
  | "calc.state"
  | "calc.401k"
  | "calc.bonus"
  | "calc.breakdown"
  | "calc.takeHome"
  | "calc.perYear"
  | "calc.effectiveRate"
  | "calc.gross"
  | "calc.netPay"
  | "freq.weekly"
  | "freq.biweekly"
  | "freq.semimonthly"
  | "freq.monthly"
  | "freq.annual"
  | "footer.tagline"
  | "footer.calculators"
  | "footer.popularStates"
  | "footer.resources"
  | "footer.disclaimerShort"
  | "footer.rights"
  | "footer.languageNote"
  | "ui.faq"
  | "ui.related"
  | "ui.otherStates"
  | "ui.statesByState"
  | "ui.statesIntro"
  | "ui.examplesTitle"
  | "ui.examplesIntro"
  | "ui.grossSalary"
  | "ui.annualTakeHome"
  | "ui.biweeklyNet"
  | "ui.effectiveTax"
  | "ui.disclaimer"
  | "ui.home"
  | "ui.breadcrumbStates"
  | "states.title"
  | "states.subtitle"
  | "states.allStates"
  | "states.noTax";

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  "nav.home": "Home",
  "nav.salary": "Salary",
  "nav.takeHome": "Take Home",
  "nav.hourly": "Hourly",
  "nav.tax": "Tax",
  "nav.states": "States",
  "nav.menu": "Menu",
  "nav.close": "Close",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.toggle": "Toggle theme",
  "lang.label": "Language",
  "calc.enterDetails": "Enter Your Pay Details",
  "calc.payType": "Pay Type",
  "calc.salary": "Salary / Fixed Pay",
  "calc.hourly": "Hourly Wage",
  "calc.grossPay": "Gross Pay ($)",
  "calc.hourlyRate": "Hourly Rate ($)",
  "calc.payFrequency": "Pay Frequency",
  "calc.hoursPerWeek": "Hours per Week",
  "calc.overtimeHours": "Overtime Hours / Week",
  "calc.filingStatus": "Filing Status",
  "calc.single": "Single",
  "calc.married": "Married Filing Jointly",
  "calc.head": "Head of Household",
  "calc.state": "State",
  "calc.401k": "401(k) Contribution (%)",
  "calc.bonus": "Bonus this paycheck ($)",
  "calc.breakdown": "Your Paycheck Breakdown",
  "calc.takeHome": "Take-Home Pay",
  "calc.perYear": "/ year",
  "calc.effectiveRate": "Effective tax rate",
  "calc.gross": "Gross Pay",
  "calc.netPay": "Net Pay",
  "freq.weekly": "Weekly",
  "freq.biweekly": "Bi-weekly",
  "freq.semimonthly": "Semi-monthly",
  "freq.monthly": "Monthly",
  "freq.annual": "Annual",
  "footer.tagline":
    "Free paycheck, salary, and take-home pay calculator for all 50 US states.",
  "footer.calculators": "Calculators",
  "footer.popularStates": "Popular States",
  "footer.resources": "Resources",
  "footer.disclaimerShort": "Estimates only — not tax advice.",
  "footer.rights": "All rights reserved.",
  "footer.languageNote": "Calculator controls available in 8 languages (page articles stay in English).",
  "ui.faq": "Frequently Asked Questions",
  "ui.related": "Related Calculators",
  "ui.otherStates": "Paycheck Calculators for Other States",
  "ui.statesByState": "Paycheck Calculators by State",
  "ui.statesIntro":
    "Each state page preloads that state’s tax rules for a faster estimate.",
  "ui.examplesTitle": "Take-Home Pay Examples",
  "ui.examplesIntro":
    "Estimated net pay for a single filer with no 401(k) or local tax.",
  "ui.grossSalary": "Gross salary",
  "ui.annualTakeHome": "Est. annual take-home",
  "ui.biweeklyNet": "Est. biweekly net",
  "ui.effectiveTax": "Effective tax rate",
  "ui.disclaimer":
    "This paycheck calculator provides estimates only and is not tax advice. Actual withholdings may differ based on W-4 settings, local taxes, benefits, and employer policies. Multi-state reciprocity and nonresident withholding are not modeled — use one work/tax state. Consult a tax professional for personalized guidance.",
  "ui.home": "Home",
  "ui.breadcrumbStates": "States",
  "states.title": "US State Paycheck Calculators",
  "states.subtitle":
    "Choose your US state for a salary paycheck calculator with that state’s tax rules preloaded.",
  "states.allStates": "All 50 US States",
  "states.noTax": "No income tax",
};

const es: Dictionary = {
  ...en,
  "nav.home": "Inicio",
  "nav.salary": "Salario",
  "nav.takeHome": "Neto",
  "nav.hourly": "Por hora",
  "nav.tax": "Impuestos",
  "nav.states": "Estados",
  "nav.menu": "Menú",
  "nav.close": "Cerrar",
  "theme.light": "Claro",
  "theme.dark": "Oscuro",
  "theme.toggle": "Cambiar tema",
  "lang.label": "Idioma",
  "calc.enterDetails": "Ingresa tus datos de pago",
  "calc.payType": "Tipo de pago",
  "calc.salary": "Salario / Pago fijo",
  "calc.hourly": "Salario por hora",
  "calc.grossPay": "Pago bruto ($)",
  "calc.hourlyRate": "Tarifa por hora ($)",
  "calc.payFrequency": "Frecuencia de pago",
  "calc.hoursPerWeek": "Horas por semana",
  "calc.overtimeHours": "Horas extras / semana",
  "calc.filingStatus": "Estado civil fiscal",
  "calc.single": "Soltero",
  "calc.married": "Casado (declaración conjunta)",
  "calc.head": "Cabeza de familia",
  "calc.state": "Estado",
  "calc.401k": "Aporte 401(k) (%)",
  "calc.bonus": "Bono (por período, $)",
  "calc.breakdown": "Desglose de tu cheque",
  "calc.takeHome": "Pago neto",
  "calc.perYear": "/ año",
  "calc.effectiveRate": "Tasa efectiva de impuestos",
  "calc.gross": "Pago bruto",
  "calc.netPay": "Pago neto",
  "freq.weekly": "Semanal",
  "freq.biweekly": "Quincenal",
  "freq.semimonthly": "Dos veces al mes",
  "freq.monthly": "Mensual",
  "freq.annual": "Anual",
  "footer.tagline":
    "Calculadora gratuita de cheques, salario y pago neto para los 50 estados de EE. UU.",
  "footer.calculators": "Calculadoras",
  "footer.popularStates": "Estados populares",
  "footer.resources": "Recursos",
  "footer.disclaimerShort": "Solo estimaciones — no es asesoría fiscal.",
  "footer.rights": "Todos los derechos reservados.",
  "footer.languageNote": "Controles de la calculadora en 8 idiomas (los artículos de la página siguen en inglés).",
  "ui.faq": "Preguntas frecuentes",
  "ui.related": "Calculadoras relacionadas",
  "ui.otherStates": "Calculadoras de otros estados",
  "ui.statesByState": "Calculadoras por estado",
  "ui.statesIntro":
    "Cada página de estado carga las reglas fiscales de ese estado para una estimación más rápida.",
  "ui.examplesTitle": "Ejemplos de pago neto",
  "ui.examplesIntro":
    "Pago neto estimado para un soltero sin 401(k) ni impuestos locales.",
  "ui.grossSalary": "Salario bruto",
  "ui.annualTakeHome": "Neto anual estimado",
  "ui.biweeklyNet": "Neto quincenal estimado",
  "ui.effectiveTax": "Tasa efectiva",
  "ui.disclaimer":
    "Esta calculadora ofrece solo estimaciones y no es asesoría fiscal. Las retenciones reales pueden variar según el W-4, impuestos locales, beneficios y políticas del empleador.",
  "ui.home": "Inicio",
  "ui.breadcrumbStates": "Estados",
  "states.title": "Calculadoras de cheques por estado",
  "states.subtitle":
    "Elige tu estado para una calculadora con las reglas fiscales de ese estado.",
  "states.allStates": "Los 50 estados",
  "states.noTax": "Sin impuesto estatal",
};

const zh: Dictionary = {
  ...en,
  "nav.home": "首页",
  "nav.salary": "年薪",
  "nav.takeHome": "实得工资",
  "nav.hourly": "时薪",
  "nav.tax": "税费",
  "nav.states": "各州",
  "nav.menu": "菜单",
  "nav.close": "关闭",
  "theme.light": "浅色",
  "theme.dark": "深色",
  "theme.toggle": "切换主题",
  "lang.label": "语言",
  "calc.enterDetails": "输入薪资信息",
  "calc.payType": "薪资类型",
  "calc.salary": "固定薪资",
  "calc.hourly": "时薪",
  "calc.grossPay": "税前工资 ($)",
  "calc.hourlyRate": "时薪 ($)",
  "calc.payFrequency": "发薪频率",
  "calc.hoursPerWeek": "每周工时",
  "calc.overtimeHours": "每周加班时数",
  "calc.filingStatus": "报税身份",
  "calc.single": "单身",
  "calc.married": "已婚共同报税",
  "calc.head": "户主",
  "calc.state": "州",
  "calc.401k": "401(k) 缴纳比例 (%)",
  "calc.bonus": "奖金 (每期, $)",
  "calc.breakdown": "工资明细",
  "calc.takeHome": "实得工资",
  "calc.perYear": "/ 年",
  "calc.effectiveRate": "有效税率",
  "calc.gross": "税前工资",
  "calc.netPay": "实得工资",
  "freq.weekly": "每周",
  "freq.biweekly": "每两周",
  "freq.semimonthly": "半月",
  "freq.monthly": "每月",
  "freq.annual": "每年",
  "footer.tagline": "覆盖美国全部 50 州的免费工资与税后计算器。",
  "footer.calculators": "计算器",
  "footer.popularStates": "热门州",
  "footer.resources": "资源",
  "footer.disclaimerShort": "仅供估算 — 非税务建议。",
  "footer.rights": "保留所有权利。",
  "footer.languageNote": "计算器控件支持 8 种语言（页面正文仍为英文）。",
  "ui.faq": "常见问题",
  "ui.related": "相关计算器",
  "ui.otherStates": "其他州工资计算器",
  "ui.statesByState": "各州工资计算器",
  "ui.statesIntro": "每个州页面会预加载该州税制，估算更快。",
  "ui.examplesTitle": "实得工资示例",
  "ui.examplesIntro": "单身、无 401(k)、无地方税的估算净收入。",
  "ui.grossSalary": "税前年薪",
  "ui.annualTakeHome": "预估年实得",
  "ui.biweeklyNet": "预估双周实得",
  "ui.effectiveTax": "有效税率",
  "ui.disclaimer":
    "本计算器仅提供估算，不构成税务建议。实际扣款可能因 W-4、地方税、福利及雇主政策而异。",
  "ui.home": "首页",
  "ui.breadcrumbStates": "各州",
  "states.title": "各州工资计算器",
  "states.subtitle": "选择你的州，使用已预载该州税制的工资计算器。",
  "states.allStates": "全部 50 个州",
  "states.noTax": "无州所得税",
};

const vi: Dictionary = {
  ...en,
  "nav.home": "Trang chủ",
  "nav.salary": "Lương",
  "nav.takeHome": "Thực nhận",
  "nav.hourly": "Theo giờ",
  "nav.tax": "Thuế",
  "nav.states": "Tiểu bang",
  "nav.menu": "Menu",
  "nav.close": "Đóng",
  "theme.light": "Sáng",
  "theme.dark": "Tối",
  "theme.toggle": "Đổi giao diện",
  "lang.label": "Ngôn ngữ",
  "calc.enterDetails": "Nhập thông tin lương",
  "calc.payType": "Loại lương",
  "calc.salary": "Lương cố định",
  "calc.hourly": "Lương theo giờ",
  "calc.grossPay": "Lương gộp ($)",
  "calc.hourlyRate": "Mức lương giờ ($)",
  "calc.payFrequency": "Chu kỳ trả lương",
  "calc.hoursPerWeek": "Giờ mỗi tuần",
  "calc.overtimeHours": "Giờ làm thêm / tuần",
  "calc.filingStatus": "Tình trạng khai thuế",
  "calc.single": "Độc thân",
  "calc.married": "Đã kết hôn (khai chung)",
  "calc.head": "Chủ hộ",
  "calc.state": "Tiểu bang",
  "calc.401k": "Đóng góp 401(k) (%)",
  "calc.bonus": "Thưởng (mỗi kỳ, $)",
  "calc.breakdown": "Chi tiết phiếu lương",
  "calc.takeHome": "Thực nhận",
  "calc.perYear": "/ năm",
  "calc.effectiveRate": "Thuế suất hiệu dụng",
  "calc.gross": "Lương gộp",
  "calc.netPay": "Thực nhận",
  "freq.weekly": "Hàng tuần",
  "freq.biweekly": "Hai tuần một lần",
  "freq.semimonthly": "Nửa tháng",
  "freq.monthly": "Hàng tháng",
  "freq.annual": "Hàng năm",
  "footer.tagline":
    "Máy tính phiếu lương miễn phí cho cả 50 tiểu bang Hoa Kỳ.",
  "footer.calculators": "Máy tính",
  "footer.popularStates": "Tiểu bang phổ biến",
  "footer.resources": "Tài nguyên",
  "footer.disclaimerShort": "Chỉ ước tính — không phải tư vấn thuế.",
  "footer.rights": "Đã đăng ký bản quyền.",
  "footer.languageNote": "Điều khiển máy tính hỗ trợ 8 ngôn ngữ (bài viết trang vẫn bằng tiếng Anh).",
  "ui.faq": "Câu hỏi thường gặp",
  "ui.related": "Máy tính liên quan",
  "ui.otherStates": "Máy tính tiểu bang khác",
  "ui.statesByState": "Máy tính theo tiểu bang",
  "ui.statesIntro":
    "Mỗi trang tiểu bang tải sẵn quy tắc thuế của tiểu bang đó.",
  "ui.examplesTitle": "Ví dụ thực nhận",
  "ui.examplesIntro":
    "Ước tính cho người độc thân, không 401(k), không thuế địa phương.",
  "ui.grossSalary": "Lương gộp",
  "ui.annualTakeHome": "Thực nhận/năm ước tính",
  "ui.biweeklyNet": "Thực nhận hai tuần",
  "ui.effectiveTax": "Thuế suất hiệu dụng",
  "ui.disclaimer":
    "Máy tính chỉ đưa ra ước tính, không phải tư vấn thuế. Khấu trừ thực tế có thể khác.",
  "ui.home": "Trang chủ",
  "ui.breadcrumbStates": "Tiểu bang",
  "states.title": "Máy tính phiếu lương theo tiểu bang",
  "states.subtitle":
    "Chọn tiểu bang để dùng máy tính đã tải sẵn quy tắc thuế.",
  "states.allStates": "Cả 50 tiểu bang",
  "states.noTax": "Không thuế thu nhập",
};

const tl: Dictionary = {
  ...en,
  "nav.home": "Home",
  "nav.salary": "Sahod",
  "nav.takeHome": "Netong Sahod",
  "nav.hourly": "Oras-oras",
  "nav.tax": "Buwis",
  "nav.states": "Mga Estado",
  "nav.menu": "Menu",
  "nav.close": "Isara",
  "theme.light": "Maliwanag",
  "theme.dark": "Madilim",
  "theme.toggle": "Palitan ang tema",
  "lang.label": "Wika",
  "calc.enterDetails": "Ilagay ang detalye ng sahod",
  "calc.payType": "Uri ng bayad",
  "calc.salary": "Sahod / Fixed Pay",
  "calc.hourly": "Oras-oras na sahod",
  "calc.grossPay": "Gross Pay ($)",
  "calc.hourlyRate": "Oras-oras na rate ($)",
  "calc.payFrequency": "Dalas ng sahod",
  "calc.hoursPerWeek": "Oras kada linggo",
  "calc.overtimeHours": "Overtime / linggo",
  "calc.filingStatus": "Filing Status",
  "calc.single": "Single",
  "calc.married": "Married Filing Jointly",
  "calc.head": "Head of Household",
  "calc.state": "Estado",
  "calc.401k": "401(k) Contribution (%)",
  "calc.bonus": "Bonus (kada period, $)",
  "calc.breakdown": "Detalye ng paycheck",
  "calc.takeHome": "Netong Sahod",
  "calc.perYear": "/ taon",
  "calc.effectiveRate": "Effective tax rate",
  "calc.gross": "Gross Pay",
  "calc.netPay": "Net Pay",
  "freq.weekly": "Lingguhan",
  "freq.biweekly": "Bawat dalawang linggo",
  "freq.semimonthly": "Dalawang beses sa buwan",
  "freq.monthly": "Buwanan",
  "freq.annual": "Taunan",
  "footer.tagline":
    "Libreng paycheck at salary calculator para sa lahat ng 50 estado.",
  "footer.calculators": "Mga Calculator",
  "footer.popularStates": "Sikat na Estado",
  "footer.resources": "Resources",
  "footer.disclaimerShort": "Tantiya lang — hindi tax advice.",
  "footer.rights": "Nakalaan ang lahat ng karapatan.",
  "footer.languageNote": "Available ang calculator controls sa 8 wika (mananatiling English ang page articles).",
  "ui.faq": "Mga Madalas Itanong",
  "ui.related": "Kaugnay na Calculator",
  "ui.otherStates": "Calculator ng Ibang Estado",
  "ui.statesByState": "Calculator ayon sa Estado",
  "ui.statesIntro":
    "Bawat state page ay may preload na tax rules ng estado.",
  "ui.examplesTitle": "Mga Halimbawa ng Netong Sahod",
  "ui.examplesIntro":
    "Tantiya para sa single filer na walang 401(k) o local tax.",
  "ui.grossSalary": "Gross salary",
  "ui.annualTakeHome": "Tinatayang taunang net",
  "ui.biweeklyNet": "Tinatayang biweekly net",
  "ui.effectiveTax": "Effective tax rate",
  "ui.disclaimer":
    "Ang calculator ay nagbibigay ng tantiya lang at hindi tax advice.",
  "ui.home": "Home",
  "ui.breadcrumbStates": "Mga Estado",
  "states.title": "US State Paycheck Calculators",
  "states.subtitle":
    "Piliin ang iyong estado para sa calculator na may preload na tax rules.",
  "states.allStates": "Lahat ng 50 Estado",
  "states.noTax": "Walang income tax",
};

const fr: Dictionary = {
  ...en,
  "nav.home": "Accueil",
  "nav.salary": "Salaire",
  "nav.takeHome": "Net",
  "nav.hourly": "Horaire",
  "nav.tax": "Impôts",
  "nav.states": "États",
  "nav.menu": "Menu",
  "nav.close": "Fermer",
  "theme.light": "Clair",
  "theme.dark": "Sombre",
  "theme.toggle": "Changer le thème",
  "lang.label": "Langue",
  "calc.enterDetails": "Entrez vos informations de paie",
  "calc.payType": "Type de rémunération",
  "calc.salary": "Salaire / Fixe",
  "calc.hourly": "Salaire horaire",
  "calc.grossPay": "Salaire brut ($)",
  "calc.hourlyRate": "Taux horaire ($)",
  "calc.payFrequency": "Fréquence de paie",
  "calc.hoursPerWeek": "Heures par semaine",
  "calc.overtimeHours": "Heures supp. / semaine",
  "calc.filingStatus": "Situation fiscale",
  "calc.single": "Célibataire",
  "calc.married": "Marié (déclaration conjointe)",
  "calc.head": "Chef de famille",
  "calc.state": "État",
  "calc.401k": "Cotisation 401(k) (%)",
  "calc.bonus": "Prime (par période, $)",
  "calc.breakdown": "Détail de votre paie",
  "calc.takeHome": "Salaire net",
  "calc.perYear": "/ an",
  "calc.effectiveRate": "Taux d'imposition effectif",
  "calc.gross": "Salaire brut",
  "calc.netPay": "Salaire net",
  "freq.weekly": "Hebdomadaire",
  "freq.biweekly": "Toutes les deux semaines",
  "freq.semimonthly": "Bimensuel",
  "freq.monthly": "Mensuel",
  "freq.annual": "Annuel",
  "footer.tagline":
    "Calculateur gratuit de paie et de salaire net pour les 50 États américains.",
  "footer.calculators": "Calculateurs",
  "footer.popularStates": "États populaires",
  "footer.resources": "Ressources",
  "footer.disclaimerShort": "Estimations uniquement — pas un conseil fiscal.",
  "footer.rights": "Tous droits réservés.",
  "footer.languageNote": "Commandes de la calculatrice disponibles en 8 langues (les articles de page restent en anglais).",
  "ui.faq": "Questions fréquentes",
  "ui.related": "Calculateurs associés",
  "ui.otherStates": "Calculateurs d'autres États",
  "ui.statesByState": "Calculateurs par État",
  "ui.statesIntro":
    "Chaque page d'État précharge les règles fiscales de cet État.",
  "ui.examplesTitle": "Exemples de salaire net",
  "ui.examplesIntro":
    "Estimation pour un célibataire sans 401(k) ni taxe locale.",
  "ui.grossSalary": "Salaire brut",
  "ui.annualTakeHome": "Net annuel estimé",
  "ui.biweeklyNet": "Net bihebdomadaire estimé",
  "ui.effectiveTax": "Taux effectif",
  "ui.disclaimer":
    "Ce calculateur fournit uniquement des estimations et ne constitue pas un conseil fiscal.",
  "ui.home": "Accueil",
  "ui.breadcrumbStates": "États",
  "states.title": "Calculateurs de paie par État",
  "states.subtitle":
    "Choisissez votre État pour un calculateur avec ses règles fiscales.",
  "states.allStates": "Les 50 États",
  "states.noTax": "Pas d'impôt sur le revenu",
};

const ko: Dictionary = {
  ...en,
  "nav.home": "홈",
  "nav.salary": "연봉",
  "nav.takeHome": "실수령액",
  "nav.hourly": "시급",
  "nav.tax": "세금",
  "nav.states": "주별",
  "nav.menu": "메뉴",
  "nav.close": "닫기",
  "theme.light": "라이트",
  "theme.dark": "다크",
  "theme.toggle": "테마 전환",
  "lang.label": "언어",
  "calc.enterDetails": "급여 정보 입력",
  "calc.payType": "급여 유형",
  "calc.salary": "고정 급여",
  "calc.hourly": "시급",
  "calc.grossPay": "세전 급여 ($)",
  "calc.hourlyRate": "시급 ($)",
  "calc.payFrequency": "지급 주기",
  "calc.hoursPerWeek": "주당 근무 시간",
  "calc.overtimeHours": "주당 초과근무",
  "calc.filingStatus": "신고 신분",
  "calc.single": "미혼",
  "calc.married": "부부 공동 신고",
  "calc.head": "세대주",
  "calc.state": "주",
  "calc.401k": "401(k) 기여율 (%)",
  "calc.bonus": "보너스 (기간당, $)",
  "calc.breakdown": "급여 명세",
  "calc.takeHome": "실수령액",
  "calc.perYear": "/ 년",
  "calc.effectiveRate": "실효 세율",
  "calc.gross": "세전 급여",
  "calc.netPay": "실수령액",
  "freq.weekly": "주급",
  "freq.biweekly": "격주",
  "freq.semimonthly": "반월",
  "freq.monthly": "월급",
  "freq.annual": "연봉",
  "footer.tagline": "미국 50개 주 전체용 무료 급여·실수령액 계산기.",
  "footer.calculators": "계산기",
  "footer.popularStates": "인기 주",
  "footer.resources": "자료",
  "footer.disclaimerShort": "추정치만 제공 — 세무 자문이 아닙니다.",
  "footer.rights": "모든 권리 보유.",
  "footer.languageNote": "계산기 조작 UI는 8개 언어로 제공됩니다(페이지 본문은 영어).",
  "ui.faq": "자주 묻는 질문",
  "ui.related": "관련 계산기",
  "ui.otherStates": "다른 주 급여 계산기",
  "ui.statesByState": "주별 급여 계산기",
  "ui.statesIntro": "각 주 페이지는 해당 주 세법을 미리 불러옵니다.",
  "ui.examplesTitle": "실수령액 예시",
  "ui.examplesIntro": "미혼, 401(k)·지방세 없음 기준 추정치입니다.",
  "ui.grossSalary": "세전 연봉",
  "ui.annualTakeHome": "예상 연 실수령",
  "ui.biweeklyNet": "예상 격주 실수령",
  "ui.effectiveTax": "실효 세율",
  "ui.disclaimer":
    "이 계산기는 추정치만 제공하며 세무 자문이 아닙니다. 실제 공제액은 다를 수 있습니다.",
  "ui.home": "홈",
  "ui.breadcrumbStates": "주별",
  "states.title": "주별 급여 계산기",
  "states.subtitle": "해당 주 세법이 적용된 급여 계산기를 선택하세요.",
  "states.allStates": "50개 주 전체",
  "states.noTax": "주 소득세 없음",
};

const ar: Dictionary = {
  ...en,
  "nav.home": "الرئيسية",
  "nav.salary": "الراتب",
  "nav.takeHome": "صافي الراتب",
  "nav.hourly": "بالساعة",
  "nav.tax": "الضرائب",
  "nav.states": "الولايات",
  "nav.menu": "القائمة",
  "nav.close": "إغلاق",
  "theme.light": "فاتح",
  "theme.dark": "داكن",
  "theme.toggle": "تبديل المظهر",
  "lang.label": "اللغة",
  "calc.enterDetails": "أدخل بيانات الراتب",
  "calc.payType": "نوع الأجر",
  "calc.salary": "راتب ثابت",
  "calc.hourly": "أجر بالساعة",
  "calc.grossPay": "الراتب الإجمالي ($)",
  "calc.hourlyRate": "الأجر بالساعة ($)",
  "calc.payFrequency": "دورية الدفع",
  "calc.hoursPerWeek": "ساعات العمل أسبوعيًا",
  "calc.overtimeHours": "ساعات إضافية / أسبوع",
  "calc.filingStatus": "الحالة الضريبية",
  "calc.single": "أعزب",
  "calc.married": "متزوج (إقرار مشترك)",
  "calc.head": "رب الأسرة",
  "calc.state": "الولاية",
  "calc.401k": "مساهمة 401(k) (%)",
  "calc.bonus": "مكافأة (لكل فترة، $)",
  "calc.breakdown": "تفاصيل الراتب",
  "calc.takeHome": "صافي الراتب",
  "calc.perYear": "/ سنة",
  "calc.effectiveRate": "معدل الضريبة الفعلي",
  "calc.gross": "الراتب الإجمالي",
  "calc.netPay": "صافي الراتب",
  "freq.weekly": "أسبوعي",
  "freq.biweekly": "كل أسبوعين",
  "freq.semimonthly": "مرتين شهريًا",
  "freq.monthly": "شهري",
  "freq.annual": "سنوي",
  "footer.tagline":
    "حاسبة رواتب وصافي أجر مجانية لجميع الولايات الأمريكية الخمسين.",
  "footer.calculators": "الحاسبات",
  "footer.popularStates": "ولايات شائعة",
  "footer.resources": "موارد",
  "footer.disclaimerShort": "تقديرات فقط — ليست استشارة ضريبية.",
  "footer.rights": "جميع الحقوق محفوظة.",
  "footer.languageNote": "عناصر التحكم في الحاسبة متاحة بـ 8 لغات (مقالات الصفحة تبقى بالإنجليزية).",
  "ui.faq": "الأسئلة الشائعة",
  "ui.related": "حاسبات ذات صلة",
  "ui.otherStates": "حاسبات ولايات أخرى",
  "ui.statesByState": "حاسبات حسب الولاية",
  "ui.statesIntro": "كل صفحة ولاية تُحمّل مسبقًا قواعد الضرائب لتلك الولاية.",
  "ui.examplesTitle": "أمثلة على صافي الراتب",
  "ui.examplesIntro":
    "تقدير لأعزب بدون 401(k) وبدون ضرائب محلية.",
  "ui.grossSalary": "الراتب الإجمالي",
  "ui.annualTakeHome": "صافي سنوي تقديري",
  "ui.biweeklyNet": "صافي كل أسبوعين",
  "ui.effectiveTax": "المعدل الفعلي",
  "ui.disclaimer":
    "توفر هذه الحاسبة تقديرات فقط وليست استشارة ضريبية. قد تختلف الاقتطاعات الفعلية.",
  "ui.home": "الرئيسية",
  "ui.breadcrumbStates": "الولايات",
  "states.title": "حاسبات الرواتب حسب الولاية",
  "states.subtitle":
    "اختر ولايتك لحاسبة راتب مع قواعد الضرائب الخاصة بتلك الولاية.",
  "states.allStates": "جميع الولايات الخمسين",
  "states.noTax": "بدون ضريبة دخل",
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  es,
  zh,
  vi,
  tl,
  fr,
  ko,
  ar,
};

export function t(locale: Locale, key: TranslationKey): string {
  return DICTIONARIES[locale][key] ?? DICTIONARIES.en[key] ?? key;
}

export function getLocaleMeta(code: Locale): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}
