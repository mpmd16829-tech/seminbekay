import { FestivalActivity, DayProgram, Committee } from '../types';

export const FESTIVAL_INFO = {
  editionFr: "3e Édition",
  editionAr: "النسخة الثالثة",
  titleFr: "SEMAINE CULTURELLE ET SPORTIVE 2026",
  titleAr: "الأسبوع الثقافي والرياضي 2026",
  locationFr: "Hassi El Bakaï — Kiffa, Wilaya de l’Assaba, Mauritanie",
  locationAr: "حاسي البكاي — كيفة، ولاية لعصابه، موريتانيا",
  datesFr: "Du 28 août au 2 septembre 2026",
  datesAr: "من 28 أغسطس إلى 2 سبتمبر 2026",
  themeFr: "Ensemble pour la culture, le sport, la sensibilisation, la solidarité et le développement local.",
  themeAr: "معًا من أجل الثقافة والرياضة والتوعية والتضامن والتنمية المحلية",
  invitationFr: "Venez nombreux participer, proposer vos idées, rejoindre les comités, soutenir les équipes et contribuer à la réussite de cette grande rencontre communautaire.",
  invitationAr: "ندعو الجميع إلى المشاركة الفعالة، وتقديم الأفكار، والانضمام إلى لجان التنظيم، وتشجيع الفرق، والمساهمة في إنجاح هذا الحدث المجتمعي الكبير.",
  footerOpenFr: "Participation ouverte à tous",
  footerOpenAr: "المشاركة مفتوحة للجميع",
  footerTaglineFr: "Votre énergie, vos idées et votre talent font la différence !",
  footerTaglineAr: "طاقتكم وأفكاركم ومواهبكم تصنع الفرق!",
};

