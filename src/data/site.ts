/** イベント全体の基本情報 */
export const event = {
  title: "オルスクフェス2026",
  titleSub: "@ONLINE",
  catch: "〜 新しい教育のカタチに出会う2日間 〜",
  lead: "全国13校のオルタナティブスクールと出会う2日間",
  dates: [
    { day: "9.26", wd: "土", color: "brand" as const },
    { day: "9.27", wd: "日", color: "pink" as const },
  ],
  timeNote: "両日 9:00 - 12:00　オンライン開催（Zoom）",
  organizer: "オルタナティブスクール・ジャパン",
  organizerShort: "ASJ",
  organizerTagline: "未来の学びを、みんなでつくる。",
  applyUrl: "#apply",
};

/** ヘッダーナビゲーション */
export const nav = [
  { label: "オルスクフェスとは", href: "#about" },
  { label: "参加校", href: "#schools" },
  { label: "プログラム", href: "#program" },
  { label: "よくある質問", href: "#faq" },
  { label: "お知らせ", href: "#news" },
  { label: "主催者情報", href: "#organizer" },
];

/** 共感パート（お悩み） */
export const worries = [
  { text: "今の学校のあり方に\n違和感がある…\nほかの選択肢も知りたい", face: "a" as const },
  { text: "わが子に合った\n学びの場を見つけたい！", face: "b" as const },
  { text: "不登校・登校しぶりでも\n参加できる学校は？", face: "c" as const },
  { text: "教育の多様な選択肢に\nついて詳しく\n知りたい！", face: "d" as const },
];

/** できる3つのこと */
export const features = [
  {
    no: "01",
    title: "知る",
    lead: "全国の多様な学びの場を一度に知る",
    body: "13校のオルタナティブスクールが参加！",
    scene: "online" as const,
  },
  {
    no: "02",
    title: "比べる",
    lead: "気になるスクールと直接話して比較",
    body: "疑問や不安をその場で質問できます。",
    scene: "compare" as const,
  },
  {
    no: "03",
    title: "話す",
    lead: "ブレイクアウトルームで少人数で相談",
    body: "先生・在校生・保護者と気軽に話せます。",
    scene: "talk" as const,
  },
];

/** 参加スクール（13校） */
export const schools = [
  { name: "タテノイト", area: "長野県", scene: 0 },
  { name: "自由学舎EUREKA", area: "北海道", scene: 1 },
  { name: "学びの森\nオルタナティブスクール", area: "京都府", scene: 2 },
  { name: "モンテッソーリ・エレメンタリー\nスクール北九州（MEK）", area: "福岡県", scene: 3 },
  { name: "ラーンネット・グローバルスクール\n／ラーンネット・エッジ", area: "兵庫県", scene: 4 },
  { name: "湘南ホクレア学園", area: "神奈川県", scene: 5 },
  { name: "インフィニティ国際学院\n中等部・高等部", area: "全国", scene: 6 },
  { name: "箕面こどもの森学園", area: "大阪府", scene: 7 },
  { name: "ヒミツキチ森学園", area: "神奈川県", scene: 8 },
  { name: "学び舎トーカ", area: "愛知県", scene: 9 },
  { name: "藤枝みんなのミライ楽校", area: "静岡県", scene: 10 },
  { name: "逗子オルタナティブ\nスクールFRASCO", area: "神奈川県", scene: 11 },
  { name: "ぐるりミライスクール", area: "東京都", scene: 12 },
];

/** タイムテーブル */
export const timetable = [
  {
    date: "9.26",
    wd: "土",
    tone: "brand" as const,
    rows: [
      { time: "9:00", label: "オープニング" },
      { time: "9:20", label: "学校紹介セッション①" },
      { time: "10:00", label: "ブレイクアウトルーム①" },
      { time: "10:50", label: "学校紹介セッション②" },
      { time: "11:30", label: "ブレイクアウトルーム②" },
    ],
  },
  {
    date: "9.27",
    wd: "日",
    tone: "pink" as const,
    rows: [
      { time: "9:00", label: "オープニング" },
      { time: "9:20", label: "学校紹介セッション③" },
      { time: "10:00", label: "ブレイクアウトルーム③" },
      { time: "10:50", label: "学校紹介セッション④" },
      { time: "11:30", label: "クロージング" },
    ],
  },
];

/** イベント概要 */
export const overview = [
  { icon: "calendar" as const, label: "開催方法", value: "オンライン（Zoom）" },
  { icon: "people" as const, label: "開催日時", value: "2026.9.26（土）・9.27（日）\n両日 9:00-12:00" },
  { icon: "coin" as const, label: "参加費", value: "1,000円\n（両日参加可）" },
  { icon: "target" as const, label: "対象", value: "保護者・教育関係者・\n学生などどなたでも" },
  { icon: "seat" as const, label: "定員", value: "100名" },
];

/** こんな方におすすめ */
export const recommend = [
  { text: "子どもに合った\n学びの場を探している保護者の方", icon: "parent" as const },
  { text: "教育の多様な選択肢を\n知りたい方", icon: "search" as const },
  { text: "不登校・登校しぶりで\n悩んでいる方", icon: "heart" as const },
  { text: "教育関係の仕事をしている\n方・学んでいる方", icon: "work" as const },
];

/** よくある質問 */
export const faqs = [
  {
    q: "どのように参加すればいいですか？",
    a: "申し込みフォームからお申し込みいただくと、開催前日までにZoomの参加URLをメールでお送りします。当日はURLをクリックするだけでご参加いただけます。",
  },
  {
    q: "途中参加や中座退出はできますか？",
    a: "はい、可能です。ご都合のよい時間だけのご参加でも問題ありません。気になるスクールのセッションだけ参加される方も多くいらっしゃいます。",
  },
  {
    q: "子どもも一緒に参加できますか？",
    a: "もちろん大歓迎です。お子さまと一緒に画面をご覧いただきながら、気になったことをその場で質問していただけます。",
  },
  {
    q: "録画の配信はありますか？",
    a: "お申し込みいただいた方限定で、開催後2週間のアーカイブ配信を予定しています（一部セッションを除く）。当日ご参加が難しい方もご活用ください。",
  },
  {
    q: "参加費の支払い方法を教えてください",
    a: "クレジットカード決済、またはコンビニ決済をご利用いただけます。お申し込み後に送られる案内メールからお手続きください。",
  },
  {
    q: "キャンセルはできますか？",
    a: "開催3日前まではマイページからキャンセルが可能で、参加費を全額返金いたします。それ以降のキャンセルは返金いたしかねますのでご了承ください。",
  },
];

/** お知らせ */
export const news = [
  { date: "2026.09.01", tag: "更新", text: "参加スクールが13校に決定しました！" },
  { date: "2026.08.20", tag: "受付", text: "オルスクフェス2026のお申し込み受付を開始しました。" },
  { date: "2026.08.01", tag: "お知らせ", text: "開催日程が2026年9月26日(土)・27日(日)に決定しました。" },
];
