import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { WordItem } from '../types';
import { speakText, triggerHaptic } from '../utils/speech';
import { saveCustomWord } from '../utils/storage';
import { SENTENCE_DICTIONARY } from '../data/sentenceDictionary';
import { Volume2, ExternalLink, X, BookOpen, Plus, Check } from 'lucide-react';

interface InteractiveSentenceProps {
  sentence: string;
  translation?: string;
  wordsPool?: WordItem[];
  speechRate?: number;
  speechLang?: string;
  className?: string;
  isDark?: boolean;
  onWordSaved?: () => void;
}

// 常用高頻動詞片語與慣用語 (Phrasal Verbs & Idioms) 智慧辨識庫
const PHRASAL_VERBS_MAP: Record<string, { base: string; pos: string; trans: string; explanation?: string; phonetic?: string }> = {
  // turn out 系列
  'turn out': { base: 'turn out', pos: 'phr v.', trans: '結果是、原來是、最終發現', explanation: '由 turn (轉向) + out (向外) 組成，表示事情發展揭曉的最終結果', phonetic: '/tɜ:rn aʊt/' },
  'turned out': { base: 'turn out', pos: 'phr v.', trans: '結果是、原來是 (過去式)', explanation: '由 turn + out 組成，表示事情發展揭曉的最終結果 (如 It turned out that...)', phonetic: '/tɜ:rnd aʊt/' },
  'turns out': { base: 'turn out', pos: 'phr v.', trans: '結果是、原來是 (第三人稱單數)', explanation: '口語常作 Turns out (that)...', phonetic: '/tɜ:rnz aʊt/' },
  'turning out': { base: 'turn out', pos: 'phr v.', trans: '結果演變為... (進行式)', explanation: '表示事情發展進展', phonetic: '/ˈtɜ:rnɪŋ aʊt/' },

  // check in / out 系列
  'check in': { base: 'check in', pos: 'phr v.', trans: '辦理報到、登記手續 (飯店入住/機場登機)', explanation: '抵達時向櫃檯登記報到', phonetic: '/tʃek ɪn/' },
  'checked in': { base: 'check in', pos: 'phr v.', trans: '辦理報到手續 (過去式)', explanation: '已完成登機或入住登記', phonetic: '/tʃekt ɪn/' },
  'check out': { base: 'check out', pos: 'phr v.', trans: '退房、結帳離開；檢查查看', explanation: '離店時結清帳單', phonetic: '/tʃek aʊt/' },
  'checked out': { base: 'check out', pos: 'phr v.', trans: '辦理退房手續 (過去式)', explanation: '已完成退房結帳', phonetic: '/tʃekt aʊt/' },

  // pick up / drop off
  'pick up': { base: 'pick up', pos: 'phr v.', trans: '接送、領取 (行李/票券)、拿起', explanation: '去特定地點接人或取件', phonetic: '/pɪk ʌp/' },
  'picked up': { base: 'pick up', pos: 'phr v.', trans: '接送、領取 (過去式)', explanation: '已取件或接載完畢', phonetic: '/pɪkt ʌp/' },
  'drop off': { base: 'drop off', pos: 'phr v.', trans: '放客下車、繳還 (租車/借物)', explanation: '順路載人抵達或歸還車輛', phonetic: '/drɑ:p ɔ:f/' },
  'dropped off': { base: 'drop off', pos: 'phr v.', trans: '放客下車、繳還 (過去式)', explanation: '已還車或完成送達', phonetic: '/drɑ:pt ɔ:f/' },

  // take off
  'take off': { base: 'take off', pos: 'phr v.', trans: '(飛機) 起飛；脫下 (衣物)', explanation: '指飛機升空離開跑道，或脫去外套鞋帽', phonetic: '/teɪk ɔ:f/' },
  'took off': { base: 'take off', pos: 'phr v.', trans: '(飛機) 起飛；脫下 (過去式)', explanation: '飛機已升空', phonetic: '/tʊk ɔ:f/' },
  'taking off': { base: 'take off', pos: 'phr v.', trans: '(飛機) 起飛中 (進行式)', explanation: '正在加速升空中', phonetic: '/ˈteɪkɪŋ ɔ:f/' },

  // figure out / find out
  'figure out': { base: 'figure out', pos: 'phr v.', trans: '搞清楚、弄明白、想出解決辦法', explanation: '經由思考或觀察摸索出答案', phonetic: '/ˈfɪɡjər aʊt/' },
  'figured out': { base: 'figure out', pos: 'phr v.', trans: '搞清楚、弄明白 (過去式)', explanation: '已經理清頭緒', phonetic: '/ˈfɪɡjərd aʊt/' },
  'find out': { base: 'find out', pos: 'phr v.', trans: '發現、查明、打聽得知', explanation: '探聽或獲知未知資訊', phonetic: '/faɪnd aʊt/' },
  'found out': { base: 'find out', pos: 'phr v.', trans: '發現、查明 (過去式)', explanation: '已獲知相關資訊', phonetic: '/faʊnd aʊt/' },

  // look forward to
  'look forward to': { base: 'look forward to', pos: 'phr v.', trans: '滿心期待、盼望 (後接名詞/Ving)', explanation: '帶著興奮的心情等待某事到來', phonetic: '/lʊk ˈfɔ:rwərd tu:/' },
  'looking forward to': { base: 'look forward to', pos: 'phr v.', trans: '正滿心期待著', explanation: '社交信件與會話極常用的結尾敬語', phonetic: '/ˈlʊkɪŋ ˈfɔ:rwərd tu:/' },
  'looked forward to': { base: 'look forward to', pos: 'phr v.', trans: '期待、盼望 (過去式)', explanation: '過去所期待之事', phonetic: '/lʊkt ˈfɔ:rwərd tu:/' },

  // run out of
  'run out of': { base: 'run out of', pos: 'phr v.', trans: '用光、耗盡 (電量/水/現金/時間)', explanation: '某種消耗品或資源見底', phonetic: '/rʌn aʊt əv/' },
  'ran out of': { base: 'run out of', pos: 'phr v.', trans: '用光、耗盡 (過去式)', explanation: '資源已經消耗殆盡', phonetic: '/ræn aʊt əv/' },

  // catch up
  'catch up': { base: 'catch up', pos: 'phr v.', trans: '敘舊、聊近況；趕上進度', explanation: '很久沒見的朋友更新彼此近況', phonetic: '/kætʃ ʌp/' },
  'caught up': { base: 'catch up', pos: 'phr v.', trans: '敘舊、聊近況 (過去式)', explanation: '已敘舊或趕上進度', phonetic: '/kɔ:t ʌp/' },

  // get along
  'get along': { base: 'get along', pos: 'phr v.', trans: '相處融洽、合得來', explanation: '彼此互動順暢無摩擦 (get along with someone)', phonetic: '/ɡet əˈlɔ:ŋ/' },
  'got along': { base: 'get along', pos: 'phr v.', trans: '相處融洽 (過去式)', explanation: '彼此相處很好', phonetic: '/ɡɑ:t əˈlɔ:ŋ/' },

  // come across
  'come across': { base: 'come across', pos: 'phr v.', trans: '偶然遇見、碰巧發現', explanation: '非刻意尋找卻巧遇', phonetic: '/kʌm əˈkrɔ:s/' },
  'came across': { base: 'come across', pos: 'phr v.', trans: '偶然遇見、碰巧發現 (過去式)', explanation: '巧遇某人或發現某物', phonetic: '/keɪm əˈkrɔ:s/' },

  // set off / out
  'set off': { base: 'set off', pos: 'phr v.', trans: '出發、啟程、動身', explanation: '開始一趟旅程或行動', phonetic: '/set ɔ:f/' },
  'set out': { base: 'set out', pos: 'phr v.', trans: '出發、著手進行', explanation: '啟程或開始一項計畫', phonetic: '/set aʊt/' },

  // fill out
  'fill out': { base: 'fill out', pos: 'phr v.', trans: '填寫 (表格/入境卡/申請單)', explanation: '將空欄逐項填妥完整', phonetic: '/fɪl aʊt/' },
  'filled out': { base: 'fill out', pos: 'phr v.', trans: '填寫 (過去式)', explanation: '已填妥表格', phonetic: '/fɪld aʊt/' },

  // make sure
  'make sure': { base: 'make sure', pos: 'idiom', trans: '確認、確保、務必', explanation: '檢查以保證無誤 (Make sure to...)', phonetic: '/meɪk ʃʊr/' },
  'made sure': { base: 'make sure', pos: 'idiom', trans: '確認、確保 (過去式)', explanation: '已事先確認', phonetic: '/meɪd ʃʊr/' },

  // in advance
  'in advance': { base: 'in advance', pos: 'adv phr.', trans: '提前、預先、事先', explanation: '事情發生之前就先做好 (Book in advance)', phonetic: '/ɪn ədˈvæns/' },

  // on time / in time
  'on time': { base: 'on time', pos: 'adv phr.', trans: '準時、按時', explanation: '分秒不差依表定時間', phonetic: '/ɑ:n taɪm/' },
  'in time': { base: 'in time', pos: 'adv phr.', trans: '及時、來得及', explanation: '在最後期限或截止前趕上', phonetic: '/ɪn taɪm/' },

  // used to
  'used to': { base: 'used to', pos: 'modal phr.', trans: '過去習慣、曾經 (現在已不如此)', explanation: '過去經常發生的狀態或習慣', phonetic: '/ju:st tu:/' },

  // due to
  'due to': { base: 'due to', pos: 'prep phr.', trans: '由於、因為 (常用於說明原因)', explanation: 'Due to bad weather / delay', phonetic: '/du: tu:/' },
};