export const FESTIVAL_ACTIVITIES: FestivalActivity[] = [
  {
    id: "cultural-evenings",
    titleFr: "Soirées Culturelles",
    titleAr: "الأمسيات الثقافية والشعر والمديح",
    categoryFr: "Culture & Patrimoine",
    categoryAr: "الثقافة والتراث",
    descFr: "Poésie hassaniya et arabe, madih prophétique, contes traditionnels, musique tidinit et pièces de théâtre communautaires.",
    descAr: "جلسات الشعر الحساني والفصيح، ليالي المديح النبوي، الحكايات الشعبية، أنغام التيدينيت والمسرح الهادف.",
    iconName: "Sparkles",
    badgeFr: "Poésie & Musique",
    badgeAr: "شعر ومديح",
    scheduleDay: "Chaque soir à 20h30",
    scheduleDayAr: "كل ليلة ابتداءً من 20:30",
    targetGroupFr: "Artistes, poètes, familles et tous publics",
    targetGroupAr: "الفنانون، الشعراء، العائلات والجميع",
  },
  {
    id: "awareness-sessions",
    titleFr: "Présentations de Sensibilisation",
    titleAr: "عروض وندوات التوعية والتثقيف",
    categoryFr: "Citoyenneté & Santé",
    categoryAr: "المواطنة والصحة",
    descFr: "Conférences-débats sur la santé publique, l'importance de l'éducation, l'unité nationale et l'action citoyenne.",
    descAr: "محاضرات ونقاشات تفاعلية حول الصحة العامة، أهمية التعليم، تعزيز الوحدة الوطنية والعمل المدني.",
    iconName: "Megaphone",
    badgeFr: "Débats & Santé",
    badgeAr: "توعية وحوار",
    scheduleDay: "Matinées et début d'après-midi",
    scheduleDayAr: "الفترات الصباحية",
    targetGroupFr: "Jeunes, parents, acteurs associatifs",
    targetGroupAr: "الشباب، الأولياء، الفاعلون الجمعويون",
  },
  {
    id: "traditional-shooting",
    titleFr: "Tir Traditionnel",
    titleAr: "مسابقة الرماية التقليدية",
    categoryFr: "Tradition & Précision",
    categoryAr: "الأصالة والتحدي",
    descFr: "Tournoi d'adresse et de précision célébrant l'adresse des tireurs de l'Assaba selon les règles ancestrales mauritaniennes.",
    descAr: "منافسات دقيقة وشيقة تبرز مهارة الرماة في ولاية لعصابه احتفاءً بتقاليد الرماية الموريتانية الأصيلة.",
    iconName: "Target",
    badgeFr: "Précision & Noblesse",
    badgeAr: "دقة وشرف",
    scheduleDay: "29 et 30 août",
    scheduleDayAr: "29 و 30 أغسطس",
    targetGroupFr: "Tireurs traditionnels et passionnés",
    targetGroupAr: "هواة ومحترفو الرماية الأصيلة",
  },
  {
    id: "football-sports",
    titleFr: "Compétitions Sportives & Football",
    titleAr: "المسابقات الرياضية وبطولة كرة القدم",
    categoryFr: "Sport & Fair-play",
    categoryAr: "الرياضة والروح الرياضية",
    descFr: "Tournoi inter-quartiers et inter-villages de football, épreuves d'athlétisme, courses de vitesse et relais.",
    descAr: "كأس البطولة بين الأحياء والقرى المجاورة، سباقات العدو والماراثون وألعاب القوى للشباب.",
    iconName: "Trophy",
    badgeFr: "Tournoi & Relais",
    badgeAr: "كأس وبطولة",
    scheduleDay: "Tous les après-midis à 16h30",
    scheduleDayAr: "يوميًا على الساعة 16:30",
    targetGroupFr: "Équipes locales, athlètes et supporters",
    targetGroupAr: "الفرق المحلية، الرياضيون والمشجعون",
  },
  {
    id: "traditional-games",
    titleFr: "Jeux Féminins — Kroub et Sigg",
    titleAr: "الألعاب النسوية التراثية (اكرور / كروب، والسيك / السيغ)",
    categoryFr: "Patrimoine Féminin",
    categoryAr: "التراث النسوي العريق",
    descFr: "Célébration des jeux traditionnels mauritaniens : tournois passionnants de Kroub (adresse avec cailloux) et Sigg (bâtonnets sur sable).",
    descAr: "إحياء للألعاب الشعبية الموريتانية العريقة: بطولات تنافسية في لعبة اكرور ولعبة السيك على الرمال بروح البهجة.",
    iconName: "Dices",
    badgeFr: "Kroub & Sigg",
    badgeAr: "اكرور والسيك",
    scheduleDay: "Du 29 août au 1er septembre",
    scheduleDayAr: "من 29 أغسطس إلى 1 سبتمبر",
    targetGroupFr: "Femmes, jeunes filles et passionnées de traditions",
    targetGroupAr: "النساء، الفتيات وحافظات التراث",
  },
  {
    id: "youth-trainings",
    titleFr: "Formations pour les Jeunes",
    titleAr: "ورشات وتكوين وتأطير الشباب",
    categoryFr: "Développement & Compétences",
    categoryAr: "بناء القدرات والمهارات",
    descFr: "Ateliers pratiques : secourisme, entrepreneuriat local, outils numériques, gestion associative et leadership.",
    descAr: "ورش عمل تطبيقية: الإسعافات الأولية، ريادة الأعمال المحلية، المهارات الرقمية، والقيادة المجتمعية.",
    iconName: "GraduationCap",
    badgeFr: "Ateliers Pratiques",
    badgeAr: "مهارات وتأهيل",
    scheduleDay: "Matinées (9h00 - 12h00)",
    scheduleDayAr: "الفترة الصباحية (9:00 - 12:00)",
    targetGroupFr: "Jeunes diplômés, porteurs de projets, étudiants",
    targetGroupAr: "الشباب، حاملو المشاريع والطلبة",
  },
  {
    id: "cleanup-environment",
    titleFr: "Journée Nettoyage & Environnement",
    titleAr: "يوم النظافة والتطوع وحماية البيئة",
    categoryFr: "Écologie & Volontariat",
    categoryAr: "البيئة والعمل التطوعي",
    descFr: "Opération éco-citoyenne de salubrité à Hassi El Bakaï, plantation d'arbres d'ombrage et gestion des déchets.",
    descAr: "حملة تنظيف كبرى في شوارع وفضاءات حاسي البكاي، غرس أشجار الظل والتوعية بحماية البيئة المحلية.",
    iconName: "Leaf",
    badgeFr: "Eco-citoyenneté",
    badgeAr: "غرس ونظافة",
    scheduleDay: "Dimanche 30 août dès 7h00",
    scheduleDayAr: "الأحد 30 أغسطس ابتداءً من 7:00",
    targetGroupFr: "Bénévoles, associations, habitants de tous âges",
    targetGroupAr: "المتطوعون، الجمعيات وكافة السكان",
  },
  {
    id: "social-support",
    titleFr: "Soutien Social & Solidarité",
    titleAr: "التضامن الاجتماعي ودعم الأسر",
    categoryFr: "Entraide & Fraternité",
    categoryAr: "التكافل والإحسان",
    descFr: "Actions caritatives, distribution de fournitures scolaires pour la rentrée, aides aux familles vulnérables et consultations gratuites.",
    descAr: "مبادرات تكافلية، توزيع المستلزمات المدرسية استعدادًا للعام الدراسي، ومساعدات موجهة للأسر المتعففة.",
    iconName: "HeartHandshake",
    badgeFr: "Entraide & Solidarité",
    badgeAr: "تكافل وعطاء",
    scheduleDay: "Pendant toute la semaine",
    scheduleDayAr: "طيلة أيام الأسبوع",
    targetGroupFr: "Comités d'entraide, bienfaiteurs, familles",
    targetGroupAr: "لجان التكافل، المحسنون، الأسر",
  },
];

