# แผน SEO — ไทยชลธาร พลาส (TH / EN)

วันที่: 21 ตุลาคม 2026
ขอบเขต: แผนจากโค้ดและข้อมูลในโปรเจกต์นี้; พื้นฐาน SEO ระยะ 1 ถูกเพิ่มในโค้ดแล้วตาม SEO-DEPLOYMENT.md แต่ยังไม่ได้เผยแพร่บน production หรือตรวจ Search Console / Analytics / อันดับจริง
เป้าหมาย: เพิ่มผู้ซื้อ B2B ที่ค้นหาชิ้นส่วนหรือโรงงานผลิต และวัดการสอบถามที่มีคุณภาพจาก organic search

## สภาพก่อนปรับปรุง (เริ่มงาน)

- มี URL ภาษาไทยเดิมและภาษาอังกฤษ `/en` พร้อม HTML จากเซิร์ฟเวอร์ ชื่อสินค้าและลิงก์หมวดหมู่จริง 8 หมวด รวม 107 รายการ
- `views/partials/includings.ejs` มี hreflang แต่ยังเป็น path สัมพัทธ์ และนำ query ค้นหามารวมด้วย ควรแยก URL สำหรับ SEO ออกจากลิงก์สลับภาษาสำหรับผู้ใช้
- ยังไม่พบ canonical, sitemap.xml, robots.txt หรือ structured data ในซอร์สที่ตรวจ การไม่มี robots.txt ไม่ได้หมายความว่า Google crawl ไม่ได้
- มี description ที่หน้าแรกและหน้ารวมสินค้า แต่หน้าหมวด / เกี่ยวกับ / ติดต่อยังขาดข้อความเฉพาะหน้า
- หน้าหมวดยังเน้นรูปและชื่อสั้น ๆ ไม่มีรายละเอียดการเลือกใช้ สเปก หรือคำอธิบายสินค้าเพียงพอ
- สินค้ายังเปิดรูปด้วย dialog ไม่มี URL รายสินค้า จึงยังไม่มีหน้ารายสินค้าสำหรับรับคำค้นรุ่นหรือขนาดเฉพาะ
- ยังไม่มีข้อมูล Search Console, ปริมาณค้นหา, Core Web Vitals จากผู้ใช้จริง หรือสถิติ lead จึงยังจัดอันดับ keyword ด้วยตัวเลขจริงไม่ได้

## ระยะ 1 — พื้นฐานก่อนเผยแพร่ (ประมาณ 3–5 วันทำงาน)

| งาน | แนวทาง | เกณฑ์รับงาน |
|---|---|---|
| โดเมนหลัก | ยืนยันโดเมนจริง HTTPS และ www/non-www ใช้ `SITE_URL` ที่กำหนดไว้ ไม่สร้าง URL จาก Host header ของผู้ใช้ | redirect 301 ไปโดเมนหลักแบบไม่วนและคง path/query ที่จำเป็น |
| canonical | หน้าไทย canonical กลับหน้าไทย หน้าอังกฤษกลับหน้าอังกฤษ ไม่ชี้ทุกภาษาไปหน้าไทย | แต่ละหน้า indexable มี canonical เต็ม 1 ค่า และตรงกับ sitemap |
| hreflang | ใช้ URL เต็ม TH ↔ EN แบบ reciprocal และ self-reference; ใช้ x-default ไปหน้าไทยเมื่อเลือกไทยเป็นค่าเริ่มต้น | ทุกคู่ตอบ 200 ภาษาและเนื้อหาตรงกัน ไม่มี q/category/tracking query ปะปน |
| query และ URL ซ้ำ | `?q=` มีผลค้นหาให้ `noindex,follow`; `?category=valid-slug` ที่ไม่มีคำค้นให้ย้ายสู่หน้าหมวดมาตรฐาน; ตัด tracking query ออกจาก canonical | หน้า filtered ไม่เพิ่ม URL ซ้ำใน sitemap และหน้าเนื้อหาต่างกันไม่ถูก canonical ไปหน้าไม่ตรงเนื้อหา |
| sitemap.xml | สร้างจาก route และข้อมูลหมวด ใช้ absolute canonical URLs สองภาษา; ถ้าคง `/catalogue` ให้ตัดสินใจ index หรือรวมเข้าหน้าสินค้าอย่างชัดเจน | ไม่มี search, POST `/send`, redirect, 404 หรือ localhost; lastmod ใช้วันที่เปลี่ยนเนื้อหาจริง |
| robots / staging | robots.txt ระบุ sitemap และเปิด asset ที่จำเป็น; พรีวิวใช้ access control หรือ noindex ที่เหมาะสม | production ไม่มี noindex จากพรีวิวหลุดมา; ไม่ใช้ robots.txt ซ่อนความลับ |
| metadata | title / description เฉพาะหน้าและภาษา; OG image/title/description สำหรับการแชร์ | ไม่ซ้ำเป็นชื่อบริษัททุกหน้า; ไม่ยัด keyword |
| structured data | Organization ที่หน้าแรกและ BreadcrumbList ตามหน้าจริง ใช้ชื่อ ที่อยู่ โทรศัพท์และโลโก้ที่ตรวจแล้ว | JSON-LD ผ่านเครื่องมือตรวจและข้อมูลตรงกับเนื้อหาที่เห็น |
| performance | รูป carousel ขนาดเหมาะสม มี width/height; โหลดภาพแรกก่อน ภาพถัดไป/ใต้จอแบบ lazy; วัดฟอนต์และ JS | วัดก่อน/หลังด้วย Lighthouse และ PageSpeed Insights; เป้าหมายภาคสนาม p75: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 |

