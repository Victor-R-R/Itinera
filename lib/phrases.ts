import type { Phrase } from "./types";
import { uid } from "./format";

type PhraseTemplate = Omit<Phrase, "id">;

const make = (templates: PhraseTemplate[]): Phrase[] =>
  templates.map((t) => ({ ...t, id: uid() }));

// ─── Catalogues por idioma ────────────────────────────────────────────────────

const EN: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días, ¿cómo está?", target: "Good morning, how are you?" },
  { category: "Saludos", source: "Muchas gracias, muy amable.", target: "Thank you very much, that's very kind." },
  { category: "Saludos", source: "Por favor.", target: "Please." },
  { category: "Saludos", source: "De nada.", target: "You're welcome." },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "A table for two, please." },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "Can we have the check, please?" },
  { category: "Restaurante", source: "¿Tienen opciones sin gluten?", target: "Do you have gluten-free options?" },
  { category: "Restaurante", source: "Está delicioso.", target: "This is delicious." },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "I have a reservation under the name…" },
  { category: "Hotel", source: "¿A qué hora es el check-out?", target: "What time is check-out?" },
  { category: "Hotel", source: "¿Puede subir el equipaje a la habitación?", target: "Can you bring the luggage to the room?" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "How do I get to the airport?" },
  { category: "Transporte", source: "¿Dónde está la parada de metro?", target: "Where is the subway station?" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "How much is this?" },
  { category: "Compras", source: "¿Aceptan tarjeta?", target: "Do you take card?" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "I need help, please." },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "Where is the nearest hospital?" },
  { category: "Emergencias", source: "He perdido mi pasaporte.", target: "I've lost my passport." },
];

const FR: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días, ¿cómo está?", target: "Bonjour, comment allez-vous ?" },
  { category: "Saludos", source: "Muchas gracias, muy amable.", target: "Merci beaucoup, c'est très aimable." },
  { category: "Saludos", source: "Por favor.", target: "S'il vous plaît." },
  { category: "Saludos", source: "De nada.", target: "De rien." },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "Une table pour deux, s'il vous plaît." },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "L'addition, s'il vous plaît." },
  { category: "Restaurante", source: "¿Tienen opciones sin gluten?", target: "Avez-vous des options sans gluten ?" },
  { category: "Restaurante", source: "Está delicioso.", target: "C'est délicieux." },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "J'ai une réservation au nom de…" },
  { category: "Hotel", source: "¿A qué hora es el check-out?", target: "À quelle heure est le check-out ?" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "Comment puis-je aller à l'aéroport ?" },
  { category: "Transporte", source: "¿Dónde está la parada de metro?", target: "Où est la station de métro ?" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "Combien ça coûte ?" },
  { category: "Compras", source: "¿Aceptan tarjeta?", target: "Acceptez-vous la carte ?" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "J'ai besoin d'aide, s'il vous plaît." },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "Où est l'hôpital le plus proche ?" },
  { category: "Emergencias", source: "He perdido mi pasaporte.", target: "J'ai perdu mon passeport." },
];

const DE: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días, ¿cómo está?", target: "Guten Morgen, wie geht es Ihnen?" },
  { category: "Saludos", source: "Muchas gracias, muy amable.", target: "Vielen Dank, sehr freundlich." },
  { category: "Saludos", source: "Por favor.", target: "Bitte." },
  { category: "Saludos", source: "De nada.", target: "Bitte sehr." },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "Einen Tisch für zwei, bitte." },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "Die Rechnung, bitte." },
  { category: "Restaurante", source: "¿Tienen opciones sin gluten?", target: "Haben Sie glutenfreie Optionen?" },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "Ich habe eine Reservierung auf den Namen…" },
  { category: "Hotel", source: "¿A qué hora es el check-out?", target: "Um wie viel Uhr ist der Check-out?" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "Wie komme ich zum Flughafen?" },
  { category: "Transporte", source: "¿Dónde está la parada de metro?", target: "Wo ist die U-Bahn-Station?" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "Wie viel kostet das?" },
  { category: "Compras", source: "¿Aceptan tarjeta?", target: "Akzeptieren Sie Kreditkarten?" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "Ich brauche Hilfe, bitte." },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "Wo ist das nächste Krankenhaus?" },
  { category: "Emergencias", source: "He perdido mi pasaporte.", target: "Ich habe meinen Reisepass verloren." },
];