export const FESTIVAL_DAYS_SCHEDULE: DayProgram[] = [
  {
    dayNumber: 1,
    dateFr: "Vendredi 28 Août 2026",
    dateAr: "الجمعة 28 أغسطس 2026",
    highlightFr: "Cérémonie d'ouverture & Match inaugural",
    highlightAr: "حفل الافتتاح الرسمي والمباراة الافتتاحية",
    events: [
      {
        time: "16:00",
        titleFr: "Grande cérémonie d'ouverture officielle & Accueil des délégations",
        titleAr: "حفل الافتتاح الرسمي واستقبال الوفود ووجهاء المنطقة",
        locationFr: "Tribune Centrale de Hassi El Bakaï",
        locationAr: "المنصة الرئيسية بحاسي البكاي",
        type: "culture"
      },
      {
        time: "17:30",
        titleFr: "Coup d'envoi du tournoi de Football (Match d'ouverture)",
        titleAr: "انطلاق بطولة كرة القدم (المباراة الافتتاحية)",
        locationFr: "Terrain municipal de Hassi El Bakaï",
        locationAr: "الملعب البلدي بحاسي البكاي",
        type: "sport"
      },
      {
        time: "20:30",
        titleFr: "Soirée poétique inaugurale et chants traditionnels mauritaniens",
        titleAr: "أمسية شعرية افتتاحية وأناشيد ومدائح موريتانية",
        locationFr: "Espace Culturel Assaba",
        locationAr: "الفضاء الثقافي لعصابه",
        type: "culture"
      }
    ]
  },
  {
    dayNumber: 2,
    dateFr: "Samedi 29 Août 2026",
    dateAr: "السبت 29 أغسطس 2026",
    highlightFr: "Tir traditionnel & Lancement des jeux Kroub & Sigg",
    highlightAr: "انطلاق الرماية التقليدية وبطولات اكرور والسيك",
    events: [
      {
        time: "08:30",
        titleFr: "Atelier de formation pour les jeunes : Leadership et gestion associative",
        titleAr: "ورشة تكوينية للشباب: القيادة وتسيير المبادرات والجمعيات",
        locationFr: "Salle polyvalente communautaire",
        locationAr: "القاعة المجتمعية متعددة الخدمات",
        type: "youth"
      },
      {
        time: "10:00",
        titleFr: "Compétition de tir traditionnel mauritanien (Phase éliminatoire)",
        titleAr: "منافسات الرماية التقليدية (الأدوار التمهيدية)",
        locationFr: "Champ de tir de Kiffa - Assaba",
        locationAr: "ميدان الرماية بكيفة - لعصابه",
        type: "traditional"
      },
      {
        time: "16:00",
        titleFr: "Tournoi des jeux féminins traditionnels : Kroub et Sigg",
        titleAr: "بطولة الألعاب الشعبية النسوية: اكرور والسيغ",
        locationFr: "Espace des Traditions Féminines",
        locationAr: "فضاء التقاليد والأصالة النسوية",
        type: "traditional"
      },
      {
        time: "17:00",
        titleFr: "2e journée du tournoi de Football",
        titleAr: "مباريات اليوم الثاني من دوري كرة القدم",
        locationFr: "Terrain municipal",
        locationAr: "الملعب البلدي",
        type: "sport"
      },
      {
        time: "21:00",
        titleFr: "Conférence de sensibilisation : Éducation des jeunes et santé communautaire",
        titleAr: "ندوة توعوية: تمدرس الأبناء والصحة الوقائية للمجتمع",
        locationFr: "Tribune Centrale",
        locationAr: "المنصة الرئيسية",
        type: "culture"
      }
    ]
  },
  {
    dayNumber: 3,
    dateFr: "Dimanche 30 Août 2026",
    dateAr: "الأحد 30 أغسطس 2026",
    highlightFr: "Grande journée de nettoyage & Reboisement citoyen",
    highlightAr: "اليوم التطوعي للنظافة والتشجير وحماية البيئة",
    events: [
      {
        time: "07:00",
        titleFr: "Grande journée d'assainissement et reboisement dans tout Hassi El Bakaï",
        titleAr: "حملة النظافة الكبرى وغرس الأشجار في أرجاء حاسي البكاي",
        locationFr: "Tous les quartiers de la localité",
        locationAr: "كافة أحياء وساحات القرية",
        type: "eco"
      },
      {
        time: "11:00",
        titleFr: "Sensibilisation environnementale et gestion écologique de l'eau",
        titleAr: "حملة إرشادية للمحافظة على البيئة وترشيد المياه",
        locationFr: "Place de la Solidarité",
        locationAr: "ساحة التضامن",
        type: "eco"
      },
      {
        time: "16:30",
        titleFr: "Quarts de finale du tournoi de Football & Compétitions d'athlétisme",
        titleAr: "ربع نهائي بطولة كرة القدم ومسابقات ألعاب القوى",
        locationFr: "Terrain municipal",
        locationAr: "الملعب البلدي",
        type: "sport"
      },
      {
        time: "20:30",
        titleFr: "Soirée théâtrale et sketches sur la citoyenneté et la solidarité",
        titleAr: "سهرة مسرحية واسكتشات هادفة حول المواطنة والتكافل",
        locationFr: "Espace Culturel Assaba",
        locationAr: "الفضاء الثقافي لعصابه",
        type: "culture"
      }
    ]
  },
  {
    dayNumber: 4,
    dateFr: "Lundi 31 Août 2026",
    dateAr: "الإثنين 31 أغسطس 2026",
    highlightFr: "Solidarité sociale & Formations numériques",
    highlightAr: "قوافل التضامن الاجتماعي والتكوين الرقمي للشباب",
    events: [
      {
        time: "09:00",
        titleFr: "Atelier numérique et secourisme pour les jeunes volontaires",
        titleAr: "ورشة المهارات الرقمية والإسعافات الأولية للشباب",
        locationFr: "Centre de formation",
        locationAr: "مركز التكوين",
        type: "youth"
      },
      {
        time: "10:30",
        titleFr: "Lancement des actions de solidarité et kits scolaires pour les familles",
        titleAr: "توزيع الحقائب المدرسية والمساعدات للأسر المتعففة",
        locationFr: "Comité de Solidarité Sociale",
        locationAr: "مقر لجنة التضامن الاجتماعي",
        type: "social"
      },
      {
        time: "16:30",
        titleFr: "Demi-finales de Football & Phases finales de Kroub et Sigg",
        titleAr: "نصف نهائي كرة القدم ونهائيات مسابقة اكرور والسيغ",
        locationFr: "Terrain municipal & Espace Féminin",
        locationAr: "الملعب البلدي وفضاء التقاليد",
        type: "sport"
      },
      {
        time: "20:45",
        titleFr: "Conférence sur l'histoire et le patrimoine de l'Assaba et de Kiffa",
        titleAr: "محاضرة تاريخية حول تراث ورجالات منطقة لعصابه وكيفة",
        locationFr: "Tribune Centrale",
        locationAr: "المنصة الرئيسية",
        type: "culture"
      }
    ]
  },
  {
    dayNumber: 5,
    dateFr: "Mardi 1er Septembre 2026",
    dateAr: "الثلاثاء 1 سبتمبر 2026",
    highlightFr: "Finales du Tir traditionnel & Grande Nuit du Madih",
    highlightAr: "نهائيات الرماية التقليدية وليلة المديح النبوي الكبرى",
    events: [
      {
        time: "09:30",
        titleFr: "Finale palpitante du Tir Traditionnel de l'Assaba",
        titleAr: "المباراة النهائية الكبرى لبطولة الرماية التقليدية",
        locationFr: "Champ de tir",
        locationAr: "ميدان الرماية",
        type: "traditional"
      },
      {
        time: "16:30",
        titleFr: "Match pour la 3e place de football & Remise des distinctions d'athlétisme",
        titleAr: "مباراة المركز الثالث وتتويج أبطال ألعاب القوى",
        locationFr: "Terrain municipal",
        locationAr: "الملعب البلدي",
        type: "sport"
      },
      {
        time: "21:00",
        titleFr: "Grande veillée spirituelle et Nuit du Madih Prophétique",
        titleAr: "ليلة المديح النبوي الشريف والقصائد الصوفية العذبة",
        locationFr: "Grande Place de Hassi El Bakaï",
        locationAr: "الساحة الكبرى بحاسي البكاي",
        type: "culture"
      }
    ]
  },
  {
    dayNumber: 6,
    dateFr: "Mercredi 2 Septembre 2026",
    dateAr: "الأربعاء 2 سبتمبر 2026",
    highlightFr: "Grande Finale de Football & Cérémonie de Clôture",
    highlightAr: "النهائي الكبير لكرة القدم وحفل الاختتام وتوزيع الجوائز",
    events: [
      {
        time: "16:00",
        titleFr: "Grande Finale du Tournoi de Football de Hassi El Bakaï 2026",
        titleAr: "النهائي الحاسم لكأس الأسبوع الرياضي لكرة القدم 2026",
        locationFr: "Terrain municipal",
        locationAr: "الملعب البلدي",
        type: "sport"
      },
      {
        time: "19:30",
        titleFr: "Cérémonie solennelle de clôture, remise des trophées et prix d'excellence",
        titleAr: "حفل الختام الرسمي وتوزيع الجوائز والكؤوس والشهادات التقديرية",
        locationFr: "Tribune d'Honneur",
        locationAr: "المنصة الشرفية",
        type: "culture"
      },
      {
        time: "21:30",
        titleFr: "Grand concert festif de clôture et feux d'artifice de l'unité",
        titleAr: "سهرة الاختتام الاحتفالية الكبرى وإعلان ختام النسخة الثالثة",
        locationFr: "Place Centrale",
        locationAr: "الساحة المركزية",
        type: "culture"
      }
    ]
  }
];