ข้อสำคัญ: canonical และ hreflang มีหน้าที่ต่างกัน การแปลอังกฤษทั้งหน้าไม่ควรถูกลดให้เป็น canonical ของหน้าไทย [Google: localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## ระยะ 2 — หน้าหมวดและบริการที่ตอบเจตนาซื้อ (ประมาณ 1–2 สัปดาห์)

เริ่มจากหมวดสินค้าที่มีความสำคัญทางธุรกิจจริง โดยให้ฝ่ายขายเลือก 3 หมวดแรกก่อน ไม่อ้างว่าคำต่อไปนี้มีปริมาณค้นหาสูงจนกว่าจะมีข้อมูลยืนยัน

| หน้า | กลุ่มคำค้นไทยสำหรับวิจัย | กลุ่มคำค้นอังกฤษสำหรับวิจัย | เนื้อหาที่ต้องขอเพิ่ม |
|---|---|---|---|
| ลูกล้อ | ลูกล้อเฟอร์นิเจอร์, ลูกล้อ 1.5 นิ้ว, ลูกล้อ 2 นิ้ว | furniture casters, 1.5-inch caster, 2-inch caster | ขนาด วัสดุ วิธีติดตั้ง น้ำหนักรับได้ที่ตรวจสอบแล้ว |
| ล้อลูกปืน | ล้อลิ้นชักลูกปืน, ล้อลูกปืนแกนย้ำ | drawer rollers, bearing rollers | เส้นผ่านศูนย์กลาง ชนิดแกน การใช้งาน |
| งานรีด/ยางขอบ | ยางขอบโต๊ะ, ยางขอบกระจก, ยางขอบประตูตู้ | plastic extrusion profiles, rubber edge trim, cabinet door seals | หน้าตัด ร่อง ปีก วัสดุ ความยาว และภาพวัดขนาด |
| จุกยาง | จุกยางสวมใน, จุกยางขาเก้าอี้ | rubber tube inserts, furniture leg caps | รูปทรง ขนาดภายใน/ภายนอก วัสดุ |
| มือจับและปุ่มจับ | มือจับเฟอร์นิเจอร์, ปุ่มจับตู้ | furniture handles, cabinet knobs | ชื่อรุ่น ขนาด ระยะรู สี |
| ชุดขาปรับระดับ | ขาปรับระดับเฟอร์นิเจอร์ | adjustable furniture feet, levelling feet | ขนาดเกลียว ระยะปรับ น้ำหนักรับได้ |
| อุปกรณ์เฟอร์นิเจอร์ | อะไหล่เฟอร์นิเจอร์, อุปกรณ์ตู้เตียง | furniture fittings, cabinet and bed hardware | แยกกลุ่มงาน เลือกใช้ และสเปกสินค้า |
| ผลิตตามแบบ | รับฉีดพลาสติก, รับรีดพลาสติก, โรงงานผลิตชิ้นส่วนพลาสติก | plastic injection moulding Thailand, custom plastic extrusion | ความสามารถเครื่องจักร วัสดุ ขั้นตอน MOQ / lead time ที่ธุรกิจยืนยัน |

แต่ละหน้าควรมี H1 ตรงประเภทสินค้า คำอธิบายการใช้งาน วิธีเลือก ตารางสเปกที่มีจริง รูปชัด ลิงก์หมวดที่เกี่ยวข้อง และทางขอราคา ข้อมูลสองภาษาต้องมีสาระเท่ากันและให้คนในธุรกิจตรวจศัพท์เทคนิค

ตัวอย่าง title ที่เสนอ:
- TH: `ลูกล้อเฟอร์นิเจอร์ 1.5–2 นิ้ว | ไทยชลธาร พลาส`
- EN: `Furniture Casters & Wheels | Thai Chonlatharn Plas`
- ชื่อขนาดหรือการใช้งานใน title ต้องตรงกับสินค้าจริง ไม่เติมคำรับประกัน/มาตรฐานที่ยังไม่ยืนยัน

## ระยะ 3 — รายสินค้าและความน่าเชื่อถือ (ประมาณ 2–4 สัปดาห์ หลังข้อมูลพร้อม)

1. ทำ URL ถาวรสำหรับสินค้าสำคัญก่อน 10–20 รายการ พร้อมรุ่น สเปก ตารางขนาด รูป และปุ่มขอราคา; ไม่สร้าง 107 หน้าบาง ๆ จากชื่อและรูปอย่างเดียว
2. เพิ่มหน้าบริการงานฉีดและงานรีด หากมีข้อมูลเพียงพอ แสดงขั้นตอนตั้งแต่ส่งแบบ ประเมิน ผลิต จนส่งมอบ
3. ทำบทความตอบคำถามการเลือกใช้ 2–4 เรื่องต่อเดือน เช่น วิธีวัดจุกยาง / เลือกลูกล้อตามการใช้งาน / วิธีอ่านขนาดยางขอบ โดยให้ผู้เชี่ยวชาญตรวจ
4. ใส่ข้อมูลโรงงาน ที่อยู่ ช่องทางติดต่อ และใบรับรองที่ตรวจสอบสถานะแล้ว ไม่แสดงตราเป็นหลักฐานว่าการรับรองยังมีผลโดยอัตโนมัติ
5. ตรวจและปรับ Google Business Profile ด้วยชื่อ ที่อยู่ โทรศัพท์จริง เมื่อเจ้าของให้สิทธิ์และยืนยันธุรกิจ

Product structured data: เว็บนี้เป็นแคตตาล็อกขอราคา ยังไม่มีราคา สต็อก หรือ checkout ไม่สร้างราคา 0 หรือคะแนนรีวิวขึ้นมาเพื่อให้ผ่าน rich result; พิจารณา Product เฉพาะหน้ารายสินค้าที่มีข้อมูลจริง และไม่ใช้ Merchant Listing กับหน้าที่ซื้อโดยตรงไม่ได้ [Google: Product](https://developers.google.com/search/docs/appearance/structured-data/product), [Merchant listing requirements](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)

## การวัดผลและตรวจรับ

- เชื่อม Google Search Console ของโดเมนจริง ส่ง sitemap และตรวจ URL ไทย/อังกฤษตัวอย่างด้วย URL Inspection
- เก็บ baseline: indexed canonical pages, non-brand impressions/clicks, CTR แยกภาษาและหน้าหมวด, organic enquiries ที่มีคุณภาพ
- วัดเหตุการณ์ LINE click, phone click, email click และ contact_submit_success; success ต้องมาจากผล server ที่ยอมรับส่งจริง ไม่ใช่การกดปุ่มหรือข้อความ success ปัจจุบัน
- แยก intent ภาษา/หมวด ไม่ใส่อีเมล เบอร์โทร หรือข้อความลูกค้าใน analytics
- หลังเผยแพร่ ตรวจวันที่ 7: 200/301/404, sitemap, robots/noindex, canonical/hreflang; วันที่ 30/60/90: การ index คำค้น CTR และ lead เทียบ baseline
- ไม่มีการรับประกันอันดับหรือระยะเวลา index ให้ใช้ข้อมูลจริงตัดสินว่าควรขยายหมวดและเนื้อหาใด

## ข้อมูลที่ต้องยืนยันก่อนเริ่มลงมือ

โดเมน production / ผู้ดูแล DNS, สิทธิ์ Search Console และ Analytics, ตลาดเป้าหมายและภาษา, หมวดที่ทำกำไรหรืออยากขายก่อน, สเปกสินค้าและกำลังผลิตจริง, สถานะใบรับรอง และผู้รับผิดชอบอนุมัติเนื้อหา

## ขอบเขตงานรอบนี้

เพิ่ม canonical/hreflang, metadata, sitemap/robots, structured data, คำอธิบายหมวด และ responsive WebP ในโค้ดแล้ว ดูการตั้งค่าและการตรวจรับที่ SEO-DEPLOYMENT.md; ยังไม่ได้สร้างหน้ารายสินค้า/บริการใหม่ เชื่อมบริการ Google หรือส่ง sitemap จริง