// 常見高頻基礎詞速查表 (涵蓋基礎名詞、代名詞、介系詞、連詞與常用形容詞)
const BASIC_COMMON_WORDS: Record<string, { pos: string; trans: string; phonetic?: string }> = {
  // 連接詞與副詞
  'and': { pos: 'conj.', trans: '和、與、而且', phonetic: '/ænd/' },
  'or': { pos: 'conj.', trans: '或者、還是', phonetic: '/ɔ:r/' },
  'but': { pos: 'conj.', trans: '但是、然而', phonetic: '/bʌt/' },
  'so': { pos: 'conj./adv.', trans: '所以、如此', phonetic: '/soʊ/' },
  'also': { pos: 'adv.', trans: '也、並且', phonetic: '/ˈɔ:lsoʊ/' },
  'then': { pos: 'adv.', trans: '然後、當時', phonetic: '/ðen/' },
  'actually': { pos: 'adv.', trans: '實際上、居然、竟然', phonetic: '/ˈæktʃuəli/' },
  'please': { pos: 'adv./v.', trans: '請、拜託；使滿意', phonetic: '/pli:z/' },
  'not': { pos: 'adv.', trans: '不、沒有', phonetic: '/nɑ:t/' },
  'no': { pos: 'adj./adv.', trans: '沒有、不', phonetic: '/noʊ/' },
  'yes': { pos: 'adv.', trans: '是的', phonetic: '/jes/' },
  'ok': { pos: 'adj./adv.', trans: '好的、沒問題', phonetic: '/oʊˈkeɪ/' },
  'okay': { pos: 'adj./adv.', trans: '好的、可以', phonetic: '/oʊˈkeɪ/' },
  'just': { pos: 'adv.', trans: '只是、正好、剛剛', phonetic: '/dʒʌst/' },
  'too': { pos: 'adv.', trans: '太、過於；也', phonetic: '/tu:/' },
  'very': { pos: 'adv.', trans: '非常、很', phonetic: '/ˈveri/' },
  'really': { pos: 'adv.', trans: '真地、確實', phonetic: '/ˈri:əli/' },
  'together': { pos: 'adv.', trans: '一起、共同', phonetic: '/təˈɡeðər/' },
  'here': { pos: 'adv.', trans: '在這裡、往這裡', phonetic: '/hɪr/' },
  'there': { pos: 'adv.', trans: '在那裡、往那裡', phonetic: '/ðer/' },
  'now': { pos: 'adv.', trans: '現在、立刻', phonetic: '/naʊ/' },
  'today': { pos: 'n./adv.', trans: '今天', phonetic: '/təˈdeɪ/' },
  'tomorrow': { pos: 'n./adv.', trans: '明天', phonetic: '/təˈmɔ:roʊ/' },
  'yesterday': { pos: 'n./adv.', trans: '昨天', phonetic: '/ˈjestərdeɪ/' },
  'again': { pos: 'adv.', trans: '再次、又一次', phonetic: '/əˈɡen/' },
  'already': { pos: 'adv.', trans: '已經', phonetic: '/ɔ:lˈredi/' },
  'always': { pos: 'adv.', trans: '總是、一直', phonetic: '/ˈɔ:lweɪz/' },
  'never': { pos: 'adv.', trans: '從不、絕不', phonetic: '/ˈnevər/' },
  'if': { pos: 'conj.', trans: '如果、假使；是否', phonetic: '/ɪf/' },
  'because': { pos: 'conj.', trans: '因為', phonetic: '/bɪˈkɔːz/' },
  'all': { pos: 'adj./pron.', trans: '所有的、全部的', phonetic: '/ɔːl/' },
  'some': { pos: 'adj./pron.', trans: '一些、某些', phonetic: '/sʌm/' },
  'one': { pos: 'num./pron.', trans: '一個、一', phonetic: '/wʌn/' },
  'same': { pos: 'adj.', trans: '相同的、同樣的', phonetic: '/seɪm/' },
  'tonight': { pos: 'n./adv.', trans: '今晚', phonetic: '/təˈnaɪt/' },

  // 代名詞
  'i': { pos: 'pron.', trans: '我 (主格)', phonetic: '/aɪ/' },
  'you': { pos: 'pron.', trans: '你、你們', phonetic: '/ju:/' },
  'your': { pos: 'pron.', trans: '你的、你們的 (所有格)', phonetic: '/jɔ:r/' },
  'my': { pos: 'pron.', trans: '我的 (所有格)', phonetic: '/maɪ/' },
  'me': { pos: 'pron.', trans: '我 (受格)', phonetic: '/mi:/' },
  'he': { pos: 'pron.', trans: '他 (主格)', phonetic: '/hi:/' },
  'him': { pos: 'pron.', trans: '他 (受格)', phonetic: '/hɪm/' },
  'his': { pos: 'pron.', trans: '他的 (所有格)', phonetic: '/hɪz/' },
  'she': { pos: 'pron.', trans: '她 (主格)', phonetic: '/ʃi:/' },
  'her': { pos: 'pron.', trans: '她的 (所有格/受格)', phonetic: '/hɜ:r/' },
  'it': { pos: 'pron.', trans: '它 (主格/受格)', phonetic: '/ɪt/' },
  'its': { pos: 'pron.', trans: '它的 (所有格)', phonetic: '/ɪts/' },
  'we': { pos: 'pron.', trans: '我們 (主格)', phonetic: '/wi:/' },
  'our': { pos: 'pron.', trans: '我們的 (所有格)', phonetic: '/ˈaʊər/' },
  'us': { pos: 'pron.', trans: '我們 (受格)', phonetic: '/ʌs/' },
  'they': { pos: 'pron.', trans: '他們 (主格)', phonetic: '/ðeɪ/' },
  'them': { pos: 'pron.', trans: '他們 (受格)', phonetic: '/ðem/' },
  'their': { pos: 'pron.', trans: '他們的 (所有格)', phonetic: '/ðer/' },
  'this': { pos: 'pron./adj.', trans: '這個', phonetic: '/ðɪs/' },
  'that': { pos: 'pron./conj.', trans: '那個；連接詞 (引導子句)', phonetic: '/ðæt/' },
  'these': { pos: 'pron./adj.', trans: '這些', phonetic: '/ði:z/' },
  'those': { pos: 'pron./adj.', trans: '那些', phonetic: '/ðoʊz/' },
  'what': { pos: 'pron.', trans: '什麼', phonetic: '/wɑ:t/' },
  'where': { pos: 'pron./adv.', trans: '哪裡', phonetic: '/wer/' },
  'when': { pos: 'adv./conj.', trans: '何時、當...的時候', phonetic: '/wen/' },
  'how': { pos: 'adv.', trans: '如何、怎樣', phonetic: '/haʊ/' },
  'who': { pos: 'pron.', trans: '誰', phonetic: '/hu:/' },
  'which': { pos: 'pron./adj.', trans: '哪一個', phonetic: '/wɪtʃ/' },

  // 冠詞與介系詞
  'the': { pos: 'art.', trans: '這/那 (定冠詞)', phonetic: '/ði:/' },
  'a': { pos: 'art.', trans: '一個 (不定冠詞)', phonetic: '/eɪ/' },
  'an': { pos: 'art.', trans: '一個 (母音前不定冠詞)', phonetic: '/æn/' },
  'at': { pos: 'prep.', trans: '在 (特定地點/時刻)', phonetic: '/æt/' },
  'in': { pos: 'prep.', trans: '在...裡面、在 (區域/時間)', phonetic: '/ɪn/' },
  'on': { pos: 'prep.', trans: '在...上面、在 (某日)', phonetic: '/ɑ:n/' },
  'to': { pos: 'prep./to', trans: '到、向、朝著；不定詞', phonetic: '/tu:/' },
  'for': { pos: 'prep.', trans: '為了、給、持續 (時間)', phonetic: '/fɔ:r/' },
  'of': { pos: 'prep.', trans: '...的、屬於、關於', phonetic: '/ʌv/' },
  'with': { pos: 'prep.', trans: '和...一起、用、具有', phonetic: '/wɪð/' },
  'without': { pos: 'prep.', trans: '沒有、無', phonetic: '/wɪˈðaʊt/' },
  'by': { pos: 'prep.', trans: '藉由、在...旁邊、被', phonetic: '/baɪ/' },
  'from': { pos: 'prep.', trans: '來自、從', phonetic: '/frʌm/' },
  'about': { pos: 'prep./adv.', trans: '關於；大約', phonetic: '/əˈbaʊt/' },
  'into': { pos: 'prep.', trans: '進入...之中', phonetic: '/ˈɪntu:/' },
  'out': { pos: 'adv./prep.', trans: '在外面、出來、離開', phonetic: '/aʊt/' },
  'up': { pos: 'adv./prep.', trans: '向上、起來', phonetic: '/ʌp/' },
  'down': { pos: 'adv./prep.', trans: '向下、落下', phonetic: '/daʊn/' },
  'off': { pos: 'adv./prep.', trans: '離開、脫下、關掉', phonetic: '/ɔ:f/' },
  'over': { pos: 'prep.', trans: '在...上方、越過、超過', phonetic: '/ˈoʊvər/' },
  'until': { pos: 'prep./conj.', trans: '直到...為止', phonetic: '/ənˈtɪl/' },
  'after': { pos: 'prep./conj.', trans: '在...之後', phonetic: '/ˈæftər/' },
  'near': { pos: 'prep./adj.', trans: '在...附近、靠近', phonetic: '/nɪr/' },

  // 動詞 (be、助動詞與常用動詞)
  'is': { pos: 'v.', trans: '是 (be動詞單數現在式)', phonetic: '/ɪz/' },
  'are': { pos: 'v.', trans: '是 (be動詞複數現在式)', phonetic: '/ɑ:r/' },
  'was': { pos: 'v.', trans: '是 (be動詞單數過去式)', phonetic: '/wʌz/' },
  'were': { pos: 'v.', trans: '是 (be動詞複數過去式)', phonetic: '/wɜ:r/' },
  'be': { pos: 'v.', trans: '是、存在、成為 (原型)', phonetic: '/bi:/' },
  'been': { pos: 'v.', trans: '是、到過 (過去分詞)', phonetic: '/bɪn/' },
  'being': { pos: 'v.', trans: '正在處於 (進行式)', phonetic: '/ˈbi:ɪŋ/' },
  'have': { pos: 'v.', trans: '有、具備；讓、使得', phonetic: '/hæv/' },
  'has': { pos: 'v.', trans: '有 (第三人稱單數)', phonetic: '/hæz/' },
  'had': { pos: 'v.', trans: '有 (過去式/過去分詞)', phonetic: '/hæd/' },
  'do': { pos: 'v./aux.', trans: '做、執行；助動詞', phonetic: '/du:/' },
  'does': { pos: 'v./aux.', trans: '做 (第三人稱單數)', phonetic: '/dʌz/' },
  'did': { pos: 'v./aux.', trans: '做 (過去式)', phonetic: '/dɪd/' },
  'can': { pos: 'modal', trans: '能夠、可以', phonetic: '/kæn/' },
  'could': { pos: 'modal', trans: '能夠、可以 (禮貌請求)', phonetic: '/kʊd/' },
  'would': { pos: 'modal', trans: '將會、願意 (委婉客氣)', phonetic: '/wʊd/' },
  'will': { pos: 'modal', trans: '將會、願意', phonetic: '/wɪl/' },
  'should': { pos: 'modal', trans: '應該', phonetic: '/ʃʊd/' },
  'may': { pos: 'modal', trans: '也許、可以 (許可)', phonetic: '/meɪ/' },
  'might': { pos: 'modal', trans: '可能、也許', phonetic: '/maɪt/' },
  'must': { pos: 'modal', trans: '必須、一定', phonetic: '/mʌst/' },
  'turn': { pos: 'v./n.', trans: '轉動、轉向；輪流', phonetic: '/tɜ:rn/' },
  'turned': { pos: 'v.', trans: '轉向、轉動 (過去式)', phonetic: '/tɜ:rnd/' },
  'prefer': { pos: 'v.', trans: '更喜歡、偏好', phonetic: '/prɪˈfɜ:r/' },
  'preferred': { pos: 'v.', trans: '更喜歡 (過去式)', phonetic: '/prɪˈfɜ:rd/' },
  'like': { pos: 'v./prep.', trans: '喜歡；像、如同', phonetic: '/laɪk/' },
  'want': { pos: 'v.', trans: '想要', phonetic: '/wɑ:nt/' },
  'wanted': { pos: 'v.', trans: '想要 (過去式)', phonetic: '/ˈwɑ:ntɪd/' },
  'need': { pos: 'v./n.', trans: '需要', phonetic: '/ni:d/' },
  'needed': { pos: 'v.', trans: '需要 (過去式)', phonetic: '/ˈni:dɪd/' },
  'help': { pos: 'v./n.', trans: '幫助、協助', phonetic: '/help/' },
  'helped': { pos: 'v.', trans: '幫助 (過去式)', phonetic: '/helpt/' },
  'share': { pos: 'v./n.', trans: '分享、共有；股份', phonetic: '/ʃer/' },
  'shared': { pos: 'v.', trans: '分享 (過去式)', phonetic: '/ʃerd/' },
  'take': { pos: 'v.', trans: '拿取、搭乘、花費', phonetic: '/teɪk/' },
  'took': { pos: 'v.', trans: '拿取、搭乘 (過去式)', phonetic: '/tʊk/' },
  'get': { pos: 'v.', trans: '得到、前往、變得', phonetic: '/ɡet/' },
  'got': { pos: 'v.', trans: '得到 (過去式)', phonetic: '/ɡɑ:t/' },
  'go': { pos: 'v.', trans: '去、前往', phonetic: '/ɡoʊ/' },
  'went': { pos: 'v.', trans: '去 (過去式)', phonetic: '/went/' },
  'come': { pos: 'v.', trans: '來、抵達', phonetic: '/kʌm/' },
  'came': { pos: 'v.', trans: '來 (過去式)', phonetic: '/keɪm/' },
  'see': { pos: 'v.', trans: '看見、明白', phonetic: '/si:/' },
  'saw': { pos: 'v.', trans: '看見 (過去式)', phonetic: '/sɔ:/' },
  'know': { pos: 'v.', trans: '知道、認識', phonetic: '/noʊ/' },
  'knew': { pos: 'v.', trans: '知道 (過去式)', phonetic: '/nu:/' },
  'say': { pos: 'v.', trans: '說', phonetic: '/seɪ/' },
  'said': { pos: 'v.', trans: '說 (過去式)', phonetic: '/sed/' },
  'tell': { pos: 'v.', trans: '告訴、講述', phonetic: '/tel/' },
  'told': { pos: 'v.', trans: '告訴 (過去式)', phonetic: '/toʊld/' },
  'call': { pos: 'v./n.', trans: '打電話、呼叫；電話', phonetic: '/kɔ:l/' },
  'pay': { pos: 'v./n.', trans: '付款、支付', phonetic: '/peɪ/' },
  'paid': { pos: 'v.', trans: '付款 (過去式)', phonetic: '/peɪd/' },
  'check': { pos: 'v./n.', trans: '檢查、核對；帳單', phonetic: '/tʃek/' },
  'order': { pos: 'v./n.', trans: '點餐、訂購；順序', phonetic: '/ˈɔ:rdər/' },
  'book': { pos: 'v./n.', trans: '預訂；書本', phonetic: '/bʊk/' },
  'booked': { pos: 'v.', trans: '預訂 (過去式)', phonetic: '/bʊkt/' },

  // 名詞與形容詞 (日常旅遊與生活高頻詞)
  'water': { pos: 'n.', trans: '水、飲用水；給...澆水', phonetic: '/ˈwɔ:tər/' },
  'still': { pos: 'adj./adv.', trans: '無氣泡的、平靜的；仍然', phonetic: '/stɪl/' },
  'sparkling': { pos: 'adj.', trans: '起泡的、閃閃發光的', phonetic: '/ˈspɑ:rklɪŋ/' },
  'lemon': { pos: 'n.', trans: '檸檬', phonetic: '/ˈlemən/' },
  'tea': { pos: 'n.', trans: '茶', phonetic: '/ti:/' },
  'coffee': { pos: 'n.', trans: '咖啡', phonetic: '/ˈkɔ:fi/' },
  'beer': { pos: 'n.', trans: '啤酒', phonetic: '/bɪr/' },
  'wine': { pos: 'n.', trans: '葡萄酒、紅酒', phonetic: '/waɪn/' },
  'drink': { pos: 'n./v.', trans: '飲料；喝', phonetic: '/drɪŋk/' },
  'food': { pos: 'n.', trans: '食物、餐點', phonetic: '/fu:d/' },
  'menu': { pos: 'n.', trans: '菜單', phonetic: '/ˈmenju:/' },
  'table': { pos: 'n.', trans: '餐桌、桌子', phonetic: '/ˈteɪbl/' },
  'bill': { pos: 'n.', trans: '帳單、鈔票', phonetic: '/bɪl/' },
  'tip': { pos: 'n./v.', trans: '小費；實用建議、訣竅', phonetic: '/tɪp/' },
  'price': { pos: 'n.', trans: '價格、價錢', phonetic: '/praɪs/' },
  'cash': { pos: 'n.', trans: '現金', phonetic: '/kæʃ/' },
  'card': { pos: 'n.', trans: '卡片、票卡', phonetic: '/kɑ:rd/' },
  'pass': { pos: 'n./v.', trans: '通行證、票券；通過', phonetic: '/pæs/' },
  'boarding': { pos: 'n./adj.', trans: '登機、登船', phonetic: '/ˈbɔ:rdɪŋ/' },
  'ticket': { pos: 'n.', trans: '票券、車票、門票', phonetic: '/ˈtɪkɪt/' },
  'flight': { pos: 'n.', trans: '班機、航程', phonetic: '/flaɪt/' },
  'gate': { pos: 'n.', trans: '登機門、大門', phonetic: '/ɡeɪt/' },
  'seat': { pos: 'n.', trans: '座位', phonetic: '/si:t/' },
  'bag': { pos: 'n.', trans: '提袋、袋子', phonetic: '/bæɡ/' },
  'luggage': { pos: 'n.', trans: '行李', phonetic: '/ˈlʌɡɪdʒ/' },
  'baggage': { pos: 'n.', trans: '行李', phonetic: '/ˈbæɡɪdʒ/' },
  'airport': { pos: 'n.', trans: '機場', phonetic: '/ˈerpɔ:rt/' },
  'station': { pos: 'n.', trans: '車站、局', phonetic: '/ˈsteɪʃn/' },
  'bus': { pos: 'n.', trans: '公車、巴士', phonetic: '/bʌs/' },
  'train': { pos: 'n./v.', trans: '火車；訓練', phonetic: '/treɪn/' },
  'car': { pos: 'n.', trans: '汽車', phonetic: '/kɑ:r/' },
  'taxi': { pos: 'n.', trans: '計程車', phonetic: '/ˈtæksi/' },
  'hotel': { pos: 'n.', trans: '飯店、旅館', phonetic: '/hoʊˈtel/' },
  'room': { pos: 'n.', trans: '房間、空間', phonetic: '/ru:m/' },
  'key': { pos: 'n./adj.', trans: '鑰匙；關鍵', phonetic: '/ki:/' },
  'desk': { pos: 'n.', trans: '櫃檯、書桌', phonetic: '/desk/' },
  'service': { pos: 'n.', trans: '服務', phonetic: '/ˈsɜ:rvɪs/' },
  'friend': { pos: 'n.', trans: '朋友', phonetic: '/frend/' },
  'friends': { pos: 'n.', trans: '朋友們 (複數)', phonetic: '/frendz/' },
  'mutual': { pos: 'adj.', trans: '共同的、互相的', phonetic: '/ˈmju:tʃuəl/' },
  'time': { pos: 'n.', trans: '時間、次數', phonetic: '/taɪm/' },
  'hour': { pos: 'n.', trans: '小時', phonetic: '/ˈaʊər/' },
  'day': { pos: 'n.', trans: '白天、一天', phonetic: '/deɪ/' },
  'days': { pos: 'n.', trans: '歲月、時代、日子 (複數)', phonetic: '/deɪz/' },
  'college': { pos: 'n.', trans: '大學、學院', phonetic: '/ˈkɑ:lɪdʒ/' },
  'good': { pos: 'adj.', trans: '好的、優良的', phonetic: '/ɡʊd/' },
  'great': { pos: 'adj.', trans: '極好的、偉大的', phonetic: '/ɡreɪt/' },
  'fine': { pos: 'adj.', trans: '好的、健康的', phonetic: '/faɪn/' },
  'well': { pos: 'adv./adj.', trans: '很好地；健康', phonetic: '/wel/' },
  'free': { pos: 'adj.', trans: '免費的、自由的', phonetic: '/fri:/' },
  'ready': { pos: 'adj.', trans: '準備好的、現成的', phonetic: '/ˈredi/' },
  'open': { pos: 'adj./v.', trans: '營業中的；打開', phonetic: '/ˈoʊpən/' },
  'closed': { pos: 'adj.', trans: '已打烊的、關閉的', phonetic: '/kloʊzd/' },
  'hot': { pos: 'adj.', trans: '熱的、辣的', phonetic: '/hɑ:t/' },
  'cold': { pos: 'adj.', trans: '冰冷的、冷的', phonetic: '/koʊld/' },
  'ice': { pos: 'n.', trans: '冰塊、冰', phonetic: '/aɪs/' },
  'big': { pos: 'adj.', trans: '大的', phonetic: '/bɪɡ/' },
  'small': { pos: 'adj.', trans: '小的', phonetic: '/smɔ:l/' },
  'fast': { pos: 'adj./adv.', trans: '快速的', phonetic: '/fæst/' },
  'slow': { pos: 'adj./adv.', trans: '緩慢的', phonetic: '/sloʊ/' },
  'late': { pos: 'adj./adv.', trans: '遲的、晚的、延後的', phonetic: '/leɪt/' },
  'fresh': { pos: 'adj.', trans: '新鮮的、嶄新的', phonetic: '/freʃ/' },
  'full': { pos: 'adj.', trans: '完整的、全額的、滿的', phonetic: '/fʊl/' },
  'rough': { pos: 'adj.', trans: '洶湧的、風浪大的、粗糙的', phonetic: '/rʌf/' },
  'dead': { pos: 'adj.', trans: '沒電的、耗盡的、死亡的', phonetic: '/ded/' },
  'family': { pos: 'n.', trans: '家庭、家人', phonetic: '/ˈfæməli/' },
  'hair': { pos: 'n.', trans: '頭髮、毛髮', phonetic: '/her/' },
  'dryer': { pos: 'n.', trans: '吹風機、烘乾機', phonetic: '/ˈdraɪər/' },
  'hall': { pos: 'n.', trans: '大廳、走廊、會堂', phonetic: '/hɔːl/' },
  'market': { pos: 'n.', trans: '市場、市集', phonetic: '/ˈmɑːrkɪt/' },
  'phone': { pos: 'n.', trans: '電話、手機', phonetic: '/foʊn/' },
  'show': { pos: 'v./n.', trans: '出示、展示；表演', phonetic: '/ʃoʊ/' },
  'die': { pos: 'v.', trans: '關機、停擺、死亡', phonetic: '/daɪ/' },
  'died': { pos: 'v.', trans: '沒電關機、停擺 (過去式)', phonetic: '/daɪd/' },
  'run': { pos: 'v.', trans: '進行、運作、跑', phonetic: '/rʌn/' },
  'runs': { pos: 'v.', trans: '進行、營業 (第三人稱單數)', phonetic: '/rʌnz/' },
  'pm': { pos: 'abbr.', trans: '下午、午後 (post meridiem)', phonetic: '/ˌpiː ˈem/' },
};

