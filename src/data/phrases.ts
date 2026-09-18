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
  },
  // --- 擴充會話手冊 (p-65 ~ p-100) ---
  {
    id: 'p-65',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Do I need to take out my laptop and liquids from my bag at security?',
    zh: '過安檢時我需要將筆記型電腦與液體從小包包裡拿出來嗎？',
    situation: '安檢 X 光機檢查時'
  },
  {
    id: 'p-66',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'My flight was delayed for over 4 hours. Can you issue a flight delay certificate for insurance?',
    zh: '我的班機延誤超過四小時，可以請航空公司開立班機延誤證明供保險理賠嗎？',
    situation: '向地勤索取班機延誤證明'
  },
  {
    id: 'p-67',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Where is the duty-free pick-up counter for online pre-orders?',
    zh: '請問預先在網路上訂購的免稅品提貨櫃台在哪裡？',
    situation: '免稅品線上提貨'
  },
  {
    id: 'p-68',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Is there a hair dryer in the room, or do I need to borrow one from the front desk?',
    zh: '請問房間裡有吹風機嗎？還是需要向櫃台借用？',
    situation: '確認房內吹風機備品'
  },
  {
    id: 'p-69',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Could we request an extra rollaway bed for our room? How much is the surcharge per night?',
    zh: '我們房間可以申請加一張折疊床嗎？每晚加收多少費用？',
    situation: '多人同住申請加床'
  },
  {
    id: 'p-70',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Where is the meeting point for the airport shuttle bus?',
    zh: '請問機場接駁巴士的集合搭車點在哪裡？',
    situation: '飯店門口搭乘接駁車'
  },
  {
    id: 'p-71',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'We are leaving for a 2-day island trip. Can we store our large bags here until we return?',
    zh: '我們要去外島玩兩天，可以把大件行李寄放在這裡直到我們回來入住嗎？',
    situation: '跨日寄放大型行李'
  },
  {
    id: 'p-72',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Excuse me, could we move to that table by the window instead?',
    zh: '不好意思，我們可以換到靠窗邊的那張桌子嗎？',
    situation: '進餐廳要求更換座位'
  },
  {
    id: 'p-73',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Please, no cilantro (coriander) and no onions on my noodles.',
    zh: '我的麵裡請千萬不要加香菜，也不要加洋蔥。',
    situation: '避開特殊辛香料點餐'
  },
  {
    id: 'p-74',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Is this dish very spicy? Could you make it mild, please?',
    zh: '這道料理會很辣嗎？可以幫我做微辣或不辣嗎？',
    situation: '調整辣度'
  },
  {
    id: 'p-75',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Could you tell me where the restroom is located, please?',
    zh: '可以麻煩告訴我化妝室/洗手間在哪裡嗎？',
    situation: '詢問洗手間位置'
  },
  {
    id: 'p-76',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Do you have a baby high chair available for our toddler?',
    zh: '請問店裡有提供小幼童專用的兒童高腳餐椅嗎？',
    situation: '帶小朋友用餐索取兒童椅'
  },
  {
    id: 'p-77',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'What kind of salad dressings do you offer? Ranch, Italian, or balsamic vinaigrette?',
    zh: '請問你們提供哪些沙拉醬？田園醬、義式油醋還是巴薩米克醋？',
    situation: '點沙拉選醬汁'
  },
  {
    id: 'p-78',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Do you have this in other colors like navy blue or olive green?',
    zh: '這件有其他顏色嗎？例如海軍藍或橄欖綠？',
    situation: '詢問其他顏色款式'
  },
  {
    id: 'p-79',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Is the tax refund paid in cash at the airport or credited back to my card?',
    zh: '請問退稅是在機場退領現金，還是直接退刷到我的信用卡上？',
    situation: '確認退稅款項返還方式'
  },
  {
    id: 'p-80',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'If I buy three of these souvenirs, could you do 10% off?',
    zh: '如果我買三個這種紀念品，可以算我九折嗎？',
    situation: '多買爭取折扣'
  },
  {
    id: 'p-81',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'I don\'t need a plastic bag, I brought my own reusable eco-friendly bag.',
    zh: '我不需要塑膠袋，我自己有帶環保購物袋。',
    situation: '結帳自備購物袋環保減塑'
  },
  {
    id: 'p-82',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Could I get an itemized invoice with your tax ID number?',
    zh: '可以給我一張開立有統一統編/稅號的明細發票嗎？',
    situation: '出差報帳索取統一發票'
  },
  {
    id: 'p-83',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Where is the designated pick-up zone for Uber or ride-share cars?',
    zh: '請問 Uber 或網路叫車服務的指定上車接送區在哪裡？',
    situation: '機場或車站尋找叫車接送點'
  },
  {
    id: 'p-84',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'What time does the last subway train depart tonight?',
    zh: '請問今晚地鐵末班車是幾點出發？',
    situation: '夜間遊玩確認末班車'
  },
  {
    id: 'p-85',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'The ticket machine swallowed my cash bill. Who should I contact for help?',
    zh: '自動售票機把我的鈔票吃進去卡住了，我該找誰處理？',
    situation: '售票機故障求助站務員'
  },
  {
    id: 'p-86',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Does this train stop at Victoria Station, or is it an express train that bypasses it?',
    zh: '這班火車會停靠維多利亞站嗎？還是它是跳站過站不停的直達特快車？',
    situation: '上車前確認各停與特快'
  },
  {
    id: 'p-87',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Where can I catch the scenic ferry / cable car to the mountain top?',
    zh: '請問在哪裡可以搭乘觀光渡輪 / 上山頂的觀光纜車？',
    situation: '景點尋找觀光交通工具'
  },
  {
    id: 'p-88',
    category: 'daily',
    categoryLabel: '日常口語',
    en: 'Could you speak a little more slowly, please? My English is a bit rusty.',
    zh: '可以麻煩您說得稍微慢一點點嗎？我的英文稍微有一點生疏。',
    situation: '外國人講太快時最實用禮貌的一句話'
  },
  {
    id: 'p-89',
    category: 'daily',
    categoryLabel: '日常口語',
    en: 'Do you use Instagram or WhatsApp? Let\'s exchange contacts!',
    zh: '你有用 Instagram 或 WhatsApp 嗎？我們互相加個聯絡方式吧！',
    situation: '旅途中與新朋友交換社群'
  },
  {
    id: 'p-90',
    category: 'daily',
    categoryLabel: '日常口語',
    en: 'What do you recommend as a fun hidden gem around here that tourists don\'t know about?',
    zh: '你推薦這附近有什麼觀光客不知道、非常有趣的私房秘境景點嗎？',
    situation: '向在地當地人請教私房景點'
  },
  {
    id: 'p-91',
    category: 'daily',
    categoryLabel: '日常口語',
    en: 'What time should we meet up tomorrow morning in the hotel lobby?',
    zh: '我們明天早上幾點在飯店大廳集合碰面？',
    situation: '與旅伴約定集合時間'
  },
  {
    id: 'p-92',
    category: 'daily',
    categoryLabel: '日常口語',
    en: 'Could you do me a favor and take a quick photo of us with this monument?',
    zh: '可以麻煩你幫個忙，幫我們以這座紀念碑為背景拍張合照嗎？',
    situation: '景點請路人幫忙拍照'
  },
  {
    id: 'p-93',
    category: 'daily',
    categoryLabel: '日常口語',
    en: 'Just press this button right here to take the picture. One more, please!',
    zh: '按這裡這個按鈕就可以拍照了，麻煩再幫我們拍一張，謝謝！',
    situation: '請人拍照時引導按鍵'
  },
  {
    id: 'p-94',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'The ATM swallowed my credit card. Is there an emergency service hotline number?',
    zh: '提款機把我的信用卡吃掉了，請問有緊急客服服務專線可以撥打嗎？',
    situation: '國外 ATM 提款卡被吞'
  },
  {
    id: 'p-95',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'One of the wheels on my suitcase was broken during transit. I need to file a damage claim.',
    zh: '我的行李箱輪子在航空運送過程中被摔斷破壞了，我需要申報行李損壞理賠。',
    situation: '領行李發現行李箱被摔壞索賠'
  },
  {
    id: 'p-96',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I need an English-to-Mandarin interpreter or a real-time translation service, please.',
    zh: '我需要一位英翻中口譯員或即時翻譯服務，麻煩請協助。',
    situation: '醫院或警局需要官方翻譯'
  },
  {
    id: 'p-97',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I got stung by a bee / jellyfish. Do you have any antiseptic cream or vinegar?',
    zh: '我被蜜蜂叮了 / 我被水母螫傷了，請問有消毒藥膏或食用白醋嗎？',
    situation: '海邊或戶外意外螫傷急救'
  },
  {
    id: 'p-98',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'Is there a dental clinic nearby? I have a sudden unbearable toothache.',
    zh: '請問附近有牙醫診所嗎？我突發劇烈、無法忍受的牙痛。',
    situation: '旅途中突發劇烈牙痛'
  },
  {
    id: 'p-99',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'Please stop the vehicle immediately! My friend is getting carsick and needs fresh air.',
    zh: '請立刻靠邊停車！我的朋友暈車非常嚴重，需要下車呼吸新鮮空氣。',
    situation: '長途搭車嚴重暈車'
  },
  {
    id: 'p-100',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I have diabetes and need to keep my insulin medication refrigerated. Could you assist me?',
    zh: '我有糖尿病，需要將胰島素藥品冷藏保存，請問可以協助冷藏嗎？',
    situation: '向飯店或機組人員請求冷藏特殊藥品'
  },
  // ==========================================
  // --- 8. 青年旅館與社交破冰 (Hostel & Social Icebreakers) ---
  // ==========================================
  {
    id: 'p-101',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Hi there! Is anyone sitting here? Do you mind if I join you?',
    zh: '嗨！這裡有人坐嗎？介意我坐你旁邊一起聊聊嗎？',
    situation: '在青旅交誼廳或咖啡廳主動搭訕拼桌'
  },
  {
    id: 'p-102',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Where are you from, and how long have you been on the road?',
    zh: '你來自哪裡？你出來旅行多久了呢？',
    situation: '旅人間最經典不敗的破冰開場白'
  },
  {
    id: 'p-103',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'What brings you to this city? Any cool places you\'ve visited so far?',
    zh: '是什麼契機讓你來到這座城市？目前有去過什麼很酷的地方嗎？',
    situation: '詢問對方的旅遊動機與心得'
  },
  {
    id: 'p-104',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'I\'m looking for some hidden gems. What would you recommend around here?',
    zh: '我想找一些在地私房秘境，你有推薦這附近什麼好地方嗎？',
    situation: '向其他旅人或在地店員索取私房景點建議'
  },
  {
    id: 'p-105',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Where are you heading next after this trip?',
    zh: '這趟旅行結束後，你接下來打算去哪裡？',
    situation: '聊旅人未來的旅行路線與計畫'
  },
  {
    id: 'p-106',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'We\'re going to grab some authentic street food tonight. Care to join us?',
    zh: '我們今晚打算去吃道地的街頭小吃，要不要一起來？',
    situation: '主動邀約其他背包客一起晚餐'
  },
  {
    id: 'p-107',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Cheers! What local beer or cocktail do you like best here?',
    zh: '乾杯！你在這裡最喜歡哪一種在地啤酒或調酒？',
    situation: '在酒吧或聚會舉杯聊天'
  },
  {
    id: 'p-108',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Are you traveling solo or with a group of friends?',
    zh: '你是一個人獨旅，還是跟一群朋友出來玩？',
    situation: '了解對方的旅行模式'
  },
  {
    id: 'p-109',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Do you work remotely while traveling, or are you on holiday?',
    zh: '你是邊旅行邊遠端工作（數位遊民），還是純粹來度假放空？',
    situation: '聊彼此的工作型態與生活方式'
  },
  {
    id: 'p-110',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Could you take a quick photo of me with this monument in the background?',
    zh: '可以麻煩你以這座紀念碑為背景，幫我拍張照片嗎？',
    situation: '請路人旅伴幫忙拍照'
  },
  {
    id: 'p-111',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Let me take one for you in return! Portrait or landscape mode?',
    zh: '換我幫你拍幾張吧！你想要直向還是橫向構圖？',
    situation: '禮貌主動回饋幫對方拍照'
  },
  {
    id: 'p-112',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'I had such a great time chatting with you today!',
    zh: '今天跟你聊天真的非常開心！',
    situation: '相談甚歡準備告別時表達謝意'
  },
  {
    id: 'p-113',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Let\'s exchange Instagram or WhatsApp so we can keep in touch.',
    zh: '我們交換一下 Instagram 或 WhatsApp，保持聯絡吧！',
    situation: '互留聯絡方式保持友誼'
  },
  {
    id: 'p-114',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'If you ever come visit Taiwan, let me know and I\'ll show you around!',
    zh: '如果你未來有機會來台灣玩，一定要告訴我，我帶你到處走走！',
    situation: '熱情邀請對方未來到自己家鄉旅遊'
  },
  {
    id: 'p-115',
    category: 'social',
    categoryLabel: '社交破冰',
    en: 'Safe travels on the rest of your adventure! Take care!',
    zh: '祝你接下來的冒險旅程一路順風平安！保重！',
    situation: '向即將出發啟程的旅伴道別祝福'
  },
  // ==========================================
  // --- 9. 文化生活與深度探索 (Culture & Lifestyle) ---
  // ==========================================
  {
    id: 'p-116',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'What is the history behind this traditional ceremony?',
    zh: '這項傳統祭典儀式背後有什麼樣的歷史故事呢？',
    situation: '參加當地節慶時向導遊或當地人請益'
  },
  {
    id: 'p-117',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'Is there any specific dress code or etiquette I should be aware of inside the temple?',
    zh: '進入這座寺廟參觀，有任何特定的穿著規定或禮節需要注意嗎？',
    situation: '進入宗教聖地或古蹟前確認禮節'
  },
  {
    id: 'p-118',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'What is the most traditional dish that locals truly eat on a daily basis?',
    zh: '當地居民平常日常真正最愛吃的道地傳統料理是什麼？',
    situation: '詢問店員避開觀光客菜單、探尋在地真實美食'
  },
  {
    id: 'p-119',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'How do people usually celebrate this festival around here?',
    zh: '這裡的人們通常都怎麼慶祝這個特別的節日呢？',
    situation: '聊節慶風俗民情'
  },
  {
    id: 'p-120',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'The architecture here is such a stunning blend of classical and modern styles.',
    zh: '這裡的建築風格真是太令人驚艷了，完美融合了古典與現代風貌。',
    situation: '讚嘆當地的城鎮街景與建築美學'
  },
  {
    id: 'p-121',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'Could you tell me what this symbol represents in local folklore?',
    zh: '您可以跟我說說這個圖騰符號在在地民間傳說中代表什麼涵義嗎？',
    situation: '參觀博物館或手工藝品店時提問'
  },
  {
    id: 'p-122',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'I find the relaxed lifestyle here so refreshing compared to the frantic city pace.',
    zh: '相較於大城市的匆忙步調，我覺得這裡悠閒放鬆的生活節奏讓人耳目一新。',
    situation: '與當地居民分享彼此生活型態的感受'
  },
  {
    id: 'p-123',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'Is this handicraft made using traditional methods by local artisans?',
    zh: '這件手工藝品是由當地匠人採用傳統古法手工打造的嗎？',
    situation: '在市集欣賞匠人手工藝品'
  },
  {
    id: 'p-124',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'What surprised me most is how warm and welcoming everyone has been to strangers.',
    zh: '最讓我驚喜感動的是，大家對外來陌生人都如此溫暖友善且熱情相待。',
    situation: '由衷讚賞當地人的好客與善良'
  },
  {
    id: 'p-125',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'Could you recommend an art gallery or live music venue popular with locals?',
    zh: '你能推薦一間受當地文青喜愛的藝廊或現場獨立音樂空間嗎？',
    situation: '尋找深度文藝或音樂體驗'
  },
  {
    id: 'p-126',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'In my home country, we usually do it differently. Let me show you!',
    zh: '在我們家鄉，我們通常有不一樣的習慣做法，我來示範給你看！',
    situation: '分享跨文化交流與彼此習俗'
  },
  {
    id: 'p-127',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'What is the customary way to show appreciation to the host here?',
    zh: '在當地習俗中，要向招待的屋主表達感謝的最恰當方式是什麼？',
    situation: '寄宿家庭或作客時展現教養'
  },
  {
    id: 'p-128',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'The panoramic view from the summit was completely breathtaking and timeless.',
    zh: '從山頂俯瞰的環景全貌真是美到令人屏息，充滿永恆的史詩感。',
    situation: '與旅伴分享登山或登頂的心情震撼'
  },
  {
    id: 'p-129',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'Visiting this historic neighborhood truly broadened my perspective on the region.',
    zh: '探訪這個歷史悠久的舊街區，著實大大開拓了我對這片土地的歷史視野。',
    situation: '總結深度古蹟走讀的心得'
  },
  {
    id: 'p-130',
    category: 'culture',
    categoryLabel: '文化生活',
    en: 'Traveling really proves that despite our different languages, our hearts feel the same.',
    zh: '旅行真的證明了一件事：儘管我們語言各異，但人與人之間的心靈感受是相通的。',
    situation: '深夜暢聊感悟人生的旅行金句'
  },
  // ==========================================
  // --- 10. 現代數位與 3C 通訊 (Digital Travel & Tech) ---
  // ==========================================
  {
    id: 'p-131',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'Excuse me, is there a power outlet where I could charge my phone?',
    zh: '不好意思，請問這裡有插座可以讓我充一下手機嗎？',
    situation: '在咖啡廳或候機室尋找插座充電'
  },
  {
    id: 'p-132',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'Do you accept contactless tap to pay with Apple Pay here?',
    zh: '請問你們這裡接受 Apple Pay 感應付款嗎？',
    situation: '結帳時詢問手機感應支付'
  },
  {
    id: 'p-133',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'My portable power bank is 10,000 mAh. Is it permitted in my carry-on luggage?',
    zh: '我的行動電源是 10,000 mAh，請問可以放在隨身手提行李帶上飛機嗎？',
    situation: '安檢時主動確認行動電源規格'
  },
  {
    id: 'p-134',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'I installed an eSIM but cannot get any cellular data signal. Could you help me configure it?',
    zh: '我安裝了虛擬 eSIM 卻收不到行動數據訊號，可以麻煩您幫我設定檢查一下嗎？',
    situation: '在電信櫃台求助設定 eSIM'
  },
  {
    id: 'p-135',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'My battery is almost dead. Do you sell Type-C charging cables or rental power banks?',
    zh: '我的手機快沒電了，請問你們有賣 Type-C 充電線或提供共享行動電源租借嗎？',
    situation: '手機沒電時向超商或店家求助'
  },
  {
    id: 'p-136',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'We want to rent a car with full collision damage waiver and unlimited mileage.',
    zh: '我們想租一輛車，並加購全額車損免責險 (CDW) 以及不限里程。',
    situation: '租車櫃台辦理取車手續'
  },
  {
    id: 'p-137',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'Is the mountain hiking trail open today, or is it closed due to severe weather?',
    zh: '今天這條登山健行步道有開放嗎？還是因為惡劣天氣封閉了？',
    situation: '出發健行前向國家公園遊客中心確認'
  },
  {
    id: 'p-138',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'Are life jackets included with this snorkeling equipment rental?',
    zh: '租借這套浮潛裝備有包含救生衣嗎？',
    situation: '海邊租借水上運動裝備'
  },
  {
    id: 'p-139',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'Does this rental vehicle come with an electronic toll pass for highway toll roads?',
    zh: '這輛租賃車有內建行駛高速公路收費站用的電子自動扣款感應卡嗎？',
    situation: '自駕出發前確認收費站扣款'
  },
  {
    id: 'p-140',
    category: 'digital',
    categoryLabel: '數位通訊',
    en: 'Warning: Beware of dangerous rip currents; please swim only within the patrolled red and yellow flags.',
    zh: '警告：注意危險離岸暗流；請務必僅在紅黃雙色旗巡邏守護範圍內游泳。',
    situation: '海邊戲水安全防範指示'
  },
  // ==========================================
  // --- 11. 爭議維權與酒吧社交 (Disputes & Nightlife) ---
  // ==========================================
  {
    id: 'p-141',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'Excuse me, I believe there is an overcharge on this receipt. Could you double-check it?',
    zh: '不好意思，我認為這張收據上有算錯多收的費用，可以麻煩您幫我重新核對一下嗎？',
    situation: '發現帳單金額有出入時禮貌維權'
  },
  {
    id: 'p-142',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'Our flight has been delayed for over five hours. What compensation or meal vouchers can you provide?',
    zh: '我們的班機延誤超過五小時了，請問貴公司能提供什麼樣的索賠補償或免費餐券？',
    situation: '班機嚴重延誤時向航空公司地勤爭取權益'
  },
  {
    id: 'p-143',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'The air conditioner in our room is completely out of order. Could you send someone to fix it or change our room?',
    zh: '我們房間的冷氣完全壞掉無法運轉，可以派人來修繕或幫我們更換房間嗎？',
    situation: '向飯店櫃檯反映客房設施故障並要求換房'
  },
  {
    id: 'p-144',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'Since the activity was cancelled on your end due to engine failure, I would like a full refund.',
    zh: '既然該行程是因為貴方引擎故障而取消的，我要求全額退款。',
    situation: '因業者過失取消時要求全額退款'
  },
  {
    id: 'p-145',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'Could I speak with the duty manager regarding this unresolved issue, please?',
    zh: '針對這個遲遲未解決的問題，我可以請值班經理出面說明嗎？',
    situation: '基層人員無法解決問題時請求主管介入'
  },
  {
    id: 'p-146',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'What beers do you have on tap, and is it currently happy hour?',
    zh: '你們目前有哪幾款生啤酒有拉霸供應？現在是歡樂時光優惠時段嗎？',
    situation: '進酒吧最地道、最懂行的點酒問法'
  },
  {
    id: 'p-147',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'I\'ll have a glass of your house red wine and a gin and tonic on the rocks, please.',
    zh: '麻煩給我一杯你們餐廳特選的招牌紅酒，以及一杯琴湯尼調酒加冰塊。',
    situation: '在餐酒館或酒吧點酒'
  },
  {
    id: 'p-148',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'I don\'t drink alcohol tonight. Do you have any signature mocktails?',
    zh: '我今晚不喝酒，請問你們有什麼招牌無酒精特調飲品推薦嗎？',
    situation: '不喝酒時點選特色軟飲'
  },
  {
    id: 'p-149',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'Could you keep the tab open for now? We\'ll close it and pay together later.',
    zh: '可以先幫我們保留酒帳不結算嗎？我們稍後走的時候再一起刷卡付清。',
    situation: '在酒吧押卡開酒帳 (open a tab)'
  },
  {
    id: 'p-150',
    category: 'service',
    categoryLabel: '爭議酒吧',
    en: 'Could we split the bill evenly between the three of us?',
    zh: '我們可以把這筆帳單在我們三人之間平均平分各自分開刷卡嗎？',
    situation: '聚餐結帳時請求 AA 制均攤付款'
  }
];