export const FESTIVAL_COMMITTEES: Committee[] = [
  {
    id: "com-culture",
    nameFr: "Comité Culture & Patrimoine",
    nameAr: "لجنة الثقافة والتراث",
    roleFr: "Organisation des soirées poétiques, madih, contes et pièces théâtrales.",
    roleAr: "تنظيم الأمسيات الشعرية والمديح والحكايات والأنشطة المسرحية.",
    iconName: "Sparkles"
  },
  {
    id: "com-sports",
    nameFr: "Comité Sport & Football",
    nameAr: "لجنة الرياضة وكرة القدم",
    roleFr: "Arbitrage, planification des matchs de foot et tournois sportifs.",
    roleAr: "جدولة المباريات، التحكيم، وإدارة المنافسات الكروية.",
    iconName: "Trophy"
  },
  {
    id: "com-traditions",
    nameFr: "Comité Jeux Traditionnels & Tir",
    nameAr: "لجنة الرماية والألعاب الشعبية (اكرور والسيك)",
    roleFr: "Supervision des tournois de tir traditionnel et des jeux féminins Kroub et Sigg.",
    roleAr: "الإشراف على مسابقة الرماية التقليدية وبطولات السيك واكرور النسوية.",
    iconName: "Target"
  },
  {
    id: "com-environment",
    nameFr: "Comité Environnement & Salubrité",
    nameAr: "لجنة البيئة والنظافة والعمل التطوعي",
    roleFr: "Coordination de la journée de nettoyage, matériel et reboisement.",
    roleAr: "تنسيق حملة النظافة الكبرى، توفير المعدات وغرس الأشجار.",
    iconName: "Leaf"
  },
  {
    id: "com-social",
    nameFr: "Comité Solidarité & Soutien Social",
    nameAr: "لجنة التضامن الاجتماعي ودعم الأسر",
    roleFr: "Recensement des besoins, distribution des kits scolaires et entraide.",
    roleAr: "إحصاء الاحتياجات وتوزيع الحقائب المدرسية والمساعدات الإنسانية.",
    iconName: "HeartHandshake"
  },
  {
    id: "com-logistics",
    nameFr: "Comité Logistique & Accueil",
    nameAr: "لجنة الاستقبال واللوجستيك والتنظيم",
    roleFr: "Accueil des invités, sonorisation, éclairage et sécurité générale.",
    roleAr: "استقبال الضيوف، التجهيزات الفنية، الصوت والإنارة والتنظيم.",
    iconName: "Users"
  }
];