const IT: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días, ¿cómo está?", target: "Buongiorno, come sta?" },
  { category: "Saludos", source: "Muchas gracias, muy amable.", target: "Grazie mille, molto gentile." },
  { category: "Saludos", source: "Por favor.", target: "Per favore." },
  { category: "Saludos", source: "De nada.", target: "Prego." },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "Un tavolo per due, per favore." },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "Il conto, per favore." },
  { category: "Restaurante", source: "¿Tienen opciones sin gluten?", target: "Avete opzioni senza glutine?" },
  { category: "Restaurante", source: "Está delicioso.", target: "È delizioso." },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "Ho una prenotazione a nome di…" },
  { category: "Hotel", source: "¿A qué hora es el check-out?", target: "A che ora è il check-out?" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "Come arrivo all'aeroporto?" },
  { category: "Transporte", source: "¿Dónde está la parada de metro?", target: "Dov'è la fermata della metropolitana?" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "Quanto costa questo?" },
  { category: "Compras", source: "¿Aceptan tarjeta?", target: "Accettate carta?" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "Ho bisogno di aiuto, per favore." },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "Dov'è l'ospedale più vicino?" },
  { category: "Emergencias", source: "He perdido mi pasaporte.", target: "Ho perso il mio passaporto." },
];

const PT: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días, gracias.", target: "Bom dia, obrigado." },
  { category: "Saludos", source: "Muchas gracias, muy amable.", target: "Muito obrigado, é muito gentil." },
  { category: "Saludos", source: "Por favor.", target: "Por favor." },
  { category: "Saludos", source: "De nada.", target: "De nada." },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "Uma mesa para dois, por favor." },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "A conta, por favor." },
  { category: "Restaurante", source: "¿Tienen opciones sin gluten?", target: "Têm opções sem glúten?" },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "Tenho uma reserva em nome de…" },
  { category: "Hotel", source: "¿A qué hora es el check-out?", target: "A que horas é o check-out?" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "Como vou para o aeroporto?" },
  { category: "Transporte", source: "¿Dónde está la estación?", target: "Onde fica a estação?" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "Quanto custa isto?" },
  { category: "Compras", source: "¿Aceptan tarjeta?", target: "Aceitam cartão?" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "Preciso de ajuda, por favor." },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "Onde fica o hospital mais próximo?" },
  { category: "Emergencias", source: "Necesito un médico.", target: "Preciso de um médico." },
];

const JA: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días.", target: "おはようございます。(Ohayō gozaimasu.)" },
  { category: "Saludos", source: "Muchas gracias.", target: "ありがとうございます。(Arigatō gozaimasu.)" },
  { category: "Saludos", source: "Por favor.", target: "お願いします。(Onegaishimasu.)" },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "二人席をお願いします。(Futari seki o onegaishimasu.)" },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "お会計をお願いします。(Okaikei o onegaishimasu.)" },
  { category: "Restaurante", source: "¿Tienen opciones sin gluten?", target: "グルテンフリーのものはありますか？(Guruten furī no mono wa arimasu ka?)" },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "…という名前で予約しています。(… to iu namae de yoyaku shite imasu.)" },
  { category: "Hotel", source: "¿A qué hora es el check-out?", target: "チェックアウトは何時ですか？(Chekkuauto wa nanji desu ka?)" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "空港へはどう行けますか？(Kūkō e wa dō ikemasu ka?)" },
  { category: "Transporte", source: "¿Dónde está la parada de metro?", target: "地下鉄の駅はどこですか？(Chikatetsu no eki wa doko desu ka?)" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "これはいくらですか？(Kore wa ikura desu ka?)" },
  { category: "Compras", source: "¿Aceptan tarjeta?", target: "カードで払えますか？(Kādo de haraemasu ka?)" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "助けてください。(Tasukete kudasai.)" },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "一番近い病院はどこですか？(Ichiban chikai byōin wa doko desu ka?)" },
];