interface LookupResult {
  word: string;
  baseWord?: string;
  phonetic?: string;
  partOfSpeech?: string;
  translation: string;
  tip?: string;
  source: 'phrasal' | 'vocab' | 'common' | 'online';
}

// 常見不規則動詞過去式與分詞還原表
const IRREGULAR_VERBS_MAP: Record<string, string> = {
  'bought': 'buy', 'took': 'take', 'left': 'leave', 'spent': 'spend', 'saw': 'see',
  'went': 'go', 'came': 'come', 'made': 'make', 'got': 'get', 'flew': 'fly',
  'held': 'hold', 'chose': 'choose', 'felt': 'feel', 'found': 'find', 'swam': 'swim',
  'drove': 'drive', 'wore': 'wear', 'ate': 'eat', 'drank': 'drink', 'slept': 'sleep',
  'caught': 'catch', 'thought': 'think', 'brought': 'bring', 'taught': 'teach',
  'paid': 'pay', 'told': 'tell', 'sold': 'sell', 'built': 'build', 'lost': 'lose',
  'won': 'win', 'spoken': 'speak', 'written': 'write', 'eaten': 'eat', 'flown': 'fly',
  'driven': 'drive', 'chosen': 'choose', 'taken': 'take', 'given': 'give', 'gave': 'give',
  'began': 'begin', 'begun': 'begin', 'broke': 'break', 'broken': 'break', 'stole': 'steal',
  'stolen': 'steal', 'woken': 'wake', 'woke': 'wake', 'fell': 'fall', 'fallen': 'fall',
  'stood': 'stand', 'understood': 'understand', 'sat': 'sit', 'met': 'meet', 'led': 'lead'
};

