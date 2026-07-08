import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const targetLang = process.argv[2] ?? "de";
const supportedTargetLangs = new Set(["de", "fr", "it", "tr", "es", "el", "ja", "tl", "uk", "ru"]);
if (!supportedTargetLangs.has(targetLang)) {
  throw new Error(`Unsupported target language "${targetLang}". Expected one of: ${[...supportedTargetLangs].join(", ")}`);
}
const outputPath = path.join(root, `data/translations/${targetLang}.json`);
const sourceDirs = ["data/curated", "data/generated/history-knowledge"];
const splitToken = "\n<<<OP_TRANSLATION_SPLIT>>>\n";
const maxBatchChars = 4200;
const skipKey = /(^|_)url_en$|wikipedia_en$|review_url_en$/;
const cyrillic = /[Ѐ-ӿ]/u;
const latin = /[A-Za-z]/u;
const numericOnly = /^[-+]?\d+(?:[.,]\d+)?$/;
const protectedFieldBases = new Set(["actor", "architect", "birthplace", "builder"]);
let protectedNameFixups = [];

const manualTranslationsByLang = {
  de: {
    "Public web reference; reuse terms not verified":
      "Öffentliche Webreferenz; Wiederverwendungsbedingungen nicht geprüft",
    "Wikimedia Commons file license, verify per file":
      "Wikimedia-Commons-Dateilizenz; pro Datei prüfen",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International",
    "Open-license media; follow the stated license and attribution.":
      "Medien mit offener Lizenz; beachten Sie die angegebene Lizenz und Namensnennung.",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  fr: {
    "Public web reference; reuse terms not verified":
      "Référence web publique ; conditions de réutilisation non vérifiées",
    "Wikimedia Commons file license, verify per file":
      "Licence de fichier Wikimedia Commons ; vérifier chaque fichier",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution - Partage dans les mêmes conditions 4.0 International",
    "Open-license media; follow the stated license and attribution.":
      "Médias sous licence ouverte ; respectez la licence indiquée et l'attribution.",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  it: {
    "Public web reference; reuse terms not verified":
      "Riferimento web pubblico; condizioni di riutilizzo non verificate",
    "Wikimedia Commons file license, verify per file":
      "Licenza del file Wikimedia Commons; verificare per ciascun file",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribuzione - Condividi allo stesso modo 4.0 Internazionale",
    "Open-license media; follow the stated license and attribution.":
      "Media con licenza aperta; rispettare la licenza indicata e l'attribuzione.",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  tr: {
    // The Ottoman-layer route deliberately uses the historical name Filibe;
    // keep it ahead of the Filibe→Plovdiv exonym normalisation.
    "Filibe / Ottoman layer": "Filibe / Osmanlı katmanı",
    "Filibe": "Filibe",
    "Hristo Milev (1867-1943) was a Bulgarian public figure and National Liberal Party politician born in Shipka. He graduated with distinction from the Plovdiv Boys' Gymnasium, then worked as an investigator and judge, later becoming secretary and district governor of Plovdiv Municipality. From 9 October to 3 December 1903 he chaired the three-member commission, then governed as mayor until 19 September 1905. After his term he was reappointed district governor of Stara Zagora. He authored The Killing of Hadzhi Dimitar's Detachment and Sketches from the Lives of the Insurgents and a Historical-Geographical Atlas of Bulgaria.":
      "Hristo Milev (1867-1943), Shipka doğumlu Bulgar halk figürü ve Ulusal Liberal Parti politikacısıydı. Plovdiv Erkek Lisesi'ndan üstün başarı ile mezun oldu, ardından müfettiş ve yargıç olarak çalıştı, daha sonra Plovdiv Belediyesi'nde sekreter ve kaymakam oldu. 9 Ekim'den 3 Aralık 1903'e kadar üç üyeli komisyona başkanlık etti, ardından 19 Eylül 1905'e kadar belediye başkanı olarak görev yaptı. Görev süresinin ardından yeniden Stara Zagora kaymakamlığına atandı. Hacı Dimitar'ın Öldürülmesi ve İsyancıların Hayatlarından Taslaklar ile Bulgaristan Tarihsel-Coğrafya Atlası'nın yazarıdır.",
    "Milosh Hristov Danov (1874-1943) was a Bulgarian public figure and son of Hristo G. Danov. Born in Stara Zagora, he completed Bulgarian gymnasium in Thessaloniki and studied mathematical sciences in Leipzig without completing a doctorate, since his father's publishing house needed him back in Plovdiv by 1898. During the Balkan War of 1912 he volunteered in the Macedonian-Adrianopolitan Volunteer Corps. In the First World War he served as a junior officer and received an order for bravery. In 1908 he became deputy mayor of Plovdiv, and was mayor twice: in 1918-1919 as chair of a three-member commission and in 1928-1929 as chair of a seven-member commission. He was deputy chair of the Chamber of Commerce and Industry in Plovdiv and later moved his father's publishing house to Sofia.":
      "Milosh Hristov Danov (1874-1943), Bulgar halk figürü ve Hristo G. Danov'un oğluydu. Stara Zagora'da doğdu, Selanik'teki Bulgar Lisesini tamamladı ve 1898'de babasının yayınevinin Plovdiv'ye geri dönmesine ihtiyaç duyduğu için doktorasını tamamlamadan Leipzig'de matematik bilimleri okudu. 1912 Balkan Savaşı sırasında Makedon-Adrianopolitan Gönüllü Kolordusu'nda gönüllü oldu. Birinci Dünya Savaşı'nda astsubay olarak görev yaptı ve cesaret nişanı aldı. 1908'de Plovdiv belediye başkan yardımcısı oldu ve iki kez belediye başkanı oldu: 1918-1919'da üç üyeli bir komisyonun başkanı olarak ve 1928-1929'da yedi üyeli bir komisyonun başkanı olarak. Plovdiv Ticaret ve Sanayi Odası'nın başkan yardımcısıydı ve daha sonra babasının yayınevini Sofya'ya taşıdı.",
    "Public web reference; reuse terms not verified":
      "Herkese açık web kaynağı; yeniden kullanım koşulları doğrulanmadı",
    "Wikimedia Commons file license, verify per file":
      "Wikimedia Commons dosya lisansı; her dosya için doğrulayın",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Atıf-AynıLisanslaPaylaş 4.0 Uluslararası",
    "Open-license media; follow the stated license and attribution.":
      "Açık lisanslı medya; belirtilen lisansa ve atfa uyun.",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0",
    // Machine reordering separates the "Eng." honorific from the surname here;
    // pin a clean translation that keeps the recorded name intact.
    "Mayoral term(s) for Eng. Ivan Totev.":
      "Eng. Ivan Totev için belediye başkanlığı dönemleri."
  },
  es: {
    // Route title: drop the machine's trailing period and Roman-numeral quirk.
    "Modern Plovdiv of the 20th century": "Plovdiv moderno del siglo XX",
    "Public web reference; reuse terms not verified":
      "Referencia web pública; condiciones de reutilización no verificadas",
    "Wikimedia Commons file license, verify per file":
      "Licencia de archivo de Wikimedia Commons; verificar en cada archivo",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Atribución-CompartirIgual 4.0 Internacional",
    "Open-license media; follow the stated license and attribution.":
      "Medios con licencia abierta; respete la licencia indicada y la atribución.",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  el: {
    // Route title: "χωρίς βήμα" reads as "without a step (in a dance)";
    // stairs are what the route avoids.
    "Step-free Plovdiv": "Plovdiv χωρίς σκαλοπάτια",
    "Public web reference; reuse terms not verified":
      "Δημόσια διαδικτυακή αναφορά· οι όροι επαναχρησιμοποίησης δεν επαληθεύτηκαν",
    "Wikimedia Commons file license, verify per file":
      "Άδεια αρχείου Wikimedia Commons· επαληθεύστε ανά αρχείο",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution-ShareAlike 4.0 International",
    "Open-license media; follow the stated license and attribution.":
      "Πολυμέσα με ανοιχτή άδεια· τηρήστε την αναφερόμενη άδεια και την απόδοση.",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0",
    "Engineer Ivan Borisov Totev (born 28 October 1975 in Plovdiv) is a Bulgarian engineer and GERB politician who served two consecutive terms as mayor of Plovdiv from 2011 to 2019. He graduated from the Gotse Delchev Transport Technical School in Plovdiv, from the Technical University in Sofia as a master engineer in computer systems and technologies, and in public administration from Plovdiv University. Before becoming mayor he was mayor of Iztochen District (2007-2009), briefly an MP in 2009, and regional governor of Plovdiv (2009-2011). During his administration the city prepared and delivered the European Capital of Culture 2019 title, and after his mayoral term Totev was again elected to the 45th, 46th and 47th National Assemblies.":
      "Ο Ivan Borisov Totev (γεννημένος στις 28 Οκτωβρίου 1975 στο Plovdiv) είναι Βούλγαρος μηχανικός και πολιτικός του GERB που υπηρέτησε δύο συνεχόμενες θητείες ως δήμαρχος του Plovdiv από το 2011 έως το 2019. Αποφοίτησε από την Τεχνική Σχολή Μεταφορών Gotse Delchev στο Plovdiv, από το Τεχνικό Πανεπιστήμιο της Σόφιας ως διπλωματούχος μηχανικός συστημάτων και τεχνολογιών υπολογιστών, και από το Πανεπιστήμιο του Plovdiv στη δημόσια διοίκηση. Πριν γίνει δήμαρχος ήταν δήμαρχος της περιφέρειας Iztochen (2007-2009), για σύντομο διάστημα βουλευτής το 2009, και περιφερειακός κυβερνήτης του Plovdiv (2009-2011). Κατά τη διάρκεια της διοίκησής του η πόλη προετοίμασε και υλοποίησε τον τίτλο Πολιτιστική Πρωτεύουσα της Ευρώπης 2019, ενώ μετά τη δημαρχιακή του θητεία ο Totev εξελέγη ξανά στην 45η, 46η και 47η Εθνοσυνέλευση.",
    "Hristo Pavlov Shkodrov was a Social Democrat, journalist and prominent trade unionist appointed chair of Plovdiv's three-member municipal commission on 26 September 1919. His term belongs to the unstable postwar municipal administration: a Regional History Museum Plovdiv study of interwar political life describes how, after Stefan Gevgalov's resignation in 1919, several temporary commission chairs followed one another for only a month or two, including Pavlov, who was replaced on 11 November by Hariton Kuev. In 2014 Pod Tepeto reported that Dimitar Raychev supplied researcher Katerina Chobanova with archival photographic material of Pavlov, filling the blank in her collection of Plovdiv mayor portraits. Another Regional History Museum Plovdiv study notes that after his death the municipality decided he should be buried at municipal expense.":
      "Ο Hristo Pavlov Shkodrov ήταν σοσιαλδημοκράτης, δημοσιογράφος και εξέχων συνδικαλιστής, διορισμένος πρόεδρος της τριμελούς δημοτικής επιτροπής του Plovdiv στις 26 Σεπτεμβρίου 1919. Η θητεία του ανήκει στην ασταθή μεταπολεμική δημοτική διοίκηση: μελέτη του Περιφερειακού Ιστορικού Μουσείου Plovdiv για την πολιτική ζωή του Μεσοπολέμου περιγράφει πώς, μετά την παραίτηση του Stefan Gevgalov το 1919, αρκετοί προσωρινοί πρόεδροι επιτροπών διαδέχθηκαν ο ένας τον άλλον για μόλις έναν ή δύο μήνες, μεταξύ τους και ο Pavlov, που αντικαταστάθηκε στις 11 Νοεμβρίου από τον Hariton Kuev. Το 2014 το Pod Tepeto ανέφερε ότι ο Dimitar Raychev παρείχε στην ερευνήτρια Katerina Chobanova αρχειακό φωτογραφικό υλικό του Pavlov, συμπληρώνοντας το κενό στη συλλογή της με πορτρέτα δημάρχων του Plovdiv. Άλλη μελέτη του Περιφερειακού Ιστορικού Μουσείου Plovdiv σημειώνει ότι μετά τον θάνατό του ο δήμος αποφάσισε να ταφεί με δημοτική δαπάνη.",
    "Sotir Antoniadi (1843-1928) was a physician and politician of Greek origin, born in Stanimaka, today Asenovgrad. He first studied at the central Greek school in Plovdiv, then at a high school in Athens, and later medicine in Vienna before working for two years in Paris. Antoniadi was a deputy in the Regional Assembly of Eastern Rumelia and in 1885 in the National Assembly of the Principality of Bulgaria. Between 26 January and 21 April 1883 he briefly served as acting mayor of Plovdiv. In 1915 he moved to Greece; his house and the pharmacy built in 1872 are part of the Old Plovdiv architectural and historical reserve.":
      "Ο Sotir Antoniadi (1843-1928) ήταν γιατρός και πολιτικός ελληνικής καταγωγής, γεννημένος στη Στανιμάκα, σήμερα Asenovgrad. Αρχικά σπούδασε στο κεντρικό ελληνικό σχολείο του Plovdiv, στη συνέχεια σε γυμνάσιο της Αθήνας και αργότερα ιατρική στη Βιέννη, πριν εργαστεί για δύο χρόνια στο Παρίσι. Ο Antoniadi ήταν βουλευτής στην Περιφερειακή Συνέλευση της Ανατολικής Ρωμυλίας και το 1885 στην Εθνοσυνέλευση του Πριγκιπάτου της Βουλγαρίας. Από τις 26 Ιανουαρίου έως τις 21 Απριλίου 1883 υπηρέτησε σύντομα ως αναπληρωτής δήμαρχος του Plovdiv. Το 1915 μετακόμισε στην Ελλάδα· το σπίτι του και το φαρμακείο που χτίστηκε το 1872 αποτελούν μέρος του αρχιτεκτονικού και ιστορικού αποθέματος του Παλαιού Plovdiv."
  },
  ja: {
    // Route title: the walk visits history/ethnographic museums, so 博物館 fits
    // better than the machine's 美術館 (fine-art museum).
    "A museum day for the rain": "雨の日の博物館めぐり",
    // Route title: the machine renders the rowing venue as a "hand-rowed
    // canal"; keep the site's established ボート競技場 wording.
    "The Rowing Canal and the Maritsa riverside": "ボート競技場とマリツァ川沿い",
    "Hristo Milev (1867-1943) was a Bulgarian public figure and National Liberal Party politician born in Shipka. He graduated with distinction from the Plovdiv Boys' Gymnasium, then worked as an investigator and judge, later becoming secretary and district governor of Plovdiv Municipality. From 9 October to 3 December 1903 he chaired the three-member commission, then governed as mayor until 19 September 1905. After his term he was reappointed district governor of Stara Zagora. He authored The Killing of Hadzhi Dimitar's Detachment and Sketches from the Lives of the Insurgents and a Historical-Geographical Atlas of Bulgaria.":
      "Hristo Milev (1867-1943) はShipka生まれのブルガリアの著名人であり国民自由党の政治家でした。彼はプロヴディフ男子ギムナジウムを優秀な成績で卒業し、その後捜査官および判事として働き、後にPlovdiv Municipalityの秘書および地区知事に就任した。 1903年10月9日から12月3日まで、彼は3人の委員からなる委員会の委員長を務め、その後1905年9月19日まで市長として統治した。任期後はStara Zagora地区ガバナーに再任された。彼は、『ハッジ・ディミタル分遣隊の殺害』、『反乱軍の生活からのスケッチ』、およびブルガリアの歴史・地理アトラスを執筆しました。",
    "Milosh Hristov Danov (1874-1943) was a Bulgarian public figure and son of Hristo G. Danov. Born in Stara Zagora, he completed Bulgarian gymnasium in Thessaloniki and studied mathematical sciences in Leipzig without completing a doctorate, since his father's publishing house needed him back in Plovdiv by 1898. During the Balkan War of 1912 he volunteered in the Macedonian-Adrianopolitan Volunteer Corps. In the First World War he served as a junior officer and received an order for bravery. In 1908 he became deputy mayor of Plovdiv, and was mayor twice: in 1918-1919 as chair of a three-member commission and in 1928-1929 as chair of a seven-member commission. He was deputy chair of the Chamber of Commerce and Industry in Plovdiv and later moved his father's publishing house to Sofia.":
      "Milosh Hristov Danov (1874-1943) はブルガリアの著名人であり、Hristo G. Danovの息子でした。Stara Zagoraで生まれた彼は、テッサロニキのブルガリア人ギムナジウムを修了し、父親の出版社が1898年までにPlovdivに戻る必要があったため、博士号を取得することなくライプツィヒで数理科学を学んだ。1912年のバルカン戦争中、彼はマケドニア・アドリアノポリタン義勇軍に志願した。第一次世界大戦では下級士官として従軍し、勇敢な勲章を受章した。 1908年に彼はPlovdivの副市長に就任し、1918年から1919年には3人委員会の委員長として、1928年から1929年には7人委員会の委員長として2度市長を務めた。彼はPlovdivの商工会議所の副会頭であり、その後、父親の出版社をソフィアに移転しました。",
    "Public web reference; reuse terms not verified":
      "公開ウェブ参照。再利用条件は未確認",
    "Wikimedia Commons file license, verify per file":
      "Wikimedia Commons のファイルライセンス。各ファイルごとに確認",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution-ShareAlike 4.0 International",
    "Open-license media; follow the stated license and attribution.":
      "オープンライセンスのメディア。記載のライセンスと帰属表示に従ってください。",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0",
    "A large prefab housing complex designed by architect Ivan Popov (1968); construction began in 1973 and it became a separate district in 1983.":
      "建築家Ivan Popovが1968年に設計した大規模なプレハブ住宅団地。1973年に建設が始まり、1983年に独立した地区になりました。",
    // Bulgarian-only municipal source titles (no English form exists upstream, so the
    // machine left them Cyrillic and corrupted "Решение"->"Реловдие"); pin natural Japanese.
    "Общински съвет - Пловдив, Решение 33 за бюджет 2018":
      "Plovdiv市議会 — 2018年度予算に関する決議第33号",
    "Общински съвет - Пловдив, Решение №4 за бюджет 2014":
      "Plovdiv市議会 — 2014年度予算に関する決議第4号",
    "Общински съвет — Пловдив, Правилник за подпомагане на деца с изявени дарби":
      "Plovdiv市議会 — 才能ある児童の支援に関する規則",
    "Общински съвет — Пловдив, Решение №58 за отчет на бюджет 2010":
      "Plovdiv市議会 — 2010年度予算決算に関する決議第58号",
    // Bulgarian-only Wikimedia image captions that the machine left untranslated.
    "Природна забележителност в България.": "ブルガリアの自然記念物。",
    "Баня в Пловдив, България.": "Plovdivの公衆浴場、ブルガリア。"
  },
  tl: {
    "Public web reference; reuse terms not verified":
      "Pampublikong sanggunian sa web; hindi pa nasusuring mga tuntunin sa muling paggamit",
    "Wikimedia Commons file license, verify per file":
      "Lisensya ng file sa Wikimedia Commons; suriin sa bawat file",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution-ShareAlike 4.0 International",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0",
    "Open-license media; follow the stated license and attribution.":
      "Medyang may bukas na lisensya; sundin ang nakasaad na lisensya at atribusyon.",
    "Bulgarian Revival": "Pambansang Muling Pagsilang ng Bulgaria",
    "State targeted subsidy": "Nakatuong subsidyo ng estado",
    "Mayor of Plovdiv Municipality": "Alkalde ng Munisipalidad ng Plovdiv",
    "Mayoral term(s) for Eng. Ivan Totev.": "Termino bilang alkalde: Eng. Ivan Totev.",
    "A bloodless coup in Plovdiv united Eastern Rumelia with the Principality of Bulgaria. 6 September is celebrated as Unification Day and the Day of Plovdiv.":
      "Sa isang mapayapang pag-aaklas sa Plovdiv, naisama ang Silangang Rumelia sa Prinsipalidad ng Bulgaria. Ipinagdiriwang ang Setyembre 6 bilang Araw ng Pagkakaisa at Araw ng Plovdiv.",
    "After the Congress of Berlin, Plovdiv became the capital of the autonomous Ottoman province of Eastern Rumelia.":
      "Pagkatapos ng Kongreso ng Berlin, naging kabisera ang Plovdiv ng awtonomong lalawigang Osmanli ng Silangang Rumelia.",
    "A National Revival house in Plovdiv's Old Town, built in 1863 and preserved as a house-museum of 19th-century urban life.":
      "Isang bahay mula sa Pambansang Muling Pagsilang sa Lumang Bayan ng Plovdiv, itinayo noong 1863 at pinangalagaan bilang bahay-museo ng buhay-lungsod noong ika-19 na siglo.",
    "A building from Plovdiv's National Revival period, dating to 1846.":
      "Isang gusali mula sa panahon ng Pambansang Muling Pagsilang sa Plovdiv, na itinayo noong 1846.",
    "A building from Plovdiv's National Revival period, dating to 1848.":
      "Isang gusali mula sa panahon ng Pambansang Muling Pagsilang sa Plovdiv, na itinayo noong 1848.",
    "A building from Plovdiv's National Revival period.":
      "Isang gusali mula sa panahon ng Pambansang Muling Pagsilang sa Plovdiv.",
    "Bulgarian Revival, 1832": "Pambansang Muling Pagsilang ng Bulgaria, 1832",
    "Bulgarian Revival, 1838": "Pambansang Muling Pagsilang ng Bulgaria, 1838",
    "Automatically normalized from the existing curated data; requires independent editorial review before counting as complete.":
      "Awtomatikong inayos mula sa kasalukuyang piniling datos; kailangan pa ng hiwalay na pagsusuring editoryal bago ituring na kumpleto.",
    "Automatically prepared archive record from Wikimedia Commons; requires independent editorial review and finer georeferencing before final publication.":
      "Awtomatikong inihandang talaan mula sa arkibo ng Wikimedia Commons; kailangan pa ng hiwalay na pagsusuring editoryal at mas tumpak na paglalapat sa mapa bago ang huling paglalathala.",
    "Automatically prepared then/now pair; requires independent editorial review of the match, license and context before final publication.":
      "Awtomatikong inihandang pares ng noon/ngayon; kailangan pa ng hiwalay na pagsusuring editoryal sa tugma, lisensya, at konteksto bago ang huling paglalathala.",
    "Requires independent editorial review and full transcription before it counts as a finished primary document.":
      "Kailangan ng hiwalay na pagsusuring editoryal at buong transkripsyon bago ito ituring na tapos na pangunahing dokumento.",
    "The 1999 archive record is programme context, not a municipal budget.":
      "Ang talaan sa arkibo mula 1999 ay konteksto ng programa, hindi badyet ng munisipalidad.",
    "The education resource is assembled from public knowledge-base records and requires pedagogical and editorial review before formal use.":
      "Ang mapagkukunang pang-edukasyon ay binuo mula sa mga pampublikong talaan ng kaalaman at kailangan pa ng pagsusuring pedagogical at editoryal bago gamitin nang pormal.",
    "The Old Town is not only a National Revival quarter. It stands over older layers and lets us talk about continuity.":
      "Ang Lumang Bayan ay hindi lamang kapitbahayan ng Pambansang Muling Pagsilang. Nakatayo ito sa mas matatandang patong ng kasaysayan at tumutulong ipaliwanag ang pagpapatuloy ng lungsod.",
    "The Old Town of Plovdiv climbs across three of the city's hills, where six thousand years of habitation lie layered one upon another — Thracian, Roman, medieval and, most visibly, the painted timber mansions of the Bulgarian National Revival.":
      "Umaakayat ang Lumang Bayan ng Plovdiv sa tatlo sa mga burol ng lungsod, kung saan magkakapatong ang anim na libong taon ng paninirahan — Trakiano, Romano, medyebal, at higit na kapansin-pansin, ang mga makukulay na kahoy na mansiyon ng Pambansang Muling Pagsilang ng Bulgaria.",
    "The first Bulgarian school in the city was opened — part of the educational awakening of the National Revival.":
      "Binuksan ang unang paaralang Bulgaro sa lungsod — bahagi ng pagkamulat sa edukasyon noong Pambansang Muling Pagsilang.",
    "The home is one of the expositions of the Regional Historical Museum and, in six halls, tells the story of book publishing during the National Revival.":
      "Ang bahay ay isa sa mga eksposisyon ng Regional Historical Museum at, sa anim na bulwagan, ikinukuwento nito ang paglalathala ng mga aklat noong Pambansang Muling Pagsilang.",
    "Under Rome the city became Trimontium — capital of the province of Thracia, with a theatre, stadium and forum. In the Ottoman period it was known as Filibe, and in the 19th century it became a centre of the Bulgarian Revival and of trade.":
      "Sa ilalim ng Roma, naging Trimontium ang lungsod — kabisera ng lalawigan ng Thracia, na may teatro, istadyum, at forum. Sa panahong Osmanli kilala ito bilang Filibe, at noong ika-19 na siglo naging sentro ito ng Pambansang Muling Pagsilang ng Bulgaria at ng kalakalan.",
    "Used as a structured public source for starter relationship links; each relationship still awaits independent editorial review.":
      "Ginamit bilang nakabalangkas na pampublikong pinagmulan para sa panimulang mga ugnayan; bawat ugnayan ay kailangan pa ng hiwalay na pagsusuring editoryal.",
    // Machine translation dropped the "Hristo G. Danov" publishing-house name entirely
    // and fabricated a different institutional detail; pin an accurate hand translation.
    "Spas Georgiev Garnevski (born 18 January 1953 in Plovdiv) is a Bulgarian politician, public figure and economist who was mayor of Plovdiv from 1995 to 1999. He graduated from the University of National and World Economy in labour economics and organisation, worked at Plovdiv's state printing house and at the Hristo G. Danov publishing house, and in 1992-1995 was executive director of the printing house. After his mayoral term he remained active in local and national politics: he was expelled from the Union of Democratic Forces in 2003, led DSB's Plovdiv organisation, served as a municipal councillor, and in 2017 was elected an MP from Plovdiv-city on the GERB list. He also published the poetry collections The End of the Night and The Grandchildren of Bay Ganyo.":
      "Si Spas Georgiev Garnevski (ipinanganak noong 18 Enero 1953 sa Plovdiv) ay isang Bulgarong politiko, taong pampubliko, at ekonomista na naging alkalde ng Plovdiv mula 1995 hanggang 1999. Nagtapos siya sa Unibersidad ng Pambansa at Pandaigdigang Ekonomiya sa ekonomiya ng paggawa at organisasyon, nagtrabaho sa estatal na palimbagan ng Plovdiv at sa palimbagang Hristo G. Danov, at noong 1992-1995 ay naging punong ehekutibo ng palimbagan. Pagkatapos ng kanyang termino bilang alkalde, nanatili siyang aktibo sa lokal at pambansang pulitika: pinatalsik siya sa Union of Democratic Forces noong 2003, pinamunuan ang organisasyon ng DSB sa Plovdiv, naglingkod bilang konsehal ng munisipalidad, at noong 2017 ay nahalal na kinatawan mula sa lungsod ng Plovdiv sa listahan ng GERB. Inilathala rin niya ang mga koleksyon ng tula na Ang Katapusan ng Gabi at Ang mga Apo ni Bay Ganyo.",
    "Zdravko Dimitrov Dimitrov (born 22 May 1963 in Plovdiv) is a Bulgarian politician, sports administrator and former basketball player who was mayor of Plovdiv from 2019 to 2023. He graduated from Vasil Levski Secondary School in Plovdiv, earned a bachelor's degree in sports pedagogy from Plovdiv University, master's degrees in psychology and public administration from the same university, and financial-management training from the D. A. Tsenov Academy of Economics in Svishtov. As a player he competed for CSKA and SSK Akademik Plovdiv and played for Bulgaria's national basketball team; later he served as president of BC Akademik. In politics he was a GERB founding member, mayor of Zapaden District (2007-2011), regional governor of Plovdiv, MP in the 42nd and 43rd National Assemblies, and in 2019 won the mayoral election for Plovdiv Municipality.":
      "Si Zdravko Dimitrov Dimitrov (ipinanganak noong 22 Mayo 1963 sa Plovdiv) ay isang Bulgarong politiko, tagapangasiwa sa palakasan, at dating manlalaro ng basketball na naging alkalde ng Plovdiv mula 2019 hanggang 2023. Nagtapos siya sa Vasil Levski Secondary School sa Plovdiv, kumuha ng digring bachelor sa sports pedagogy mula sa Plovdiv University, mga masterado sa sikolohiya at pampublikong administrasyon mula sa parehong unibersidad, at pagsasanay sa pamamahalang pinansyal mula sa D. A. Tsenov Academy of Economics sa Svishtov. Bilang manlalaro, lumaban siya para sa CSKA at SSK Akademik Plovdiv at naglaro para sa pambansang koponan ng basketball ng Bulgaria; kalaunan naging pangulo siya ng BC Akademik. Sa pulitika, isa siya sa mga tagapagtatag ng GERB, naging alkalde ng distrito ng Zapaden (2007-2011), gobernador ng rehiyon ng Plovdiv, kinatawan sa ika-42 at ika-43 na Pambansang Asamblea, at noong 2019 nanalo sa halalan sa pagkaalkalde ng Munisipalidad ng Plovdiv.",
    // Machine translation lowercased the "Chirpan" place name mid-sentence.
    "Chirpan earthquake damage near St Josif — then/now":
      "Pinsala mula sa lindol sa Chirpan malapit sa St Josif — noon/ngayon",
    "Chirpan earthquake damage near St Josif":
      "Pinsala mula sa lindol sa Chirpan malapit sa St Josif",
    // Machine translation split into two inconsistent templates and, for two of the
    // four sentences, wedged the "Si" personal-name marker between the "Eng."
    // honorific and the recorded name; pin one clean, consistent template for all four.
    "The mayoral chronology links Eng. Ivan Totev with Slavcho Atanasov through the relationship \"succeeds\".":
      "Ang kronolohiya ng alkalde ay nag-uugnay kay Eng. Ivan Totev kay Slavcho Atanasov sa pamamagitan ng relasyong \"nagtagumpay\".",
    "The mayoral chronology links Eng. Ivan Totev with Zdravko Dimitrov through the relationship \"succeeded by\".":
      "Ang kronolohiya ng alkalde ay nag-uugnay kay Eng. Ivan Totev kay Zdravko Dimitrov sa pamamagitan ng relasyong \"nagtagumpay ng\".",
    "The mayoral chronology links Slavcho Atanasov with Eng. Ivan Totev through the relationship \"succeeded by\".":
      "Ang kronolohiya ng alkalde ay nag-uugnay kay Slavcho Atanasov kay Eng. Ivan Totev sa pamamagitan ng relasyong \"nagtagumpay ng\".",
    "The mayoral chronology links Zdravko Dimitrov with Eng. Ivan Totev through the relationship \"succeeds\".":
      "Ang kronolohiya ng alkalde ay nag-uugnay kay Zdravko Dimitrov kay Eng. Ivan Totev sa pamamagitan ng relasyong \"nagtagumpay\"."
  },
  uk: {
    // Route titles: keep the reviewed Unification wording ahead of the
    // template fixups, and disambiguate "заходи" (events) → "заходи сонця".
    "Unification and civic memory": "Об'єднання і громадянська пам'ять",
    "The tepeta and their sunsets": "Тепета та їхні заходи сонця",
    "A museum day for the rain": "Музейний день — і в дощ",
    "Step-free Plovdiv": "Plovdiv без сходинок",
    "Public web reference; reuse terms not verified":
      "Публічне вебпосилання; умови повторного використання не перевірено",
    "Wikimedia Commons file license, verify per file":
      "Ліцензія файлу Wikimedia Commons; перевіряйте для кожного файлу",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution-ShareAlike 4.0 International",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0",
    "Open-license media; follow the stated license and attribution.":
      "Медіа з відкритою ліцензією; дотримуйтеся вказаної ліцензії та атрибуції.",
    "Bulgarian Revival": "Болгарське національне відродження",
    "State targeted subsidy": "Цільова державна субсидія",
    "Mayor of Plovdiv Municipality": "Мер муніципалітету Plovdiv",
    "Mayoral term(s) for Eng. Ivan Totev.": "Мерська каденція: Eng. Ivan Totev.",
    "Wikipedia — Д-р Иван Чомаков": "Wikipedia — Dr. Ivan Chomakov",
    "Wikipedia — д-р Асен Кожухаров": "Wikipedia — Dr. Asen Kozhuharov",
    "Wikipedia — д-р Гарабед Томасян": "Wikipedia — Dr. Garabed Tomasyan",
    "Wikipedia — д-р Иван Кесяков": "Wikipedia — Dr. Ivan Kesyakov",
    "Wikipedia — д-р Сотир Антониади": "Wikipedia — Dr. Sotir Antoniadi",
    "Wikipedia — д-р Христо Танчев": "Wikipedia — Dr. Hristo Tanchev",
    // Machine translation truncated the surname "Samokovliev"/"Samokovets" into
    // a bare "Samokov" (the name of an unrelated real town) when it tried to
    // decline it; pin clean sentences that keep the full recorded name intact.
    "Atanas Samokovliev, also known as Atanas Samokovets (1832-1905), was a merchant, public figure and Plovdiv's first mayor after the Liberation. Born in Samokov, he was the son of icon painter Dimitar Zograf and brother of artist Stanislav Dospevski. After settling in Plovdiv he worked in tailoring and trade, helped administer the Holy Mother of God church and served in the city medjlis. The Provisional Russian Administration appointed him first mayor on 12 January 1878; he left office on 26 February that year. He later joined the Provisional Government after the Unification, was elected to parliament and was among the founders of the Plovdiv Chamber of Commerce and Industry. He was a deputy in the First Ordinary National Assembly and the Third Grand National Assembly.":
      "Atanas Samokovliev, також відомий як Atanas Samokovets (1832-1905), був купцем, громадським діячем і першим мером Plovdiv після визволення. Народився в Samokov, він був сином іконописця Димитра Зографа та братом художника Станіслава Доспевського. Поселившись у Plovdiv, він займався кравецтвом і торгівлею, допомагав в управлінні церкви Пресвятої Богородиці та служив у міському меджлісі. Тимчасова російська адміністрація призначила його першим мером 12 січня 1878 року; він залишив посаду 26 лютого того ж року. Пізніше він увійшов до Тимчасового уряду після Об'єднання, був обраний до парламенту та був одним із засновників Пловдівської торгово-промислової палати. Був депутатом Перших звичайних народних зборів і Третіх Великих народних зборів.",
    "Mayoral term(s) for Atanas Samokovliev.": "Термін(и) мера для Atanas Samokovliev.",
    "The mayoral chronology links Atanas Samokovliev with Kostaki Peev through the relationship \"succeeded by\".":
      "Мерська хронологія пов'язує Atanas Samokovliev з Kostaki Peev через стосунки «наступник».",
    "The mayoral chronology links Kostaki Peev with Atanas Samokovliev through the relationship \"succeeds\".":
      "Мерська хронологія пов'язує Kostaki Peev з Atanas Samokovliev через стосунки «наступник»."
  },
  ru: {
    // Route titles: the machine turned the museum day into a "museum of rain"
    // and left a stray trailing period on the 20th-century title.
    "A museum day for the rain": "Музейный день — и в дождь",
    "Modern Plovdiv of the 20th century": "Современный Plovdiv XX века",
    "Step-free Plovdiv": "Plovdiv без ступеней",
    "Public web reference; reuse terms not verified":
      "Публичная веб-ссылка; условия повторного использования не проверены",
    "Wikimedia Commons file license, verify per file":
      "Лицензия файла Wikimedia Commons; проверяйте для каждого файла",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution-ShareAlike 4.0 International",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0",
    "Open-license media; follow the stated license and attribution.":
      "Медиа с открытой лицензией; соблюдайте указанную лицензию и атрибуцию.",
    "Bulgarian Revival": "Болгарское национальное возрождение",
    "State targeted subsidy": "Целевая государственная субсидия",
    "Mayor of Plovdiv Municipality": "Мэр муниципалитета Plovdiv",
    "A large prefab housing complex designed by architect Ivan Popov (1968); construction began in 1973 and it became a separate district in 1983.":
      "Крупный панельный жилой комплекс, спроектированный архитектором Ivan Popov (1968); строительство началось в 1973 году, а в 1983 году он стал отдельным районом.",
    "Among the best-known houses are the Kuyumdzhioglu House (1847), today the Regional Ethnographic Museum, spread over 570 m² with 130 windows; the richly decorated Hindliyan House (1835); and the Balabanov House. Close by stand the medieval Hisar Kapia gate and the Ancient Theatre.":
      "Среди самых известных домов - Kuyumdzhioglu House (1847), сегодня Региональный этнографический музей, площадью 570 м² и со 130 окнами; богато украшенный Hindliyan House (1835); и Balabanov House. Рядом находятся средневековые ворота Hisar Kapia и Античный театр.",
    "An architectural-historical reserve on Nebet, Dzhambaz and Taksim Tepe, famous for its 19th-c. Revival houses — such as the Kuyumdzhioglu House (1847, now the Ethnographic Museum). It has been on UNESCO's tentative list since 2004.":
      "Архитектурно-исторический заповедник на Nebet, Dzhambaz и Taksim Tepe, известный домами эпохи национального Возрождения XIX века, включая Kuyumdzhioglu House (1847, ныне Этнографический музей). С 2004 года он находится в предварительном списке ЮНЕСКО.",
    "Regular editions began in 1933 (424 exhibitors); in 1934 the fair was declared permanent and the only one in Bulgaria, and in 1936 it joined the Union of International Fairs. The exhibition complex was built in 1948–1949 and hosted Expo ’81, ’85 and ’91.":
      "Регулярные выпуски начались в 1933 году (424 экспонента); в 1934 году ярмарка была объявлена постоянной и единственной в Болгарии, а в 1936 году вошла в Союз международных ярмарок. Выставочный комплекс был построен в 1948-1949 годах и принимал Expo '81, '85 и '91.",
    "The basilica was built in the mid-4th century AD, soon after Christianity was legalised in 313; a coin of Emperor Licinius (308–324) found in the excavations suggests it was among the first churches in the empire. It was the episcopal cathedral beside the forum and was destroyed after an earthquake in the late 6th century, after about 250 years of use.":
      "Базилика была построена в середине IV века н. э., вскоре после легализации христианства в 313 году; найденная при раскопках монета императора Licinius (308-324) указывает, что это была одна из первых церквей империи. Она служила епископским собором рядом с форумом и была разрушена землетрясением в конце VI века после примерно 250 лет использования.",
    "The garden was created in 1892 for the First Bulgarian Agricultural-Industrial Exhibition by the Swiss gardener Lucien Chevalas (1840–1921) — on the site of an old Turkish cemetery. For his contribution to the city, Chevalas was declared an honorary citizen of Plovdiv in 1901.":
      "Сад был создан в 1892 году для Первой болгарской сельскохозяйственно-промышленной выставки швейцарским садовником Lucien Chevalas (1840-1921) на месте старого турецкого кладбища. За вклад в город Chevalas был объявлен почетным гражданином Plovdiv в 1901 году.",
    "The stadium was built in the early 2nd century AD under Emperor Hadrian (117–138), when Philippopolis was capital of the Roman province of Thracia. Unusually for its time, it stood inside the fortified city rather than beyond the walls.":
      "Стадион был построен в начале II века н. э. при императоре Hadrian (117-138), когда Philippopolis был столицей римской провинции Thracia. Необычно для своего времени, он находился внутри укрепленного города, а не за его стенами.",
    "Bulgarian politician and jurist (born 1952)":
      "Болгарский политик и юрист (род. 1952)",
    // Machine translation truncated the surname "Samokovliev"/"Samokovets" into
    // a bare "Samokov" (the name of an unrelated real town) when it tried to
    // decline it; pin clean sentences that keep the full recorded name intact.
    "Atanas Samokovliev, also known as Atanas Samokovets (1832-1905), was a merchant, public figure and Plovdiv's first mayor after the Liberation. Born in Samokov, he was the son of icon painter Dimitar Zograf and brother of artist Stanislav Dospevski. After settling in Plovdiv he worked in tailoring and trade, helped administer the Holy Mother of God church and served in the city medjlis. The Provisional Russian Administration appointed him first mayor on 12 January 1878; he left office on 26 February that year. He later joined the Provisional Government after the Unification, was elected to parliament and was among the founders of the Plovdiv Chamber of Commerce and Industry. He was a deputy in the First Ordinary National Assembly and the Third Grand National Assembly.":
      "Atanas Samokovliev, также известный как Atanas Samokovets (1832-1905), был купцом, общественным деятелем и первым мэром Plovdiv после Освобождения. Родился в Самокове, был сыном иконописца Димитара Зографа и братом художника Станислава Доспевского. Поселившись в Plovdiv, занимался портняжным делом и торговлей, помогал управлять церковью Пресвятой Богородицы и служил в городском меджлисе. Временная русская администрация назначила его первым мэром 12 января 1878 года; он покинул пост 26 февраля того же года. Позже он вошёл во Временное правительство после Объединения, был избран в парламент и был среди основателей Пловдивской торгово-промышленной палаты. Был депутатом Первого обыкновенного народного собрания и Третьего великого народного собрания.",
    "Mayoral term(s) for Atanas Samokovliev.": "Мэрский срок: Atanas Samokovliev."
  }
};

// Extra [machineForm, originalName] fixups for protected names that the generic
// inference cannot recover (non-templated transliterations inside longer strings).
const protectedNameOverridesByLang = {
  tr: [["Bojidar Zdravkov", "Bozhidar Zdravkov"]],
  ja: [
    ["フリスト G. ダノフ", "Hristo G. Danov"],
    ["フリスト・G・ダノフ", "Hristo G. Danov"],
    ["フリスト・グルエフ・ダノフ", "Hristo Gruev Danov"],
    ["Christos Tsiiridis", "Christos Tsigiridis"]
  ],
  // Machine translation dropped/added letters in these names in a handful of batches
  // (most occurrences of each name translated correctly); pin the corrupted forms back.
  tl: [
    ["Georgi Dzhezov", "Georgi Dzhevizov"],
    ["Nikolay Marinecheshki", "Nikolay Marincheshki"],
    ["Polis Karastoyanova", "Poli Karastoyanova"]
  ]
};

// Landmark names the machine sometimes leaves in English inside longer captions;
// normalise them to their natural target-language form for consistency.
const landmarkFixupsByLang = {
  tr: [["Lamartine House", "Lamartine Evi"]],
  // Spanish renders "House" -> "Casa" but wrongly feminises the surname ("Lamartina");
  // pin the natural form keeping the recorded surname intact.
  es: [
    ["Casa Lamartina", "Casa Lamartine"],
    ["Lamartine House", "Casa Lamartine"],
    ["Prince's Garden in Plovdiv", "Jardín del Príncipe en Plovdiv"],
    ["Sahat Hill", "Sahat Tepe"],
    ["Sahat hill", "colina Sahat"],
    ["The Old Town (Old Plovdiv)", "el casco antiguo (Viejo Plovdiv)"],
    ["The Old Town", "el casco antiguo"],
    ["Old Plovdiv", "Viejo Plovdiv"],
    ["The Seven Hills (tepeta)", "las Siete Colinas (tepeta)"],
    ["The Seven Hills", "las Siete Colinas"]
  ],
  // Greek wrongly pluralises the surname ("Σπίτι Λαμαρτίνων" = house of the Lamartines);
  // pin the natural genitive-singular form.
  el: [
    ["Lamartine House", "Σπίτι Λαμαρτίνου"],
    ["Σπίτι Λαμαρτίνων", "Σπίτι Λαμαρτίνου"],
    ["Σπίτι των Λαμαρτίνων", "Σπίτι Λαμαρτίνου"],
    ["Geo Milev Primary School", "Δημοτικό Σχολείο Geo Milev"],
    ["Prince's Garden in Plovdiv", "Κήπος του Πρίγκιπα στο Plovdiv"],
    ["Sahat Hill", "Sahat Tepe"],
    ["Sahat hill", "Sahat Tepe"],
    ["The Seven Hills (tepeta)", "Επτά Λόφοι (τεπέτα)"],
    ["The Seven Hills", "Επτά Λόφοι"],
    ["Old Plovdiv", "Παλαιό Plovdiv"]
  ],
  ja: [
    ["Lamartine House", "ラマルティーヌ邸"],
    ["Prince's Garden in Plovdiv", "Plovdivの王子の庭"],
    ["Prince’s Garden in Plovdiv", "Plovdivの王子の庭"],
    ["Sahat Hill", "サハト・テペ"],
    ["Sahat hill", "サハト・テペ"],
    ["Sahat Tepe", "サハト・テペ"],
    ["Geo Milev Primary School", "ゲオ・ミレフ小学校"],
    ["The Old Town (Old Plovdiv)", "旧市街（旧Plovdiv）"],
    ["The Old Town", "旧市街"],
    ["Old Plovdiv", "旧Plovdiv"],
    ["The Seven Hills (tepeta)", "七つの丘（テペ）"],
    ["The Seven Hills", "七つの丘"]
  ]
};
const manualTranslations = manualTranslationsByLang[targetLang];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function* jsonFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(full);
    else if (entry.isFile() && entry.name.endsWith(".json")) yield full;
  }
}

function isPersonLikeRecord(record) {
  return (
    record.type === "person" ||
    String(record.id ?? "").startsWith("person-") ||
    String(record.id ?? "").startsWith("notable-person-") ||
    Array.isArray(record.roles) ||
    "birth_year" in record ||
    "death_year" in record
  );
}

function shouldTranslateField(record, base) {
  if (protectedFieldBases.has(base)) return false;
  if (base === "name" && isPersonLikeRecord(record)) return false;
  return true;
}

function collect(value, key = "", out = new Set(), parentRecord = null) {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, key, out, parentRecord);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) collect(childValue, childKey, out, value);
    return out;
  }
  if (typeof value !== "string") return out;
  const text = value.trim();
  if (!text) return out;
  if (numericOnly.test(text)) return out;
  if (key.endsWith("_en") && !skipKey.test(key)) {
    const base = key.slice(0, -3);
    if (shouldTranslateField(parentRecord ?? {}, base)) out.add(text);
  }
  if (key === "title" && latin.test(text) && !cyrillic.test(text)) out.add(text);
  return out;
}