export const INVITATION_CARD_OFFICIAL_DATA = {
  ar: {
    badge: "دعوة",
    orgName: "المنسقية العامة لتنمية تجمع قرى أحسي البكاي",
    honorificIntro: "تتشرف بدعوتكم لحضور",
    eventTitle: "النسخة الثالثة من الأسبوع الثقافي والرياضي",
    beneficiaries: "لصالح ساكنة قرى أحسي البكاي ، أكني ردانه ، تاهـمـيـره ، الكلمتر 10 ، الرباط ، قيله ، قراده والقرى المجاورة",
    slogan: "تحت شعار : بإحياء التراث نضمن تنمية مستدامة .",
    location: "أحسي البكاي / كيفه / لعصابة",
    dateTime: "ابتداء من الساعة السابعة مساء يوم 28 أغسطس 2026"
  },
  fr: {
    badge: "Invitation",
    orgName: "La Coordination Générale pour le Développement du Regroupement Villageois de Hssey El-Bekay",
    honorificIntro: "A l'honneur de vous inviter à la",
    editionNumber: "3ème",
    eventTitle: "édition de la semaine culturelle et sportive",
    beneficiaries: "Au profit des habitants des villages de Hssey El-Bekay, Egueni Radana, Tahmira, Kilomètre 10, Ribat, Ghila, Gharada et les villages Voisins",
    slogan: "Sous le slogan : Faire revivre le patrimoine garantit un développement durable.",
    dateTime: "Le 28 août 2026\nA partir de 19 heure",
    location: "A Hssey El-Bekay\nKiffa / Assaba"
  }
};