// 單字獨立精確查詞
const lookupSingleWord = (clean: string, pool: WordItem[]): LookupResult => {
  if (!clean) return { word: clean, translation: '', source: 'online' };

  // 1. 本機核心詞庫精確匹配
  const exact = pool.find(w => w.word.toLowerCase() === clean);
  if (exact) {
    return {
      word: exact.word,
      phonetic: exact.phonetic,
      partOfSpeech: exact.partOfSpeech,
      translation: exact.translation,
      tip: exact.tip,
      source: 'vocab',
    };
  }

  // 2. 常用高頻字速查表 (如 water, pass, still, friend...)
  const basic = BASIC_COMMON_WORDS[clean];
  if (basic) {
    return {
      word: clean,
      phonetic: basic.phonetic,
      partOfSpeech: basic.pos,
      translation: basic.trans,
      source: 'common',
    };
  }

  // 3. 例句全詞庫擴充字典 (覆蓋全站 310+ 生詞例句中所有單詞)
  const dictEntry = SENTENCE_DICTIONARY[clean];
  if (dictEntry) {
    return {
      word: clean,
      phonetic: dictEntry.phonetic,
      partOfSpeech: dictEntry.pos,
      translation: dictEntry.trans,
      source: 'common',
    };
  }

  // 4. 不規則動詞還原 (如 left -> leave, bought -> buy, took -> take)
  if (IRREGULAR_VERBS_MAP[clean]) {
    const baseWord = IRREGULAR_VERBS_MAP[clean];
    const baseExact = pool.find(w => w.word.toLowerCase() === baseWord);
    if (baseExact) {
      return {
        word: clean,
        baseWord,
        phonetic: baseExact.phonetic,
        partOfSpeech: 'v.',
        translation: `${baseExact.translation} (${baseWord} 的過去式/分詞)`,
        tip: baseExact.tip,
        source: 'vocab',
      };
    }
    const baseBasic = BASIC_COMMON_WORDS[baseWord];
    if (baseBasic) {
      return {
        word: clean,
        baseWord,
        phonetic: baseBasic.phonetic,
        partOfSpeech: 'v.',
        translation: `${baseBasic.trans} (${baseWord} 的過去式/分詞)`,
        source: 'common',
      };
    }
    const baseDict = SENTENCE_DICTIONARY[baseWord];
    if (baseDict) {
      return {
        word: clean,
        baseWord,
        phonetic: baseDict.phonetic,
        partOfSpeech: 'v.',
        translation: `${baseDict.trans} (${baseWord} 的過去式/分詞)`,
        source: 'common',
      };
    }
  }

  // 5. 詞形變化還原 (單複數 -s/-es, 過去式 -ed, 進行式 -ing)
  const findCandidate = (stem: string) => {
    const ex = pool.find(w => w.word.toLowerCase() === stem);
    if (ex) {
      return { word: ex.word, translation: ex.translation, partOfSpeech: ex.partOfSpeech, phonetic: ex.phonetic, tip: ex.tip };
    }
    const b = BASIC_COMMON_WORDS[stem];
    if (b) {
      return { word: stem, translation: b.trans, partOfSpeech: b.pos, phonetic: b.phonetic };
    }
    const d = SENTENCE_DICTIONARY[stem];
    if (d) {
      return { word: stem, translation: d.trans, partOfSpeech: d.pos, phonetic: d.phonetic };
    }
    return null;
  };

  let stemObj: { word: string; translation: string; partOfSpeech?: string; phonetic?: string; tip?: string } | null = null;
  if (clean.endsWith('es')) {
    stemObj = findCandidate(clean.slice(0, -2));
  } else if (clean.endsWith('s')) {
    stemObj = findCandidate(clean.slice(0, -1));
  } else if (clean.endsWith('ed')) {
    stemObj = findCandidate(clean.slice(0, -2)) || findCandidate(clean.slice(0, -1));
  } else if (clean.endsWith('ing')) {
    stemObj = findCandidate(clean.slice(0, -3)) || findCandidate(clean.slice(0, -3) + 'e');
  }

  if (stemObj) {
    return {
      word: clean,
      baseWord: stemObj.word,
      phonetic: stemObj.phonetic,
      partOfSpeech: stemObj.partOfSpeech,
      translation: `${stemObj.translation} (${stemObj.word} 的變化型)`,
      tip: stemObj.tip,
      source: 'common',
    };
  }

  // 6. 線上辭典
  return {
    word: clean,
    translation: '',
    source: 'online',
  };
};

