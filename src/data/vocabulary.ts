import type { WordItem } from '../types';

export const INITIAL_VOCABULARY: WordItem[] = [
  // --- 機場與飛行 (Airport & Flight) ---
  {
    id: 'vocab-1',
    word: 'boarding pass',
    phonetic: '/ˈbɔːrdɪŋ pæs/',
    partOfSpeech: 'n.',
    translation: '登機證',
    category: 'airport',
    categoryLabel: '機場與飛行',
    example: 'Please have your passport and boarding pass ready.',
    exampleTranslation: '請準備好您的護照與登機證。',
    tip: '登機時可出示手機電子登機證 (mobile boarding pass)。'
  },
  {
    id: 'vocab-2',
    word: 'luggage carousel',
    phonetic: '/ˈlʌɡɪdʒ ˌkærəˈsel/',
    partOfSpeech: 'n.',
    translation: '行李轉盤',
    category: 'airport',
    categoryLabel: '機場與飛行',
    example: 'Which luggage carousel will the bags from Flight BR32 arrive at?',
    exampleTranslation: 'BR32 班機的行李會在哪一個行李轉盤送達？',
    tip: '美式常用 baggage claim，英式常用 luggage carousel。'
  },
  {
    id: 'vocab-3',
    word: 'carry-on',
    phonetic: '/ˈkæri ɑːn/',
    partOfSpeech: 'n. / adj.',
    translation: '隨身手提行李',
    category: 'airport',
    categoryLabel: '機場與飛行',
    example: 'You are allowed one carry-on bag and one personal item.',
    exampleTranslation: '您被允許攜帶一件隨身手提行李與一件隨身隨身物品。',
    tip: '託運行李則是 checked baggage。'
  },
  {
    id: 'vocab-4',
    word: 'customs declaration',
    phonetic: '/ˈkʌstəmz ˌdekləˈreɪʃn/',
    partOfSpeech: 'n.',
    translation: '海關申報單',
    category: 'airport',
    categoryLabel: '機場與飛行',
    example: 'Do I need to fill out a customs declaration form?',
    exampleTranslation: '我需要填寫海關申報單嗎？',
    tip: '若無申報物品走綠色通道 (Nothing to Declare)。'
  },
  {
    id: 'vocab-5',
    word: 'layover',
    phonetic: '/ˈleɪˌoʊvər/',
    partOfSpeech: 'n.',
    translation: '轉機停留 / 過境',
    category: 'airport',
    categoryLabel: '機場與飛行',
    example: 'We have a four-hour layover in Tokyo before flying to New York.',
    exampleTranslation: '我們在飛往紐約前，會在東京轉機停留四個小時。',
    tip: '一般 24 小時內稱為 layover；超過 24 小時長停留通常稱為 stopover。'
  },

  // --- 飯店與住宿 (Hotel & Lodging) ---
  {
    id: 'vocab-6',
    word: 'complimentary',
    phonetic: '/ˌkɑːmplɪˈmentri/',
    partOfSpeech: 'adj.',
    translation: '免費贈送的',
    category: 'hotel',
    categoryLabel: '飯店與住宿',
    example: 'Breakfast and bottled water in the room are complimentary.',
    exampleTranslation: '早餐與房內的瓶裝水是免費提供的。',
    tip: '飯店常用 complimentary 代替 free，看起來更典雅。'
  },
  {
    id: 'vocab-7',
    word: 'concierge',
    phonetic: '/kɔːnˈsjerʒ/',
    partOfSpeech: 'n.',
    translation: '飯店禮賓接待員 / 服務台',
    category: 'hotel',
    categoryLabel: '飯店與住宿',
    example: 'The concierge helped us book a table at the Michelin restaurant.',
    exampleTranslation: '禮賓人員協助我們預訂了米其林餐廳的座位。',
    tip: '問路、叫計程車或預約演出都可以找禮賓部。'
  },
  {
    id: 'vocab-8',
    word: 'amenities',
    phonetic: '/əˈmenətiz/',
    partOfSpeech: 'n.',
    translation: '便利設施 / 備品',
    category: 'hotel',
    categoryLabel: '飯店與住宿',
    example: 'Does this hotel have amenities like a gym and heated swimming pool?',
    exampleTranslation: '這家飯店有健身房和溫水游泳池等便利設施嗎？',
    tip: '也常指客房內的洗髮精、牙刷、吹風機等備品。'
  },
  {
    id: 'vocab-9',
    word: 'wake-up call',
    phonetic: '/ˈweɪk ʌp kɔːl/',
    partOfSpeech: 'n.',
    translation: '晨喚電話 / 叫醒服務',
    category: 'hotel',
    categoryLabel: '飯店與住宿',
    example: 'Could I request a wake-up call for tomorrow morning at 6:30?',
    exampleTranslation: '我可以預約明天早上六點半的叫醒服務嗎？',
    tip: '趕清晨航班時向櫃台預約最安心。'
  },
  {
    id: 'vocab-10',
    word: 'deposit',
    phonetic: '/dɪˈpɑːzɪt/',
    partOfSpeech: 'n. / v.',
    translation: '押金 / 訂金',
    category: 'hotel',
    categoryLabel: '飯店與住宿',
    example: 'We require a $100 security deposit upon check-in, payable by credit card.',
    exampleTranslation: '我們在登記入住時需要收取 100 美元保證金，可使用信用卡支付。',
    tip: '退房檢查無誤後信用卡預授權會自動退還。'
  },

  // --- 餐廳與美食 (Dining & Food) ---
  {
    id: 'vocab-11',
    word: 'reservation',
    phonetic: '/ˌrezərˈveɪʃn/',
    partOfSpeech: 'n.',
    translation: '預約 / 訂位',
    category: 'dining',
    categoryLabel: '餐廳與美食',
    example: 'I have a reservation under the name Lin for 7:00 PM.',
    exampleTranslation: '我有訂位，登記的大名是林先生，時間是晚上七點。',
    tip: '進餐廳先說 "I have a reservation under [你的姓氏]"。'
  },
  {
    id: 'vocab-12',
    word: 'allergic to',
    phonetic: '/əˈlɜːrdʒɪk tuː/',
    partOfSpeech: 'adj. phr.',
    translation: '對...過敏',
    category: 'dining',
    categoryLabel: '餐廳與美食',
    example: 'I am severely allergic to peanuts and shellfish.',
    exampleTranslation: '我對花生與甲殼海鮮嚴重過敏。',
    tip: '點餐時務必先聲明過敏源，避免引發食物過敏。'
  },
  {
    id: 'vocab-13',
    word: 'tap water',
    phonetic: '/ˈtæp ˌwɔːtər/',
    partOfSpeech: 'n.',
    translation: '自來水 (免費飲用水)',
    category: 'dining',
    categoryLabel: '餐廳與美食',
    example: 'Tap water is fine for us, thank you.',
    exampleTranslation: '給我們自來水 (免費常溫/冰開水) 就可以了，謝謝。',
    tip: '國外餐廳服務生問 "Still, sparkling or tap?"，選 tap 是免費的。'
  },
  {
    id: 'vocab-14',
    word: 'to go / take out',
    phonetic: '/tuː ɡoʊ/',
    partOfSpeech: 'phr.',
    translation: '外帶',
    category: 'dining',
    categoryLabel: '餐廳與美食',
    example: 'Can I get this burger to go, please?',
    exampleTranslation: '請問這份漢堡可以外帶嗎？',
    tip: '美式常問 "For here or to go?"；英式常問 "Eat in or take away?"。'
  },
  {
    id: 'vocab-15',
    word: 'split the bill',
    phonetic: '/splɪt ðə bɪl/',
    partOfSpeech: 'phr. v.',
    translation: '分開付帳 (AA制)',
    category: 'dining',
    categoryLabel: '餐廳與美食',
    example: 'Could we split the bill between two cards?',
    exampleTranslation: '請問我們可以分刷兩張信用卡嗎？',
    tip: '口語也可以說 "Can we go Dutch?" 或 "Separate checks, please."。'
  },

  // --- 購物與退稅 (Shopping & Tax Free) ---
  {
    id: 'vocab-16',
    word: 'fitting room',
    phonetic: '/ˈfɪtɪŋ ruːm/',
    partOfSpeech: 'n.',
    translation: '試衣間',
    category: 'shopping',
    categoryLabel: '購物與退稅',
    example: 'Where is the fitting room? I would like to try this jacket on.',
    exampleTranslation: '請問試衣間在哪裡？我想試穿這件外套。',
    tip: '英式有時稱為 dressing room 或 changing room。'
  },
  {
    id: 'vocab-17',
    word: 'tax refund',
    phonetic: '/tæks ˈriːfʌnd/',
    partOfSpeech: 'n.',
    translation: '退稅',
    category: 'shopping',
    categoryLabel: '購物與退稅',
    example: 'Could you give me a tax refund form for this purchase?',
    exampleTranslation: '可以請您為這次消費開立退稅單據嗎？',
    tip: '記得隨身攜帶護照正本，店員才能開立 Tax Free 單據。'
  },
  {
    id: 'vocab-18',
    word: 'out of stock',
    phonetic: '/aʊt əv stɑːk/',
    partOfSpeech: 'adj. phr.',
    translation: '缺貨 / 無現貨',
    category: 'shopping',
    categoryLabel: '購物與退稅',
    example: 'I am sorry, size Medium in black is currently out of stock.',
    exampleTranslation: '很抱歉，黑色 M 號目前缺貨中。',
    tip: '反義詞是有現貨：in stock。'
  },
  {
    id: 'vocab-19',
    word: 'receipt',
    phonetic: '/rɪˈsiːt/',
    partOfSpeech: 'n.',
    translation: '收據 / 發票',
    category: 'shopping',
    categoryLabel: '購物與退稅',
    example: 'Keep the receipt in case you need an exchange or refund.',
    exampleTranslation: '請保留收據，以防您需要換貨或退款。',
    tip: '注意發音中字母 p 不發音，唸作 /rɪˈsiːt/。'
  },
  {
    id: 'vocab-20',
    word: 'bargain',
    phonetic: '/ˈbɑːrɡən/',
    partOfSpeech: 'n. / v.',
    translation: '特價划算好物 / 殺價',
    category: 'shopping',
    categoryLabel: '購物與退稅',
    example: 'At fifty percent off, this leather bag is an absolute bargain!',
    exampleTranslation: '打五折只要半價，這款皮包實在太划算了！',
    tip: '在傳統市集若想議價，可禮貌詢問 "Can you give me a better deal?"。'
  },

  // --- 交通與指路 (Transport & Directions) ---
  {
    id: 'vocab-21',
    word: 'platform',
    phonetic: '/ˈplætfɔːrm/',
    partOfSpeech: 'n.',
    translation: '月台',
    category: 'transport',
    categoryLabel: '交通與指路',
    example: 'The express train to Oxford departs from Platform 4.',
    exampleTranslation: '開往牛津的特快列車將在第 4 月台出發。',
    tip: '車站大廳螢幕上留意 Departures 與對應的 Platform 編號。'
  },
  {
    id: 'vocab-22',
    word: 'transfer',
    phonetic: '/trænsˈfɜːr/',
    partOfSpeech: 'v. / n.',
    translation: '轉乘 / 換車',
    category: 'transport',
    categoryLabel: '交通與指路',
    example: 'You need to transfer to the Blue Line at Central Station.',
    exampleTranslation: '您需要在中央車站轉乘藍線捷運。',
    tip: '問路常用："Where should I transfer to the airport express?"'
  },
  {
    id: 'vocab-23',
    word: 'one-way ticket',
    phonetic: '/ˌwʌnˈweɪ ˈtɪkɪt/',
    partOfSpeech: 'n.',
    translation: '單程票',
    category: 'transport',
    categoryLabel: '交通與指路',
    example: 'I would like two one-way tickets to Cambridge, please.',
    exampleTranslation: '我想買兩張到劍橋的單程票，謝謝。',
    tip: '來回票美式叫 round-trip ticket，英式叫 return ticket。'
  },
  {
    id: 'vocab-24',
    word: 'pedestrian',
    phonetic: '/pəˈdestriən/',
    partOfSpeech: 'n.',
    translation: '行人',
    category: 'transport',
    categoryLabel: '交通與指路',
    example: 'Use the pedestrian crossing when crossing this busy boulevard.',
    exampleTranslation: '穿越這條繁忙的大道時，請使用行人斑馬線。',
    tip: '斑馬線英文常用 crosswalk (美) 或 zebra crossing (英)。'
  },
  {
    id: 'vocab-25',
    word: 'fare',
    phonetic: '/fer/',
    partOfSpeech: 'n.',
    translation: '車資 / 票價',
    category: 'transport',
    categoryLabel: '交通與指路',
    example: 'What is the standard taxi fare from downtown to the airport?',
    exampleTranslation: '從市中心到機場的計程車車資大約是多少？',
    tip: '公車上常見 "Exact fare only" 表示不找零，需備妥零錢。'
  },

  // --- 生活常用口語 (Daily Chitchat & Slang) ---
  {
    id: 'vocab-26',
    word: 'No worries',
    phonetic: '/noʊ ˈwɜːriz/',
    partOfSpeech: 'phr.',
    translation: '別客氣 / 沒關係 / 小事一樁',
    category: 'daily',
    categoryLabel: '日常口語',
    example: 'A: Thank you for holding the door! B: No worries at all.',
    exampleTranslation: 'A: 謝謝你幫我扶著門！ B: 小事一樁，別客氣。',
    tip: '在美澳非常流行，比正式的 "You are welcome" 更親切隨和。'
  },
  {
    id: 'vocab-27',
    word: 'under the weather',
    phonetic: '/ˈʌndər ðə ˈweðər/',
    partOfSpeech: 'idiom',
    translation: '身體微恙 / 有點不舒服',
    category: 'daily',
    categoryLabel: '日常口語',
    example: 'I am feeling a bit under the weather today, so I will rest in the room.',
    exampleTranslation: '我今天覺得身體有點不太舒服，所以打算在房間多休息。',
    tip: '常用於描述輕微感冒、疲倦，而非重大重病。'
  },
  {
    id: 'vocab-28',
    word: 'Catch you later',
    phonetic: '/kætʃ juː ˈleɪtər/',
    partOfSpeech: 'phr.',
    translation: '晚點見 / 回頭聊',
    category: 'daily',
    categoryLabel: '日常口語',
    example: 'I have to run to a meeting now. Catch you later!',
    exampleTranslation: '我現在得趕去開會了。回頭聊！',
    tip: '道別時很自然、充滿活力的常用口語。'
  },
  {
    id: 'vocab-29',
    word: "I'm in",
    phonetic: '/aɪm ɪn/',
    partOfSpeech: 'phr.',
    translation: '我加入！算我一份！',
    category: 'daily',
    categoryLabel: '日常口語',
    example: 'If you guys are going to the night market, I am definitely in!',
    exampleTranslation: '如果大家今晚要去夜市，算我一份，我一定要去！',
    tip: '若不想參加則可說 "Count me out" 或 "I will pass this time"。'
  },
  {
    id: 'vocab-30',
    word: 'Hit me up',
    phonetic: '/hɪt miː ʌp/',
    partOfSpeech: 'phr.',
    translation: '聯絡我 / 傳訊息給我 (HMU)',
    category: 'daily',
    categoryLabel: '日常口語',
    example: 'Hit me up whenever you arrive in town this weekend.',
    exampleTranslation: '這週末你一到市區就傳訊息跟我聯絡吧。',
    tip: '社交軟體常簡寫為 HMU。'
  },

  // --- 緊急求助與醫療 (Emergency & Health) ---
  {
    id: 'vocab-31',
    word: 'prescription',
    phonetic: '/prɪˈskrɪpʃn/',
    partOfSpeech: 'n.',
    translation: '處方籤 / 處方藥',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    example: 'You will need a doctor\'s prescription to buy this antibiotic.',
    exampleTranslation: '您需要醫師處方籤才能購買這種抗生素。',
    tip: '成藥（非處方藥）則稱為 Over-The-Counter (OTC) medicine。'
  },
  {
    id: 'vocab-32',
    word: 'lost and found',
    phonetic: '/lɔːst ænd faʊnd/',
    partOfSpeech: 'n.',
    translation: '失物招領處',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    example: 'I left my backpack on the train. Is there a lost and found office?',
    exampleTranslation: '我把背包遺忘在火車上了。請問這裡有失物招領處嗎？',
    tip: '遺失物品時請儘速至車站或景點的 Lost & Found 登記。'
  },
  {
    id: 'vocab-33',
    word: 'painkiller',
    phonetic: '/ˈpeɪnkɪlər/',
    partOfSpeech: 'n.',
    translation: '止痛藥',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    example: 'Do you have any painkillers for a bad headache?',
    exampleTranslation: '請問您有治療劇烈頭痛的止痛藥嗎？',
    tip: '國外藥局常見的止痛成份有 Ibuprofen (布洛芬) 與 Acetaminophen。'
  },
  {
    id: 'vocab-34',
    word: 'emergency exit',
    phonetic: '/ɪˈmɜːrdʒənsi ˈeɡzɪt/',
    partOfSpeech: 'n.',
    translation: '緊急逃生出口',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    example: 'Please locate the nearest emergency exit as soon as you enter.',
    exampleTranslation: '一進入場所後，請先確認距離最近的緊急逃生出口位置。',
    tip: '飛機就座時也請留意自身與緊急逃生門的距離。'
  }
];