function collectProtectedNames(value, out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectProtectedNames(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    if (isPersonLikeRecord(value) && typeof value.name_en === "string") {
      const name = value.name_en.trim();
      if (name && !cyrillic.test(name)) out.add(name);
    }
    for (const base of protectedFieldBases) {
      const text = value[`${base}_en`];
      if (typeof text === "string" && text.trim() && !cyrillic.test(text)) out.add(text.trim());
    }
    for (const childValue of Object.values(value)) collectProtectedNames(childValue, out);
    return out;
  }
  return out;
}

function makeBatches(strings) {
  const batches = [];
  let current = [];
  let currentChars = 0;
  for (const text of strings) {
    const nextChars = currentChars + text.length + splitToken.length;
    if (current.length > 0 && nextChars > maxBatchChars) {
      batches.push(current);
      current = [];
      currentChars = 0;
    }
    current.push(text);
    currentChars += text.length + splitToken.length;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

async function translateBatch(batch) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", targetLang);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", batch.join(splitToken));

  const response = await fetch(url);
  if (!response.ok) throw new Error(`translation failed: ${response.status} ${response.statusText}`);
  const payload = await response.json();
  const translated = payload?.[0]?.map((part) => part?.[0] ?? "").join("") ?? "";
  const parts = translated.split("<<<OP_TRANSLATION_SPLIT>>>").map((part) => part.trim());
  if (parts.length !== batch.length) {
    throw new Error(`translation split mismatch: expected ${batch.length}, got ${parts.length}`);
  }
  return parts;
}