export const generateWhatsAppInvitationMessage = (
  participantName: string,
  honorificFr: string,
  honorificAr: string,
  invitationCode: string,
  category: string
) => {
  return `✨ *بطاقة دعوة رسمية — CARTE D'INVITATION OFFICIELLE* ✨
🇲🇷 *النسخة الثالثة من الأسبوع الثقافي والرياضي 2026*
*3ème Édition de la Semaine Culturelle et Sportive — Hssey El-Bekay*

━━━━━━━━━━━━━━━━━━━━━━━━
👤 *المدعو(ة) الكريم(ة) / Invité(e) d'honneur :*
*${honorificAr} ${participantName}*
*${honorificFr} ${participantName}*
🏷️ *الفئة / Catégorie :* ${category}
🎫 *رمز الدخول / Pass Code :* \`${invitationCode}\`
━━━━━━━━━━━━━━━━━━━━━━━━

🏛️ *الجهة المنظمة / Organisation :*
• المنسقية العامة لتنمية تجمع قرى أحسي البكاي
• La Coordination Générale pour le Développement du Regroupement Villageois de Hssey El-Bekay

🌟 *الشعار / Slogan :*
« بإحياء التراث نضمن تنمية مستدامة »
« Faire revivre le patrimoine garantit un développement durable »

📅 *الموعد والافتتاح / Date & Ouverture :*
🗓️ يوم الجمعة 28 أغسطس 2026 ابتداءً من الساعة 19:00 (السابعة مساءً)
Vendredi 28 Août 2026 à partir de 19h00

📍 *المكان / Lieu :*
حاسي البكاي — كيفة، ولاية لعصابه (موريتانيا)
Hssey El-Bekay — Kiffa / Assaba

📌 *ملاحظة هامة / Important :*
يرجى إبراز هذه البطاقة أو رمز الدخول (*${invitationCode}*) عند مدخل المهرجان.
Merci de bien vouloir présenter votre carte ou votre code d'invitation à l'entrée du festival.

مرحبًا بكم بين أهلكم وإخوانكم!
Soyez les très bienvenus !`;
};

