"""Generate site/privacy.html from site/index.html plus the policy body.

The stylesheet, header, footer and page script are lifted from index.html
verbatim so the two pages cannot drift apart: one edit to the header or the
fade-in behaviour lands on both. Only the in-page anchors are rewritten, since
from the policy page they have to point back at the top page.
"""
import re

SRC = 'site/index.html'
OUT = 'site/privacy.html'

POLICY = [
    ("1. 事業者の名称および個人情報取扱責任者",
     ['<p>名称：一般社団法人ともに生きる実践ラボ<br/>個人情報保護管理者：代表理事<br/>'
      '連絡先：<a href="mailto:info@tomoiki-lab.org">info@tomoiki-lab.org</a>／'
      '<a href="tel:09083833243">090-8383-3243</a></p>']),
    ("2. 取得する個人情報",
     ['<p>当法人は、適法かつ公正な手段により、以下の情報を取得します。</p>',
      '<ul><li>氏名、ふりがな、年齢または年代、居住地域</li>'
      '<li>メールアドレス、電話番号、住所、所属先・職業等の連絡先情報</li>'
      '<li>イベント・見学会・講座等へのお申込内容、アンケートへのご回答、お問い合わせ内容</li>'
      '<li>会費・参加費等のお支払いに関する情報（決済事業者を通じて取得する範囲に限ります）</li>'
      '<li>当法人の活動において撮影した写真・動画のうち、個人を識別できるもの</li>'
      '<li>ウェブサイトの閲覧情報（IPアドレス、ブラウザの種類、閲覧日時、参照元ページ、Cookie等の識別子）</li></ul>',
      '<p class="sub">要配慮個人情報（病歴、障がい、信条等）は、法令に基づく場合を除き、'
      'ご本人の同意なく取得しません。</p>']),
    ("3. 利用目的",
     ['<p>取得した個人情報は、以下の目的の範囲内で利用します。</p>',
      '<ul><li>イベント、見学会、講座、コミュニティ活動等の運営、ご連絡および受付管理</li>'
      '<li>お問い合わせ、ご意見・ご相談への対応</li>'
      '<li>当法人の活動報告、ニュースレター、催事のご案内の送付</li>'
      '<li>会費・参加費等の請求、受領および会計処理</li>'
      '<li>活動記録・広報のための写真・動画等の掲載（ご本人の同意を得た範囲に限ります）</li>'
      '<li>統計的に処理した情報の作成および活動改善・調査研究への利用（個人を識別できない形式に限ります）</li>'
      '<li>法令上の義務の履行および当法人の権利の行使・防御</li></ul>',
      '<p class="sub">利用目的を変更する場合は、変更後の目的が変更前の目的と関連性を有すると'
      '合理的に認められる範囲に限り、変更内容を本ページに掲載し、またはご本人へ通知します。</p>']),
    ("4. 第三者提供",
     ['<p>当法人は、次のいずれかに該当する場合を除き、あらかじめご本人の同意を得ることなく'
      '個人データを第三者に提供しません。</p>',
      '<ul><li>法令に基づく場合</li>'
      '<li>人の生命、身体または財産の保護のために必要があり、ご本人の同意を得ることが困難な場合</li>'
      '<li>公衆衛生の向上または児童の健全な育成の推進のために特に必要があり、'
      'ご本人の同意を得ることが困難な場合</li>'
      '<li>国の機関等の法令の定める事務への協力が必要で、同意取得により当該事務の遂行に'
      '支障を及ぼすおそれがある場合</li></ul>',
      '<p>共催・協力団体とともに事業を実施する場合など、共同利用を行うときは、'
      '共同して利用される項目、範囲、利用目的および管理責任者を事前に公表・通知します。</p>']),
    ("5. 業務委託および外部サービスの利用",
     ['<p>利用目的の達成に必要な範囲で、個人情報の取扱いを外部に委託することがあります。'
      'この場合、委託先の適格性を審査し、契約により安全管理義務を課したうえで、'
      '必要かつ適切な監督を行います。当法人は、イベント申込・決済（Peatix）、'
      'コミュニティ運営（Facebookグループ）、メール配信、ウェブサイトのホスティング等の'
      '外部サービスを利用しています。これらのサービスにおける個人情報の取扱いは、'
      '各事業者のプライバシーポリシーにも従います。</p>']),
    ("6. 外国にある第三者への提供",
     ['<p>前項の外部サービスの一部は、サーバーが日本国外に所在する場合があります。'
      '外国にある第三者へ個人データを提供する場合は、個人情報保護法の定めに従い、'
      '当該国の個人情報保護制度等に関する情報を提供したうえで、あらかじめご本人の同意を得るか、'
      'または基準に適合する体制を整備した提供先に限って提供します。</p>']),
    ("7. 安全管理措置",
     ['<p>当法人は、個人データの漏えい、滅失または毀損の防止その他の安全管理のため、'
      '次の措置を講じます。取扱規程の整備と責任者の設置（組織的措置）、'
      '役員・スタッフ・ボランティアへの教育および秘密保持の徹底（人的措置）、'
      '書類・記録媒体の施錠保管と持出制限（物理的措置）、アクセス権限の限定、通信の暗号化、'
      '不正アクセス対策ソフトの導入（技術的措置）。漏えい等が発生し、'
      '個人の権利利益を害するおそれがある場合は、個人情報保護委員会への報告および'
      'ご本人への通知を速やかに行います。</p>']),
    ("8. 保有期間",
     ['<p>個人情報は、利用目的の達成に必要な期間、または法令で定められた保存期間に限り保有し、'
      'その必要がなくなったときは遅滞なく消去または適切に廃棄します。</p>']),
    ("9. Cookie等の取扱い",
     ['<p>当ウェブサイトは、利便性の向上および閲覧状況の把握のためにCookieおよび類似技術を'
      '使用することがあります。これらの情報は原則として個人を特定しない形式で利用します。'
      'Cookieはブラウザの設定により無効化できますが、'
      '一部の機能がご利用いただけない場合があります。</p>']),
    ("10. 写真・動画の取扱い",
     ['<p>イベント等では、活動記録および広報のために写真・動画を撮影する場合があります。'
      '撮影・掲載を希望されない場合は、当日スタッフまたは下記窓口へお申し出ください。'
      '掲載後であっても、ご連絡をいただき次第、合理的な範囲で速やかに削除等の対応を行います。</p>']),
    ("11. 開示・訂正・利用停止等のご請求",
     ['<p>ご本人またはその代理人から、保有個人データの利用目的の通知、開示、'
      '内容の訂正・追加・削除、利用の停止・消去、第三者提供の停止のご請求があった場合は、'
      'ご本人であることを確認のうえ、法令に従い遅滞なく対応します。'
      'ご請求は下記窓口までご連絡ください。</p>']),
    ("12. 未成年者の個人情報",
     ['<p>15歳未満の方の個人情報については、原則として保護者の方の同意を得たうえで取得します。</p>']),
    ("13. 本ポリシーの変更",
     ['<p>法令の改正または当法人の活動内容の変更に応じて、本ポリシーを改定することがあります。'
      '重要な変更を行う場合は、本ページにて改定日とともに公表します。</p>']),
]