function normalizeTranslation(text) {
  let normalized = text
    .replaceAll("BGN", "BGN")
    .replaceAll("EUR", "EUR")
    .replaceAll("Open Plowdiw", "Open Plovdiv")
    .replaceAll("Open Plovdiv", "Open Plovdiv")
    .replaceAll("Wikidaten", "Wikidata")
    .replaceAll("Wiki-Daten", "Wikidata")
    .replaceAll("Wikipedien", "Wikipedia")
    .replaceAll("Wikipedia", "Wikipedia")
    .replaceAll("ウィキデータ", "Wikidata")
    .replaceAll("ウィキペディア", "Wikipedia")
    .replaceAll("ウィキメディア・コモンズ", "Wikimedia Commons")
    .replaceAll("ウィキメディア コモンズ", "Wikimedia Commons")
    .trim();
  for (const [translatedName, originalName] of protectedNameFixups) {
    normalized = normalized.replaceAll(translatedName, originalName);
  }
  return normalized;
}

function expandJapaneseNameFixups(fixups) {
  if (targetLang !== "ja") return fixups;
  const expanded = new Map();
  for (const [translatedName, originalName] of fixups) {
    const variants = new Set([
      translatedName,
      translatedName.replaceAll("・", " "),
      translatedName.replaceAll(" ", "・"),
      translatedName.replaceAll("・", "")
    ]);
    for (const variant of variants) {
      const normalizedVariant = variant.trim();
      if (normalizedVariant && normalizedVariant !== originalName) expanded.set(normalizedVariant, originalName);
    }
  }
  return [...expanded.entries()].sort((a, b) => b[0].length - a[0].length);
}

async function buildProtectedNameFixups(protectedNames, existing) {
  const existingFixups = [...protectedNames]
    .map((name) => [existing[name], name])
    .filter(([translatedName, name]) => translatedName && translatedName !== name);

  const pendingNames = [...protectedNames].filter((name) => !existing[name]);
  const translatedFixups = [];
  for (const batch of makeBatches(pendingNames)) {
    const translated = await translateBatch(batch);
    for (let i = 0; i < batch.length; i += 1) {
      const originalName = batch[i];
      const translatedName = translated[i]?.trim();
      if (translatedName && translatedName !== originalName) translatedFixups.push([translatedName, originalName]);
    }
  }

  return [...existingFixups, ...translatedFixups].sort((a, b) => b[0].length - a[0].length);
}