interface PhraseCandidate {
  text: string;
  tokenIndices: number[];
  isFirstWord: boolean;
  isLastWord: boolean;
}

export const InteractiveSentence: React.FC<InteractiveSentenceProps> = ({
  sentence,
  translation,
  wordsPool = [],
  speechRate = 0.9,
  speechLang = 'en-US',
  className = '',
  isDark = false,
  onWordSaved,
}) => {
  // 片語資料與單詞資料 (允許兩者共存並可雙向切換)
  const [phraseData, setPhraseData] = useState<{ result: LookupResult; tokenIndices: number[] } | null>(null);
  const [singleData, setSingleData] = useState<{ result: LookupResult; tokenIndices: number[] } | null>(null);
  const [activeMode, setActiveMode] = useState<'phrase' | 'single'>('single');
  const [selectedTokenIndices, setSelectedTokenIndices] = useState<number[]>([]);
  const [customMeaning, setCustomMeaning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // 切割單字與標點符號
  const tokens = sentence.split(/([a-zA-Z'-]+)/g);

  // 提取所有純英文單字及其 tokenIndex，用於相鄰片語精確推斷
  const wordTokens = tokens
    .map((tok, idx) => ({
      raw: tok,
      clean: tok.trim().toLowerCase().replace(/[^a-z]/g, ''),
      tokenIndex: idx,
    }))
    .filter(t => t.clean.length > 0);

  const handleWordClick = (token: string, tokenIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = token.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return;

    triggerHaptic('light');

    // 尋找當前單字在 wordTokens 序列中的位置
    const currIdx = wordTokens.findIndex(t => t.tokenIndex === tokenIndex);

    // 僅在「緊鄰當前點擊單字」的前後範圍尋找組合候選 (排除全文亂匹配)
    const phraseCandidates: PhraseCandidate[] = [];
    if (currIdx >= 0) {
      const p2 = wordTokens[currIdx - 2];
      const p1 = wordTokens[currIdx - 1];
      const c0 = wordTokens[currIdx];
      const n1 = wordTokens[currIdx + 1];
      const n2 = wordTokens[currIdx + 2];

      // 3 詞片語
      if (c0 && n1 && n2) {
        phraseCandidates.push({
          text: `${c0.clean} ${n1.clean} ${n2.clean}`,
          tokenIndices: [c0.tokenIndex, n1.tokenIndex, n2.tokenIndex],
          isFirstWord: true,
          isLastWord: false,
        });
      }
      if (p1 && c0 && n1) {
        phraseCandidates.push({
          text: `${p1.clean} ${c0.clean} ${n1.clean}`,
          tokenIndices: [p1.tokenIndex, c0.tokenIndex, n1.tokenIndex],
          isFirstWord: false,
          isLastWord: false,
        });
      }
      if (p2 && p1 && c0) {
        phraseCandidates.push({
          text: `${p2.clean} ${p1.clean} ${c0.clean}`,
          tokenIndices: [p2.tokenIndex, p1.tokenIndex, c0.tokenIndex],
          isFirstWord: false,
          isLastWord: true,
        });
      }

      // 2 詞片語 (如 sparkling water, turned out)
      if (c0 && n1) {
        phraseCandidates.push({
          text: `${c0.clean} ${n1.clean}`,
          tokenIndices: [c0.tokenIndex, n1.tokenIndex],
          isFirstWord: true,
          isLastWord: false,
        });
      }
      if (p1 && c0) {
        phraseCandidates.push({
          text: `${p1.clean} ${c0.clean}`,
          tokenIndices: [p1.tokenIndex, c0.tokenIndex],
          isFirstWord: false,
          isLastWord: true,
        });
      }
    }

    // 1. 先檢查相鄰是否構成動詞片語 (如 turned out, check in)
    let matchedPhrasal: { candidate: PhraseCandidate; result: LookupResult } | null = null;
    for (const cand of phraseCandidates) {
      if (PHRASAL_VERBS_MAP[cand.text]) {
        const ph = PHRASAL_VERBS_MAP[cand.text];
        matchedPhrasal = {
          candidate: cand,
          result: {
            word: cand.text,
            baseWord: ph.base,
            phonetic: ph.phonetic,
            partOfSpeech: ph.pos,
            translation: ph.trans,
            tip: ph.explanation,
            source: 'phrasal',
          },
        };
        break;
      }
    }

    // 2. 檢查相鄰是否構成詞庫中的多詞單字 (如 sparkling water, boarding pass)
    let matchedVocabPhrase: { candidate: PhraseCandidate; result: LookupResult } | null = null;
    if (!matchedPhrasal) {
      for (const cand of phraseCandidates) {
        const found = wordsPool.find(w => w.word.toLowerCase() === cand.text);
        if (found) {
          matchedVocabPhrase = {
            candidate: cand,
            result: {
              word: found.word,
              phonetic: found.phonetic,
              partOfSpeech: found.partOfSpeech,
              translation: found.translation,
              tip: found.tip,
              source: 'vocab',
            },
          };
          break;
        }
      }
    }

    // 3. 準備單字本體的查詢結果
    const singleLookup = lookupSingleWord(clean, wordsPool);
    const singleObj = {
      result: singleLookup,
      tokenIndices: [tokenIndex],
    };

    // 4. 決策預設顯示模式與選取標記
    if (matchedPhrasal) {
      // 動詞片語/慣用語：因拆開無法理解字義，預設優先顯示片語
      const phraseObj = {
        result: matchedPhrasal.result,
        tokenIndices: matchedPhrasal.candidate.tokenIndices,
      };
      setPhraseData(phraseObj);
      setSingleData(singleObj);
      setActiveMode('phrase');
      setSelectedTokenIndices(phraseObj.tokenIndices);
      speakText(phraseObj.result.word, speechRate, speechLang);
    } else if (matchedVocabPhrase) {
      // 複合名詞/搭配詞 (如 sparkling water)：
      const phraseObj = {
        result: matchedVocabPhrase.result,
        tokenIndices: matchedVocabPhrase.candidate.tokenIndices,
      };
      setPhraseData(phraseObj);
      setSingleData(singleObj);

      // 若使用者點擊的是後面的核心名詞 (如點擊 water)，優先看 water 單字字義，避免被強制綁架成 sparkling water
      if (matchedVocabPhrase.candidate.isLastWord) {
        setActiveMode('single');
        setSelectedTokenIndices(singleObj.tokenIndices);
        speakText(singleObj.result.word, speechRate, speechLang);
      } else {
        // 若使用者點擊的是修飾詞 (如 sparkling)，預設顯示整個複合單詞
        setActiveMode('phrase');
        setSelectedTokenIndices(phraseObj.tokenIndices);
        speakText(phraseObj.result.word, speechRate, speechLang);
      }
    } else {
      // 無相鄰片語，純單字查詢
      setPhraseData(null);
      setSingleData(singleObj);
      setActiveMode('single');
      setSelectedTokenIndices(singleObj.tokenIndices);
      speakText(singleObj.result.word, speechRate, speechLang);
    }

    setCustomMeaning('');
    setIsSaved(false);
  };

  const handleClose = () => {
    setPhraseData(null);
    setSingleData(null);
    setSelectedTokenIndices([]);
    setCustomMeaning('');
    setIsSaved(false);
  };

  const displayedInfo = activeMode === 'phrase' ? phraseData?.result : singleData?.result;
  const hasMultipleModes = !!phraseData && !!singleData;

  const handleSaveToCustomVocab = () => {
    if (!displayedInfo) return;
    triggerHaptic('success');
    saveCustomWord({
      word: displayedInfo.word.toLowerCase(),
      phonetic: displayedInfo.phonetic || '/-/',
      partOfSpeech: displayedInfo.partOfSpeech || 'n.',
      translation: customMeaning.trim() || displayedInfo.translation || '情境生詞',
      example: sentence,
      exampleTranslation: translation || '',
      category: 'daily',
      categoryLabel: '自訂生詞',
    });
    setIsSaved(true);
    onWordSaved?.();
  };

  const targetLookupWord = displayedInfo?.word || '';
  const cambridgeUrl = `https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/${encodeURIComponent(targetLookupWord.toLowerCase())}`;
  const googleUrl = `https://translate.google.com/?sl=en&tl=zh-TW&text=${encodeURIComponent(targetLookupWord)}&op=translate`;

  // 全局 Bottom Sheet 彈窗 (使用 createPortal 掛載於 body，完全不撐開卡片，免滾動！)
  const modalContent = displayedInfo && selectedTokenIndices.length > 0 && (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3.5 border-t sm:border border-slate-200 animate-slide-up text-slate-800 pb-8 sm:pb-5 max-h-[85vh] overflow-y-auto"
      >
        {/* 手機頂部指示條 */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto sm:hidden" />

        {/* 彈窗頂部：單字/片語、音標、發音與關閉按鈕 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-indigo-700 tracking-tight">
              {displayedInfo.word}
            </span>
            {displayedInfo.baseWord && (
              <span className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                原型: {displayedInfo.baseWord}
              </span>
            )}
            {displayedInfo.phonetic && (
              <span className="text-xs font-mono text-slate-400">
                {displayedInfo.phonetic}
              </span>
            )}
            {displayedInfo.partOfSpeech && (
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {displayedInfo.partOfSpeech}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                triggerHaptic('light');
                speakText(displayedInfo.word, speechRate, speechLang);
              }}
              className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-90 transition-all"
              title="重聽發音"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="關閉"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 雙重語意分頁按鈕：當存在「單字」與「搭配片語」時提供一鍵切換 */}
        {hasMultipleModes && phraseData && singleData && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl">
            <button
              onClick={() => {
                if (activeMode !== 'single') {
                  triggerHaptic('light');
                  setActiveMode('single');
                  setSelectedTokenIndices(singleData.tokenIndices);
                  speakText(singleData.result.word, speechRate, speechLang);
                }
              }}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'single'
                  ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>單詞</span>
              <span className="font-semibold text-[11px] truncate max-w-[110px]">「{singleData.result.word}」</span>
            </button>
            <button
              onClick={() => {
                if (activeMode !== 'phrase') {
                  triggerHaptic('light');
                  setActiveMode('phrase');
                  setSelectedTokenIndices(phraseData.tokenIndices);
                  speakText(phraseData.result.word, speechRate, speechLang);
                }
              }}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'phrase'
                  ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{phraseData.result.source === 'phrasal' ? '🔥 片語' : '📚 搭配片語'}</span>
              <span className="font-semibold text-[11px] truncate max-w-[120px]">「{phraseData.result.word}」</span>
            </button>
          </div>
        )}

        {/* 中文釋義主區塊 */}
        {displayedInfo.translation ? (
          <div className={`p-3.5 rounded-2xl border space-y-1.5 ${
            displayedInfo.source === 'phrasal'
              ? 'bg-amber-50/80 border-amber-200/80'
              : 'bg-emerald-50/70 border-emerald-100'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                displayedInfo.source === 'phrasal'
                  ? 'bg-amber-200 text-amber-900'
                  : displayedInfo.source === 'vocab'
                  ? 'bg-emerald-100/90 text-emerald-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}>
                {displayedInfo.source === 'phrasal'
                  ? '🔥 智慧識別動詞片語'
                  : displayedInfo.source === 'vocab'
                  ? '本機核心詞庫'
                  : '常用單字釋義'}
              </span>
            </div>

            <div className={`text-lg font-black pt-0.5 ${
              displayedInfo.source === 'phrasal' ? 'text-amber-950' : 'text-emerald-950'
            }`}>
              {displayedInfo.translation}
            </div>
            {displayedInfo.tip && (
              <p className={`text-xs pt-1 border-t mt-1 leading-relaxed ${
                displayedInfo.source === 'phrasal' ? 'text-amber-900 border-amber-200/60' : 'text-emerald-800 border-emerald-200/50'
              }`}>
                💡 {displayedInfo.tip}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700">可透過線上辭典即時查閱或收錄：</p>
          </div>
        )}

        {/* 原句情境提示 */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
          <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">情境原句</div>
          <p className="text-slate-700 font-medium italic">"{sentence}"</p>
          {translation && (
            <p className="text-slate-500 text-[11px]">{translation}</p>
          )}
        </div>

        {/* 線上辭典快捷按鈕 */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={cambridgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs border border-sky-200/70 transition-all active:scale-98"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>劍橋辭典詳解</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs border border-slate-200 transition-all active:scale-98"
          >
            <span>Google 翻譯</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* 快速收錄到生詞庫 */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <input
            type="text"
            placeholder="補充自訂筆記 / 中譯"
            value={customMeaning}
            onChange={(e) => setCustomMeaning(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
          <button
            onClick={handleSaveToCustomVocab}
            disabled={isSaved}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-sm'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>已收錄</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>加入生詞庫</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 例句本體文字 (每個單字皆可點擊，精確標記 index 絕不跨詞誤標) */}
      <p className={`leading-relaxed select-text ${className}`}>
        {tokens.map((tok, idx) => {
          const isWord = /[a-zA-Z]/.test(tok);
          if (!isWord) {
            return <span key={idx}>{tok}</span>;
          }

          const isSelected = selectedTokenIndices.includes(idx);
          return (
            <span
              key={idx}
              onClick={(e) => handleWordClick(tok, idx, e)}
              className={`cursor-pointer rounded-xs px-0.5 transition-all inline-block active:scale-95 ${
                isSelected
                  ? 'bg-amber-300 text-slate-900 font-bold shadow-xs ring-2 ring-amber-400'
                  : isDark
                  ? 'hover:bg-white/20 hover:text-white hover:underline underline-offset-4 decoration-sky-400/80'
                  : 'hover:bg-indigo-50 hover:text-indigo-600 hover:underline underline-offset-4 decoration-indigo-400/80'
              }`}
              title={`點擊朗讀「${tok}」並即時查詞`}
            >
              {tok}
            </span>
          );
        })}
      </p>

      {/* 透過 React Portal 渲染至 document.body，脫離卡片約束與捲軸困擾 */}
      {typeof document !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};