CONTACT = """<div class="policy-contact" data-fx="">
<h2>14. お問い合わせ窓口</h2>
<p>個人情報の取扱いに関するお問い合わせ、開示等のご請求は、下記までご連絡ください。</p>
<div class="contact-lines">
<span class="who">一般社団法人ともに生きる実践ラボ　個人情報お問い合わせ窓口</span>
<div class="contact-row">
<img alt="" src="assets/icon-mail.png"/>
<a href="mailto:info@tomoiki-lab.org">info@tomoiki-lab.org</a>
</div>
<div class="contact-row">
<img alt="" src="assets/icon-phone.png"/>
<a href="tel:09083833243">090-8383-3243</a>
</div>
</div>
</div>"""

EXTRA_CSS = """
/* ============ PRIVACY POLICY ============ */
.policy-head{background:var(--cream);padding:72px 0 36px}
.policy-head .inner{max-width:940px}
.crumbs{display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--muted);
  margin-bottom:30px;flex-wrap:wrap}
.crumbs a{color:var(--muted);text-decoration:none}
.crumbs a:hover{color:var(--olive)}
.crumbs .here{color:var(--olive)}
.policy-title{display:flex;align-items:baseline;gap:18px;margin-bottom:18px;flex-wrap:wrap}
.policy-title h1{font-family:var(--serif);font-weight:600;font-size:34px;letter-spacing:3px;
  color:var(--ink-dark)}
.policy-title span{font-family:var(--display);font-style:italic;font-size:17px;
  letter-spacing:2px;color:var(--gold)}
.policy-intro{font-size:14.5px;line-height:2.1;color:var(--ink-soft);text-wrap:pretty}

.policy-body{background:var(--cream);padding:0 0 96px}
.policy-body .inner{max-width:940px;display:flex;flex-direction:column;gap:46px}
.policy-sec{display:flex;flex-direction:column;gap:14px;padding-top:34px;
  border-top:1px solid var(--line)}
.policy-sec h2{font-family:var(--serif);font-weight:600;font-size:19px;letter-spacing:1.5px;
  color:var(--ink-dark)}
.policy-sec p,.policy-contact p{font-size:14px;line-height:2.1;color:var(--ink-mid2);
  text-wrap:pretty}
.policy-sec p.sub{font-size:13px;line-height:2;color:var(--ink-soft)}
.policy-sec ul{list-style:disc;padding-left:1.3em;display:flex;flex-direction:column;gap:9px}
.policy-sec li{font-size:14px;line-height:2;color:var(--ink-mid2)}
.policy-sec a,.policy-contact a{color:var(--olive)}
.policy-sec a:hover,.policy-contact a:hover{color:var(--gold)}

.policy-contact{display:flex;flex-direction:column;gap:16px;padding:34px 34px 36px;
  background:var(--sand);border-radius:4px}
.policy-contact h2{font-family:var(--serif);font-weight:600;font-size:19px;
  letter-spacing:1.5px;color:var(--ink-dark)}
.contact-lines{display:flex;flex-direction:column;gap:12px}
.contact-lines .who{font-size:14px;line-height:1.9;color:var(--ink-mid2)}
.policy-contact .contact-row{display:flex;align-items:center;gap:10px}
.policy-contact .contact-row img{width:20px;height:20px;flex:none}
.policy-contact .contact-row a{font-size:13.5px;color:var(--ink-mid2);text-decoration:none}

.policy-sign{display:flex;flex-direction:column;gap:6px;align-items:flex-end}
.policy-sign span{font-size:12.5px;color:var(--muted)}

@media (max-width:960px){
  .policy-head{padding:48px 0 28px}
  .policy-title h1{font-size:26px;letter-spacing:2px}
  .policy-body{padding-bottom:64px}
  .policy-body .inner{gap:36px}
  .policy-contact{padding:26px 24px 28px}
}
@media (max-width:560px){
  .policy-title h1{font-size:23px}
  .policy-sign{align-items:flex-start}
}
"""


