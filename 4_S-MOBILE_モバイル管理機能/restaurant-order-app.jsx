import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ShoppingCart, Search, Plus, Minus, Clock, Package, Phone, Mail, CheckCircle, Trash2, Calendar, ChevronRight, Star, X, ArrowRight, Store, Truck, RotateCcw, ExternalLink, Download, MessageCircle, Send } from 'lucide-react';

const C = {
  text: '#1a1a1a', textSub: '#3d3d3d', textMuted: '#555555',
  white: '#ffffff', bg: '#f5f3ef', card: '#ffffff',
  primary: '#1a4d8f', primaryLight: '#e8f0fb',
  accent: '#b8860b', accentBg: '#fff8e1',
  success: '#1b6d3d', successBg: '#e8f5e9', successLight: '#f0faf2',
  danger: '#c62828', dangerBg: '#ffebee',
  border: '#d0ccc4', shadow: '0 2px 8px rgba(0,0,0,0.08)',
};

// ─── Swipeable ───
const SwipeableItem = ({ children, onDelete, itemId }) => {
  const startX = useRef(0);
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; setSwiping(true); };
  const handleTouchMove = (e) => { if (!swiping) return; const diff = e.touches[0].clientX - startX.current; if (diff < 0) setOffset(Math.max(diff, -130)); };
  const handleTouchEnd = () => { setSwiping(false); if (offset < -80) { setDeleted(true); setTimeout(() => onDelete(itemId), 300); } else setOffset(0); };
  return (
    <div style={{ position: 'relative', overflow: 'hidden', maxHeight: deleted ? '0px' : '500px', opacity: deleted ? 0 : 1, transition: deleted ? 'max-height 0.3s ease, opacity 0.3s ease' : 'none' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '130px', background: C.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
        <Trash2 style={{ width: '28px', height: '28px', color: 'white' }} />
        <span style={{ color: 'white', fontSize: '16px', fontWeight: '700' }}>削除</span>
      </div>
      <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', zIndex: 1, background: 'white', transform: `translateX(${offset}px)`, transition: swiping ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
      >{children}</div>
    </div>
  );
};

const ScreenTransition = ({ children }) => {
  const [m, setM] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setM(true)); }, []);
  return <div style={{ opacity: m ? 1 : 0, transform: m ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.3s ease' }}>{children}</div>;
};

const StaggerItem = ({ children, index, baseDelay = 0 }) => {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), baseDelay + index * 60); return () => clearTimeout(t); }, [index, baseDelay]);
  return <div style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.35s ease' }}>{children}</div>;
};