function stripNamePrefix(value) {
  // French inserts grammatical articles before the name in some templates; Italian
  // keeps the name (incl. title prefixes like "Dott."/"Ing.") intact in the capture.
  if (targetLang === "fr") {
    return value
      .replace(/^l['’]/i, "")
      .replace(/^le /i, "")
      .replace(/^la /i, "")
      .replace(/^les /i, "")
      .trim();
  }
  return value.trim();
}

// Per-language inference of how a protected person name was rendered inside a
// translated sentence, so it can be mapped back to the original spelling.
const namePatternsByLang = {
  fr: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Référence biographique\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Naissance (?:d['’]|de |du |des )(.+)$/],
      [
        `Birth year and birthplace for ${escapedName}.`,
        /^Année et lieu de naissance (?:d['’]|de |du |des )(.+)\.$/
      ],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Données biographiques et lien vers le lieu de naissance de Plovdiv pour (.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Maire\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^.+ pour (?:l['’]|le |la |les )?(.+)\.$/],
      [`Wikipedia [—-] ${escapedName}`, /^Wikipédia [—-]\s*(.+)$/]
    ],
    archive: /Maire\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Relation personnelle\s*:\s*/
  },
  it: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Riferimento biografico\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Nascita di (.+)$/],
      [
        `Birth year and birthplace for ${escapedName}.`,
        /^Anno di nascita e luogo di nascita di (.+)\.$/
      ],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Dati biografici e collegamento al luogo di nascita di Plovdiv per (.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Sindaco\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Termine sindaco per (.+)\.$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia [—–-]\s*(.+)$/]
    ],
    archive: /Sindaco\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Rapporto personale\s*:\s*/
  },
  es: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Referencia biográfica\s*:\s*(.+)$/],
      // Spanish may insert an article ("Nacimiento del ángel ..." for "Angel").
      [`Birth of ${escapedName}`, /^Nacimiento de(?:l| la| los| las)? (.+)$/],
      [`Birth year and birthplace for ${escapedName}.`, /^Año de nacimiento y lugar de nacimiento de (.+)\.$/],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Datos biográficos y enlace del lugar de nacimiento de Plovdiv de (.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Alcalde\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Mandato.* para (.+)\.$/],
      // Spanish sometimes renders the "Wikipedia —" separator as a colon.
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia\s*[—–:-]\s*(.+)$/]
    ],
    archive: /Alcalde\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Relación personal\s*:\s*/
  },
  tr: {
    // Turkish renders the name first with a genitive suffix after an apostrophe
    // (e.g. "Emma Tahmiziyan'ın doğumu"); capture the name before the apostrophe.
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Biyografik referans\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^(.+?)['’]\S*\s+[Dd]oğ\w*$/],
      [`Birth year and birthplace for ${escapedName}.`, /^(.+?)['’]\S*\s+doğum yılı ve doğum yeri\.$/],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^(.+?)['’]\S*\s+biyografik verileri.*$/
      ],
      [`Mayor: ${escapedName}`, /^Belediye Başkanı\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^(.+?)['’]\S*\s+belediye başkanlığı dönem.*$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Vikipedi [—–-]\s*(.+)$/]
    ],
    archive: /Belediye Başkanı\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Kişi ilişkisi\s*:\s*/
  },
  el: {
    // Greek often inserts a definite article (της/του/τον/την) before the name and
    // transliterates it into Greek script; capture what follows the article.
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Βιογραφική αναφορά\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Γέννηση τ(?:ης|ου|ων|ο)\s+(.+)$/],
      [
        `Birth year and birthplace for ${escapedName}.`,
        /^Έτος γέννησης και γενέτειρα για τ(?:ην|ον|ο|η)\s+(.+)\.$/
      ],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Βιογραφικά στοιχεία.* για τ(?:ην|ον|ο|η)\s+(.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Δήμαρχος\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Δήμαρχος.* για τ(?:ον|ην|ο|η)\s+(.+)\.$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia\s*[—–:-]\s*(.+)$/]
    ],
    archive: /Δήμαρχος\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Προσωπική σχέση\s*:\s*/
  },
  ja: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^伝記(?:上の)?参照\s*[:：]\s*(.+)$/],
      [`Birth of ${escapedName}`, /^(.+?)の誕生$/],
      [`Birth year and birthplace for ${escapedName}.`, /^(.+?)の生年と出生地。?$/],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^(.+?)の伝記データ.*$/
      ],
      [`Mayor: ${escapedName}`, /^市長\s*[:：]\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^(.+?)の市長任期。?$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia\s*[—–:-]\s*(.+)$/]
    ],
    archive: /市長\s*[:：]\s*([^"」]+)["」]\.?$/,
    relationshipPrefix: /^人物関係\s*[:：]\s*/
  },
  tl: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Sanggunian ng talambuhay\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Kapanganakan\s*:\s*(.+)$/],
      [`Birth year and birthplace for ${escapedName}.`, /^Taon at lugar ng kapanganakan\s*:\s*(.+)\.$/],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Datos ng talambuhay at ugnay sa lugar ng kapanganakan sa Plovdiv\s*:\s*(.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Alkalde\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Termino bilang alkalde\s*:\s*(.+)\.$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia [—–-]\s*(.+)$/]
    ],
    archive: /Alkalde\s*:\s*([^"”]+)["”]\.?$/,
    relationshipPrefix: /^Relasyon ng tao\s*:\s*/
  },
  uk: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Біографічна довідка\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Народ(?:ження|ився|илася)\s*:?\s*(.+)$/],
      [`Birth year and birthplace for ${escapedName}.`, /^Рік і місце народження\s*:?\s*(.+)\.$/],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Біографічні дані.*(?:для|про|:)\s*(.+?)(?:\s+в Plovdiv)?\.$/
      ],
      [`Mayor: ${escapedName}`, /^(?:Мер|Міський голова|Бургомістр)\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Мерська каденція\s*:\s*(.+)\.$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia\s*[—–:-]\s*(.+)$/]
    ],
    archive: /(?:Мер|Міський голова|Бургомістр)\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^(?:Зв'язок між особами|Особисті стосунки|Особистість|Спорідненість)\s*:\s*/
  },
  ru: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Биографическая справка\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Рождение\s*:?\s*(.+)$/],
      [`Birth year and birthplace for ${escapedName}.`, /^Год и место рождения\s*:?\s*(.+)\.$/],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Биографические данные.*(?:для|о|:)\s*(.+?)(?:\s+в Plovdiv)?\.$/
      ],
      [`Mayor: ${escapedName}`, /^(?:Мэр|Градоначальник)\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Мэрский срок\s*:\s*(.+)\.$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia\s*[—–:-]\s*(.+)$/]
    ],
    archive: /(?:Мэр|Градоначальник)\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^(?:Связь между людьми|Отношения между людьми|Личное родство|Родство)\s*:\s*/
  }
};

function translatedNameFromPattern(source, target, name) {
  const langPatterns = namePatternsByLang[targetLang];
  if (!langPatterns) return null;
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  for (const [sourcePattern, targetPattern] of langPatterns.direct(escapedName)) {
    if (!new RegExp(`^${sourcePattern}$`).test(source)) continue;
    const match = target.match(targetPattern);
    return match ? stripNamePrefix(match[1]) : null;
  }

  const archiveMatch = source.match(new RegExp(`^City archive record "Mayor: ${escapedName}"\\.$`));
  if (archiveMatch) {
    const targetMatch = target.match(langPatterns.archive);
    return targetMatch ? stripNamePrefix(targetMatch[1]) : null;
  }

  const relationshipSource = source
    .replace(/^Person relationship: /, "")
    .replace(/\.$/, "")
    .match(/^(.+) — (succeeded by|succeeds) — (.+)$/);
  if (relationshipSource) {
    const targetBody = target.replace(langPatterns.relationshipPrefix, "").replace(/\.$/, "");
    // Google emits an em-dash, en-dash or (Turkish) a hyphen as the relation separator.
    const targetParts = targetBody.split(/\s+[—–-]\s+/);
    if (targetParts.length === 3 && relationshipSource[1] === name) return stripNamePrefix(targetParts[0]);
    if (targetParts.length === 3 && relationshipSource[3] === name) return stripNamePrefix(targetParts[2]);
  }

  return null;
}

function isSafeInferredNameFixup(translatedName, originalName) {
  const value = translatedName.trim();
  if (!value || value === originalName) return false;
  if (value.length < 3) return false;
  if (numericOnly.test(value)) return false;

  if (["ru", "uk"].includes(targetLang)) {
    // Russian/Ukrainian template inference can otherwise capture tiny declined
    // fragments from ordinary words ("в", "го", "ния") and later replace those
    // fragments globally with a protected name. Only accept captures that look
    // like a rendered proper name: they need uppercase name shape or an explicit
    // title marker, not just lowercase Cyrillic grammar.
    const hasTitleMarker = /(?:д-р|доктор|інж\.?|инж\.?|Eng\.|Dr\.)/iu.test(value);
    const hasUppercase = /[A-ZА-ЯЁІЇЄҐ]/u.test(value);
    const hasNameSeparator = /\s|\.|-/u.test(value);
    if (/^(?:в|во|у|из|із|с|со|з|от|від|до|на)\s+/iu.test(value)) return false;
    if (/(?:Plovdiv|Пловдив)/iu.test(value) && !/(?:Plovdiv|Пловдив)/iu.test(originalName)) return false;
    if (!hasTitleMarker && (!hasUppercase || !hasNameSeparator)) return false;
  }

  return true;
}

function inferProtectedNameFixups(translations, protectedNames) {
  const inferred = [];
  for (const [source, target] of Object.entries(translations)) {
    for (const name of protectedNames) {
      if (!source.includes(name) || target.includes(name)) continue;
      const translatedName = translatedNameFromPattern(source, target, name);
      if (translatedName && isSafeInferredNameFixup(translatedName, name)) inferred.push([translatedName, name]);
    }
  }
  return inferred;
}

function normalizeAllTranslations(translations) {
  for (const [source, translated] of Object.entries(translations)) {
    translations[source] = normalizeTranslation(translated);
  }
}

function applyManualTranslations(translations) {
  for (const [source, translated] of Object.entries(manualTranslations)) {
    translations[source] = translated;
  }
}

// Italian translates honorific prefixes that are part of a protected name
// ("Dr. X" -> "il dottor X"/"Dott. X", "Eng. X" -> "Ing. X") even mid-sentence.
// Map every machine rendering of such a prefixed name back to its original form.
function buildTitlePrefixFixups(protectedNames) {
  if (targetLang !== "it") return [];
  const variantPrefixes = {
    "Dr.": ["Il dottor", "il dottor", "Dottor", "dottor", "Dott.", "Dott.ssa", "Il Dott.", "il Dott."],
    "Dr": ["Il dottor", "il dottor", "Dottor", "dottor", "Dott.", "Dott.ssa"],
    "Eng.": ["Ing.", "ing.", "L'ingegnere", "l'ingegnere"],
    "Prof.": ["Prof.", "Il professor", "il professor"]
  };
  const fixups = [];
  for (const name of protectedNames) {
    for (const [prefix, variants] of Object.entries(variantPrefixes)) {
      if (!name.startsWith(`${prefix} `)) continue;
      const rest = name.slice(prefix.length + 1);
      for (const variant of variants) fixups.push([`${variant} ${rest}`, name]);
    }
  }
  return fixups;
}

// Machine translation renders the modern city "Plovdiv" as a historical exonym
// (Italian "Filippopoli", Turkish "Filibe", Greek "Φιλιππούπολη") or transliterates
// it (Greek "Πλόβντιβ"). Keep "Plovdiv" for the modern city while still allowing the
// exonym where the English source explicitly used the ancient "Philippopolis".
// `guarded` forms only map back when the source used "Plovdiv" (not "Philippopolis").
const exonymByLang = {
  it: [{ form: "Filippopoli", guarded: true }],
  tr: [{ form: "Filibe", guarded: true }],
  el: [
    // Longest first so the Greek genitive "Φιλιππούπολης" is handled before "Φιλιππούπολη".
    { form: "Φιλιππούπολης", guarded: true },
    { form: "Φιλιππούπολη", guarded: true },
    // Plain transliteration of the modern brand name; never the ancient city.
    { form: "Πλόβντιβ", guarded: false }
  ],
  ja: [
    { form: "プロヴディフ", guarded: true },
    { form: "プロブディフ", guarded: true },
    { form: "フィリッポポリス", guarded: true },
    { form: "フィリベ", guarded: true }
  ]
};
function applyExonymFixups(translations) {
  const exonyms = exonymByLang[targetLang];
  if (!exonyms) return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    const guardOk =
      source.includes("Plovdiv") && !source.includes("Philippopolis") && !source.includes("Filibe");
    let out = translated;
    for (const { form, guarded } of exonyms) {
      if (!out.includes(form) || (guarded && !guardOk)) continue;
      out = out.replaceAll(form, "Plovdiv");
    }
    translations[source] = out;
  }
}

