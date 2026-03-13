import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Utensils, 
  Info, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Clock, 
  Compass,
  Music,
  Camera,
  Coffee,
  ShieldCheck,
  Ticket,
  Hotel,
  Map as MapIcon,
  ExternalLink,
  Search,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getPragueRecommendations } from './services/geminiService';

interface Activity {
  time: string;
  activity: string;
  description: string;
  location?: string;
  icon: React.ReactNode;
  mapUrl?: string;
}

interface DayPlan {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
}

const ITINERARY: DayPlan[] = [
  {
    day: 1,
    date: "5 באפריל - יום ראשון",
    title: "נחיתה והיכרות עם העיר העתיקה",
    activities: [
      { time: "14:00", activity: "הגעה למלון והתארגנות", description: "צ'ק-אין במלון באזור הרובע היהודי (Josefov).", icon: <MapPin className="w-4 h-4" /> },
      { time: "16:00", activity: "מוזיאון הלגו (Lego Museum)", description: "ביקור במוזיאון הלגו הגדול באירופה - חובה!", location: "Národní 362/31", icon: <Star className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Lego+Museum+Prague" },
      { time: "19:00", activity: "ארוחת ערב כשרה", description: "מסעדת 'שלנו' (Shelanu) או 'קינג סולומון'.", icon: <Utensils className="w-4 h-4" /> }
    ]
  },
  {
    day: 2,
    date: "6 באפריל - יום שני",
    title: "הרובע היהודי ומצודת פראג",
    activities: [
      { time: "10:00", activity: "הרובע היהודי (Josefov)", description: "ביקור בבית הכנסת הישן-חדש, בית הקברות היהודי העתיק ומוזיאון היהדות.", icon: <Compass className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Jewish+Quarter+Prague" },
      { time: "14:00", activity: "מצודת פראג (Prague Castle)", description: "ביקור במתחם המצודה, קתדרלת ויטוס הקדוש וסמטת הזהב.", icon: <ShieldCheck className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Prague+Castle" },
      { time: "19:00", activity: "ארוחת ערב", description: "מסעדת 'דיניץ' (Dinitz) - אוכל ישראלי כשר.", icon: <Utensils className="w-4 h-4" /> }
    ]
  },
  {
    day: 3,
    date: "7 באפריל - יום שלישי",
    title: "גבעת פטרין וקניות",
    activities: [
      { time: "10:00", activity: "גבעת פטרין (Petřín Hill)", description: "עליה במגדל התצפית (דמוי אייפל) וביקור במבוך המראות.", icon: <MapPin className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Petrin+Tower" },
      { time: "14:00", activity: "קניון פלדיום (Palladium)", description: "זמן לקניות במרכז הקניות הגדול בעיר.", icon: <Coffee className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Palladium+Prague" },
      { time: "18:00", activity: "שיט על הוולטאבה", description: "שיט פנורמי על הנהר.", icon: <Camera className="w-4 h-4" /> }
    ]
  },
  {
    day: 4,
    date: "8 באפריל - יום רביעי",
    title: "האי קמפה וסיור אמנות",
    activities: [
      { time: "10:00", activity: "האי קמפה (Kampa Island)", description: "סיור רגלי באזור הציורי והקיר של ג'ון לנון.", icon: <MapPin className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Kampa+Island" },
      { time: "13:00", activity: "מוזיאון קמפה", description: "מוזיאון לאמנות מודרנית עם פסלים מרשימים בחוץ.", icon: <Camera className="w-4 h-4" /> },
      { time: "15:00", activity: "משחק כדורגל - סלביה פראג", description: "נסיעה לאצטדיון 'פורטונה ארנה' (יש לבדוק לוח משחקים סופי).", icon: <Ticket className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Fortuna+Arena+Prague" }
    ]
  },
  {
    day: 5,
    date: "9 באפריל - יום חמישי",
    title: "העיר החדשה והכנות לשבת",
    activities: [
      { time: "10:00", activity: "כיכר ואצלב", description: "סיור במרכז העיר המודרני, המוזיאון הלאומי ופסל סנט ואצלב.", icon: <MapPin className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Wenceslas+Square" },
      { time: "14:00", activity: "הכנות לשבת", description: "קניות אחרונות וסידורים.", icon: <Clock className="w-4 h-4" /> },
      { time: "19:00", activity: "ארוחת ערב חגיגית", description: "מסעדה כשרה לבחירתכם.", icon: <Utensils className="w-4 h-4" /> }
    ]
  },
  {
    day: 6,
    date: "10 באפריל - יום שישי",
    title: "כניסת שבת בפראג",
    activities: [
      { time: "10:00", activity: "סיור רגלי נינוח", description: "טיול רגלי בגשר קארל (Charles Bridge) לפני כניסת השבת.", icon: <Camera className="w-4 h-4" />, mapUrl: "https://www.google.com/maps/search/?api=1&query=Charles+Bridge" },
      { time: "13:00", activity: "מנוחה והתארגנות", description: "זמן למנוחה במלון.", icon: <Clock className="w-4 h-4" /> },
      { time: "19:30", activity: "הדלקת נרות ותפילה", description: "תפילת קבלת שבת בבית הכנסת 'אלטנוישול'.", icon: <ShieldCheck className="w-4 h-4" /> },
      { time: "21:00", activity: "סעודת שבת", description: "סעודה מוזמנת מראש בבית חב\"ד או במסעדה כשרה.", icon: <Utensils className="w-4 h-4" /> }
    ]
  },
  {
    day: 7,
    date: "11 באפריל - יום שבת",
    title: "שבת מנוחה ופרידה",
    activities: [
      { time: "09:30", activity: "תפילת שחרית", description: "תפילה בבית הכנסת המקומי.", icon: <ShieldCheck className="w-4 h-4" /> },
      { time: "12:30", activity: "סעודת יום שבת", description: "סעודה חגיגית.", icon: <Utensils className="w-4 h-4" /> },
      { time: "15:00", activity: "סיור רגלי (ללא חילול שבת)", description: "טיול רגלי בפארק לטנה (Letná Park) לתצפית מרהיבה.", icon: <MapPin className="w-4 h-4" /> },
      { time: "21:00", activity: "הבדלה ונסיעה לשדה", description: "סיום הטיול ונסיעה לשדה התעופה.", icon: <Clock className="w-4 h-4" /> }
    ]
  }
];

const KOSHER_RESTAURANTS = [
  { 
    name: "Shelanu - בשרי", 
    category: "בשרי", 
    type: "המבורגרים ואוכל ביתי", 
    address: "Břehová 208/8", 
    info: "מסעדה בשרית פופולרית עם אוכל מגוון, המבורגרים ושניצלים.", 
    image: "https://picsum.photos/seed/meat1/400/250",
    url: "https://www.shelanu.cz/"
  },
  { 
    name: "Shelanu - חלבי", 
    category: "חלבי", 
    type: "פיצה ופסטה", 
    address: "Břehová 208/8", 
    info: "פיצה כשרה מעולה, פסטות וסלטים. נמצא באותו מתחם של שלנו הבשרי.", 
    image: "https://picsum.photos/seed/pizza1/400/250",
    url: "https://www.shelanu.cz/"
  },
  { 
    name: "King Solomon", 
    category: "בשרי", 
    type: "יוקרתי / מסורתי", 
    address: "Široká 37/8", 
    info: "המסעדה הכשרה הוותיקה והיוקרתית ביותר בפראג. אוכל יהודי קלאסי.", 
    image: "https://picsum.photos/seed/kosher2/400/250",
    url: "https://www.kosher.cz/"
  },
  { 
    name: "Dinitz (דיניץ)", 
    category: "בשרי", 
    type: "ישראלי / גריל", 
    address: "Vězeňská 12", 
    info: "חומוס, שיפודי גריל ואווירה ישראלית חמה בלב העיר העתיקה.", 
    image: "https://picsum.photos/seed/kosher3/400/250",
    url: "https://www.dinitz.cz/"
  },
  { 
    name: "Chabad Grill", 
    category: "בשרי", 
    type: "ביתי / שבת", 
    address: "U Milosrdných 6", 
    info: "מסעדה המופעלת על ידי בית חב\"ד. מקום מצוין לסעודות שבת.", 
    image: "https://picsum.photos/seed/kosher4/400/250",
    url: "https://www.chabadprague.cz/"
  },
  { 
    name: "Kosher Market", 
    category: "חלבי/פרווה", 
    type: "סופרמרקט כשר", 
    address: "Maiselova 62/8", 
    info: "חנות מכולת עם מוצרים כשרים מישראל ואירופה, כולל גבינות ומאפים.", 
    image: "https://picsum.photos/seed/market1/400/250",
    url: "https://www.koshermarket.cz/"
  }
];

const RECOMMENDED_HOTELS = [
  { 
    name: "Hotel InterContinental", 
    rating: 5, 
    location: "צמוד לרובע היהודי", 
    info: "מיקום אסטרטגי לשומרי שבת. מרחק הליכה של דקה מבית הכנסת 'אלטנוישול'.", 
    image: "https://picsum.photos/seed/hotel1/400/250",
    url: "https://www.booking.com/hotel/cz/intercontinental-praha.html"
  },
  { 
    name: "Hotel President", 
    rating: 5, 
    location: "על גדות הנהר, ליד בית חב\"ד", 
    info: "מלון יוקרה עם נוף מדהים לוולטאבה, קרוב מאוד למרכזי הקהילה היהודית.", 
    image: "https://picsum.photos/seed/hotel2/400/250",
    url: "https://www.hotelpresident.cz/"
  },
  { 
    name: "Hotel Maximilian", 
    rating: 4, 
    location: "בלב העיר העתיקה", 
    info: "מלון בוטיק מעוצב ושקט, במרחק הליכה קצר מהרובע היהודי ומכיכר העיר העתיקה.", 
    image: "https://picsum.photos/seed/hotel3/400/250",
    url: "https://www.maximilianhotel.com/"
  }
];

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'kosher' | 'hotels'>('itinerary');

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      const data = await getPragueRecommendations("Detailed Kosher guide for Prague including maps and hotel tips for April 2026");
      setRecommendations(data);
      setLoading(false);
    }
    fetchInitialData();
  }, []);

  return (
    <div className="min-h-screen gradient-bg font-sans pb-24">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        <img 
          src="https://picsum.photos/seed/prague-castle/1920/1080" 
          alt="Prague" 
          className="w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="serif-title text-6xl md:text-8xl font-light mb-4 tracking-tight"
          >
            Prague
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-400 font-bold tracking-widest uppercase text-sm"
          >
            מדריך כשרות וטיולים • אפריל 2026
          </motion.p>
        </div>
      </section>

      {/* Main Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 flex justify-around py-4">
          {[
            { id: 'itinerary', label: 'מסלול טיול', icon: <Calendar className="w-4 h-4" /> },
            { id: 'kosher', label: 'מסעדות כשרות', icon: <Utensils className="w-4 h-4" /> },
            { id: 'hotels', label: 'מלונות מומלצים', icon: <Hotel className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-16">
        
        <AnimatePresence mode="wait">
          {activeTab === 'itinerary' && (
            <motion.section 
              key="itinerary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="serif-title text-4xl font-light">המסלול שלך</h2>
                <div className="flex gap-4">
                  <button onClick={() => setActiveDay(Math.max(0, activeDay - 1))} className="p-2 rounded-full border border-slate-200 hover:bg-white disabled:opacity-20"><ChevronRight /></button>
                  <button onClick={() => setActiveDay(Math.min(ITINERARY.length - 1, activeDay + 1))} className="p-2 rounded-full border border-slate-200 hover:bg-white disabled:opacity-20"><ChevronLeft /></button>
                </div>
              </div>

              <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden">
                <div className="day-number">0{activeDay + 1}</div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-1">{ITINERARY[activeDay].title}</h3>
                    <p className="text-emerald-600 font-bold">{ITINERARY[activeDay].date}</p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {ITINERARY.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveDay(i)}
                        className={`w-10 h-10 rounded-full shrink-0 font-bold transition-all ${activeDay === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-10">
                  {ITINERARY[activeDay].activities.map((act, i) => (
                    <div key={i} className="flex gap-8 relative group">
                      {i < ITINERARY[activeDay].activities.length - 1 && (
                        <div className="absolute top-10 bottom-0 right-4 w-px bg-slate-100 group-hover:bg-emerald-100 transition-colors" />
                      )}
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 z-10 group-hover:scale-110 transition-transform">
                        {act.icon}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{act.time}</span>
                            <h4 className="text-xl font-bold">{act.activity}</h4>
                          </div>
                          {act.mapUrl && (
                            <a href={act.mapUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                              <Navigation className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-slate-500 leading-relaxed">{act.description}</p>
                        {act.location && (
                          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <MapPin className="w-3 h-3" />
                            {act.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'kosher' && (
            <motion.section 
              key="kosher"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="serif-title text-4xl font-light">קולינריה כשרה</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">בשרי</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">חלבי</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {KOSHER_RESTAURANTS.map((res, i) => (
                  <div key={i} className="glass-card rounded-3xl overflow-hidden group">
                    <div className="h-48 overflow-hidden relative">
                      <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className={`absolute top-4 right-4 backdrop-blur px-3 py-1 rounded-full text-xs font-bold ${
                        res.category === 'בשרי' ? 'bg-red-500/90 text-white' : 'bg-blue-500/90 text-white'
                      }`}>
                        {res.category}
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600">
                        {res.type}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold">{res.name}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed h-12 overflow-hidden">{res.info}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {res.address}
                        </div>
                        <div className="flex gap-2">
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                            <Navigation className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'hotels' && (
            <motion.section 
              key="hotels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <h2 className="serif-title text-4xl font-light">איפה לישון?</h2>
              <div className="space-y-6">
                {RECOMMENDED_HOTELS.map((hotel, i) => (
                  <div key={i} className="glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-center group">
                    <div className="w-full md:w-64 h-48 overflow-hidden rounded-2xl shrink-0">
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold">{hotel.name}</h3>
                          <div className="flex gap-1 mt-1">
                            {Array.from({ length: hotel.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <a 
                          href={hotel.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          הזמן עכשיו <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">{hotel.info}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {hotel.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* AI Grounding Info - Redesigned */}
        {recommendations && (
          <section className="pt-12 border-t border-slate-200">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">טיפים חכמים לטיול</h2>
                  <p className="text-slate-400 text-sm">מידע נוסף והמלצות מבוססות בינה מלאכותית</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border-emerald-100 bg-emerald-50/30 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold">ביטחון וכשרות</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">הרובע היהודי מאובטח מאוד. מומלץ תמיד להחזיק תעודה מזהה. רוב המסעדות הכשרות נמצאות במרחק הליכה אחת מהשנייה.</p>
                </div>
                <div className="glass-card p-6 rounded-3xl border-blue-100 bg-blue-50/30 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold">תחבורה ציבורית</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">החשמליות (Trams) הן הדרך הטובה ביותר להתנייד. ניתן לשלם בכרטיס אשראי ישירות בתוך החשמלית.</p>
                </div>
                <div className="glass-card p-6 rounded-3xl border-amber-100 bg-amber-50/30 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold">זמני שבת</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">באפריל השבת נכנסת מאוחר. ודאו את הזמנים המדויקים באפליקציית 'צבע אדום' או באתר חב"ד המקומי.</p>
                </div>
              </div>

              <div className="glass-card p-8 rounded-[2rem] space-y-6">
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                  {recommendations.text}
                </div>
                
                {recommendations.grounding && recommendations.grounding.length > 0 && (
                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">מקורות וקישורים חיצוניים</p>
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href="https://www.jewishmuseum.cz/en/info/visit/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        המוזיאון היהודי - אתר רשמי
                      </a>
                      {recommendations.grounding.map((chunk: any, i: number) => (
                        chunk.web && (
                          <a 
                            key={i} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {chunk.web.title}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-200 text-center text-slate-400 text-xs">
        <p>© 2026 פראג הכשרה - כל הזכויות שמורות</p>
        <p className="mt-2">המידע מבוסס על המלצות AI ונתונים גלויים. יש לוודא זמני פתיחה וכשרות לפני ההגעה.</p>
      </footer>
    </div>
  );
}
