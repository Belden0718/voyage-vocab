import type { PhraseItem } from '../types';

export const SURVIVAL_PHRASES: PhraseItem[] = [
  // ==========================================
  // --- 1. 機場出入境與飛行 (Airport & Flight) ---
  // ==========================================
  {
    id: 'p-1',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Where can I find the baggage claim for Flight CI004?',
    zh: '請問 CI004 班機的行李提領處在哪裡？',
    situation: '提領行李時'
  },
  {
    id: 'p-2',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'I am here for vacation and will be staying for 7 days.',
    zh: '我是來度假旅遊的，預計停留 7 天。',
    situation: '海關入境審查被詢問目的時'
  },
  {
    id: 'p-3',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'I have a connecting flight to New York in two hours. Where is the transfer desk?',
    zh: '我兩個小時後要轉機飛往紐約，請問轉機櫃台在哪裡？',
    situation: '轉機換乘時'
  },
  {
    id: 'p-4',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Could you please mark this bag as fragile?',
    zh: '可以麻煩幫我這件行李貼上易碎品標籤嗎？',
    situation: '行李托運時'
  },
  {
    id: 'p-5',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'My checked baggage hasn\'t arrived. Where can I file a missing luggage report?',
    zh: '我的託運行李沒有出來，請問在哪裡可以填寫行李遺失申報單？',
    situation: '行李轉盤等不到行李時'
  },
  {
    id: 'p-6',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Could I change my seat to an aisle seat or a window seat?',
    zh: '請問我可以將座位換成靠走道或靠窗的位子嗎？',
    situation: '櫃台報到換位時'
  },
  {
    id: 'p-7',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Is there a free airport Wi-Fi network available here?',
    zh: '請問這裡有免費的機場 Wi-Fi 可以連線嗎？',
    situation: '候機時上網'
  },
  {
    id: 'p-8',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Here is my return ticket and hotel reservation confirmation.',
    zh: '這是我的回程機票與飯店訂房確認單。',
    situation: '海關審查要求出示證明時'
  },
  {
    id: 'p-9',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Could I have a blanket and a cup of warm water, please?',
    zh: '麻煩給我一條毛毯和一杯溫開水，謝謝。',
    situation: '機艙內向空服員索取'
  },
  {
    id: 'p-10',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Chicken or beef for dinner? I would like the chicken, please.',
    zh: '晚餐有雞肉還是牛肉？請給我雞肉餐，謝謝。',
    situation: '機上點飛機餐'
  },
  {
    id: 'p-11',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Excuse me, could you point me to Terminal 2?',
    zh: '不好意思，請問二號航廈要往哪裡走？',
    situation: '找航廈或轉機時'
  },
  {
    id: 'p-12',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Do I need to collect and re-check my bags for the connecting flight?',
    zh: '轉機時我需要先領出托運行李再重新托運嗎？',
    situation: '詢問行李是否直掛目的地'
  },

  // ==========================================
  // --- 2. 飯店與住宿 (Hotel & Lodging) ---
  // ==========================================
  {
    id: 'p-13',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Could we leave our luggage here before check-in?',
    zh: '在辦理入住手續前，我們可以先把行李寄放在這裡嗎？',
    situation: '早到飯店想先輕裝出遊時'
  },
  {
    id: 'p-14',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'What is the Wi-Fi password for the guest network?',
    zh: '請問客用無線網路的 Wi-Fi 密碼是什麼？',
    situation: '詢問網路連線時'
  },
  {
    id: 'p-15',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Could I have extra towels, pillows, and toilet paper, please?',
    zh: '可以麻煩再提供額外的毛巾、枕頭與衛生紙嗎？',
    situation: '向客房服務索取備品時'
  },
  {
    id: 'p-16',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'The air conditioner in my room is not working properly. Could someone check it?',
    zh: '我房間的冷氣運轉不太正常，可以派人過來檢查一下嗎？',
    situation: '房間設備故障報修'
  },
  {
    id: 'p-17',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Is breakfast included with our booking? What time is it served?',
    zh: '我們的訂房有包含早餐嗎？供應時間是幾點到幾點？',
    situation: '入住詢問早餐資訊'
  },
  {
    id: 'p-18',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Would it be possible to arrange a late check-out for one hour?',
    zh: '請問有可能通融延後退房一個小時嗎？',
    situation: '請求延後退房'
  },
  {
    id: 'p-19',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'We would prefer a quiet room on a higher floor away from the elevator.',
    zh: '我們想要高樓層、遠離電梯且安靜一點的房間。',
    situation: '辦理入住選房偏好'
  },
  {
    id: 'p-20',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Could you please call a taxi for us to the airport tomorrow morning at 6:00 AM?',
    zh: '可以麻煩櫃台幫我們預約明天早上六點去機場的計程車嗎？',
    situation: '向櫃台預約叫車'
  },
  {
    id: 'p-21',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'I accidentally locked myself out of my room. Could I get a replacement key?',
    zh: '我不小心把自己反鎖在門外了，可以給我一張備用房卡嗎？',
    situation: '房卡遺失或忘在房內'
  },
  {
    id: 'p-22',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Is there an iron and ironing board available that I could borrow?',
    zh: '請問有熨斗和燙衣板可以借用嗎？',
    situation: '向房務部借電器'
  },

  // ==========================================
  // --- 3. 餐廳與美食 (Dining & Food) ---
  // ==========================================
  {
    id: 'p-23',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Table for two, please. Do you have an English menu?',
    zh: '兩位用餐，請問有英文菜單嗎？',
    situation: '進餐廳帶位時'
  },
  {
    id: 'p-24',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'What do you recommend as the signature dish here?',
    zh: '請問你們這裡最推薦的招牌菜是什麼？',
    situation: '請店員推薦料理時'
  },
  {
    id: 'p-25',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Check, please. Can we pay separately by credit card?',
    zh: '買單結帳，請問我們可以分開刷信用卡嗎？',
    situation: '用餐完畢結帳時'
  },
  {
    id: 'p-26',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'I am severely allergic to peanuts, tree nuts, and shellfish. Does this dish contain any?',
    zh: '我對花生、堅果與甲殼海鮮嚴重過敏，這道菜有包含這些食材嗎？',
    situation: '點餐過敏原確認'
  },
  {
    id: 'p-27',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Could I get the steak medium-rare, and the dressing on the side?',
    zh: '牛排請幫我做三分熟，沙拉醬請另外分開放。',
    situation: '牛排與配醬客製化'
  },
  {
    id: 'p-28',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Excuse me, we have been waiting for over 30 minutes. Could you check on our order?',
    zh: '不好意思，我們已經等了超過三十分鐘，可以幫忙催一下餐點嗎？',
    situation: '出餐過慢催餐時'
  },
  {
    id: 'p-29',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Can we get some ice water for the table, please? Tap water is fine.',
    zh: '可以麻煩給這桌一些冰開水嗎？自來開水就可以了。',
    situation: '向服務生要免費開水'
  },
  {
    id: 'p-30',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Could you give us a few more minutes to look at the menu?',
    zh: '可以再給我們幾分鐘看一下菜單嗎？我們還沒決定好。',
    situation: '店員過來詢問但尚未決定'
  },
  {
    id: 'p-31',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Can I have this wrapped up to go, please? / Could I have a to-go box?',
    zh: '可以幫我把吃不完的餐點打包外帶嗎？/ 可以給我一個外帶盒嗎？',
    situation: '餐後剩菜打包'
  },
  {
    id: 'p-32',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Excuse me, I ordered the grilled salmon, but this looks like beef.',
    zh: '不好意思，我點的是烤鮭魚，但送上來的似乎是牛肉。',
    situation: '送錯餐點反應'
  },
  {
    id: 'p-33',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Is service charge or tip already included in the bill?',
    zh: '請問帳單中已經有包含服務費或小費了嗎？',
    situation: '結帳前確認小費'
  },
  {
    id: 'p-34',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Could I get an iced Americano with oat milk, no sugar, and less ice?',
    zh: '我想點一杯冰美式咖啡，換燕麥奶、不加糖、微冰。',
    situation: '咖啡廳客製化點咖啡'
  },

  // ==========================================
  // --- 4. 購物與退稅 (Shopping & Tax Free) ---
  // ==========================================
  {
    id: 'p-35',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Can I try this on in a size larger / smaller?',
    zh: '這件我可以試穿大一號 / 小一號的尺碼嗎？',
    situation: '服飾店挑選尺寸時'
  },
  {
    id: 'p-36',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Does this purchase qualify for a tax refund? Here is my passport.',
    zh: '這筆消費有符合免稅/退稅標準嗎？這是我的護照。',
    situation: '結帳時辦理退稅'
  },
  {
    id: 'p-37',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Do you have a brand-new one in the back stockroom?',
    zh: '請問倉庫裡有未拆封的全新現貨嗎？',
    situation: '不想買架上展示品時'
  },
  {
    id: 'p-38',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Can you give me a discount if I pay in cash or buy two of them?',
    zh: '如果我付現金或一次買兩個，可以給我一點折扣優惠嗎？',
    situation: '市集或小店殺價'
  },
  {
    id: 'p-39',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'I would like to return this item with the original receipt for a full refund.',
    zh: '我想憑原始發票退回這件商品並全額退款。',
    situation: '門市辦理退貨退款'
  },
  {
    id: 'p-40',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Do you accept Apple Pay, Line Pay, or contactless credit cards?',
    zh: '請問你們接受 Apple Pay、行動支付或感應式信用卡嗎？',
    situation: '結帳前確認支付方式'
  },
  {
    id: 'p-41',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Thank you, I\'m just browsing for now.',
    zh: '謝謝，我現在只是隨便看看逛逛。',
    situation: '店員過來熱情推銷時禮貌回應'
  },
  {
    id: 'p-42',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Could you wrap this up as a gift, please?',
    zh: '可以麻煩幫我把這個包裝成禮物送人嗎？',
    situation: '要求禮品包裝服務'
  },
  {
    id: 'p-43',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Excuse me, there is a stain/defect on this garment. Can I get another one?',
    zh: '不好意思，這件衣服上面有污漬/瑕疵，可以換一件給我嗎？',
    situation: '發現商品瑕疵'
  },
  {
    id: 'p-44',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'What is the minimum spending amount to get tax-free shopping here?',
    zh: '請問在這裡購物要消費滿多少金額才能辦理退稅？',
    situation: '詢問免稅消費門檻'
  },

  // ==========================================
  // --- 5. 交通指路與乘車 (Transport & Directions) ---
  // ==========================================
  {
    id: 'p-45',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Excuse me, does this bus go to Central Station?',
    zh: '不好意思，請問這班公車有到中央車站嗎？',
    situation: '上公車前向司機確認路線'
  },
  {
    id: 'p-46',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'How many stops is it until the Museum of Modern Art?',
    zh: '請問到現代藝術博物館還要坐幾站？',
    situation: '搭乘地鐵或電車時'
  },
  {
    id: 'p-47',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Excuse me, could you tell me how to get to the nearest metro station?',
    zh: '不好意思，可以告訴我最近的地鐵站在哪裡嗎？',
    situation: '在路上向路人問路'
  },
  {
    id: 'p-48',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Please turn on the meter. / How much will it cost to get to downtown?',
    zh: '請按表跳表計費。/ 到市中心大概需要多少車資？',
    situation: '上計程車防止被喊價敲竹槓'
  },
  {
    id: 'p-49',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Please drop me off right here in front of that hotel, thank you.',
    zh: '請直接在前面那家飯店門口讓我下車，謝謝。',
    situation: '抵達目的地請司機靠邊下車'
  },
  {
    id: 'p-50',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Where can I purchase a reloadable transit smart card or a 3-day day pass?',
    zh: '請問在哪裡可以購買可儲值的交通智慧卡或三日交通通票？',
    situation: '購買交通悠遊卡'
  },
  {
    id: 'p-51',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Which platform does the train heading toward Oxford depart from?',
    zh: '請問開往牛津的火車是在第幾月台發車？',
    situation: '火車站看台確認'
  },
  {
    id: 'p-52',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Is this seat taken, or may I sit here?',
    zh: '請問這個位子有人坐嗎？我可以坐這裡嗎？',
    situation: '搭車尋找座位'
  },
  {
    id: 'p-53',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'I would like to rent an automatic car with comprehensive GPS and insurance.',
    zh: '我想租一輛自排車，並加購中文 GPS 導航與全額全險。',
    situation: '租車櫃台辦理租車'
  },
  {
    id: 'p-54',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Could you please unlock the trunk? I have two heavy suitcases.',
    zh: '可以麻煩幫我打開後車廂嗎？我有兩件大行李箱。',
    situation: '上計程車放置行李'
  },

  // ==========================================
  // --- 6. 緊急求助與醫療 (Emergency & Health) ---
  // ==========================================
  {
    id: 'p-55',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I lost my passport, wallet, and phone. Please help me contact the local police.',
    zh: '我的護照、皮夾和手機遺失了，請幫忙我聯絡當地警察局。',
    situation: '遺失重大證件求救'
  },
  {
    id: 'p-56',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I am feeling severe stomach pain and dizziness. Where is the nearest emergency hospital?',
    zh: '我胃部劇烈絞痛而且感到非常頭暈，請問最近的急診醫院在哪裡？',
    situation: '突發急性重病求醫'
  },
  {
    id: 'p-57',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'Someone call an ambulance immediately! It is an emergency!',
    zh: '誰來趕快叫救護車！情況非常緊急！',
    situation: '現場發生危急事故'
  },
  {
    id: 'p-58',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'My wallet was stolen by a pickpocket on the subway. I need to file a police report.',
    zh: '我的皮夾在地鐵被扒手偷走了，我需要製作警察報案紀錄以申請保險理賠。',
    situation: '遭遇竊盜報警做筆錄'
  },
  {
    id: 'p-59',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'Do you have an English-speaking doctor on duty right now?',
    zh: '請問現在有會說英語的醫師在值班嗎？',
    situation: '醫院掛號溝通'
  },
  {
    id: 'p-60',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I have a high fever, a sore throat, and chills. What medicine do you recommend?',
    zh: '我現在發高燒、喉嚨劇痛而且全身發冷，請問您推薦什麼成藥？',
    situation: '藥局向藥師諮詢購買成藥'
  },
  {
    id: 'p-61',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I have travel medical insurance. Could you please provide an itemized medical bill and receipt?',
    zh: '我有投保海外海外旅遊醫療險，可以請您提供明細醫療帳單與收據嗎？',
    situation: '看診後索取保險理賠單據'
  },
  {
    id: 'p-62',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'Where can I buy emergency contraception / motion sickness pills?',
    zh: '請問在哪裡可以買到暈車/暈船藥？',
    situation: '藥局購買防暈藥物'
  },
  {
    id: 'p-63',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I am lost. Can you show me where I am on Google Maps?',
    zh: '我迷路了，可以請你在 Google 地圖上指出我現在的位置嗎？',
    situation: '迷路求助路人'
  },
  {
    id: 'p-64',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'Please help me contact my embassy or consulate as soon as possible.',
    zh: '請儘速協助我聯絡我國的大使館或代表處。',
    situation: '遇重大人身安全事故時'
  }
];