// Ukrainian is a declined language, so machine translation glues Cyrillic case
// endings directly onto the protected Latin noun "Plovdiv" (e.g. "Plovdivі",
// "Plovdivа") and forms hybrid adjectives ("Plovdivський"). Adjectives derived
// from the city name are ordinary Ukrainian words (like "римський" for
// "Roman") and get fully transliterated; the plain noun stays untouched and
// indeclinable, matching how every other locale keeps "Plovdiv" as-is.
const ukrainianAdjectiveSuffixes = [
  "ський", "ського", "ська", "ської", "ські", "ському", "ську", "ській", "ське"
];
function applyUkrainianDeclensionFixups(translations) {
  if (targetLang !== "uk") return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    for (const suffix of ukrainianAdjectiveSuffixes) {
      out = out.replaceAll(`Plovdiv${suffix}`, `пловдив${suffix}`);
    }
    // JS's \b treats Cyrillic letters as non-word characters, so it never matches
    // right after one; use a negative lookahead for another Cyrillic letter instead.
    out = out.replace(/Plovdiv(?:і|а|у|ом)(?![а-яіїєґ'])/gu, "Plovdiv");
    // The same declension-gluing happens to every other protected Latin proper
    // noun (other town names, person surnames): a Cyrillic case ending gets
    // glued directly onto the untranslated Latin word with no separator,
    // producing a garbled hybrid (e.g. "Samokovлєва", "Chirpanі"). There is no
    // general way to produce a correctly declined Ukrainian form for an
    // arbitrary protected name, so strip the glued suffix back to the bare,
    // indeclinable Latin form instead, matching how "Plovdiv" itself is kept.
    out = out.replace(/([A-Za-z]{3,})[а-яіїєґ]{1,8}(?![а-яіїєґA-Za-z])/gu, "$1");
    translations[source] = out;
  }
  applyUkrainianRelationshipTagFixups(translations);
  applyUkrainianNameConsistencyFixups(translations);
}

// The mayoral-succession templates ("A — succeeds — B", "Person relationship:
// A — succeeds — B.", and the prose "...through the relationship
// "succeeds".") each get retranslated independently per line, so Google
// Translate picks a different word for the same relationship_type almost
// every time ("змінює", "наступає", "переходить", "наступник", "успішний",
// "досягає успіху", "успішає", "успішно", "вдається", ...) instead of one
// stable term. Force every occurrence of a given relationship_type to the
// same word, matching how "person_id"-to-"to_person_id" is always read from
// the "from" person's perspective: succeeds means "to" is from's
// predecessor, succeeded_by means "to" is from's successor (confirmed
// against generate_history_knowledge.mjs's from/to construction and mirrored
// by PersonDetailView.astro's relationshipLabelsUk).
const relationshipTagLabelsUk = { succeeds: "попередник", succeededBy: "наступник" };
function applyUkrainianRelationshipTagFixups(translations) {
  if (targetLang !== "uk") return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    if (/ — succeeds — /.test(source)) {
      out = out.replace(/ — .+? — /, ` — ${relationshipTagLabelsUk.succeeds} — `);
    } else if (/ — succeeded by — /.test(source)) {
      out = out.replace(/ — .+? — /, ` — ${relationshipTagLabelsUk.succeededBy} — `);
    }
    if (/through the relationship "succeeds"\.$/.test(source)) {
      out = out.replace(/(["«])[^"»]*(["»])\.?$/, `$1${relationshipTagLabelsUk.succeeds}$2.`);
    } else if (/through the relationship "succeeded by"\.$/.test(source)) {
      out = out.replace(/(["«])[^"»]*(["»])\.?$/, `$1${relationshipTagLabelsUk.succeededBy}$2.`);
    }
    if (out !== translated) translations[source] = out;
  }
}

// Person bios whose official name repeats a surname (e.g. "Kostadin Dimitrov
// Dimitrov", where the patronymic and surname coincide) confuse Google
// Translate: it leaves the first occurrence in Latin but transliterates the
// second into Cyrillic, producing one name rendered two different ways in the
// same sentence. Revert the transliterated tail back to the Latin form used
// for the rest of the name, matching how every other locale keeps full names
// in Latin script within prose.
const ukrainianNameConsistencyFixups = [
  [/Kostadin Dimitrov Дімітров/g, "Kostadin Dimitrov Dimitrov"],
  [/Ivan Dimitrov Панев/g, "Ivan Dimitrov Panev"],
  [/Hristo Pavlov Шкодров/g, "Hristo Pavlov Shkodrov"]
];
function applyUkrainianNameConsistencyFixups(translations) {
  if (targetLang !== "uk") return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    for (const [pattern, replacement] of ukrainianNameConsistencyFixups) out = out.replace(pattern, replacement);
    if (out !== translated) translations[source] = out;
  }
}

// Russian is also a declined Slavic language, so the same class of bug as
// Ukrainian occurs: machine translation glues Cyrillic case endings directly
// onto the protected Latin noun "Plovdiv" (e.g. "Plovdivа" genitive,
// "Plovdivе" prepositional, "Plovdivу" dative, "Plovdivом" instrumental) and
// forms hybrid adjectives ("Plovdivский"). Adjectives derived from the city
// name are ordinary Russian words (like "пловдивский") and get fully
// transliterated; the plain noun stays untouched and indeclinable, matching
// how every other locale keeps "Plovdiv" as-is.
const russianAdjectiveSuffixes = [
  "ский", "ского", "ская", "ской", "ские", "скому", "скую", "ском", "ское"
];
function applyRussianDeclensionFixups(translations) {
  if (targetLang !== "ru") return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    for (const suffix of russianAdjectiveSuffixes) {
      out = out.replaceAll(`Plovdiv${suffix}`, `пловдив${suffix}`);
    }
    // JS's \b treats Cyrillic letters as non-word characters, so it never matches
    // right after one; use a negative lookahead for another Cyrillic letter instead.
    out = out.replace(/Plovdiv(?:а|е|у|ом)(?![а-яё'])/gu, "Plovdiv");
    // The same declension-gluing happens to every other protected Latin proper
    // noun (other town names, person surnames): a Cyrillic case ending gets
    // glued directly onto the untranslated Latin word with no separator,
    // producing a garbled hybrid. There is no general way to produce a
    // correctly declined Russian form for an arbitrary protected name, so
    // strip the glued suffix back to the bare, indeclinable Latin form
    // instead, matching how "Plovdiv" itself is kept.
    out = out.replace(/([A-Za-z]{3,})[а-яё]{1,8}(?![а-яёA-Za-z])/gu, "$1");
    // Bio-lead sentences ("First Middle Last (born ...) was a ...") often get
    // only the LAST name-word transliterated to Cyrillic while earlier words
    // stay Latin, producing an inconsistent hybrid within a single name (e.g.
    // "Zdravko Dimitrov Димитров", "Georgi Todorov Крастев"). There's no
    // reliable way to know the correct Russian transliteration of an arbitrary
    // name, so reset the leading name to the exact source-English form instead
    // — matching how every other locale keeps names untouched in bio leads.
    const bioLead = source.match(/^([A-ZÀ-ž][^()\n]{2,160}) \((?:b\.|born|c\.|active|fl\.|\d{3,4})/);
    if (bioLead) {
      out = out.replace(/^.+?(?=\s*[（(])/, bioLead[1]);
    }
    translations[source] = out;
  }
  applyRussianRelationshipTagFixups(translations);
  applyRussianNameConsistencyFixups(translations);
}

// Mirrors applyUkrainianRelationshipTagFixups: the mayoral-succession templates
// ("A — succeeds — B", "Person relationship: A — succeeds — B.", and the
// prose "...through the relationship "succeeds".") each get retranslated
// independently per line, so Google Translate picks a different Russian word
// for the same relationship_type from line to line. Force every occurrence to
// one stable term, matching the "from"/"to" direction confirmed against
// generate_history_knowledge.mjs: succeeds means "to" is from's predecessor,
// succeeded_by means "to" is from's successor (mirrored by
// PersonDetailView.astro's relationshipLabelsRu).
const relationshipTagLabelsRu = { succeeds: "предшественник", succeededBy: "преемник" };
function applyRussianRelationshipTagFixups(translations) {
  if (targetLang !== "ru") return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    // Usual case: Google keeps the "A — TAG — B" three-part structure and only
    // the middle TAG varies; normalize it in place.
    if (/ — succeeds — /.test(source) && / — .+? — /.test(out)) {
      out = out.replace(/ — .+? — /, ` — ${relationshipTagLabelsRu.succeeds} — `);
    } else if (/ — succeeded by — /.test(source) && / — .+? — /.test(out)) {
      out = out.replace(/ — .+? — /, ` — ${relationshipTagLabelsRu.succeededBy} — `);
    } else if (/ — succeeds — /.test(source)) {
      // Rarer case: Google collapses the template into "A — сменил B" (only one
      // em-dash, a verb instead of the tag) — rebuild the standard three-part form.
      const m = source.match(/^(?:Person relationship: )?(.+) — succeeds — (.+?)\.?$/);
      if (m) out = source.startsWith("Person relationship:")
        ? `Связь между людьми: ${m[1]} — ${relationshipTagLabelsRu.succeeds} — ${m[2]}.`
        : `${m[1]} — ${relationshipTagLabelsRu.succeeds} — ${m[2]}`;
    } else if (/ — succeeded by — /.test(source)) {
      const m = source.match(/^(?:Person relationship: )?(.+) — succeeded by — (.+?)\.?$/);
      if (m) out = source.startsWith("Person relationship:")
        ? `Связь между людьми: ${m[1]} — ${relationshipTagLabelsRu.succeededBy} — ${m[2]}.`
        : `${m[1]} — ${relationshipTagLabelsRu.succeededBy} — ${m[2]}`;
    }
    // The "chronology links A with B through the relationship "TAG"." prose
    // form is the least reliable: Google frequently drops the quoted span
    // entirely and paraphrases into unrelated wording ("через отношения.",
    // "через родство.", "благодаря отношениям.") with nothing left to patch,
    // and occasionally corrupts a protected name in the process (e.g.
    // truncating "Atanas Samokovliev" to "Атанас Samokov"). Rebuild the whole
    // sentence directly from the English source instead of patching Google's
    // output, keeping both names in their original Latin form — matching how
    // every other locale keeps names untouched in this specific summary line.
    const chronologyMatch = source.match(
      /^The mayoral chronology links (.+) with (.+) through the relationship "(succeeds|succeeded by)"\.$/
    );
    if (chronologyMatch) {
      const [, left, right, relation] = chronologyMatch;
      const tag = relation === "succeeds" ? relationshipTagLabelsRu.succeeds : relationshipTagLabelsRu.succeededBy;
      out = `Хронология мэров связывает ${left} с ${right} через связь «${tag}».`;
    }
    if (out !== translated) translations[source] = out;
  }
}

// Mirrors applyUkrainianNameConsistencyFixups: person bios whose official name
// repeats a surname (e.g. "Kostadin Dimitrov Dimitrov", where the patronymic
// and surname coincide) confuse Google Translate — it leaves the first
// occurrence in Latin but transliterates a later occurrence into Cyrillic,
// producing one name rendered two different ways in the same sentence. Revert
// the transliterated tail back to the Latin form used for the rest of the
// name, matching how every other locale keeps full names in Latin script
// within prose. Populated after scanning the generated ru.json for the same
// repeated-surname pattern already confirmed for uk.
const russianNameConsistencyFixups = [
  [/Kostadin Dimitrov (?:Дмитров|Димитров)/g, "Kostadin Dimitrov Dimitrov"],
  [/Ivan Dimitrov Панев/g, "Ivan Dimitrov Panev"],
  [/Hristo Pavlov Шкодров/g, "Hristo Pavlov Shkodrov"],
  [/Zdravko Dimitrov (?:Дмитров|Димитров)/g, "Zdravko Dimitrov Dimitrov"]
];
function applyRussianNameConsistencyFixups(translations) {
  if (targetLang !== "ru") return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    for (const [pattern, replacement] of russianNameConsistencyFixups) out = out.replace(pattern, replacement);
    if (out !== translated) translations[source] = out;
  }
}

const ukrainianRelationshipLabels = {
  child: "дитина",
  father: "батько",
  mother: "мати",
  parent: "батько/мати",
  sibling: "брат/сестра",
  spouse: "подружжя",
  succeeds: relationshipTagLabelsUk.succeeds,
  succeeded_by: relationshipTagLabelsUk.succeededBy,
  mentor: "наставник",
  student: "учень/студент",
  partner: "партнер",
  influenced_by: "зазнав(-ла) впливу"
};

function applyUkrainianTemplateFixups(translations) {
  if (targetLang !== "uk") return;
  const relationUk = (relation) =>
    relation === "succeeds" ? relationshipTagLabelsUk.succeeds : relationshipTagLabelsUk.succeededBy;

  for (const source of Object.keys(translations)) {
    if (manualTranslations[source]) continue;

    let match = source.match(/^Person relationship: (.+) — (succeeds|succeeded by) — (.+)\.$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] = `Зв'язок між особами: ${left} — ${relationUk(relation)} — ${right}.`;
      continue;
    }

    match = source.match(/^(.+) — (succeeds|succeeded by) — (.+)$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] = `${left} — ${relationUk(relation)} — ${right}`;
      continue;
    }

    match = source.match(/^The mayoral chronology links (.+) with (.+) through the relationship "(succeeds|succeeded by)"\.$/);
    if (match) {
      const [, left, right, relation] = match;
      translations[source] = `Хронологія мерів пов'язує ${left} з ${right} через зв'язок "${relationUk(relation)}".`;
      continue;
    }

    match = source.match(/^A biographical source documents the relationship "(.+)" between (.+) and (.+)\.$/);
    if (match) {
      const [, relation, left, right] = match;
      translations[source] = `Біографічне джерело документує зв'язок "${ukrainianRelationshipLabels[relation] ?? relation}" між ${left} і ${right}.`;
      continue;
    }

    match = source.match(/^Mayoral term\(s\) for (.+)\.$/);
    if (match) {
      translations[source] = `Мерська каденція: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Wikipedia [—-] (.+)$/);
    if (match) {
      translations[source] = `Wikipedia — ${match[1]}`;
      continue;
    }

    match = source.match(/^Biographical reference: (.+)$/);
    if (match) {
      translations[source] = `Біографічна довідка: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth of (.+)$/);
    if (match) {
      translations[source] = `Народження: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth year and birthplace for (.+)\.$/);
    if (match) {
      translations[source] = `Рік і місце народження: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Biographical data and Plovdiv birthplace link for (.+)\.$/);
    if (match) {
      translations[source] = `Біографічні дані та зв'язок із місцем народження у Plovdiv: ${match[1]}.`;
      continue;
    }

    match = source.match(/^(.+)'s birthplace is Plovdiv; the recorded birth year is (.+)\.$/);
    if (match) {
      translations[source] = `Місце народження ${match[1]}: Plovdiv; зафіксований рік народження - ${match[2]}.`;
      continue;
    }

    match = source.match(/^City archive record "Mayor: (.+)"\.$/);
    if (match) {
      translations[source] = `Запис міського архіву "Мер: ${match[1]}".`;
      continue;
    }

    match = source.match(/^Dating and summary for timeline record "(.+)"\.$/);
    if (match) {
      translations[source] = `Датування та короткий зміст для запису хронології "${match[1]}".`;
      continue;
    }

    const bioLead = source.match(/^([A-ZÀ-ž][^()\n]{2,160}) \((?:b\.|born|c\.|active|fl\.|\d{3,4})/);
    if (bioLead) {
      translations[source] = translations[source].replace(/^.+?(?=\s*[（(])/, bioLead[1]);
    }
  }

  const cleanupReplacements = [
    [/Містр:/g, "Мер:"],
    [/Бургомістр:/g, "Мер:"],
    [/Міський голова:/g, "Мер:"],
    [/Міський архівний запис/g, "Запис міського архіву"],
    [/(?:Особисті стосунки|Особистість|Спорідненість):/g, "Зв'язок між особами:"],
    [/Термін\(и\) мера/g, "Мерська каденція"],
    [/англ\. Іван Тот[еє]в/g, "Eng. Ivan Totev"],
    [/інж\. Іван Тотев/g, "Eng. Ivan Totev"],
    [/д-р Сотир Антоніаді/g, "Dr. Sotir Antoniadi"],
    [/д-ра Сотіра Антоніаді/g, "Dr. Sotir Antoniadi"],
    [/доктор Асен Кожухаров/g, "Dr. Asen Kozhuharov"],
    [/доктора Асена Кожухарова/g, "Dr. Asen Kozhuharov"],
    [/доктор Гарабед Томасян/g, "Dr. Garabed Tomasyan"],
    [/д-ра Гарабеда Томасяна/g, "Dr. Garabed Tomasyan"],
    [/доктор Христо Танчев/g, "Dr. Hristo Tanchev"],
    [/д-ра Христо Танчева/g, "Dr. Hristo Tanchev"],
    [/д-р Іван Чомаков/g, "Dr. Ivan Chomakov"],
    [/д-ра Івана Чомакова/g, "Dr. Ivan Chomakov"],
    [/д-р Іван Кесяков/g, "Dr. Ivan Kesyakov"],
    [/д-ра Івана Кесякова/g, "Dr. Ivan Kesyakov"],
    [/д-р Панайот Костов/g, "Dr. Panayot Kostov"],
    [/д-ра Панайота Костова/g, "Dr. Panayot Kostov"],
    [/Цільова субсидія держави/g, "Цільова державна субсидія"],
    [/Болгарське Відродження/g, "Болгарське національне відродження"]
  ];

  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    for (const [from, to] of cleanupReplacements) out = out.replace(from, to);
    translations[source] = out;
  }
}

const russianRelationshipLabels = {
  child: "ребенок",
  father: "отец",
  mother: "мать",
  parent: "родитель",
  sibling: "брат/сестра",
  spouse: "супруг/супруга",
  succeeds: relationshipTagLabelsRu.succeeds,
  succeeded_by: relationshipTagLabelsRu.succeededBy,
  mentor: "наставник",
  student: "ученик/студент",
  partner: "партнер",
  influenced_by: "испытал(а) влияние"
};

const russianShortDescriptionNationalities = {
  Bulgarian: "Болгарский",
  French: "Французский",
  Greek: "Греческий",
  Israeli: "Израильский",
  Ottoman: "Османский",
  Turkish: "Турецкий"
};

const russianShortDescriptionProfessions = {
  "film director and screenwriter": "кинорежиссер и сценарист",
  politician: "политик",
  "theatre director": "театральный режиссер",
  writer: "писатель",
  "screenwriter and film director": "сценарист и кинорежиссер",
  "scholar and educator": "ученый и просветитель",
  "politician, diplomat and journalist": "политик, дипломат и журналист",
  "grand vizier and writer": "великий визирь и писатель",
  "diplomat and politician": "дипломат и политик",
  "military officer and statesperson": "военный офицер и государственный деятель",
  "statesperson and military officer": "государственный деятель и военный офицер",
  "politician and jurist": "политик и юрист"
};

function russianDateNote(note) {
  return note.replace(/^born\s+(\d{4})$/i, "род. $1").replaceAll("–", "-");
}

function russianEmbeddedTitle(title, translations) {
  const translated = translations[title] ?? title;
  return translated
    .replace(/\.$/, "")
    .replace(/\(mayor of Plovdiv\)/g, "(мэр Plovdiv)")
    .replace(/\(politician\)/g, "(политик)")
    .replace(/\(officer\)/g, "(офицер)");
}

function applyRussianTemplateFixups(translations) {
  if (targetLang !== "ru") return;
  const relationRu = (relation) =>
    relation === "succeeds" ? relationshipTagLabelsRu.succeeds : relationshipTagLabelsRu.succeededBy;

  for (const source of Object.keys(translations)) {
    if (manualTranslations[source]) continue;

    let match = source.match(/^Person relationship: (.+) — (succeeds|succeeded by) — (.+)\.$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] = `Связь между людьми: ${left} — ${relationRu(relation)} — ${right}.`;
      continue;
    }

    match = source.match(/^(.+) — (succeeds|succeeded by) — (.+)$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] = `${left} — ${relationRu(relation)} — ${right}`;
      continue;
    }

    match = source.match(/^The mayoral chronology links (.+) with (.+) through the relationship "(succeeds|succeeded by)"\.$/);
    if (match) {
      const [, left, right, relation] = match;
      translations[source] = `Хронология мэров связывает ${left} с ${right} через связь "${relationRu(relation)}".`;
      continue;
    }

    match = source.match(/^A biographical source documents the relationship "(.+)" between (.+) and (.+)\.$/);
    if (match) {
      const [, relation, left, right] = match;
      translations[source] = `Биографический источник фиксирует связь "${russianRelationshipLabels[relation] ?? relation}" между ${left} и ${right}.`;
      continue;
    }

    match = source.match(/^Mayoral term\(s\) for (.+)\.$/);
    if (match) {
      translations[source] = `Мэрский срок: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Wikipedia [—–-] (.+)$/);
    if (match) {
      translations[source] = `Wikipedia — ${russianEmbeddedTitle(match[1], translations)}`;
      continue;
    }

    match = source.match(/^Biographical reference: (.+)$/);
    if (match) {
      translations[source] = `Биографическая справка: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth of (.+)$/);
    if (match) {
      translations[source] = `Рождение: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth year and birthplace for (.+)\.$/);
    if (match) {
      translations[source] = `Год и место рождения: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Biographical data and Plovdiv birthplace link for (.+)\.$/);
    if (match) {
      translations[source] = `Биографические данные и связь с местом рождения в Plovdiv: ${match[1]}.`;
      continue;
    }

    match = source.match(/^(.+)'s birthplace is Plovdiv; the recorded birth year is (.+)\.$/);
    if (match) {
      translations[source] = `Место рождения ${match[1]}: Plovdiv; зафиксированный год рождения - ${match[2]}.`;
      continue;
    }

    match = source.match(/^City archive record "Mayor: (.+)"\.$/);
    if (match) {
      translations[source] = `Запись городского архива "Мэр: ${match[1]}".`;
      continue;
    }

    match = source.match(/^Dating and summary for timeline record "(.+)"\.$/);
    if (match) {
      translations[source] = `Датировка и краткое содержание для записи хронологии "${russianEmbeddedTitle(match[1], translations)}".`;
      continue;
    }

    match = source.match(/^Media and license for (.+): (.+)\.$/);
    if (match) {
      const [, subject, fileName] = match;
      translations[source] = `Медиа и лицензия: ${russianEmbeddedTitle(subject, translations)} — ${fileName}.`;
      continue;
    }

    match = source.match(/^([A-Z][A-Za-z]+) (.+) \((born \d{4}|\d{4}[–-]\d{4})\)\.?$/);
    if (match) {
      const [, nationality, profession, note] = match;
      const nationalityRu = russianShortDescriptionNationalities[nationality];
      const professionRu = russianShortDescriptionProfessions[profession];
      if (nationalityRu && professionRu) {
        translations[source] = `${nationalityRu} ${professionRu} (${russianDateNote(note)})`;
        continue;
      }
    }

    match = source.match(/^First of two consecutive terms as mayor of Plovdiv \((.+)\)\.$/);
    if (match) {
      translations[source] = `Первый из двух последовательных сроков на посту мэра Plovdiv (${match[1]}).`;
      continue;
    }

    match = source.match(/^Second of two consecutive terms as mayor of Plovdiv \((.+)\)\.$/);
    if (match) {
      translations[source] = `Второй из двух последовательных сроков на посту мэра Plovdiv (${match[1]}).`;
      continue;
    }

    const bioLead = source.match(/^([A-ZÀ-ž][^()\n]{2,160}) \((?:b\.|born|c\.|active|fl\.|\d{3,4})/);
    if (bioLead) {
      translations[source] = translations[source].replace(/^.+?(?=\s*[（(])/, bioLead[1]);
    }
  }

  const cleanupReplacements = [
    [/Личное родство:/g, "Связь между людьми:"],
    [/Отношения между людьми:/g, "Связь между людьми:"],
    [/Родство:/g, "Связь между людьми:"],
    [/Срок\(и\) мэра/g, "Мэрский срок"],
    [/Мэрский термин \(термины\) для/g, "Мэрский срок:"],
    [/Мэрский срок для/g, "Мэрский срок:"],
    [/Городская архивная запись/g, "Запись городского архива"],
    [/англ\. Иван Тотев/g, "Eng. Ivan Totev"],
    [/инж\. Иван Тотев/g, "Eng. Ivan Totev"],
    [/д-р Сотир Антониади/g, "Dr. Sotir Antoniadi"],
    [/д-ра Сотира Антониади/g, "Dr. Sotir Antoniadi"],
    [/доктор Асен Кожухаров/g, "Dr. Asen Kozhuharov"],
    [/доктора Асена Кожухарова/g, "Dr. Asen Kozhuharov"],
    [/доктор Гарабед Томасян/g, "Dr. Garabed Tomasyan"],
    [/д-ра Гарабеда Томасяна/g, "Dr. Garabed Tomasyan"],
    [/доктор Христо Танчев/g, "Dr. Hristo Tanchev"],
    [/д-ра Христо Танчева/g, "Dr. Hristo Tanchev"],
    [/д-р Иван Чомаков/g, "Dr. Ivan Chomakov"],
    [/д-ра Ивана Чомакова/g, "Dr. Ivan Chomakov"],
    [/д-р Иван Кесяков/g, "Dr. Ivan Kesyakov"],
    [/д-ра Ивана Кесякова/g, "Dr. Ivan Kesyakov"],
    [/д-р Панайот Костов/g, "Dr. Panayot Kostov"],
    [/д-ра Панайота Костова/g, "Dr. Panayot Kostov"],
    [/Целевая субсидия государства/g, "Целевая государственная субсидия"],
    [/Болгарское Возрождение/g, "Болгарское национальное возрождение"]
  ];

  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    for (const [from, to] of cleanupReplacements) out = out.replace(from, to);
    translations[source] = out;
  }
}

// The source convention writes honorifics as "Dr."/"Eng." before a name. Italian
// machine translation expands these ("il dottor"/"Dott."/"Ing.") even for full
// names not in the protected set; restore the source form wherever the English
// source actually used the honorific, so names read identically across locales.
function applyHonorificFixups(translations) {
  if (!["it", "tr", "es", "el", "ja", "ru"].includes(targetLang)) return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    if (targetLang === "el") {
      // Greek renders "Dr." as "Δρ"/"Δρ."; restore the source honorific so the
      // recorded name reads identically across locales.
      if (/\bDr\.?\s/.test(source)) {
        out = out.replace(/\bΔρ\.? /g, "Dr. ");
      }
      if (/\bEng\.?\s/.test(source)) {
        out = out.replace(/\bΜηχ\.? /g, "Eng. ").replace(/\bΜηχανικός /g, "Eng. ");
      }
    } else if (targetLang === "it") {
      // Match the source honorific with or without a trailing period ("Dr." or "Dr").
      if (/\bDr\.?\s/.test(source)) {
        out = out
          .replace(/\b[Ii]l dottor /g, "Dr. ")
          .replace(/\bDott\.ssa /g, "Dr. ")
          .replace(/\bDott\. /g, "Dr. ")
          .replace(/\bDottor /g, "Dr. ");
      }
      if (/\bEng\.?\s/.test(source)) {
        out = out.replace(/\b[Ll]'ingegnere /g, "Eng. ").replace(/\bIng\. /g, "Eng. ");
      }
    } else if (targetLang === "es") {
      // Spanish keeps "Dr." but renders "Eng." as "Ing.", "el inglés" or "el ingeniero".
      if (/\bEng\.?\s/.test(source)) {
        out = out
          .replace(/\b[Ee]l inglés\. /g, "Eng. ")
          .replace(/\b[Ee]l ingeniero /g, "Eng. ")
          .replace(/\bIng\. /g, "Eng. ");
      }
    } else if (targetLang === "tr") {
      // Turkish keeps "Dr." but renders "Eng." as "Müh." (Mühendis); restore the
      // source convention so the honorific reads identically across locales.
      if (/\bEng\.?\s/.test(source)) {
        out = out.replace(/\bMüh\. /g, "Eng. ").replace(/\bMühendis /g, "Eng. ");
      }
    } else if (targetLang === "ja") {
      // Keep recorded honorific prefixes as part of the protected source name.
      if (/\bDr\.?\s/.test(source)) {
        out = out.replace(/博士\s*/g, "Dr. ");
      }
      if (/\bEng\.?\s/.test(source)) {
        out = out.replace(/(?:エンジニア|技師)\s*/g, "Eng. ");
      }
    } else if (targetLang === "ru") {
      if (/\bDr\.?\s/.test(source)) {
        out = out.replace(/[Дд]-р\.?\s/g, "Dr. ").replace(/[Дд]октор\s/g, "Dr. ");
      }
      if (/\bEng\.?\s/.test(source)) {
        out = out.replace(/[Ии]нж\.?\s/g, "Eng. ").replace(/[Ии]нженер\s/g, "Eng. ");
      }
    }
    translations[source] = out;
  }
}

function applyLandmarkFixups(translations) {
  const fixups = landmarkFixupsByLang[targetLang];
  if (!fixups) return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    for (const [en, local] of fixups) out = out.replaceAll(en, local);
    translations[source] = out;
  }
}

function applyGreekTemplateFixups(translations) {
  if (targetLang !== "el") return;
  for (const source of Object.keys(translations)) {
    let match = source.match(/^(.+) — (succeeds|succeeded by) — (.+)$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] =
        relation === "succeeds"
          ? `${left} — διαδέχεται — ${right}`
          : `${left} — ακολουθείται από — ${right}`;
      continue;
    }

    match = source.match(/^Person relationship: (.+) — (succeeds|succeeded by) — (.+)\.$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] =
        relation === "succeeds"
          ? `Προσωπική σχέση: ${left} — διαδέχεται — ${right}.`
          : `Προσωπική σχέση: ${left} — ακολουθείται από — ${right}.`;
      continue;
    }

    match = source.match(/^The mayoral chronology links (.+) with (.+) through the relationship "(succeeds|succeeded by)"\.$/);
    if (match) {
      const [, left, right, relation] = match;
      const label = relation === "succeeds" ? "διαδέχεται" : "ακολουθείται από";
      translations[source] = `Το δημαρχιακό χρονολόγιο συνδέει ${left} με ${right} μέσω της σχέσης «${label}».`;
      continue;
    }

    match = source.match(/^Mayoral term\(s\) for (.+)\.$/);
    if (match) {
      translations[source] = `Δημαρχιακή θητεία για ${match[1]}.`;
      continue;
    }

    match = source.match(/^Wikipedia [—-] (.+)$/);
    if (match) {
      translations[source] = `Wikipedia — ${match[1]}`;
      continue;
    }

    match = source.match(/^Biographical reference: (.+)$/);
    if (match) {
      translations[source] = `Βιογραφική αναφορά: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth of (.+)$/);
    if (match) {
      translations[source] = `Γέννηση: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth year and birthplace for (.+)\.$/);
    if (match) {
      translations[source] = `Έτος γέννησης και γενέτειρα: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Biographical data and Plovdiv birthplace link for (.+)\.$/);
    if (match) {
      translations[source] = `Βιογραφικά στοιχεία και σύνδεση τόπου γέννησης στο Plovdiv: ${match[1]}.`;
      continue;
    }

    match = source.match(/^City archive record "Mayor: (.+)"\.$/);
    if (match) {
      translations[source] = `Εγγραφή αρχείου πόλης «Δήμαρχος: ${match[1]}».`;
    }
  }
}

const japaneseThenNowTitleFixups = new Map([
  ["Street in Philippopolis, January 1878 — then/now", "1878年1月のフィリッポポリスの通り — 今昔比較"],
  ["Plovdiv railway station around 1880 — then/now", "1880年頃のPlovdiv駅 — 今昔比較"],
  ["Postcard: Bahnhof von Plowdiw — then/now", "絵葉書: Bahnhof von Plowdiw — 今昔比較"],
  ["Plovdiv photographed by Ivan Karastoyanov — then/now", "Ivan Karastoyanovが撮影したPlovdiv — 今昔比較"],
  ["Dzhambaz Tepe in 1892 — then/now", "1892年のDzhambaz Tepe — 今昔比較"],
  ["Ottoman clock tower on Sahat Tepe — then/now", "サハト・テペのオスマン時計塔 — 今昔比較"],
  ["Postcard of the clock tower — then/now", "時計塔の絵葉書 — 今昔比較"],
  ["Sahat Hill on an old postcard — then/now", "古い絵葉書のサハト・テペ — 今昔比較"],
  ["Dzhumaya Square on an old postcard — then/now", "古い絵葉書のDzhumaya広場 — 今昔比較"],
  ["Dzhumaya Square - postcard 2 — then/now", "Dzhumaya広場 - 絵葉書2 — 今昔比較"],
  ["Dzhumaya Square - postcard 3 — then/now", "Dzhumaya広場 - 絵葉書3 — 今昔比較"],
  ["Gerdzhika in 1931 — then/now", "1931年のGerdzhika — 今昔比較"],
  ["Old Bridge and Gerdzhika Bridge in the 1930s — then/now", "1930年代の旧橋とGerdzhika橋 — 今昔比較"],
  ["Greek High School in Plovdiv — then/now", "Plovdivのギリシャ高校 — 今昔比較"],
  ["The German school in Plovdiv, 1928 — then/now", "1928年のPlovdivドイツ学校 — 今昔比較"],
  ["Tsar Simeon Garden in 1915 — then/now", "1915年のTsar Simeon Garden — 今昔比較"],
  ["Prince's Garden in Plovdiv — then/now", "Plovdivの王子の庭 — 今昔比較"],
  ["Prince’s Garden in Plovdiv — then/now", "Plovdivの王子の庭 — 今昔比較"],
  ["Opening of the 1939 Plovdiv Fair — then/now", "1939年Plovdiv見本市の開幕 — 今昔比較"],
  ["First Plovdiv Exhibition, 1892 - image 1 — then/now", "1892年の第1回Plovdiv博覧会 - 画像1 — 今昔比較"],
  ["First Plovdiv Exhibition, 1892 - image 10 — then/now", "1892年の第1回Plovdiv博覧会 - 画像10 — 今昔比較"],
  ["Uncovering the Ancient Theatre - image 1 — then/now", "古代劇場発掘 - 画像1 — 今昔比較"],
  ["Uncovering the Ancient Theatre - image 2 — then/now", "古代劇場発掘 - 画像2 — 今昔比較"],
  ["Uncovering the Ancient Stadium - image 1 — then/now", "古代競技場発掘 - 画像1 — 今昔比較"],
  ["Uncovering the Ancient Stadium - image 2 — then/now", "古代競技場発掘 - 画像2 — 今昔比較"],
  ["Chirpan earthquake damage near St Josif — then/now", "St Josif付近のChirpan地震被害 — 今昔比較"],
  ["Ivan Vazov National Library after the earthquake — then/now", "地震後のIvan Vazov国立図書館 — 今昔比較"],
  ["Balkan cinema in Plovdiv — then/now", "Plovdivのバルカン映画館 — 今昔比較"],
  ["View from the Trimontium Hotel, 1958 — then/now", "1958年、Trimontium Hotelからの眺め — 今昔比較"],
  ["Lamartine House restoration archive, 1972 — then/now", "1972年のラマルティーヌ邸修復アーカイブ — 今昔比較"]
]);

const japaneseRelationshipLabels = {
  child: "子",
  father: "父",
  mother: "母",
  parent: "親",
  sibling: "きょうだい",
  spouse: "配偶者",
  succeeds: "前任者",
  succeeded_by: "後任者",
  mentor: "師",
  student: "弟子・学生",
  partner: "協力者",
  influenced_by: "影響を受けた相手"
};

function localizeJapaneseThenNowTitle(text) {
  let out = japaneseThenNowTitleFixups.get(text) ?? text.replaceAll("then/now", "今昔比較");
  for (const [englishTitle, japaneseTitle] of japaneseThenNowTitleFixups) {
    out = out.replaceAll(englishTitle, japaneseTitle);
  }
  return out;
}

function applyJapaneseTemplateFixups(translations) {
  if (targetLang !== "ja") return;
  const relationJa = (relation) => (relation === "succeeds" ? "前任者" : "後任者");
  const officialSourcePrefixes = [
    "Administrative Register",
    "National Assembly",
    "Plovdiv Municipality",
    "Pod Tepeto",
    "Regional History Museum Plovdiv"
  ];
  for (const source of Object.keys(translations)) {
    if (japaneseThenNowTitleFixups.has(source)) {
      translations[source] = japaneseThenNowTitleFixups.get(source);
      continue;
    }

    const bioLead = source.match(/^([A-ZÀ-ž][^()\n]{2,120}) \((?:b\.|born|c\.|active|fl\.|\d{3,4})/);
    if (bioLead) {
      translations[source] = translations[source].replace(/^.+?(?=\s*[（(])/, bioLead[1]);
    }

    for (const prefix of officialSourcePrefixes) {
      if (source === prefix || source.startsWith(`${prefix} - `) || source.startsWith(`${prefix} — `)) {
        translations[source] = translations[source].replace(/^.+?(?=\s*[-—])/, prefix);
        if (!translations[source].startsWith(prefix)) translations[source] = prefix;
        break;
      }
    }
    if (source.includes("Plovdiv Municipality") && !translations[source].includes("Plovdiv Municipality")) {
      translations[source] = translations[source]
        .replaceAll("Plovdiv自治体", "Plovdiv Municipality")
        .replaceAll("Plovdiv市", "Plovdiv Municipality");
    }
    if (source.includes("Administrative Register") && !translations[source].includes("Administrative Register")) {
      translations[source] = translations[source]
        .replaceAll("ブルガリア行政登録簿", "Administrative Register")
        .replaceAll("行政登録簿", "Administrative Register");
    }

    let match = source.match(/^(.+) — (succeeds|succeeded by) — (.+)$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] = `${left} — ${relationJa(relation)} — ${right}`;
      continue;
    }

    match = source.match(/^Person relationship: (.+) — (succeeds|succeeded by) — (.+)\.$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] = `人物関係: ${left} — ${relationJa(relation)} — ${right}.`;
      continue;
    }

    match = source.match(/^The mayoral chronology links (.+) with (.+) through the relationship "(succeeds|succeeded by)"\.$/);
    if (match) {
      const [, left, right, relation] = match;
      translations[source] = `市長年表では、関係「${relationJa(relation)}」を通じて ${left} と ${right} を結び付けています。`;
      continue;
    }

    match = source.match(/^A biographical source documents the relationship "(.+)" between (.+) and (.+)\.$/);
    if (match) {
      const [, relation, left, right] = match;
      translations[source] = `伝記資料は、${left} と ${right} の関係「${japaneseRelationshipLabels[relation] ?? relation}」を記録しています。`;
      continue;
    }

    match = source.match(/^Mayoral term\(s\) for (.+)\.$/);
    if (match) {
      translations[source] = `${match[1]} の市長任期。`;
      continue;
    }

    match = source.match(/^Wikipedia [—-] (.+)$/);
    if (match) {
      translations[source] = `Wikipedia — ${match[1]}`;
      continue;
    }

    match = source.match(/^Biographical reference: (.+)$/);
    if (match) {
      translations[source] = `伝記参照: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth of (.+)$/);
    if (match) {
      translations[source] = `${match[1]} の誕生`;
      continue;
    }

    match = source.match(/^Birth year and birthplace for (.+)\.$/);
    if (match) {
      translations[source] = `${match[1]} の生年と出生地。`;
      continue;
    }

    match = source.match(/^Biographical data and Plovdiv birthplace link for (.+)\.$/);
    if (match) {
      translations[source] = `${match[1]} の伝記データと Plovdiv の出生地リンク。`;
      continue;
    }

    match = source.match(/^(.+)'s birthplace is Plovdiv; the recorded birth year is (.+)\.$/);
    if (match) {
      translations[source] = `${match[1]} の出生地は Plovdiv、記録された出生年は ${match[2]} 年です。`;
      continue;
    }

    match = source.match(/^City archive record "Mayor: (.+)"\.$/);
    if (match) {
      translations[source] = `市アーカイブ記録「市長: ${match[1]}」。`;
      continue;
    }

    match = source.match(/^Historical image for then\/now pair: (.+)$/);
    if (match) {
      translations[source] = `今昔比較ペアの歴史画像: ${localizeJapaneseThenNowTitle(match[1])}`;
      continue;
    }

    match = source.match(/^Current comparison image for then\/now pair: (.+)$/);
    if (match) {
      translations[source] = `今昔比較ペアの現在画像: ${localizeJapaneseThenNowTitle(match[1])}`;
      continue;
    }

    match = source.match(/^Historical image, license and source page for then\/now pair "(.+)"\.$/);
    if (match) {
      translations[source] = `今昔比較ペア「${localizeJapaneseThenNowTitle(match[1])}」の歴史画像、ライセンス、出典ページ。`;
      continue;
    }

    match = source.match(/^Current comparison image, license and source page for then\/now pair "(.+)"\.$/);
    if (match) {
      translations[source] = `今昔比較ペア「${localizeJapaneseThenNowTitle(match[1])}」の現在画像、ライセンス、出典ページ。`;
    }
  }

  const cleanupReplacements = [
    [/then\/now/g, "今昔比較"],
    [/当時\/現在/g, "今昔比較"],
    [/当時と現在/g, "今昔比較"],
    [/当時と今/g, "今昔比較"],
    [/Source Coverage/g, "出典網羅性"],
    [/Editorial Review/g, "編集レビュー"],
    [/ジオ・ミレフ小学校/g, "ゲオ・ミレフ小学校"],
    [/ラマルティーヌ ハウス/g, "ラマルティーヌ邸"],
    [/ラマルティーヌの家/g, "ラマルティーヌ邸"],
    [/サハト テペ/g, "サハト・テペ"],
    [/サハット ヒル/g, "サハト・テペ"],
    [/サハト・ヒル/g, "サハト・テペ"],
    [/古いポストカード/g, "古い絵葉書"],
    [/ポストカード/g, "絵葉書"],
    [/バルカン半島映画/g, "バルカン映画館"],
    [/ゲオ・ミレフ小学校\s+([のはをにでとが])/g, "ゲオ・ミレフ小学校$1"],
    [/ラマルティーヌ邸\s+([のはをにでとが])/g, "ラマルティーヌ邸$1"],
    [/旧Plovdiv\s+([のはをにでとが])/g, "旧Plovdiv$1"],
    [/Kostaki Peev・ゲオルギエフ/g, "Kostaki Peev Georgiev"],
    [/Kostadin Dimitrov・ディミトロフ/g, "Kostadin Dimitrov Dimitrov"],
    [/アルメニア系のDr\. でした/g, "アルメニア系の医師でした"],
    [/Dr\. として働き/g, "医師として働き"],
    [
      /地元の訃報は彼の任期を主要自治体の賠償の始まりと結び付けている。規制、ツァラピツァ埋立地の廃棄物処理技術、そして初の市営犬保護施設。/g,
      "地元の訃報では、彼の任期は財産返還の開始、主要な自治体規則、Tsalapitsa埋立地の廃棄物処理技術、初の市営犬保護施設と結び付けられています。"
    ]
  ];
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = localizeJapaneseThenNowTitle(translated);
    for (const [from, to] of cleanupReplacements) out = out.replace(from, to);
    translations[source] = out;
  }
}

const tagalogProfessionLabels = {
  actor: "artista",
  "actor and film director": "artista at direktor ng pelikula",
  actress: "artista",
  "actress and politician": "artista at politiko",
  artist: "artista",
  "artistic gymnast": "artistikong himnasta",
  athlete: "atleta",
  "basketball player": "manlalaro ng basketball",
  "bass singer": "mang-aawit na bass",
  "beer company": "kompanya ng serbesa",
  boxer: "boksingero",
  "canoe racer": "manlalaro sa karera ng canoe",
  canoeist: "manlalaro ng canoe",
  "Catholic priest": "paring Katoliko",
  "chess grandmaster": "grandmaster sa chess",
  "chess player": "manlalaro ng chess",
  clergyman: "klerigo",
  composer: "kompositor",
  conductor: "konduktor",
  "conductor and cultural manager": "konduktor at tagapamahalang pangkultura",
  coxswain: "tagatimon sa bangka",
  "director, screenwriter and producer": "direktor, tagasulat ng senaryo, at producer",
  economist: "ekonomista",
  "economist and politician": "ekonomista at politiko",
  equestrian: "mangangabayo",
  fencer: "eskrimador",
  "film director": "direktor ng pelikula",
  "film director and screenwriter": "direktor ng pelikula at tagasulat ng senaryo",
  "film director, screenwriter and writer": "direktor ng pelikula, tagasulat ng senaryo, at manunulat",
  "football referee": "reperi ng football",
  footballer: "manlalaro ng football",
  general: "heneral",
  geographer: "heograpo",
  gymnast: "himnasta",
  "high jumper": "atleta sa high jump",
  "investigative journalist": "mamamahayag na imbestigatibo",
  "javelin thrower": "tagahagis ng sibat",
  "jazz pianist and composer": "piyanista ng jazz at kompositor",
  journalist: "mamamahayag",
  "journalist and politician": "mamamahayag at politiko",
  "jurist and politician": "hurista at politiko",
  liturgy: "liturhiya",
  logician: "dalubhasa sa lohika",
  "martial artist": "manlalaban sa martial arts",
  "middle-distance runner": "mananakbo sa gitnang distansya",
  "military officer": "opisyal militar",
  mineralogist: "mineralogo",
  model: "modelo",
  "modern pentathlete": "atleta sa modernong pentathlon",
  musician: "musikero",
  "opera singer": "mang-aawit ng opera",
  painter: "pintor",
  "philosopher and art historian": "pilosopo at historyador ng sining",
  physicist: "pisiko",
  pianist: "piyanista",
  politician: "politiko",
  "politician and jurist": "politiko at hurista",
  "professional wrestler, rower and powerlifter": "propesyonal na wrestler, mananagwan, at powerlifter",
  "public figure": "taong pampubliko",
  "racing driver": "drayber sa karera",
  revolutionary: "rebolusyonaryo",
  "rhythmic gymnast": "ritmikong himnasta",
  rower: "mananagwan",
  "scientist and anti-terrorism expert": "siyentipiko at eksperto sa kontra-terorismo",
  sculptor: "iskultor",
  singer: "mang-aawit",
  "sport shooter": "tagabaril sa palakasan",
  "sports shooter": "tagabaril sa palakasan",
  "sprint canoer": "manlalaro ng sprint canoe",
  swimmer: "manlalangoy",
  "State Security officer": "opisyal ng seguridad ng estado",
  "tennis player": "manlalaro ng tennis",
  "theatre director": "direktor ng teatro",
  university: "unibersidad",
  violinist: "biyolinista",
  "visual artist": "biswal na artista",
  "volleyball player": "manlalaro ng volleyball",
  weightlifter: "tagapagbuhat ng timbang",
  wrestler: "wrestler",
  writer: "manunulat",
  "writer and poet": "manunulat at makata",
  zoologist: "zoologo"
};

function tagalogDateNote(note) {
  return note.replace(/^born\s+(\d{4})$/i, "ipinanganak $1");
}

function tagalogProfessionLabel(profession) {
  const match = profession.match(/^(.+?) \((.+)\)$/);
  const base = match ? match[1] : profession;
  const note = match ? match[2] : null;
  const label = tagalogProfessionLabels[base];
  if (!label) return null;
  return note ? `${label} (${tagalogDateNote(note)})` : label;
}

function tagalogBiographicalLead(lead) {
  return lead.replace(/\(b\. (\d{4})\)/g, "(ipinanganak $1)");
}

function tagalogLabel(text) {
  return text
    .replace(/\bDefinitive Bulgarian rule\b/g, "Tiyak na pamumunong Bulgaro")
    .replace(/\bInto the Bulgarian Empire\b/g, "Sa loob ng Imperyong Bulgaro")
    .replace(/\bThe Bulgarian Church is restored\b/g, "Naibalik ang Simbahang Bulgaro")
    .replace(/\bThe first Bulgarian school\b/g, "Ang unang paaralang Bulgaro")
    .replace(/\bThe Old Town \(Old Plovdiv\)\b/g, "Lumang Bayan (Old Plovdiv)")
    .replace(/\bThe Seven Hills \(tepeta\)\b/g, "Pitong Burol (tepeta)")
    .replace(/\bThe Old Town\b/g, "Lumang Bayan")
    .replace(/\bOld Town\b/g, "Lumang Bayan")
    .replace(/\bOld Plovdiv\b/g, "Lumang Plovdiv")
    .replace(/\bUnification square\b/g, "Liwasan ng Pagkakaisa")
    .replace(/\bEastern Rumelia\b/g, "Silangang Rumelia")
    .replace(/\bPrincipality of Bulgaria\b/g, "Prinsipalidad ng Bulgaria")
    .replace(/\bBulgarian Revival\b/g, "Pambansang Muling Pagsilang ng Bulgaria")
    .replace(/\bNational Revival\b/g, "Pambansang Muling Pagsilang")
    .replace(/\bLiberation\b/g, "Paglaya")
    .replace(/\bUnification\b/g, "Pagkakaisa")
    .replace(/\bCentral district\b/g, "distrito ng Central")
    .replace(/\bEastern district\b/g, "distrito ng Eastern")
    .replace(/\bNorthern district\b/g, "distrito ng Northern")
    .replace(/\bSouthern district\b/g, "distrito ng Southern")
    .replace(/\bWestern district\b/g, "distrito ng Western")
    .replace(/\bTrakiya district\b/g, "distrito ng Trakiya");
}

function isFileOnlyTranslationSource(source, translated) {
  return (
    source === translated &&
    /\.(?:jpe?g|png|webp|gif|svg|pdf)\b/i.test(source)
  );
}

function cleanupTagalogText(source, translated) {
  if (isFileOnlyTranslationSource(source, translated)) return translated;

  const cleanupReplacements = [
    [/\bPrincipality of Bulgaria\b/g, "Prinsipalidad ng Bulgaria"],
    [/\bEastern Rumelia\b/g, "Silangang Rumelia"],
    [/\bUnification Day\b/g, "Araw ng Pagkakaisa"],
    [/\bThe Unification of Bulgaria\b/g, "Pagkakaisa ng Bulgaria"],
    [/\bthe Unification\b/g, "ang Pagkakaisa"],
    [/\bUnification\b/g, "Pagkakaisa"],
    [/\bLiberation\b/g, "Paglaya"],
    [/\bBulgarian National Revival\b/g, "Pambansang Muling Pagsilang ng Bulgaria"],
    [/\bBulgarian Revival\b/g, "Pambansang Muling Pagsilang ng Bulgaria"],
    [/\bNational Revival\b/g, "Pambansang Muling Pagsilang"],
    [/\bRevival-era\b/g, "panahon ng Pambansang Muling Pagsilang"],
    [/\bRevival era\b/g, "panahon ng Pambansang Muling Pagsilang"],
    [/\bRevival\b/g, "Pambansang Muling Pagsilang"],
    [/\bOttoman-era\b/g, "panahong Osmanli"],
    [/\bOttoman period\b/g, "panahong Osmanli"],
    [/\bOttoman\b/g, "Osmanli"],
    [/\bRoman\b/g, "Romano"],
    [/\bThracian\b/g, "Trakiano"],
    [/\bMacedonian\b/g, "Macedoniano"],
    [/\bOld Town\b/g, "Lumang Bayan"],
    [/\bOld Plovdiv\b/g, "Lumang Plovdiv"],
    [/\bUnification square\b/g, "Liwasan ng Pagkakaisa"],
    [/\barchive record\b/g, "talaan sa arkibo"],
    [/\bgeoreferencing\b/g, "paglalapat sa mapa"],
    [/\beditorial review\b/g, "pagsusuring editoryal"],
    [/\beditoryal na pagsusuri\b/g, "pagsusuring editoryal"],
    [/\bindependiyenteng pagsusuri sa editoryal\b/g, "hiwalay na pagsusuring editoryal"],
    [/\bindependiyenteng pagsusuri ng editoryal\b/g, "hiwalay na pagsusuring editoryal"],
    [/\bcapital programme\b/g, "programang kapital"],
    [/\bcapital program\b/g, "programang kapital"],
    [/\bprograma ng kapital\b/g, "programang kapital"],
    [/\bprograma ng kabisera\b/g, "programang kapital"],
    [/\bdraft programang kapital\b/g, "burador na programang kapital"],
    [/\bbudget-adoption report\b/g, "ulat sa pagpapatibay ng badyet"],
    [/\bpag-aampon ng badyet\b/g, "pagpapatibay ng badyet"],
    [/\bpublic budget presentation\b/g, "pampublikong presentasyon ng badyet"],
    [/\bbudget presentation\b/g, "presentasyon ng badyet"],
    [/\bpublic source\b/g, "pampublikong pinagmulan"],
    [/\bstructured pampublikong pinagmulan\b/g, "nakabalangkas na pampublikong pinagmulan"],
    [/\bsource\b/g, "pinagmulan"],
    [/\btimeline record\b/g, "talaan sa kronolohiya"],
    [/\btimeline\b/g, "kronolohiya"],
    [/\bmayoral election\b/g, "halalan sa pagkaalkalde"],
    [/\bmayoral term\b/g, "termino bilang alkalde"],
    [/\bmayoral terms\b/g, "mga termino bilang alkalde"],
    [/\bmayors\b/g, "mga alkalde"],
    [/\bmayoral\b/g, "pang-alkalde"],
    [/\bacting alkalde\b/g, "pansamantalang alkalde"],
    [/\bmayor\b/g, "alkalde"],
    [/\bMayor\b/g, "Alkalde"],
    [/\bTrakiya Distrito\b/g, "distrito ng Trakiya"],
    [/\bZapaden Distrito\b/g, "distrito ng Zapaden"],
    [/\bCentral Distrito\b/g, "distrito ng Central"],
    [/\bDistrict\b/g, "Distrito"],
    [/\bdistrict\b/g, "distrito"],
    [/\blayered religious heritage\b/g, "patong-patong na pamanang panrelihiyon"],
    [/\barchitectural-historical reserve\b/g, "reserbang arkitektural at historikal"],
    [/\bcultural monument\b/g, "monumentong pangkultura"],
    [/\burban architecture\b/g, "arkitekturang panglungsod"],
    [/\burban memory\b/g, "alaalang panglungsod"],
    [/\burban life\b/g, "buhay-lungsod"],
    [/\bmerchant\b/g, "mangangalakal"],
    [/\bmerchants\b/g, "mga mangangalakal"],
    [/\bquarter\b/g, "kapitbahayan"],
    [/\blayers\b/g, "mga patong"],
    [/\blayer\b/g, "patong"],
    [/\bpublic figure\b/g, "taong pampubliko"],
    [/\bpublic data\b/g, "pampublikong datos"],
    [/\bpublic buildings\b/g, "mga pampublikong gusali"],
    [/\bpublic works\b/g, "mga gawaing pampubliko"],
    [/\bresidential\b/g, "tirahan"],
    [/\bmunicipal task\b/g, "gawaing munisipal"],
    [/\bmunicipal administration\b/g, "administrasyong munisipal"],
    [/\bmunicipal co-financing\b/g, "kasamang pondo ng munisipalidad"],
    [/\bmunicipal development plan\b/g, "plano sa pagpapaunlad ng munisipalidad"],
    [/\bmunicipal councillor\b/g, "konsehal ng munisipalidad"],
    [/\bmunicipal\b/g, "munisipal"],
    [/\bpostwar\b/g, "pagkatapos ng digmaan"],
    [/\bpagkatapos ng digmaan city\b/g, "lungsod pagkatapos ng digmaan"],
    [/\bpagkatapos ng digmaan gawaing munisipal\b/g, "gawaing munisipal pagkatapos ng digmaan"],
    [/\bpublic-works program\b/g, "programa ng mga gawaing pampubliko"],
    [/\bpublic-works programme\b/g, "programa ng mga gawaing pampubliko"],
    [/\boperational-programme projects\b/g, "mga proyektong programang operasyonal"],
    [/\bCapital investment program\b/g, "Programang pamumuhunang kapital"],
    [/\bcapital investment program\b/g, "programang pamumuhunang kapital"],
    [/\bcapital expenditure of\b/g, "gastos kapital na"],
    [/\breports executed\b/g, "ay nag-uulat ng naisagawang"],
    [/\bfunctional analysis\b/g, "pagsusuring panggamit"],
    [/\bair raids\b/g, "mga pagsalakay mula sa himpapawid"],
    [/\bblack-market\b/g, "iligal na pamilihan"],
    [/\beducational awakening\b/g, "pagkamulat sa edukasyon"],
    [/\bedukasyonal na paggising\b/g, "pagkamulat sa edukasyon"],
    [/\bEuropean Capital of Culture\b/g, "Kapital ng Kultura sa Europa"],
    [/"Pag-iisa ng Bulgaria"/g, "\"Pagkakaisa ng Bulgaria\""],
    [/"Book Publishing"/g, "\"Paglalathala ng Aklat\""],
    [/\bModern History Center\b/g, "Sentro ng Makabagong Kasaysayan"],
    [/\bModern History Centre\b/g, "Sentro ng Makabagong Kasaysayan"],
    [/\bCenter\b/g, "Sentro"],
    [/\bBulgarian beer company\b/g, "Kompanya ng serbesa sa Bulgaria"],
    [/\bBulgarian Administrative Register\b/g, "Administratibong Rehistro ng Bulgaria"],
    [/\bBulgarian Archives State Agency\b/g, "Ahensiya ng Estado para sa mga Arkibo ng Bulgaria"],
    [/\bBulgarian National Audit Office\b/g, "Pambansang Tanggapan ng Awdit ng Bulgaria"],
    [/\baudit ulat\b/g, "ulat ng awdit"],
    [/\bfinancial audit\b/g, "pinansyal na awdit"],
    [/\bBulgarian Exarchate\b/g, "Eksarkado ng Bulgaria"],
    [/\bBulgarian Empire\b/g, "Imperyong Bulgaro"],
    [/\bBulgarian Church\b/g, "Simbahang Bulgaro"],
    [/\bBulgarian Red Cross\b/g, "Krus na Pula ng Bulgaria"],
    [/\bBulgarian Agricultural Bank\b/g, "Bangko Agrikultural ng Bulgaria"],
    [/\bBulgarian Agrarian National Union\b/g, "Pambansang Unyong Agraryo ng Bulgaria"],
    [/\bBulgarian National Assembly\b/g, "Pambansang Asamblea ng Bulgaria"],
    [/\bmember of the Pambansang Asamblea ng Bulgaria\b/g, "miyembro ng Pambansang Asamblea ng Bulgaria"],
    [/\bBulgarian Literary Society\b/g, "Lipunang Pampanitikan ng Bulgaria"],
    [/\bSecret Bulgarian Central Revolutionary Committee\b/g, "Lihim na Sentral na Rebolusyonaryong Komite ng Bulgaria"],
    [/\bFirst Bulgarian Fair\b/g, "Unang Peryang Bulgaro"],
    [/\bUnang Bulgarian Agricultural at Industrial Exhibition\b/g, "Unang Pang-agrikultura at Pang-industriyang Eksibisyon ng Bulgaria"],
    [/\bUnang Bulgarian Agricultural-Industrial Exhibition\b/g, "Unang Pang-agrikultura at Pang-industriyang Eksibisyon ng Bulgaria"],
    [/\bBulgarian Agricultural at Industrial Exhibition\b/g, "Pang-agrikultura at Pang-industriyang Eksibisyon ng Bulgaria"],
    [/\bBulgarian Agricultural-Industrial Exhibition\b/g, "Pang-agrikultura at Pang-industriyang Eksibisyon ng Bulgaria"],
    [/\bunang Bulgarian Kapital ng Kultura sa Europa\b/g, "unang Kapital ng Kultura sa Europa mula sa Bulgaria"],
    [/\bBulgarian grammar school\b/g, "gimnasyong Bulgaro"],
    [/\bBulgarian gymnasium\b/g, "gimnasyong Bulgaro"],
    [/\bgurong Bulgarian\b/g, "gurong Bulgaro"],
    [/\bPartido Komunista ng Bulgarong ipinanganak\b/g, "Partido Komunista ng Bulgaria na ipinanganak"],
    [/\bBulgarian dark beer\b/g, "maitim na serbesang Bulgaro"],
    [/\bBulgarian religious community\b/g, "pamayanang panrelihiyong Bulgaro"],
    [/\bBulgarian artistic gymnast\b/g, "Bulgarong artistikong himnasta"],
    [/\bdating Bulgarian artistic gymnast\b/g, "dating Bulgarong artistikong himnasta"],
    [/\bFormer Bulgarian artistic gymnast\b/g, "Dating Bulgarong artistikong himnasta"],
    [/\bBulgarian artist\b/g, "Bulgarong artista"],
    [/\bBulgarian artists\b/g, "mga Bulgarong artista"],
    [/\bBulgarian publicist\b/g, "Bulgarong publisista"],
    [/\bSerbo-Bulgarian War\b/g, "Digmaang Serbo-Bulgaro"],
    [/\bRusso-Turkish War\b/g, "Digmaang Ruso-Turko"],
    [/\bApril Uprising\b/g, "Pag-aalsang Abril"],
    [/\bAbril Pag-aalsa\b/g, "Pag-aalsang Abril"],
    [/\bUnity committee\b/g, "komite ng Pagkakaisa"],
    [/\bProvisional Government of Silangang Rumelia\b/g, "Pansamantalang Pamahalaan ng Silangang Rumelia"],
    [/\bNational Assembly\b/g, "Pambansang Asamblea"],
    [/\bGrand National Assemblies\b/g, "mga Dakilang Pambansang Asamblea"],
    [/\bGrand National Assembly\b/g, "Dakilang Pambansang Asamblea"],
    [/\bChurch-and-People councils\b/g, "mga konseho ng Simbahan at Bayan"],
    [/\bChurch-and-People council\b/g, "konseho ng Simbahan at Bayan"],
    [/\bsa Bulgarong nagho-host\b/g, "sa Bulgaria na nag-host"],
    [/\bBulgarong mga tagapaglathala\b/g, "mga Bulgarong tagapaglathala"],
    [/\bgeographical atlase\b/g, "mga atlas na heograpiko"],
    [/\bfirst Bulgarian encyclopedia\b/g, "unang ensiklopediyang Bulgaro"],
    [/\bunang Bulgarian encyclopedia\b/g, "unang ensiklopediyang Bulgaro"],
    [/\bBulgarian enterprise\b/g, "negosyong Bulgaro"],
    [/\bpublishing house\b/g, "palimbagan"],
    [/\bbahay-publish\b/g, "palimbagan"],
    [/\bpublishing and distributing books\b/g, "paglalathala at pamamahagi ng mga aklat"],
    [/\bbooks\b/g, "mga aklat"],
    [/\bprovisional 2026 programang kapital\b/g, "pansamantalang programang kapital para sa 2026"],
    [/\bProvisional 2026 programang kapital\b/g, "Pansamantalang programang kapital para sa 2026"],
    [/\bstate-subsidy\b/g, "subsidyo ng estado"],
    [/\btarget na subsidy ng estado\b/g, "nakatuong subsidyo ng estado"],
    [/\bsubsidy na naka-target ng estado\b/g, "nakatuong subsidyo ng estado"],
    [/\bNational Assembly of the Prinsipalidad ng Bulgaria\b/g, "Pambansang Asamblea ng Prinsipalidad ng Bulgaria"],
    [/\bNational Assembly of the Prinsipalidad\b/g, "Pambansang Asamblea ng Prinsipalidad"],
    [/\bRegional Assembly\b/g, "Panrehiyong Asamblea"],
    [/\bBulgarian public figure\b/g, "Bulgarong taong pampubliko"],
    [/\bBulgarian taong pampubliko\b/g, "Bulgarong taong pampubliko"],
    [/\bBulgarian pampublikong personalidad\b/g, "Bulgarong taong pampubliko"],
    [/\bBulgarian pampublikong pigura\b/g, "Bulgarong taong pampubliko"],
    [/\bisang Bulgarian pampublikong personalidad\b/g, "isang Bulgarong taong pampubliko"],
    [/\bisang Bulgarian pampublikong pigura\b/g, "isang Bulgarong taong pampubliko"],
    [/\bisang Bulgarian\b/g, "isang Bulgarong"],
    [/\bBulgarian na\b/g, "Bulgarong"],
    [/\bBulgarian aktor\b/g, "Bulgarong aktor"],
    [/\bBulgarian politiko\b/g, "Bulgarong politiko"],
    [/\bpolitiko ng Bulgaria\b/g, "Bulgarong politiko"],
    [/\bBulgaria na\b/g, "Bulgarong"],
    [/\bBulgarian Communist Party\b/g, "Partido Komunista ng Bulgaria"],
    [/\bBulgarian-Soviet Society\b/g, "Lipunang Bulgaro-Sobyet"],
    [/\bFirst Bulgarian Agricultural and Industrial Exhibition\b/g, "Unang Pang-agrikultura at Pang-industriyang Eksibisyon ng Bulgaria"],
    [/\bBulgarian Agricultural and Industrial Exhibition\b/g, "Pang-agrikultura at Pang-industriyang Eksibisyon ng Bulgaria"],
    [/\bBulgarian European Capital of Culture\b/g, "Bulgarong Kapital ng Kultura sa Europa"],
    [/\bin Bulgarian\b/g, "sa wikang Bulgaro"],
    [/\bwikang Bulgarian\b/g, "wikang Bulgaro"],
    [/\bthe Thracians\b/g, "ang mga Trakiano"],
    [/\bThracians\b/g, "mga Trakiano"],
    [/\bThrace\b/g, "Thracia"],
    [/\bPambansang Muling Pagsilang ng Bulgaria-era\b/g, "panahon ng Pambansang Muling Pagsilang ng Bulgaria"],
    [/\bisang panahon ng Pambansang Muling Pagsilang ng Bulgaria tagapagturo, tagapaglathala at pampublikong personalidad\b/g, "isang tagapagturo, tagapaglathala, at taong pampubliko noong Pambansang Muling Pagsilang ng Bulgaria"],
    [/\bisang panahon ng Pambansang Muling Pagsilang ng Bulgaria guro\b/g, "isang guro noong Pambansang Muling Pagsilang ng Bulgaria"],
    [/\bPambansang Muling Pagsilang ng Bulgarong bahay\b/g, "bahay mula sa Pambansang Muling Pagsilang ng Bulgaria"],
    [/\bmga bahay mula sa Pambansang Muling Pagsilang ng Bulgaria ng Lumang Bayan ng Plovdiv\b/g, "mga bahay ng Lumang Bayan ng Plovdiv mula sa Pambansang Muling Pagsilang ng Bulgaria"],
    [/\bmga bahay mula sa Pambansang Muling Pagsilang ng Bulgaria ng Lumang Bayan\b/g, "mga bahay ng Lumang Bayan mula sa Pambansang Muling Pagsilang ng Bulgaria"],
    [/\bPambansang Muling Pagsilang house museum\b/g, "bahay-museo ng Pambansang Muling Pagsilang"],
    [/\bPambansang Muling Pagsilang house\b/g, "bahay ng Pambansang Muling Pagsilang"],
    [/\bpanahong Osmanli mosque\b/g, "moske mula sa panahong Osmanli"],
    [/\bOsmanli bath\b/g, "paliguang Osmanli"],
    [/\bOsmanli Empire\b/g, "Imperyong Osmanli"],
    [/\burban-mobility\b/g, "mobilidad sa lungsod"],
    [/\burban fabric\b/g, "estrukturang panglungsod"],
    [/\burban topography\b/g, "topograpiyang panglungsod"],
    [/\burban site\b/g, "pook panglungsod"],
    [/\burban hill\b/g, "burol sa lungsod"],
    [/\burban patong\b/g, "patong panglungsod"],
    [/\burban communities\b/g, "mga pamayanang panglungsod"],
    [/\bcommunities sa lunsod\b/g, "mga pamayanang panglungsod"],
    [/\bkonteksto ng urban\b/g, "kontekstong panglungsod"],
    [/\burban\b/g, "panglungsod"],
    [/\bquarters\b/g, "mga kapitbahayan"],
    [/\bPlovdiv's\b/g, "ng Plovdiv"],
    [/\bng Plovdiv 2024 programang kapital\b/g, "programang kapital ng Plovdiv noong 2024"],
    [/\bstarter georeferenced cartographic patong\b/g, "panimulang kartograpikong patong na inilapat sa mapa"],
    [/\bI-archive ang mapa\b/g, "Mapa sa arkibo"],
    [/\bGreek Patriarch\b/g, "Patriyarkang Griyego"],
    [/\bGreek school\b/g, "paaralang Griyego"],
    [/\bGreek sa\b/g, "Griyego sa"],
    [/\beditorial board\b/g, "lupon ng patnugot"],
    [/\bpublisher\b/g, "tagapaglathala"],
    [/\beducator\b/g, "tagapagturo"],
    [/\bPambansang Pambansang Muling Pagsilang\b/g, "Pambansang Muling Pagsilang"]
  ];

  let out = translated;
  for (const [from, to] of cleanupReplacements) out = out.replace(from, to);
  return out;
}

function applyTagalogTemplateFixups(translations) {
  if (targetLang !== "tl") return;
  const relationTl = (relation) => (relation === "succeeds" ? "humalili kay" : "hinalinhan ni");

  for (const source of Object.keys(translations)) {
    let match = source.match(/^(.+) — (succeeds|succeeded by) — (.+)$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] = `${left} — ${relationTl(relation)} — ${right}`;
      continue;
    }

    match = source.match(/^Person relationship: (.+) — (succeeds|succeeded by) — (.+)\.$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] = `Relasyon ng tao: ${left} — ${relationTl(relation)} — ${right}.`;
      continue;
    }

    match = source.match(/^The mayoral chronology links (.+) with (.+) through the relationship "(succeeds|succeeded by)"\.$/);
    if (match) {
      const [, left, right, relation] = match;
      translations[source] = `Iniuugnay ng kronolohiya ng mga alkalde sina ${left} at ${right} sa pamamagitan ng relasyong "${relationTl(relation)}".`;
      continue;
    }

    match = source.match(/^A biographical source documents the relationship "(.+)" between (.+) and (.+)\.$/);
    if (match) {
      const [, relation, left, right] = match;
      translations[source] = `Itinatala ng sangguniang talambuhay ang relasyong "${relation}" sa pagitan nina ${left} at ${right}.`;
      continue;
    }

    match = source.match(/^Dating and summary for timeline record "(.+)"\.$/);
    if (match) {
      translations[source] = `Petsa at buod para sa talaan sa kronolohiya na "${tagalogLabel(match[1])}".`;
      continue;
    }

    match = source.match(/^City archive record "Mayor: (.+)"\.$/);
    if (match) {
      translations[source] = `Talaan ng arkibo ng lungsod "Alkalde: ${match[1]}".`;
      continue;
    }

    match = source.match(/^Mayoral term\(s\) for (.+)\.$/);
    if (match) {
      translations[source] = `Termino bilang alkalde: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Wikipedia [—-] (.+)$/);
    if (match) {
      translations[source] = `Wikipedia — ${match[1]}`;
      continue;
    }

    match = source.match(/^Biographical reference: (.+)$/);
    if (match) {
      translations[source] = `Sanggunian ng talambuhay: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth of (.+)$/);
    if (match) {
      translations[source] = `Kapanganakan: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth year and birthplace for (.+)\.$/);
    if (match) {
      translations[source] = `Taon at lugar ng kapanganakan: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Biographical data and Plovdiv birthplace link for (.+)\.$/);
    if (match) {
      translations[source] = `Datos ng talambuhay at ugnay sa lugar ng kapanganakan sa Plovdiv: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Historical image for then\/now pair: (.+)$/);
    if (match) {
      translations[source] = `Makasaysayang larawan para sa pares noon/ngayon: ${tagalogLabel(match[1])}`;
      continue;
    }

    match = source.match(/^Current comparison image for then\/now pair: (.+)$/);
    if (match) {
      translations[source] = `Kasalukuyang larawang panghambing para sa pares noon/ngayon: ${tagalogLabel(match[1])}`;
      continue;
    }

    match = source.match(/^Coordinates for (.+)\.$/);
    if (match) {
      translations[source] = `Mga coordinate para sa ${tagalogLabel(match[1])}.`;
      continue;
    }

    match = source.match(/^Landmark: (.+)$/);
    if (match) {
      translations[source] = `Palatandaan: ${tagalogLabel(match[1])}`;
      continue;
    }

    match = source.match(/^landmark: (.+)$/);
    if (match) {
      translations[source] = `palatandaan: ${tagalogLabel(match[1])}`;
      continue;
    }

    match = source.match(/^Media for landmark: (.+)$/);
    if (match) {
      translations[source] = `Media para sa palatandaan: ${tagalogLabel(match[1])}`;
      continue;
    }

    match = source.match(/^Description and historical context for (.+)\.$/);
    if (match) {
      translations[source] = `Paglalarawan at makasaysayang konteksto para sa ${tagalogLabel(match[1])}.`;
      continue;
    }

    match = source.match(/^Media and license for (.+): (.+)\.$/);
    if (match) {
      const [, subject, fileName] = match;
      translations[source] = `Media at lisensya para sa ${tagalogLabel(subject)}: ${fileName}.`;
      continue;
    }

    match = source.match(/^(.+) — Bulgarian (.+)\.$/);
    if (match) {
      const [, name, profession] = match;
      const professionTl = tagalogProfessionLabel(profession);
      if (professionTl) {
        translations[source] = `${tagalogBiographicalLead(name)} — Bulgarong ${professionTl}.`;
        continue;
      }
    }

    match = source.match(/^Bulgarian (.+)$/);
    if (match) {
      const professionTl = tagalogProfessionLabel(match[1]);
      if (professionTl) {
        translations[source] = `Bulgarong ${professionTl}`;
        continue;
      }
    }

    match = source.match(/^([A-Z][A-Za-z]+) (.+) \((born \d{4}|\d{4}[–-]\d{4})\)\.?$/);
    if (match) {
      const [, nationality, profession, note] = match;
      const professionTl = nationality === "Bulgarian" ? tagalogProfessionLabel(profession) : null;
      if (professionTl) {
        translations[source] = `Bulgarong ${professionTl} (${tagalogDateNote(note)})`;
        continue;
      }
      continue;
    }
  }

  const cleanupReplacements = [
    [/Pakikipag-date/g, "Petsa"],
    [/nagtagumpay ng/g, "hinalinhan ni"],
    [/nagtagumpay/g, "humalili kay"],
    [/mayoral chronology/g, "kronolohiya ng mga alkalde"],
    [/Person relationship:/g, "Relasyon ng tao:"],
    [/City archive record/g, "Talaan ng arkibo ng lungsod"],
    [/Mayor:/g, "Alkalde:"],
    [/Mayor ng Plovdiv Municipality/g, "Alkalde ng Munisipalidad ng Plovdiv"],
    [/Plovdiv Municipality/g, "Munisipalidad ng Plovdiv"],
    [/State targeted subsidy/g, "Nakatuong subsidyo ng estado"],
    [/Tinutukoy ng estado ang subsidy/g, "Nakatuong subsidyo ng estado"],
    [/Open-license media/g, "Medyang may bukas na lisensya"],
    [/attribution/g, "atribusyon"],
    [/public figure/g, "pampublikong personalidad"],
    [/basalyo/g, "sakop na alyado"],
    [/Rebiba ng Bulgaria/g, "Pambansang Muling Pagsilang ng Bulgaria"],
    [/Bulgarian Muling Pagkabuhay/g, "Pambansang Muling Pagsilang ng Bulgaria"],
    [/Rebiba/g, "Pambansang Muling Pagsilang"],
    [/Landmark:/g, "Palatandaan:"],
    [/landmark:/g, "palatandaan:"],
    [/Coordinates para/g, "Mga coordinate para"],
    [/coordinates para/g, "mga coordinate para"]
  ];

  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = cleanupTagalogText(source, translated);
    for (const [from, to] of cleanupReplacements) out = out.replace(from, to);
    translations[source] = out;
  }
}

const existing = fs.existsSync(outputPath) ? readJson(outputPath) : {};
const allStrings = new Set(Object.keys(manualTranslations));
const protectedNames = new Set();
for (const dir of sourceDirs) {
  for (const file of jsonFiles(path.join(root, dir))) {
    const json = readJson(file);
    collectProtectedNames(json, protectedNames);
    collect(json, "", allStrings);
  }
}
for (const name of protectedNames) allStrings.delete(name);
protectedNameFixups = await buildProtectedNameFixups(protectedNames, existing);

const translations = { ...manualTranslations };
for (const text of allStrings) {
  if (manualTranslations[text]) continue; // manual translations are authoritative
  if (existing[text]) translations[text] = normalizeTranslation(existing[text]);
}
const pending = [...allStrings]
  .filter((text) => !translations[text])
  .sort((a, b) => a.length - b.length || a.localeCompare(b));

console.log(`${targetLang} translations: ${Object.keys(translations).length} cached, ${pending.length} pending`);

const batches = makeBatches(pending);
for (let i = 0; i < batches.length; i += 1) {
  const batch = batches[i];
  const translated = await translateBatch(batch);
  for (let j = 0; j < batch.length; j += 1) translations[batch[j]] = normalizeTranslation(translated[j]);
  if ((i + 1) % 10 === 0 || i === batches.length - 1) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(Object.fromEntries(Object.entries(translations).sort()), null, 2)}\n`);
    console.log(`translated ${i + 1}/${batches.length} batches`);
  }
}

const inferredNameFixups = inferProtectedNameFixups(translations, protectedNames);
const titlePrefixFixups = buildTitlePrefixFixups(protectedNames);
const overrideFixups = protectedNameOverridesByLang[targetLang] ?? [];
protectedNameFixups = [
  ...protectedNameFixups,
  ...inferredNameFixups,
  ...titlePrefixFixups,
  ...overrideFixups
].sort((a, b) => b[0].length - a[0].length);
protectedNameFixups = expandJapaneseNameFixups(protectedNameFixups);
normalizeAllTranslations(translations);
applyExonymFixups(translations);
applyHonorificFixups(translations);
applyLandmarkFixups(translations);
applyGreekTemplateFixups(translations);
applyJapaneseTemplateFixups(translations);
applyUkrainianDeclensionFixups(translations);
applyUkrainianTemplateFixups(translations);
applyRussianDeclensionFixups(translations);
applyRussianTemplateFixups(translations);
applyTagalogTemplateFixups(translations);
applyManualTranslations(translations);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(Object.fromEntries(Object.entries(translations).sort()), null, 2)}\n`);
console.log(`wrote ${path.relative(root, outputPath)} (${Object.keys(translations).length} entries)`);