const Toast = ({ message, visible, type = 'success' }) => (
  <div style={{ position: 'fixed', top: visible ? '24px' : '-80px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, transition: 'top 0.4s ease', background: type === 'success' ? C.success : C.accent, color: 'white', padding: '14px 28px', borderRadius: '14px', fontSize: '17px', fontWeight: '700', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}>
    {type === 'success' ? <CheckCircle style={{ width: '22px', height: '22px' }} /> : <Clock style={{ width: '22px', height: '22px' }} />}
    {message}
  </div>
);

// ─── Main App ───
const RestaurantOrderPortal = () => {
  const [currentScreen, setCurrentScreen] = useState('entry');
  const emojiDict = [
    { kw: ['レタス', 'キャベツ', 'ほうれん草', 'ホウレンソウ', '小松菜', '白菜', '水菜', '春菊', 'ニラ', 'にら', 'サニーレタス', 'わかめ', '昆布'], e: '🥬' },
    { kw: ['トマト', 'ミニトマト'], e: '🍅' }, { kw: ['なす', 'ナス', '茄子'], e: '🍆' },
    { kw: ['きゅうり', 'キュウリ', 'ズッキーニ'], e: '🥒' }, { kw: ['ピーマン', 'パプリカ'], e: '🫑' },
    { kw: ['とうもろこし', 'コーン'], e: '🌽' }, { kw: ['アボカド'], e: '🥑' },
    { kw: ['にんじん', 'ニンジン', '人参'], e: '🥕' }, { kw: ['じゃがいも', 'ジャガイモ', 'メークイン', '男爵'], e: '🥔' },
    { kw: ['さつまいも', 'サツマイモ'], e: '🍠' }, { kw: ['里芋', 'さといも'], e: '🥔' },
    { kw: ['玉ねぎ', 'たまねぎ', '長ねぎ', 'ネギ', 'ねぎ'], e: '🧅' },
    { kw: ['にんにく', 'ニンニク'], e: '🧄' }, { kw: ['しょうが', 'ショウガ', '生姜'], e: '🫚' },
    { kw: ['しいたけ', '椎茸', 'しめじ', 'えのき', 'まいたけ', 'エリンギ', 'きのこ'], e: '🍄' },
    { kw: ['えだまめ', '枝豆'], e: '🫛' }, { kw: ['もやし'], e: '🌱' },
    { kw: ['りんご', 'リンゴ'], e: '🍎' }, { kw: ['みかん', 'オレンジ'], e: '🍊' },
    { kw: ['レモン', 'ライム'], e: '🍋' }, { kw: ['バナナ'], e: '🍌' },
    { kw: ['ぶどう', 'ブドウ'], e: '🍇' }, { kw: ['いちご', 'イチゴ', '苺'], e: '🍓' },
    { kw: ['もも', '桃'], e: '🍑' }, { kw: ['メロン'], e: '🍈' }, { kw: ['すいか', 'スイカ'], e: '🍉' },
    { kw: ['パイナップル'], e: '🍍' }, { kw: ['キウイ'], e: '🥝' }, { kw: ['マンゴー'], e: '🥭' },
    { kw: ['さくらんぼ', 'チェリー'], e: '🍒' }, { kw: ['梨'], e: '🍐' },
    { kw: ['牛肉', 'ビーフ', '和牛', '豚肉', 'ポーク', 'ひき肉', 'ミンチ'], e: '🥩' },
    { kw: ['鶏肉', 'チキン', 'ささみ', 'むね肉'], e: '🍗' },
    { kw: ['ハム', 'ベーコン'], e: '🥓' }, { kw: ['ソーセージ', 'ウインナー'], e: '🌭' },
    { kw: ['鮭', 'サーモン', 'まぐろ', 'マグロ', 'ツナ', '魚', 'さんま', 'さば', 'あじ', 'ぶり', '鯛'], e: '🐟' },
    { kw: ['えび', 'エビ', '海老'], e: '🦐' }, { kw: ['いか', 'イカ'], e: '🦑' },
    { kw: ['たこ', 'タコ'], e: '🐙' }, { kw: ['貝', 'あさり', 'ホタテ'], e: '🐚' }, { kw: ['カニ', 'かに'], e: '🦀' },
    { kw: ['卵', 'たまご', 'タマゴ'], e: '🥚' }, { kw: ['牛乳', 'ミルク'], e: '🥛' },
    { kw: ['チーズ'], e: '🧀' }, { kw: ['バター'], e: '🧈' },
    { kw: ['米', 'こめ', 'ライス', '白米', '玄米'], e: '🍚' }, { kw: ['パン', '食パン'], e: '🍞' },
    { kw: ['麺', 'うどん', 'そば', 'ラーメン', 'パスタ'], e: '🍜' }, { kw: ['小麦粉', '薄力粉', '片栗粉'], e: '🌾' },
    { kw: ['醤油', 'しょうゆ', '味噌', 'みそ', '酢', 'マヨネーズ', 'ケチャップ', 'ソース', 'ドレッシング'], e: '🫙' },
    { kw: ['塩', 'しお', '砂糖', 'さとう'], e: '🧂' }, { kw: ['油', 'オイル', 'ごま油', 'オリーブ'], e: '🫗' },
    { kw: ['みりん', '料理酒'], e: '🍶' },
    { kw: ['ビール', '生ビール'], e: '🍺' }, { kw: ['日本酒', '清酒', '焼酎'], e: '🍶' },
    { kw: ['ワイン'], e: '🍷' }, { kw: ['ウイスキー', 'ハイボール'], e: '🥃' },
    { kw: ['サワー', 'チューハイ'], e: '🍸' }, { kw: ['ジュース'], e: '🧃' },
    { kw: ['お茶', '緑茶', 'ウーロン茶', '麦茶'], e: '🍵' }, { kw: ['コーヒー', '珈琲'], e: '☕' },
    { kw: ['水', 'ミネラルウォーター', '炭酸水'], e: '💧' },
    { kw: ['かまぼこ', 'ちくわ', 'はんぺん'], e: '🍥' }, { kw: ['弁当'], e: '🍱' }, { kw: ['おにぎり'], e: '🍙' },
    { kw: ['チョコレート', 'チョコ', 'ショコラ'], e: '🍫' },
    { kw: ['クッキー', 'ビスケット', 'ラスク', 'マカロン'], e: '🍪' },
    { kw: ['ケーキ', 'タルト', 'カステラ', 'バウムクーヘン', 'マドレーヌ'], e: '🍰' },
    { kw: ['ドーナツ', 'シュークリーム', 'エクレア'], e: '🍩' },
    { kw: ['プリン', 'ゼリー', 'ムース', 'ティラミス'], e: '🍮' },
    { kw: ['アイスクリーム', 'ソフトクリーム', 'ジェラート'], e: '🍦' },
    { kw: ['飴', 'キャンディ', 'キャラメル', 'グミ', 'マシュマロ'], e: '🍬' },
    { kw: ['せんべい', '煎餅', 'おかき', 'あられ'], e: '🍘' },
    { kw: ['まんじゅう', '饅頭', '餅', 'もち', '大福', '団子', 'だんご'], e: '🍡' },
    { kw: ['パイ', 'アップルパイ'], e: '🥧' }, { kw: ['ワッフル'], e: '🧇' },
    { kw: ['パンケーキ', 'ホットケーキ', 'クレープ'], e: '🥞' },
    { kw: ['ナッツ', 'アーモンド', 'くるみ', 'ピーナッツ', '落花生'], e: '🥜' },
    { kw: ['ポップコーン', 'ポテトチップス', 'ポテチ'], e: '🍿' }, { kw: ['プレッツェル'], e: '🥨' },
    { kw: ['菓子', 'お菓子', 'スイーツ', 'デザート'], e: '🍬' },
  ];

  const getEmoji = (name, code = '') => { const t = `${name} ${code}`; for (const e of emojiDict) for (const k of e.kw) if (t.includes(k)) return e.e; return null; };
  const iconColors = ['#2b6cb0','#2f855a','#b7791f','#9b2c2c','#6b46c1','#2c7a7b','#975a16','#744210'];
  const ProductIcon = ({ name, code, size = 56, fontSize = 30 }) => {
    const emoji = getEmoji(name, code);
    if (emoji) return <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '14px', background: '#f5f3ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${fontSize}px`, flexShrink: 0 }}>{emoji}</div>;
    const ch = name.replace(/[(\[（【].*/, '').trim().charAt(0) || '?';
    return <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '14px', background: iconColors[name.charCodeAt(0) % iconColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontSize: `${Math.round(fontSize * 0.75)}px`, fontWeight: '800' }}>{ch}</div>;
  };
  const InlineIcon = ({ name, code, size = 28 }) => {
    const emoji = getEmoji(name, code);
    if (emoji) return <span style={{ fontSize: `${size}px` }}>{emoji}</span>;
    const ch = name.replace(/[(\[（【].*/, '').trim().charAt(0) || '?';
    return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, borderRadius: '8px', background: iconColors[name.charCodeAt(0) % iconColors.length], color: 'white', fontSize: `${Math.round(size * 0.6)}px`, fontWeight: '800' }}>{ch}</span>;
  };

  const [cartItems, setCartItems] = useState([
    { id: 1, code: 'レタス (S) (1ケース) (6個)', name: 'レタス(玉)', quantity: 2, price: 250 },
    { id: 2, code: 'トマト (M) (1ケース)', name: 'トマト(kg)', quantity: 3, price: 680 },
    { id: 3, code: '玉ねぎ (2L) (1ケース) (15kg)', name: '玉ねぎ(箱10kg)', quantity: 1, price: 1200 }
  ]);
  const [deliveryDate, setDeliveryDate] = useState(() => { const t = new Date(); t.setDate(t.getDate() + 1); return `${t.getMonth()+1}/${t.getDate()}`; });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const dateInputRef = useRef(null);

  const showToast = (msg, type = 'success') => { setToast({ visible: true, message: msg, type }); setTimeout(() => setToast(p => ({ ...p, visible: false })), 2200); };
  const navigate = (s) => { setCurrentScreen(s); window.scrollTo(0, 0); };
  const [activeChatKey, setActiveChatKey] = useState('general');
  const sendChatMessage = (key) => {
    const text = chatInput.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setChatThreads(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: Date.now(), sender: 'customer', text, time }],
    }));
    setChatInput('');
    showToast('メッセージを送信しました');
  };
  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const updateQuantity = (id, q) => { if (q < 1) return; setCartItems(cartItems.map(i => i.id === id ? { ...i, quantity: q } : i)); };
  const removeItem = (id) => { setCartItems(cartItems.filter(i => i.id !== id)); showToast('商品を削除しました'); };
  const addToCart = (item) => { const ex = cartItems.find(c => c.code === item.code); if (ex) updateQuantity(ex.id, ex.quantity + 1); else setCartItems([...cartItems, { ...item, id: Date.now(), quantity: 1 }]); showToast(`${item.name} を追加しました`); };

  // codeから商品名の重複部分を除去し、規格情報のみ返す
  const getSpec = (name, code) => {
    if (!code) return '';
    // nameの最初の文字列（括弧なし部分）でcodeを分割
    const baseName = name.replace(/\(.*$/, '').replace(/（.*$/, '');
    const idx = code.indexOf(baseName);
    if (idx >= 0) {
      const after = code.substring(idx + baseName.length).trim();
      return after || code;
    }
    return code;
  };

  const allProducts = [
    { code: 'レタス (S) (1ケース) (6個)', name: 'レタス(玉)', price: 250, favorite: true },
    { code: 'トマト (M) (1ケース)', name: 'トマト(kg)', price: 680, favorite: true },
    { code: '玉ねぎ (2L) (1ケース) (15kg)', name: '玉ねぎ(箱10kg)', price: 1200, favorite: true },
    { code: 'キャベツ (L) (1ケース) (8個)', name: 'キャベツ(玉)', price: 180 },
    { code: '大根 (M) (1ケース) (10本)', name: '大根(本)', price: 150 },
    { code: 'にんじん (M) (1袋) (10kg)', name: 'にんじん(袋)', price: 320 },
    { code: 'じゃがいも (L) (1ケース) (10kg)', name: 'じゃがいも(箱)', price: 480 },
    { code: 'ピーマン (M) (1ケース) (5kg)', name: 'ピーマン(袋)', price: 350 },
    { code: 'ミツバ (M) (1袋) (500g)', name: 'ミツバ(袋)', price: 180 },
    { code: 'オクラ (M) (1パック) (100g)', name: 'オクラ(パック)', price: 120 },
    { code: 'サニーレタス (M) (1ケース) (6個)', name: 'サニーレタス(玉)', price: 200 },
    { code: 'チョコパイ (1箱) (12個入)', name: 'チョコパイ(箱)', price: 450 },
  ];

  // ─── 注文履歴ダミーデータ（商品明細付き） ───
  const orderHistory = [
    { id: '#20241225-0038', date: '12月25日(月)', ym: '2024-12', total: 8450, status: '配送済み', items: [
      { name: 'レタス(玉)', code: 'レタス (S) (1ケース) (6個)', price: 250, quantity: 3 },
      { name: 'トマト(kg)', code: 'トマト (M) (1ケース)', price: 680, quantity: 2 },
      { name: '玉ねぎ(箱10kg)', code: '玉ねぎ (2L) (1ケース) (15kg)', price: 1200, quantity: 1 },
      { name: 'キャベツ(玉)', code: 'キャベツ (L) (1ケース) (8個)', price: 180, quantity: 4 },
      { name: 'にんじん(袋)', code: 'にんじん (M) (1袋) (10kg)', price: 320, quantity: 2 },
      { name: 'じゃがいも(箱)', code: 'じゃがいも (L) (1ケース) (10kg)', price: 480, quantity: 1 },
      { name: '大根(本)', code: '大根 (M) (1ケース) (10本)', price: 150, quantity: 5 },
      { name: 'ピーマン(袋)', code: 'ピーマン (M) (1ケース) (5kg)', price: 350, quantity: 2 },
      { name: 'ミツバ(袋)', code: 'ミツバ (M) (1袋) (500g)', price: 180, quantity: 3 },
      { name: 'オクラ(パック)', code: 'オクラ (M) (1パック) (100g)', price: 120, quantity: 4 },
    ]},
    { id: '#20241222-0035', date: '12月22日(金)', ym: '2024-12', total: 6200, status: '配送済み', items: [
      { name: 'レタス(玉)', code: 'レタス (S) (1ケース) (6個)', price: 250, quantity: 2 },
      { name: 'トマト(kg)', code: 'トマト (M) (1ケース)', price: 680, quantity: 3 },
      { name: '玉ねぎ(箱10kg)', code: '玉ねぎ (2L) (1ケース) (15kg)', price: 1200, quantity: 2 },
      { name: 'キャベツ(玉)', code: 'キャベツ (L) (1ケース) (8個)', price: 180, quantity: 3 },
      { name: 'にんじん(袋)', code: 'にんじん (M) (1袋) (10kg)', price: 320, quantity: 1 },
      { name: 'ピーマン(袋)', code: 'ピーマン (M) (1ケース) (5kg)', price: 350, quantity: 2 },
      { name: 'サニーレタス(玉)', code: 'サニーレタス (M) (1ケース) (6個)', price: 200, quantity: 3 },
      { name: 'チョコパイ(箱)', code: 'チョコパイ (1箱) (12個入)', price: 450, quantity: 1 },
    ]},
    { id: '#20241220-0031', date: '12月20日(水)', ym: '2024-12', total: 11800, status: '配送済み', items: [
      { name: 'レタス(玉)', code: 'レタス (S) (1ケース) (6個)', price: 250, quantity: 5 },
      { name: 'トマト(kg)', code: 'トマト (M) (1ケース)', price: 680, quantity: 4 },
      { name: '玉ねぎ(箱10kg)', code: '玉ねぎ (2L) (1ケース) (15kg)', price: 1200, quantity: 3 },
      { name: 'じゃがいも(箱)', code: 'じゃがいも (L) (1ケース) (10kg)', price: 480, quantity: 2 },
      { name: '大根(本)', code: '大根 (M) (1ケース) (10本)', price: 150, quantity: 6 },
      { name: 'にんじん(袋)', code: 'にんじん (M) (1袋) (10kg)', price: 320, quantity: 3 },
    ]},
    { id: '#20241218-0028', date: '12月18日(月)', ym: '2024-12', total: 4350, status: '配送済み', items: [
      { name: 'トマト(kg)', code: 'トマト (M) (1ケース)', price: 680, quantity: 2 },
      { name: 'キャベツ(玉)', code: 'キャベツ (L) (1ケース) (8個)', price: 180, quantity: 3 },
      { name: 'ピーマン(袋)', code: 'ピーマン (M) (1ケース) (5kg)', price: 350, quantity: 2 },
      { name: 'レタス(玉)', code: 'レタス (S) (1ケース) (6個)', price: 250, quantity: 2 },
      { name: 'オクラ(パック)', code: 'オクラ (M) (1パック) (100g)', price: 120, quantity: 5 },
      { name: 'ミツバ(袋)', code: 'ミツバ (M) (1袋) (500g)', price: 180, quantity: 2 },
    ]},
    { id: '#20241215-0024', date: '12月15日(金)', ym: '2024-12', total: 7600, status: '配送済み', items: [
      { name: 'レタス(玉)', code: 'レタス (S) (1ケース) (6個)', price: 250, quantity: 4 },
      { name: 'トマト(kg)', code: 'トマト (M) (1ケース)', price: 680, quantity: 3 },
      { name: '玉ねぎ(箱10kg)', code: '玉ねぎ (2L) (1ケース) (15kg)', price: 1200, quantity: 2 },
      { name: 'じゃがいも(箱)', code: 'じゃがいも (L) (1ケース) (10kg)', price: 480, quantity: 1 },
      { name: '大根(本)', code: '大根 (M) (1ケース) (10本)', price: 150, quantity: 3 },
      { name: 'サニーレタス(玉)', code: 'サニーレタス (M) (1ケース) (6個)', price: 200, quantity: 2 },
      { name: 'にんじん(袋)', code: 'にんじん (M) (1袋) (10kg)', price: 320, quantity: 2 },
      { name: 'キャベツ(玉)', code: 'キャベツ (L) (1ケース) (8個)', price: 180, quantity: 3 },
      { name: 'チョコパイ(箱)', code: 'チョコパイ (1箱) (12個入)', price: 450, quantity: 2 },
    ]},
    { id: '#20241128-0019', date: '11月28日(木)', ym: '2024-11', total: 5400, status: '配送済み', items: [
      { name: 'レタス(玉)', code: 'レタス (S) (1ケース) (6個)', price: 250, quantity: 3 },
      { name: 'トマト(kg)', code: 'トマト (M) (1ケース)', price: 680, quantity: 2 },
      { name: 'キャベツ(玉)', code: 'キャベツ (L) (1ケース) (8個)', price: 180, quantity: 5 },
      { name: 'にんじん(袋)', code: 'にんじん (M) (1袋) (10kg)', price: 320, quantity: 3 },
    ]},
    { id: '#20241122-0015', date: '11月22日(金)', ym: '2024-11', total: 8900, status: '配送済み', items: [
      { name: 'レタス(玉)', code: 'レタス (S) (1ケース) (6個)', price: 250, quantity: 4 },
      { name: 'トマト(kg)', code: 'トマト (M) (1ケース)', price: 680, quantity: 3 },
      { name: '玉ねぎ(箱10kg)', code: '玉ねぎ (2L) (1ケース) (15kg)', price: 1200, quantity: 2 },
      { name: '大根(本)', code: '大根 (M) (1ケース) (10本)', price: 150, quantity: 6 },
      { name: 'ピーマン(袋)', code: 'ピーマン (M) (1ケース) (5kg)', price: 350, quantity: 4 },
    ]},
    { id: '#20241015-0010', date: '10月15日(火)', ym: '2024-10', total: 6300, status: '配送済み', items: [
      { name: 'トマト(kg)', code: 'トマト (M) (1ケース)', price: 680, quantity: 3 },
      { name: '玉ねぎ(箱10kg)', code: '玉ねぎ (2L) (1ケース) (15kg)', price: 1200, quantity: 2 },
      { name: 'にんじん(袋)', code: 'にんじん (M) (1袋) (10kg)', price: 320, quantity: 2 },
      { name: 'じゃがいも(箱)', code: 'じゃがいも (L) (1ケース) (10kg)', price: 480, quantity: 1 },
    ]},
  ];
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterYear, setFilterYear] = useState('2024');
  const [filterMonth, setFilterMonth] = useState('all');
  const [chatInput, setChatInput] = useState('');
  // チャットスレッド: 'general' = 全体問い合わせ / '注文番号' = 注文ごと
  const [chatThreads, setChatThreads] = useState({
    'general': [
      { id: 1, sender: 'vendor', text: 'いつもご利用ありがとうございます。ご不明点やご要望がございましたら、こちらからお気軽にお問い合わせください。', time: '12/20 10:30' },
    ],
    '#20241225-0038': [
      { id: 1, sender: 'customer', text: '12/25の注文ですが、レタスを追加で2ケース足せますか？', time: '12/24 16:05' },
      { id: 2, sender: 'vendor', text: 'ご連絡ありがとうございます。レタス2ケース追加で承りました。明日の便に同梱いたします。', time: '12/24 16:20' },
      { id: 3, sender: 'customer', text: '助かります。よろしくお願いします。', time: '12/24 16:22' },
    ],
    '#20241220-0031': [
      { id: 1, sender: 'customer', text: '本日納品のじゃがいも、少し小ぶりだったので次回は L サイズでお願いできますか？', time: '12/20 14:10' },
      { id: 2, sender: 'vendor', text: '承知しました。次回より L サイズ中心でお出しします。ご指摘ありがとうございます。', time: '12/20 15:00' },
    ],
  });

  // ─── 翌日判定ヘルパー ───
  const isTomorrow = () => {
    const t = new Date(); t.setDate(t.getDate() + 1);
    return deliveryDate === `${t.getMonth()+1}/${t.getDate()}`;
  };

  // ─── 日付フォーマットヘルパー ───
  const formatDeliveryDate = () => {
    const dayNames = ['日','月','火','水','木','金','土'];
    if (deliveryDate && deliveryDate.includes('-')) {
      const p = deliveryDate.split('-'); const dd = new Date(p[0], p[1]-1, p[2]);
      return `${dd.getMonth()+1}月${dd.getDate()}日(${dayNames[dd.getDay()]})`;
    }
    if (deliveryDate && deliveryDate.includes('/')) {
      const today = new Date();
      for (let i = 1; i <= 7; i++) { const d = new Date(today); d.setDate(today.getDate() + i); if (`${d.getMonth()+1}/${d.getDate()}` === deliveryDate) return `${d.getMonth()+1}月${d.getDate()}日(${dayNames[d.getDay()]})`; }
    }
    return deliveryDate || '未選択';
  };

  // ─── Styles ───
  const cardStyle = { background: C.card, borderRadius: '16px', border: `1px solid ${C.border}`, boxShadow: C.shadow, overflow: 'hidden' };
  const headerBar = { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245,243,239,0.96)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.border}` };
  const fixedBottom = { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', padding: '16px 20px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderTop: `2px solid ${C.border}`, zIndex: 50 };
  const bigBtn = (bg, col, sh) => ({ background: bg, color: col, border: 'none', borderRadius: '14px', padding: '18px 20px', fontSize: '18px', fontWeight: '800', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: sh || 'none', minHeight: '60px' });
  const navBtn = { display: 'flex', alignItems: 'center', gap: '4px', background: C.primaryLight, border: `2px solid ${C.primary}`, borderRadius: '12px', color: C.primary, fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: '8px 14px', minHeight: '48px' };

  // ═══════ CHAT: 吹き出しリスト ═══════
  const ChatBubbles = ({ messages }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(!messages || messages.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '30px 20px', color: C.textMuted, fontSize: '15px', fontWeight: '600' }}>
          まだメッセージはありません
        </div>
      ) : messages.map(m => {
        const mine = m.sender === 'customer';
        return (
          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
            {!mine && <div style={{ fontSize: '12px', color: C.textMuted, fontWeight: '700', marginBottom: '3px', marginLeft: '4px' }}>（株）丸将</div>}
            <div style={{
              maxWidth: '80%', padding: '10px 14px', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: mine ? C.primary : 'white', color: mine ? 'white' : C.text,
              border: mine ? 'none' : `1.5px solid ${C.border}`, fontSize: '16px', fontWeight: '500', lineHeight: 1.5,
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>{m.text}</div>
            <div style={{ fontSize: '11px', color: C.textMuted, fontWeight: '600', marginTop: '3px', padding: '0 4px' }}>{m.time}</div>
          </div>
        );
      })}
    </div>
  );

  // ═══════ CHAT: 入力欄 ═══════
  const ChatInputBar = ({ chatKey, placeholder }) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
      <textarea
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder={placeholder || 'メッセージを入力...'}
        rows={1}
        style={{
          flex: 1, minHeight: '48px', maxHeight: '120px', padding: '12px 14px', borderRadius: '12px',
          border: `2px solid ${C.border}`, fontSize: '16px', fontWeight: '500', color: C.text,
          outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
        onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
      />
      <button onClick={() => sendChatMessage(chatKey)} disabled={!chatInput.trim()} style={{
        width: '48px', height: '48px', borderRadius: '12px', border: 'none', flexShrink: 0,
        background: chatInput.trim() ? C.primary : C.border, cursor: chatInput.trim() ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Send style={{ width: '20px', height: '20px', color: 'white' }} />
      </button>
    </div>
  );

  // ═══════ ENTRY ═══════
  const renderEntryScreen = () => (
    <ScreenTransition>
      <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d2b52, #1a4d8f)', padding: '16px 20px', paddingTop: '12px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '15px', opacity: 0.8, fontWeight: '600' }}>株式会社 丸山食品</div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '4px 0' }}>居酒屋「たけ」本店 様</h1>
            <p style={{ fontSize: '14px', opacity: 0.7, fontWeight: '600', margin: 0 }}>納品先コード: 14-1</p>
          </div>
        </div>

        <div style={{ padding: '10px 20px 0' }}>
          <StaggerItem index={0}>
            <div style={{ background: C.accentBg, border: `2px solid ${C.accent}`, borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: '#5c4003' }}>翌日出荷分は本日17時 締切</div>
                <div style={{ fontSize: '15px', color: '#6b4f0a', fontWeight: '700' }}>締切後はお問い合わせください</div>
              </div>
            </div>
          </StaggerItem>
        </div>

        <div style={{ padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { onClick: () => navigate('cart'), bg: C.successLight, border: '#4caf50', iconBg: C.success, icon: '📦', title: '前回注文を再送信', sub: '12/25の注文 · 10品' },
            { onClick: () => navigate('products'), bg: C.card, border: C.border, iconBg: C.primary, icon: '🔍', title: '商品を選んで注文', sub: 'カテゴリから探す' },
            { onClick: () => navigate('history'), bg: C.card, border: C.border, iconBg: '#6b46a3', icon: '📋', title: '注文履歴を見る', sub: '過去の注文を確認' },
            { onClick: () => { setActiveChatKey('general'); navigate('chat'); }, bg: C.card, border: C.border, iconBg: '#2e7d52', icon: '💬', title: 'チャット / お問い合わせ', sub: '仕入先とのやり取りを確認' },
          ].map((item, idx) => (
            <StaggerItem key={idx} index={idx + 1} baseDelay={80}>
              <button onClick={item.onClick} style={{ ...cardStyle, width: '100%', padding: '16px', border: `2px solid ${item.border}`, background: item.bg, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '19px', fontWeight: '800', color: C.text, marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '15px', color: C.textSub, fontWeight: '600' }}>{item.sub}</div>
                </div>
                <ChevronRight style={{ width: '22px', height: '22px', color: C.textSub }} />
              </button>
            </StaggerItem>
          ))}
        </div>

        {/* ③ 電話・メールボタン */}
        <StaggerItem index={4} baseDelay={160}>
          <div style={{ padding: '0 20px', display: 'flex', gap: '12px' }}>
            <a href="tel:03-1234-5678" style={{ flex: 1, ...cardStyle, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' }}>
              <Phone style={{ width: '24px', height: '24px', color: C.primary }} />
              <span style={{ fontSize: '19px', fontWeight: '800', color: C.primary }}>電話する</span>
            </a>
            <a href="mailto:order@example.com" style={{ flex: 1, ...cardStyle, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' }}>
              <Mail style={{ width: '24px', height: '24px', color: C.primary }} />
              <span style={{ fontSize: '19px', fontWeight: '800', color: C.primary }}>メールする</span>
            </a>
          </div>
          <div style={{ padding: '10px 24px 0', fontSize: '15px', color: C.primary, fontWeight: '600', lineHeight: '1.6' }}>
            ※ 納品に問題がある場合にはお問い合わせください
          </div>
        </StaggerItem>
      </div>
    </ScreenTransition>
  );

  // ═══════ PRODUCTS ═══════
  // コンパクト表示: 未追加は1行、追加済みは注文数を簡潔に表示
  const ProductCard = ({ item }) => {
    const inCart = cartItems.find(c => c.code === item.code);
    return inCart ? (
      /* カートに入っている商品: 緑枠でコンパクト表示 */
      <div style={{ ...cardStyle, padding: '12px 14px', marginBottom: '8px', border: `2px solid ${C.success}`, background: C.successBg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ProductIcon name={item.name} code={item.code} size={40} fontSize={22} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: C.text }}>{item.name}</div>
            <div style={{ fontSize: '13px', color: C.textMuted, fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSpec(item.name, item.code)}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: C.success }}>{inCart.quantity}個</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: C.text }}>¥{(inCart.quantity * item.price).toLocaleString()}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button onClick={() => navigate('cart')} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '8px', borderRadius: '8px', background: 'white', border: `1.5px solid ${C.primary}`,
            color: C.primary, fontSize: '14px', fontWeight: '700', cursor: 'pointer', minHeight: '38px',
          }}>
            <ShoppingCart style={{ width: '14px', height: '14px' }} /> 数量変更
          </button>
          <button onClick={() => removeItem(inCart.id)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '8px 12px', borderRadius: '8px', background: C.dangerBg, border: `1.5px solid ${C.danger}`,
            color: C.danger, fontSize: '14px', fontWeight: '700', cursor: 'pointer', minHeight: '38px',
          }}>
            <Trash2 style={{ width: '14px', height: '14px' }} /> 削除
          </button>
        </div>
      </div>
    ) : (
      /* カートに未追加: 1行コンパクト + 右端に追加ボタン */
      <div style={{ ...cardStyle, padding: '10px 14px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ProductIcon name={item.name} code={item.code} size={38} fontSize={20} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '17px', fontWeight: '800', color: C.text }}>{item.name}</div>
          <div style={{ fontSize: '12px', color: C.textMuted, fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSpec(item.name, item.code)}</div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: '800', color: C.text, flexShrink: 0, marginRight: '4px' }}>¥{item.price}</div>
        <button onClick={() => {
          setCartItems(prev => [...prev, { ...item, id: Date.now(), quantity: 1 }]);
          showToast(`${item.name} を追加`);
        }} style={{
          flexShrink: 0, width: '44px', height: '44px', borderRadius: '12px',
          border: `2px solid ${C.primary}`, background: C.primaryLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Plus style={{ width: '20px', height: '20px', color: C.primary }} />
        </button>
      </div>
    );
  };

  const renderProductsScreen = () => {
    const filtered = searchQuery ? allProducts.filter(p => p.name.includes(searchQuery) || p.code.includes(searchQuery)) : allProducts;
    const favs = filtered.filter(p => p.favorite); const rest = filtered.filter(p => !p.favorite);
    return (
      <ScreenTransition>
        <div style={{ minHeight: '100vh', paddingBottom: cartItems.length > 0 ? '110px' : '20px' }}>
          <div style={headerBar}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
              <button onClick={() => navigate('entry')} style={navBtn}><ChevronLeft style={{ width: '22px', height: '22px' }} /> 戻る</button>
              <span style={{ fontWeight: '800', fontSize: '20px', color: C.text }}>商品一覧</span>
              <button onClick={() => navigate('cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '8px', minWidth: '48px', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart style={{ width: '26px', height: '26px', color: C.text }} />
                {cartItems.length > 0 && <span style={{ background: C.danger, color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', position: 'absolute', top: 0, right: 0 }}>{cartItems.length}</span>}
              </button>
            </div>
            <div style={{ padding: '0 20px 14px' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ width: '22px', height: '22px', position: 'absolute', left: '16px', top: '15px', color: C.textMuted }} />
                <input type="text" placeholder="商品名で検索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '14px 48px 14px 48px', borderRadius: '14px', border: `2px solid ${C.border}`, fontSize: '17px', background: 'white', outline: 'none', boxSizing: 'border-box', color: C.text, fontWeight: '500' }}
                  onFocus={(e) => e.target.style.borderColor = C.primary} onBlur={(e) => e.target.style.borderColor = C.border} />
                {searchQuery && <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '10px', background: '#ddd', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X style={{ width: '18px', height: '18px', color: C.text }} /></button>}
              </div>
            </div>
          </div>
          {favs.length > 0 && (<>
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #e8f0fb, #e8f5e9)', borderBottom: `1px solid ${C.border}` }}>
              <Star style={{ width: '20px', height: '20px', color: '#b8860b', fill: '#b8860b' }} />
              <span style={{ fontWeight: '800', fontSize: '18px', color: C.text }}>定番商品</span>
              <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#fff3cd', color: '#5c4003', fontSize: '15px', fontWeight: '700' }}>前回注文</span>
            </div>
            <div style={{ padding: '10px 20px 4px' }}>{favs.map((item, i) => <StaggerItem key={i} index={i}><ProductCard item={item} /></StaggerItem>)}</div>
          </>)}
          {rest.length > 0 && (<>
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: '#f0ede8', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
              <Package style={{ width: '20px', height: '20px', color: C.textSub }} />
              <span style={{ fontWeight: '800', fontSize: '18px', color: C.text }}>その他商品</span>
            </div>
            <div style={{ padding: '10px 20px 4px' }}>{rest.map((item, i) => <StaggerItem key={i} index={i} baseDelay={favs.length * 60}><ProductCard item={item} /></StaggerItem>)}</div>
          </>)}
          {cartItems.length > 0 && <div style={fixedBottom}><button onClick={() => navigate('cart')} style={bigBtn(C.primary, 'white', '0 4px 16px rgba(26,77,143,0.35)')}><ShoppingCart style={{ width: '22px', height: '22px' }} /> カートを見る ({cartItems.length}品 · ¥{total.toLocaleString()})</button></div>}
        </div>
      </ScreenTransition>
    );
  };

  // ═══════ CART ═══════
  const renderCartScreen = () => (
    <ScreenTransition>
      <div style={{ minHeight: '100vh', paddingBottom: '140px' }}>
        <div style={headerBar}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
            <button onClick={() => navigate('products')} style={navBtn}><ChevronLeft style={{ width: '22px', height: '22px' }} /> 商品選択</button>
            <span style={{ fontWeight: '800', fontSize: '20px', color: C.text }}>注文内容</span>
            <div style={{ width: '80px' }} />
          </div>
        </div>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: C.textMuted, fontWeight: '600' }}>
          💡 削除ボタンまたは左スワイプで商品を削除できます
        </div>
        <div>
          {cartItems.map((item, idx) => (
            <StaggerItem key={item.id} index={idx}>
              <SwipeableItem onDelete={removeItem} itemId={item.id}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ProductIcon name={item.name} code={item.code} size={40} fontSize={22} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: C.text }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: C.textMuted, fontWeight: '600' }}>{getSpec(item.name, item.code)}</div>
                      <div style={{ fontSize: '14px', color: C.textSub, fontWeight: '600' }}>¥{item.price} × {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '19px', fontWeight: '800', color: C.primary, flexShrink: 0 }}>¥{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                  {/* 数量: -5 / -1 / 直接入力 / +1 / +5  ...  削除 */}
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 5))} style={{ width: '40px', height: '44px', borderRadius: '10px', border: `2px solid ${C.border}`, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: C.textSub }}>-5</button>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '40px', height: '44px', borderRadius: '10px', border: `2px solid ${C.border}`, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus style={{ width: '18px', height: '18px', color: C.text }} /></button>
                    <input type="number" inputMode="numeric" value={item.quantity}
                      onChange={(e) => { const v = parseInt(e.target.value); if (v >= 1) updateQuantity(item.id, v); }}
                      onFocus={(e) => e.target.select()}
                      style={{ width: '64px', height: '44px', borderRadius: '10px', border: `2px solid ${C.primary}`, fontSize: '22px', fontWeight: '800', textAlign: 'center', color: C.primary, outline: 'none', boxSizing: 'border-box' }}
                    />
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '40px', height: '44px', borderRadius: '10px', border: `2px solid ${C.primary}`, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus style={{ width: '18px', height: '18px', color: C.primary }} /></button>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 5)} style={{ width: '40px', height: '44px', borderRadius: '10px', border: `2px solid ${C.primary}`, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: C.primary }}>+5</button>
                    <div style={{ flex: 1 }} />
                    <button onClick={() => removeItem(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', height: '44px', borderRadius: '10px', border: `2px solid ${C.danger}`, background: C.dangerBg, cursor: 'pointer', flexShrink: 0 }}>
                      <Trash2 style={{ width: '16px', height: '16px', color: C.danger }} />
                      <span style={{ fontSize: '14px', fontWeight: '700', color: C.danger }}>削除</span>
                    </button>
                  </div>
                </div>
              </SwipeableItem>
            </StaggerItem>
          ))}
        </div>

        {/* 納品希望日 */}
        <div style={{ padding: '20px' }}>
          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Calendar style={{ width: '22px', height: '22px', color: C.primary }} />
              <span style={{ fontSize: '18px', fontWeight: '800', color: C.text }}>納品希望日</span>
            </div>
            {(() => {
              const dayNames = ['日','月','火','水','木','金','土'];
              const today = new Date();
              const days = [];
              for (let i = 1; i <= 7; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push({ value: `${d.getMonth()+1}/${d.getDate()}`, day: d.getDate(), month: d.getMonth()+1, dow: dayNames[d.getDay()], isSun: d.getDay()===0, isSat: d.getDay()===6 }); }
              return (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
                  {days.map(d => (
                    <button key={d.value} onClick={() => setDeliveryDate(d.value)} style={{ flexShrink: 0, width: '72px', padding: '12px 6px', borderRadius: '14px', border: deliveryDate === d.value ? `3px solid ${C.primary}` : `2px solid ${C.border}`, background: deliveryDate === d.value ? C.primaryLight : 'white', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: d.isSun ? C.danger : d.isSat ? C.primary : C.textMuted }}>{d.dow}</div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: deliveryDate === d.value ? C.primary : C.text }}>{d.day}</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: C.textMuted }}>{d.month}月</div>
                    </button>
                  ))}
                </div>
              );
            })()}
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '14px',
                border: deliveryDate && deliveryDate.includes('-') ? `3px solid ${C.primary}` : `2px solid ${C.border}`,
                background: deliveryDate && deliveryDate.includes('-') ? C.primaryLight : 'white',
              }}>
                <Calendar style={{ width: '20px', height: '20px', color: C.primary, flexShrink: 0 }} />
                <span style={{ fontSize: '16px', fontWeight: '700', color: C.textSub, flexShrink: 0 }}>それ以降:</span>
                <input
                  ref={dateInputRef}
                  type="date"
                  min={(() => { const t = new Date(); return t.toISOString().split('T')[0]; })()}
                  value={deliveryDate && deliveryDate.includes('-') ? deliveryDate : ''}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const today = new Date(); today.setHours(0,0,0,0);
                    const selected = new Date(e.target.value + 'T00:00:00');
                    if (selected < today) {
                      showToast('本日以降の日付を選択してください', 'accent');
                      e.target.value = '';
                      return;
                    }
                    setDeliveryDate(e.target.value);
                  }}
                  style={{
                    flex: 1, height: '44px', borderRadius: '10px', border: `2px solid ${C.border}`,
                    fontSize: '17px', fontWeight: '700', color: C.primary, padding: '0 12px',
                    background: 'white', cursor: 'pointer', outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* 選択中表示 */}
            {deliveryDate && (
              <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '12px', background: C.successBg, border: `1px solid ${C.success}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle style={{ width: '18px', height: '18px', color: C.success, flexShrink: 0 }} />
                <span style={{ fontSize: '16px', fontWeight: '700', color: C.success }}>{formatDeliveryDate()} を選択中</span>
              </div>
            )}

            {/* ① 翌日注文の注意表示 */}
            {isTomorrow() && (
              <div style={{ marginTop: '12px', padding: '16px 18px', borderRadius: '12px', background: C.dangerBg, border: `2px solid ${C.danger}`, display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: C.danger, lineHeight: '1.6' }}>
                  翌日注文は取引先との取引条件をご確認のうえ選択ください
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={fixedBottom}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '17px', fontWeight: '700', color: C.textSub }}>小計（税込・配送料込）</span>
            <span style={{ fontSize: '28px', fontWeight: '800', color: C.text }}>¥{total.toLocaleString()}</span>
          </div>
          <button onClick={() => navigate('confirm')} style={bigBtn(C.primary, 'white', '0 4px 16px rgba(26,77,143,0.35)')}>確認画面へ <ArrowRight style={{ width: '22px', height: '22px' }} /></button>
        </div>
      </div>
    </ScreenTransition>
  );

  // ═══════ CONFIRM（④欠品セクション削除済み）═══════
  const renderConfirmScreen = () => (
    <ScreenTransition>
      <div style={{ minHeight: '100vh', paddingBottom: '120px' }}>
        <div style={headerBar}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
            <button onClick={() => navigate('cart')} style={navBtn}><ChevronLeft style={{ width: '22px', height: '22px' }} /> 修正する</button>
            <span style={{ fontWeight: '800', fontSize: '20px', color: C.text }}>注文確認</span>
            <div style={{ width: '80px' }} />
          </div>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <StaggerItem index={0}>
            <div style={{ ...cardStyle, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck style={{ width: '24px', height: '24px', color: C.primary }} />
                </div>
                <div>
                  <div style={{ fontSize: '19px', fontWeight: '800', color: C.text }}>居酒屋「たけ」本店</div>
                  <div style={{ fontSize: '16px', color: C.textSub, fontWeight: '600', marginTop: '2px' }}>東京都渋谷区神南1-2-3</div>
                </div>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem index={1}>
            <div style={{ ...cardStyle, padding: '18px', background: C.primaryLight, border: `2px solid ${C.primary}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar style={{ width: '22px', height: '22px', color: C.primary }} />
                <div style={{ fontSize: '20px', fontWeight: '800', color: C.primary }}>{formatDeliveryDate()} 納品予定</div>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem index={2}>
            <div style={cardStyle}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontSize: '18px', fontWeight: '800', color: C.text }}>注文商品（{cartItems.length}品）</div>
              {cartItems.map((item, idx) => (
                <div key={item.id} style={{ padding: '14px 20px', borderBottom: idx < cartItems.length - 1 ? '1px solid #eee' : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <InlineIcon name={item.name} code={item.code} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: C.text }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: C.textMuted, fontWeight: '600' }}>{getSpec(item.name, item.code)}</div>
                    <div style={{ fontSize: '15px', color: C.textSub, fontWeight: '600' }}>¥{item.price} × {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: C.text }}>¥{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ padding: '18px 20px', borderTop: `2px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '19px', fontWeight: '800', color: C.text }}>合計</span>
                <div>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: C.primary }}>¥{total.toLocaleString()}</span>
                  <div style={{ fontSize: '14px', color: C.textMuted, fontWeight: '600', textAlign: 'right', marginTop: '2px' }}>税込・配送料込</div>
                </div>
              </div>
            </div>
          </StaggerItem>
        </div>
        <div style={fixedBottom}>
          <button onClick={() => navigate('complete')} style={bigBtn(C.success, 'white', '0 4px 16px rgba(27,109,61,0.35)')}>
            <CheckCircle style={{ width: '22px', height: '22px' }} /> この内容で送信する
          </button>
        </div>
      </div>
    </ScreenTransition>
  );

  // ═══════ COMPLETE ═══════
  const renderCompleteScreen = () => {
    const [show, setShow] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShow(true), 300); return () => clearTimeout(t); }, []);
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(170deg, #e8f5e9 0%, #f5f3ef 40%, #e8f0fb 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.success}, #2e7d32)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(27,109,61,0.35)', transform: show ? 'scale(1)' : 'scale(0.3)', opacity: show ? 1 : 0, transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <CheckCircle style={{ width: '56px', height: '56px', color: 'white' }} />
        </div>
        <div style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s ease 0.2s', textAlign: 'center', marginTop: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: C.text, marginBottom: '8px' }}>注文完了！</h1>
          <p style={{ fontSize: '18px', color: C.textSub, fontWeight: '600' }}>ご注文ありがとうございます</p>
        </div>
        <div style={{ ...cardStyle, padding: '28px', width: '100%', maxWidth: '380px', marginTop: '28px', opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.5s ease 0.35s' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '15px', color: C.textMuted, fontWeight: '700', marginBottom: '4px' }}>注文番号</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: C.primary }}>#20241226-0042</div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: C.text, fontWeight: '600' }}>
              <Mail style={{ width: '22px', height: '22px', color: C.primary }} /> 確認メールを送信しました
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: C.accentBg, padding: '14px', borderRadius: '12px', fontSize: '17px', color: '#5c4003', fontWeight: '700' }}>
              <Clock style={{ width: '22px', height: '22px', color: C.accent }} /> 17時まで変更可能です
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => navigate('entry')} style={bigBtn(C.primary, 'white', '0 4px 16px rgba(26,77,143,0.35)')}>トップに戻る</button>
            <button onClick={() => navigate('products')} style={{ ...bigBtn('white', C.primary), border: `2px solid ${C.primary}` }}>続けて注文する</button>
          </div>
        </div>
      </div>
    );
  };

  // ═══════ ⑥ HISTORY (一覧) ═══════
  const renderHistoryScreen = () => {
    const years = [...new Set(orderHistory.map(o => o.ym.split('-')[0]))].sort().reverse();
    const monthsInYear = [...new Set(orderHistory.filter(o => o.ym.startsWith(filterYear)).map(o => parseInt(o.ym.split('-')[1])))].sort((a,b) => b - a);
    const filtered = orderHistory.filter(o => {
      if (!filterYear) return true;
      if (!o.ym.startsWith(filterYear)) return false;
      if (filterMonth === 'all') return true;
      return o.ym === `${filterYear}-${String(filterMonth).padStart(2,'0')}`;
    });

    return (
      <ScreenTransition>
        <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
          <div style={headerBar}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
              <button onClick={() => navigate('entry')} style={navBtn}><ChevronLeft style={{ width: '22px', height: '22px' }} /> 戻る</button>
              <span style={{ fontWeight: '800', fontSize: '20px', color: C.text }}>注文履歴</span>
              <div style={{ width: '80px' }} />
            </div>
            {/* 年月フィルター: 年セレクト + 月ボタン */}
            <div style={{ padding: '0 20px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setFilterMonth('all'); }} style={{
                  padding: '10px 16px', borderRadius: '12px', border: `2px solid ${C.primary}`,
                  background: C.primaryLight, color: C.primary, fontSize: '17px', fontWeight: '800',
                  cursor: 'pointer', outline: 'none', appearance: 'auto',
                }}>
                  {years.map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
                <span style={{ fontSize: '15px', color: C.textMuted, fontWeight: '600' }}>{filtered.length}件の注文</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => setFilterMonth('all')} style={{
                  padding: '8px 16px', borderRadius: '20px',
                  border: filterMonth === 'all' ? `2px solid ${C.primary}` : `2px solid ${C.border}`,
                  background: filterMonth === 'all' ? C.primary : 'white',
                  color: filterMonth === 'all' ? 'white' : C.textSub,
                  fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                }}>全月</button>
                {monthsInYear.map(m => (
                  <button key={m} onClick={() => setFilterMonth(m)} style={{
                    padding: '8px 16px', borderRadius: '20px',
                    border: filterMonth === m ? `2px solid ${C.primary}` : `2px solid ${C.border}`,
                    background: filterMonth === m ? C.primary : 'white',
                    color: filterMonth === m ? 'white' : C.textSub,
                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                  }}>{m}月</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: C.textMuted, fontSize: '17px', fontWeight: '600' }}>
                該当する注文はありません
              </div>
            ) : filtered.map((order, idx) => (
              <StaggerItem key={order.id} index={idx}>
              <div style={{ ...cardStyle, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: C.textMuted, fontWeight: '600', marginBottom: '2px' }}>{order.date}</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: C.primary }}>{order.id}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ padding: '5px 12px', borderRadius: '20px', background: C.successBg, color: C.success, fontSize: '14px', fontWeight: '700' }}>{order.status}</span>
                    {chatThreads[order.id] && chatThreads[order.id].length > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: C.danger }}>
                        <MessageCircle style={{ width: '18px', height: '18px', color: 'white' }} />
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', padding: '12px 0', borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: '13px', color: C.textMuted, fontWeight: '600' }}>品数</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: C.text }}>{order.items.length}品</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: C.textMuted, fontWeight: '600' }}>合計</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: C.text }}>¥{order.total.toLocaleString()}</div>
                  </div>
                </div>
                {/* ボタン2つ: 注文詳細 / 再注文 */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button onClick={() => { setSelectedOrder(order); navigate('historyDetail'); }} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px', borderRadius: '12px', border: `2px solid ${C.primary}`, background: 'white',
                    color: C.primary, fontSize: '15px', fontWeight: '700', cursor: 'pointer', minHeight: '52px',
                  }}>
                    <ExternalLink style={{ width: '18px', height: '18px' }} /> 注文詳細
                  </button>
                  <button onClick={() => {
                    const newItems = order.items.map((it, i) => ({ ...it, id: Date.now() + i }));
                    setCartItems(newItems);
                    showToast(`${order.id} の内容をカートに読込みました`);
                    navigate('cart');
                  }} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px', borderRadius: '12px', border: 'none', background: C.primary,
                    color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', minHeight: '52px',
                  }}>
                    <RotateCcw style={{ width: '18px', height: '18px' }} /> 再注文
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
          </div>
        </div>
      </ScreenTransition>
    );
  };

  // ═══════ HISTORY DETAIL (注文詳細) ═══════
  const generateOrderPDF = (order) => {
    const orderTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const rows = order.items.map((item, i) =>
      `<tr style="border-bottom:1px solid #ddd;">
        <td style="padding:10px 8px;font-size:14px;">${i+1}</td>
        <td style="padding:10px 8px;font-size:14px;">${item.name}</td>
        <td style="padding:10px 8px;font-size:13px;color:#555;">${item.code}</td>
        <td style="padding:10px 8px;text-align:right;font-size:14px;">¥${item.price.toLocaleString()}</td>
        <td style="padding:10px 8px;text-align:center;font-size:14px;">${item.quantity}</td>
        <td style="padding:10px 8px;text-align:right;font-size:14px;font-weight:bold;">¥${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    ).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>注文明細 ${order.id}</title>
      <style>
        @media print { body { margin: 0; } @page { margin: 15mm; } }
        body { font-family: 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 24px; margin: 0 0 4px; } h2 { font-size: 18px; color: #1a4d8f; margin: 0 0 20px; }
        .info { display: flex; gap: 40px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #1a4d8f; }
        .info div { } .info .label { font-size: 12px; color: #777; } .info .value { font-size: 18px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { background: #1a4d8f; color: white; padding: 10px 8px; text-align: left; font-size: 13px; }
        th:nth-child(4), th:nth-child(5), th:nth-child(6) { text-align: right; }
        th:nth-child(5) { text-align: center; }
        .total-row { background: #f5f3ef; font-weight: bold; }
        .total-row td { padding: 14px 8px; font-size: 16px; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #888; text-align: center; }
        .print-btn { display: block; margin: 20px auto; padding: 14px 40px; background: #1a4d8f; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; }
        @media print { .print-btn { display: none; } }
      </style></head><body>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
        <div>
          <h1>注文明細書</h1>
          <h2>${order.id}</h2>
        </div>
        <div style="text-align:right;font-size:13px;color:#555;">
          <div style="font-weight:bold;font-size:15px;">（株）丸将</div>
          <div style="margin-top:8px;">注文日: ${order.date}</div>
        </div>
      </div>
      <div class="info">
        <div><div class="label">お客様</div><div class="value">株式会社 丸山食品</div></div>
        <div><div class="label">納品先</div><div class="value">居酒屋「たけ」本店</div></div>
        <div><div class="label">ステータス</div><div class="value">${order.status}</div></div>
      </div>
      <table>
        <thead><tr><th>#</th><th>商品名</th><th>商品コード</th><th style="text-align:right;">単価</th><th style="text-align:center;">数量</th><th style="text-align:right;">小計</th></tr></thead>
        <tbody>${rows}
          <tr class="total-row"><td colspan="4"></td><td style="text-align:center;font-size:14px;">${order.items.reduce((s,i)=>s+i.quantity,0)}点</td><td style="text-align:right;font-size:18px;color:#1a4d8f;">¥${orderTotal.toLocaleString()}</td></tr>
        </tbody>
      </table>
      <div class="footer">
        <p>スマートオーダー ／ DXONE株式会社</p>
      </div>
      <button class="print-btn" onclick="window.print()">🖨️ 印刷 / PDF保存</button>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
    else showToast('ポップアップを許可してください', 'accent');
  };

  const renderHistoryDetailScreen = () => {
    const order = selectedOrder;
    if (!order) return <div style={{ padding: '40px', textAlign: 'center' }}>注文が選択されていません</div>;
    const orderTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
    return (
      <ScreenTransition>
        <div style={{ minHeight: '100vh', paddingBottom: '20px' }}>
          <div style={headerBar}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
              <button onClick={() => navigate('history')} style={navBtn}><ChevronLeft style={{ width: '22px', height: '22px' }} /> 履歴一覧</button>
              <span style={{ fontWeight: '800', fontSize: '20px', color: C.text }}>注文詳細</span>
              <div style={{ width: '80px' }} />
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 注文情報ヘッダ */}
            <StaggerItem index={0}>
              <div style={{ ...cardStyle, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: C.textMuted, fontWeight: '600', marginBottom: '4px' }}>{order.date}</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: C.primary }}>{order.id}</div>
                  </div>
                  <span style={{ padding: '6px 14px', borderRadius: '20px', background: C.successBg, color: C.success, fontSize: '14px', fontWeight: '700' }}>{order.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '24px', paddingTop: '12px', borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: '13px', color: C.textMuted, fontWeight: '600' }}>品数</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: C.text }}>{order.items.length}品</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: C.textMuted, fontWeight: '600' }}>合計金額</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: C.text }}>¥{orderTotal.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* 商品一覧 */}
            <StaggerItem index={1}>
              <div style={cardStyle}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontSize: '18px', fontWeight: '800', color: C.text }}>
                  注文商品
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ padding: '14px 20px', borderBottom: idx < order.items.length - 1 ? '1px solid #eee' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <InlineIcon name={item.name} code={item.code} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '17px', fontWeight: '700', color: C.text }}>{item.name}</div>
                      <div style={{ fontSize: '14px', color: C.textMuted, fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getSpec(item.name, item.code)}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: C.text }}>¥{(item.price * item.quantity).toLocaleString()}</div>
                      <div style={{ fontSize: '14px', color: C.textMuted, fontWeight: '600' }}>¥{item.price} × {item.quantity}</div>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '16px 20px', borderTop: `2px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: C.text }}>合計</span>
                  <div>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: C.primary }}>¥{orderTotal.toLocaleString()}</span>
                    <div style={{ fontSize: '13px', color: C.textMuted, fontWeight: '600', textAlign: 'right' }}>税込・配送料込</div>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* アクション: PDF保存 + 再注文（インライン配置） */}
            <StaggerItem index={2}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => generateOrderPDF(order)} style={{
                  flex: 1, background: 'white', color: C.primary, border: `2px solid ${C.primary}`, borderRadius: '14px',
                  padding: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '56px',
                }}>
                  <Download style={{ width: '20px', height: '20px' }} /> PDF保存
                </button>
                <button onClick={() => {
                  const newItems = order.items.map((it, i) => ({ ...it, id: Date.now() + i }));
                  setCartItems(newItems);
                  showToast(`${order.id} の内容をカートに読込みました`);
                  navigate('cart');
                }} style={{
                  flex: 1, background: C.primary, color: 'white', border: 'none', borderRadius: '14px',
                  padding: '16px', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '56px',
                  boxShadow: '0 4px 16px rgba(26,77,143,0.35)',
                }}>
                  <RotateCcw style={{ width: '20px', height: '20px' }} /> 再注文する
                </button>
              </div>
            </StaggerItem>

            {/* この注文に関するチャット（LINE風・ページごとスクロール） */}
            <StaggerItem index={3}>
              <div style={cardStyle}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle style={{ width: '20px', height: '20px', color: C.primary }} />
                  <span style={{ fontSize: '18px', fontWeight: '800', color: C.text }}>この注文のやり取り</span>
                </div>
                <div style={{ padding: '20px', minHeight: '380px', background: '#f7f6f3' }}>
                  <ChatBubbles messages={chatThreads[order.id]} />
                </div>
                <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, background: C.card }}>
                  <ChatInputBar chatKey={order.id} placeholder="この注文について質問..." />
                </div>
              </div>
            </StaggerItem>
          </div>
        </div>
      </ScreenTransition>
    );
  };

  // ═══════ CHAT SCREEN (全体問い合わせ) ═══════
  const renderChatScreen = () => {
    const messages = chatThreads[activeChatKey] || [];
    const isOrder = activeChatKey !== 'general';
    return (
      <ScreenTransition>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '90px' }}>
          <div style={headerBar}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
              <button onClick={() => navigate(isOrder ? 'historyDetail' : 'entry')} style={navBtn}><ChevronLeft style={{ width: '22px', height: '22px' }} /> 戻る</button>
              <span style={{ fontWeight: '800', fontSize: '20px', color: C.text }}>{isOrder ? '注文のやり取り' : 'お問い合わせ'}</span>
              <div style={{ width: '80px' }} />
            </div>
            {isOrder && (
              <div style={{ padding: '0 20px 12px', fontSize: '14px', color: C.textSub, fontWeight: '700' }}>注文番号: {activeChatKey}</div>
            )}
          </div>

          {/* 仕入先情報バナー */}
          <div style={{ padding: '14px 20px 0' }}>
            <div style={{ ...cardStyle, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#2e7d52', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏢</div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: C.text }}>株式会社 丸将</div>
                <div style={{ fontSize: '14px', color: C.textSub, fontWeight: '600' }}>担当: 営業部</div>
              </div>
            </div>
          </div>

          {/* メッセージ */}
          <div style={{ flex: 1, padding: '16px 20px' }}>
            <ChatBubbles messages={messages} />
          </div>
        </div>

        {/* 固定入力欄 */}
        <div style={{ ...fixedBottom, padding: '12px 16px' }}>
          <ChatInputBar chatKey={activeChatKey} />
        </div>
      </ScreenTransition>
    );
  };

  const screens = { entry: renderEntryScreen, products: renderProductsScreen, cart: renderCartScreen, confirm: renderConfirmScreen, complete: renderCompleteScreen, history: renderHistoryScreen, historyDetail: renderHistoryDetailScreen, chat: renderChatScreen };

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', background: C.bg, minHeight: '100vh', fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', -apple-system, sans-serif", position: 'relative', overflow: 'hidden', boxShadow: '0 0 60px rgba(0,0,0,0.1)' }}>
      <Toast {...toast} />
      <div style={{ height: '44px', background: 'linear-gradient(135deg, #0d2b52, #1a4d8f)', position: 'sticky', top: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px' }}>
        <span style={{ fontSize: '17px', color: 'rgba(255,255,255,0.9)', fontWeight: '700' }}>（株）丸将</span>
      </div>
      {screens[currentScreen]()}
      {/* フッター */}
      <div style={{ padding: '24px 20px 32px', textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: '16px', fontWeight: '800', color: C.textSub, letterSpacing: '0.05em' }}>スマートオーダー</div>
        <div style={{ fontSize: '13px', color: C.textMuted, fontWeight: '600', marginTop: '4px' }}>DXONE株式会社</div>
      </div>
    </div>
  );
};

export default RestaurantOrderPortal;