const ZH: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días.", target: "早上好。(Zǎoshang hǎo.)" },
  { category: "Saludos", source: "Muchas gracias.", target: "非常感谢。(Fēicháng gǎnxiè.)" },
  { category: "Saludos", source: "Por favor.", target: "请。(Qǐng.)" },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "两位，请给我一张桌子。(Liǎng wèi, qǐng gěi wǒ yī zhāng zhuōzi.)" },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "请买单。(Qǐng mǎidān.)" },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "我用…的名字预订了。(Wǒ yòng… de míngzì yùdìng le.)" },
  { category: "Hotel", source: "¿A qué hora es el check-out?", target: "退房时间是几点？(Tuìfáng shíjiān shì jǐ diǎn?)" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "怎么去机场？(Zěnme qù jīchǎng?)" },
  { category: "Transporte", source: "¿Dónde está la parada de metro?", target: "地铁站在哪里？(Dìtiě zhàn zài nǎlǐ?)" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "这个多少钱？(Zhège duōshǎo qián?)" },
  { category: "Compras", source: "¿Aceptan tarjeta?", target: "可以刷卡吗？(Kěyǐ shuākǎ ma?)" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "请帮助我。(Qǐng bāngzhù wǒ.)" },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "最近的医院在哪里？(Zuìjìn de yīyuàn zài nǎlǐ?)" },
];

const AR: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días.", target: "صباح الخير (Sabāḥ al-khayr)" },
  { category: "Saludos", source: "Muchas gracias.", target: "شكراً جزيلاً (Shukran jazīlan)" },
  { category: "Saludos", source: "Por favor.", target: "من فضلك (Min faḍlak)" },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "طاولة لشخصين من فضلك (Ṭāwila li-shakhṣayn min faḍlak)" },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "الحساب من فضلك (Al-ḥisāb min faḍlak)" },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "لدي حجز باسم… (Ladī ḥajz bi-sm…)" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "كيف أصل إلى المطار؟ (Kayfa aṣil ilā al-maṭār?)" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "بكم هذا؟ (Bi-kam hādhā?)" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "أحتاج مساعدة (Aḥtāj musāʿada)" },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "أين أقرب مستشفى؟ (Ayna aqrab mustashfā?)" },
];

const EL: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días.", target: "Καλημέρα. (Kaliméra.)" },
  { category: "Saludos", source: "Muchas gracias.", target: "Ευχαριστώ πολύ. (Efcharistó polí.)" },
  { category: "Saludos", source: "Por favor.", target: "Παρακαλώ. (Parakaló.)" },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "Ένα τραπέζι για δύο, παρακαλώ. (Éna trapézi gia dío, parakaló.)" },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "Τον λογαριασμό, παρακαλώ. (Ton logariazmó, parakaló.)" },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "Έχω κράτηση στο όνομα… (Écho krátisi sto ónoma…)" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "Πώς φτάνω στο αεροδρόμιο; (Pós ftáno sto aerodrómio?)" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "Πόσο κάνει αυτό; (Póso káni aftó?)" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "Χρειάζομαι βοήθεια, παρακαλώ. (Chreiázome voítheia, parakaló.)" },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "Πού είναι το πλησιέστερο νοσοκομείο; (Pu íne to plisiéstero nosokomío?)" },
];

const NL: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días.", target: "Goedemorgen." },
  { category: "Saludos", source: "Muchas gracias.", target: "Hartelijk dank." },
  { category: "Saludos", source: "Por favor.", target: "Alsjeblieft." },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "Een tafel voor twee, alsjeblieft." },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "De rekening, alsjeblieft." },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "Ik heb een reservering op naam van…" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "Hoe kom ik op het vliegveld?" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "Hoeveel kost dit?" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "Ik heb hulp nodig, alsjeblieft." },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "Waar is het dichtstbijzijnde ziekenhuis?" },
];