def grab(src, start, end, label):
    i = src.index(start)
    j = src.index(end, i) + len(end)
    print(f'  取得: {label}')
    return src[i:j]


def main():
    src = open(SRC, encoding='utf-8').read()

    style = grab(src, '<style>', '</style>', 'スタイルシート')
    header = grab(src, '<header class="site-header">', '</header>', 'ヘッダー')
    footer = grab(src, '<footer class="site-footer">', '</footer>', 'フッター')
    script = grab(src, '<script>', '</script>', 'ページスクリプト')
    bar = grab(src, '<div class="connect-bar">', '</div>', 'グラデーションバー')

    # From this page the top page's anchors need the file name in front.
    header = re.sub(r'href="#(concept|philosophy|origin|ladder|firstday|join|top)"',
                    r'href="index.html#\1"', header)
    header = header.replace('href="index.html#top"', 'href="index.html"')
    footer = re.sub(r'href="#(concept|philosophy|origin|ladder|firstday|join|news)"',
                    r'href="index.html#\1"', footer)
    # Self-link: mark the current page instead of linking to it.
    footer = footer.replace('<a href="privacy.html">プライバシーポリシー</a>',
                            '<span class="here">プライバシーポリシー</span>')

    style = style.replace('</style>', EXTRA_CSS + '</style>')

    secs = []
    for n, (title, paras) in enumerate(POLICY):
        d = f' style="--d:{min(n, 3) * 0.06:.2f}s"' if n else ''
        secs.append(f'<div class="policy-sec" data-fx=""{d}>\n'
                    f'<h2>{title}</h2>\n' + '\n'.join(paras) + '\n</div>')

    page = f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>プライバシーポリシー｜一般社団法人 ともに生きる実践ラボ</title>
<meta name="description" content="一般社団法人ともに生きる実践ラボの個人情報の取扱いに関する方針です。">
<meta name="robots" content="index, follow">
<link rel="icon" href="assets/tomoiki-mark.png">

<meta property="og:type" content="article">
<meta property="og:title" content="プライバシーポリシー｜一般社団法人 ともに生きる実践ラボ">
<meta property="og:description" content="一般社団法人ともに生きる実践ラボの個人情報の取扱いに関する方針です。">
<meta property="og:image" content="assets/logo-color.png">
<meta name="twitter:card" content="summary">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">

{style}
</head>
<body>
<!-- ============ HEADER ============ -->
{header}
{bar}

<!-- ============ TITLE ============ -->
<section class="policy-head">
<div class="inner">
<p class="crumbs" data-fx=""><a href="index.html">ホーム</a><span>／</span><span class="here">プライバシーポリシー</span></p>
<div class="policy-title" data-fx="" style="--d:0.06s">
<h1>プライバシーポリシー</h1>
<span>privacy policy</span>
</div>
<p class="policy-intro" data-fx="" style="--d:0.12s">一般社団法人ともに生きる実践ラボ（以下「当法人」といいます。）は、当法人が運営するウェブサイトおよび当法人の事業活動において取得する個人情報の重要性を認識し、個人情報の保護に関する法律（以下「個人情報保護法」といいます。）その他の関係法令およびガイドラインを遵守するとともに、以下の方針に基づき個人情報を適正に取り扱います。</p>
</div>
</section>

<!-- ============ POLICY ============ -->
<section class="policy-body">
<div class="inner">
{chr(10).join(secs)}
{CONTACT}
<div class="policy-sign" data-fx="">
<span>制定日：2026年9月20日</span>
<span>一般社団法人ともに生きる実践ラボ　代表理事</span>
</div>
</div>
</section>

<!-- ============ FOOTER ============ -->
{footer}

{script}
</body>
</html>
'''
    open(OUT, 'w', encoding='utf-8').write(page)
    print(f'\n{OUT} を生成しました（{len(page):,} 文字、条項 {len(POLICY) + 1} 件）')


if __name__ == '__main__':
    main()