export const SHARE_TEMPLATES = {
  whatsappText: `🇲🇷 *SEMAINE CULTURELLE ET SPORTIVE 2026 — 3e Édition*
📍 *Hassi El Bakaï — Kiffa, Wilaya de l’Assaba (Mauritanie)*
📅 *Du 28 août au 2 septembre 2026*

*الأسبوع الثقافي والرياضي 2026 — النسخة الثالثة*
حاسي البكاي — كيفة، ولاية لعصابه (موريتانيا)
من 28 أغسطس إلى 2 سبتمبر 2026

🌟 *Thème / الموضوع :*
« Ensemble pour la culture, le sport, la sensibilisation, la solidarité et le développement local. »
« معًا من أجل الثقافة والرياضة والتوعية والتضامن والتنمية المحلية »

🎯 *Activités au programme / البرنامج :*
• Soirées culturelles, poésie & madih (الأمسيات الثقافية والشعر)
• Présentations de sensibilisation (عروض وندوات التوعية)
• Tir traditionnel (مسابقة الرماية التقليدية)
• Compétitions sportives & football (المسابقات الرياضية وكرة القدم)
• Jeux féminins : Kroub et Sigg (الألعاب النسوية: اكرور والسيك)
• Formations pour les jeunes (ورشات وتكوين الشباب)
• Journée nettoyage & environnement (يوم النظافة وحماية البيئة)
• Soutien social & solidarité (التضامن الاجتماعي ودعم الأسر)

📢 *Message d’invitation / رسالة الدعوة :*
Venez nombreux participer, proposer vos idées, rejoindre les comités, soutenir les équipes et contribuer à la réussite de cette grande rencontre communautaire.
ندعو الجميع إلى المشاركة الفعالة، وتقديم الأفكار، والانضمام إلى لجان التنظيم، وتشجيع الفرق، والمساهمة في إنجاح هذا الحدث المجتمعي الكبير.

✨ *Participation ouverte à tous — المشاركة مفتوحة للجميع*
« Votre énergie, vos idées et votre talent font la différence ! »
« طاقتكم وأفكاركم ومواهبكم تصنع الفرق! »`
};