const KO: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días.", target: "안녕하세요. (Annyeonghaseyo.)" },
  { category: "Saludos", source: "Muchas gracias.", target: "감사합니다. (Gamsahamnida.)" },
  { category: "Saludos", source: "Por favor.", target: "부탁드립니다. (Butakdeurimnida.)" },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "두 명이요. (Du myeongiyo.)" },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "계산서 주세요. (Gyesanseo juseyo.)" },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "…이름으로 예약했어요. (… ireumeuro yeyakhaesseoyo.)" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "공항에 어떻게 가요? (Gonghan-e eotteoke gayo?)" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "이거 얼마예요? (Igeo eolmayeyo?)" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "도와주세요. (Dowajuseyo.)" },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "가장 가까운 병원이 어디예요? (Gajang gakkaun byeongwon-i eodiyeyo?)" },
];

const TH: PhraseTemplate[] = [
  { category: "Saludos", source: "Buenos días.", target: "สวัสดีครับ/ค่ะ (Sawatdee khrap/kha)" },
  { category: "Saludos", source: "Muchas gracias.", target: "ขอบคุณมากครับ/ค่ะ (Khop khun mak khrap/kha)" },
  { category: "Saludos", source: "Por favor.", target: "กรุณา (Karuna)" },
  { category: "Restaurante", source: "Una mesa para dos, por favor.", target: "โต๊ะสำหรับสองคน (Toh samrap song khon)" },
  { category: "Restaurante", source: "¿Puede traernos la cuenta?", target: "เก็บเงินด้วยครับ/ค่ะ (Kep ngern duay khrap/kha)" },
  { category: "Hotel", source: "Tengo una reserva a nombre de…", target: "ฉันมีการจองในชื่อ… (Chan mi kan chong nai chue…)" },
  { category: "Transporte", source: "¿Cómo llego al aeropuerto?", target: "ไปสนามบินยังไง (Pai sanam bin yang ngai)" },
  { category: "Compras", source: "¿Cuánto cuesta esto?", target: "ราคาเท่าไหร่ (Raka tao rai)" },
  { category: "Emergencias", source: "Necesito ayuda, por favor.", target: "ช่วยด้วย (Chuay duay)" },
  { category: "Emergencias", source: "¿Dónde está el hospital más cercano?", target: "โรงพยาบาลใกล้ที่สุดอยู่ที่ไหน (Rong phayaban klai thi sut yu thi nai)" },
];

// ─── Mapa país → { speakLang, phrases } ─────────────────────────────────────

type CountryConfig = { speakLang: string; phrases: Phrase[] };

const COUNTRY_MAP: Array<{ keys: string[]; speakLang: string; templates: PhraseTemplate[] }> = [
  {
    keys: ["eeuu", "estados unidos", "usa", "united states", "america", "américas"],
    speakLang: "en-US",
    templates: EN,
  },
  {
    keys: ["reino unido", "uk", "gran bretaña", "gran bretana", "inglaterra", "escocia", "gales", "irlanda"],
    speakLang: "en-GB",
    templates: EN,
  },
  {
    keys: ["australia", "nueva zelanda", "canadá", "canada"],
    speakLang: "en-AU",
    templates: EN,
  },
  {
    keys: ["francia", "france", "bélgica", "belgica", "belgium", "suiza", "switzerland", "mónaco", "monaco"],
    speakLang: "fr-FR",
    templates: FR,
  },
  {
    keys: ["alemania", "germany", "deutschland", "austria", "suiza alemana"],
    speakLang: "de-DE",
    templates: DE,
  },
  {
    keys: ["italia", "italy"],
    speakLang: "it-IT",
    templates: IT,
  },
  {
    keys: ["portugal"],
    speakLang: "pt-PT",
    templates: PT,
  },
  {
    keys: ["brasil", "brazil"],
    speakLang: "pt-BR",
    templates: PT,
  },
  {
    keys: ["japón", "japon", "japan"],
    speakLang: "ja-JP",
    templates: JA,
  },
  {
    keys: ["china", "taiwán", "taiwan", "hong kong"],
    speakLang: "zh-CN",
    templates: ZH,
  },
  {
    keys: ["marruecos", "morocco", "egipto", "egypt", "emiratos", "dubai", "arabia", "jordania", "jordán", "jordan", "túnez", "tunez", "líbano", "libano"],
    speakLang: "ar-SA",
    templates: AR,
  },
  {
    keys: ["grecia", "greece"],
    speakLang: "el-GR",
    templates: EL,
  },
  {
    keys: ["países bajos", "paises bajos", "holanda", "netherlands", "bélgica holandesa"],
    speakLang: "nl-NL",
    templates: NL,
  },
  {
    keys: ["corea", "korea"],
    speakLang: "ko-KR",
    templates: KO,
  },
  {
    keys: ["tailandia", "thailand"],
    speakLang: "th-TH",
    templates: TH,
  },
];

// ─── Traducciones de los textos fuente por locale ────────────────────────────
// El campo `source` de Phrase siempre se almacena en español (lengua base).
// En display-time, FrasesTab usa este mapa para mostrar la frase en el idioma
// del usuario sin necesidad de migrar datos en Supabase.

export const SOURCE_I18N: Record<string, Partial<Record<"fr", string>>> = {
  "Buenos días, ¿cómo está?": { fr: "Bonjour, comment allez-vous ?" },
  "Buenos días.": { fr: "Bonjour." },
  "Buenos días, gracias.": { fr: "Bonjour, merci." },
  "Muchas gracias, muy amable.": { fr: "Merci beaucoup, c'est très aimable." },
  "Muchas gracias.": { fr: "Merci beaucoup." },
  "Por favor.": { fr: "S'il vous plaît." },
  "De nada.": { fr: "De rien." },
  "Una mesa para dos, por favor.": { fr: "Une table pour deux, s'il vous plaît." },
  "¿Puede traernos la cuenta?": { fr: "L'addition, s'il vous plaît." },
  "¿Tienen opciones sin gluten?": { fr: "Avez-vous des options sans gluten ?" },
  "Está delicioso.": { fr: "C'est délicieux." },
  "Tengo una reserva a nombre de…": { fr: "J'ai une réservation au nom de…" },
  "¿A qué hora es el check-out?": { fr: "À quelle heure est le check-out ?" },
  "¿Puede subir el equipaje a la habitación?": { fr: "Pouvez-vous monter les bagages dans la chambre ?" },
  "¿Cómo llego al aeropuerto?": { fr: "Comment puis-je aller à l'aéroport ?" },
  "¿Dónde está la parada de metro?": { fr: "Où est la station de métro ?" },
  "¿Dónde está la estación?": { fr: "Où est la gare ?" },
  "¿Cuánto cuesta esto?": { fr: "Combien ça coûte ?" },
  "¿Aceptan tarjeta?": { fr: "Acceptez-vous la carte ?" },
  "Necesito ayuda, por favor.": { fr: "J'ai besoin d'aide, s'il vous plaît." },
  "¿Dónde está el hospital más cercano?": { fr: "Où est l'hôpital le plus proche ?" },
  "He perdido mi pasaporte.": { fr: "J'ai perdu mon passeport." },
  "Necesito un médico.": { fr: "J'ai besoin d'un médecin." },
};

export const CATEGORY_I18N: Record<string, Partial<Record<"fr", string>>> = {
  "Saludos": { fr: "Salutations" },
  "Restaurante": { fr: "Restaurant" },
  "Hotel": { fr: "Hôtel" },
  "Transporte": { fr: "Transport" },
  "Compras": { fr: "Shopping" },
  "Emergencias": { fr: "Urgences" },
};

/** Devuelve speakLang y phrases pre-pobladas para el país indicado.
 *  Si el país no se reconoce, usa inglés como fallback. */
export const getCountryConfig = (country: string): CountryConfig => {
  const normalized = country.toLowerCase().trim();
  const match = COUNTRY_MAP.find((entry) =>
    entry.keys.some((key) => normalized.includes(key))
  );
  const { speakLang, templates } = match ?? { speakLang: "en-US", templates: EN };
  return { speakLang, phrases: make(templates) };
};
