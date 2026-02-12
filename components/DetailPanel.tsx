
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Search,
  Phone, 
  User, 
  Building2,
  MapPin,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Navigation,
  Info
} from 'lucide-react';
import { CooperativeFeature } from '../types.ts';

interface DetailPanelProps {
  selectedCoop: CooperativeFeature | null;
  allCoops: CooperativeFeature[];
  onSelect: (f: CooperativeFeature) => void;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ selectedCoop, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  
  const p = selectedCoop?.properties;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCoop) {
      setIsSearchOpen(false);
      setIsExpanded(true); 
    }
  }, [selectedCoop]);

  const coords = selectedCoop?.geometry?.coordinates;
  const lng = Array.isArray(coords) ? coords[0] : 0;
  const lat = Array.isArray(coords) ? coords[1] : 0;
  const gMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const closeEverything = () => {
    setIsSearchOpen(false);
    onClose();
    setIsExpanded(false);
    setLocalSearch("");
  };

  if (!selectedCoop && !isSearchOpen) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[4000] pointer-events-auto">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="w-14 h-14 bg-[#0f172a] text-white rounded-full shadow-2xl hover:bg-[#1e293b] hover:scale-110 transition-all flex items-center justify-center border-4 border-white"
        >
          <Search size={22} strokeWidth={2} />
        </button>
      </div>
    );
  }

  const coopName = p?.['Nom de coopérative'] || p?.Nom_Coop;
  const commune = p?.Commune || "---";
  
  // جلب الدائرة من الحقول المتاحة
  const cercle = p?.Cercle || p?.['Cercle'] || "غير محدد";
  
  // جلب الدوار من حقل quartier/ douars كما هو مطلوب تحديداً
  const douar = p?.['quartier/ douars'] || p?.Douar || p?.['Douar'] || "غير محدد";
  
  const sector = p?.["Filière d'activité"] || p?.Secteur || "---";
  const president = p?.['Nom et prénom président/gestionnaire'] || "Non renseigné";
  const phone = p?.['N° téléphone'] || p?.['Téléphone'] || p?.['Telephone'] || p?.['Tel'] || null;
  const birthDate = p?.['Date de naissance'] || "---";
  const schoolLevel = p?.['Niveau scolaire'] || "---";
  
  const adherents = p?.["Nombre des adherents"] || p?.["Nombre des adhérents"] || 0;
  const capital = p?.["Capital social"] || "0";
  const femmes = p?.["Nombre des femmes"] || 0;
  const jeunes = p?.["Nombre des jeunes"] || p?.["Jeunes (-35 ans)"] || 0;

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-[4000] w-full max-w-lg px-2 md:px-4 pb-4 pointer-events-none transition-all duration-500 ${isExpanded ? 'h-[85vh] md:h-[75vh]' : 'h-auto'}`}
    >
      <div 
        className={`bg-white w-full shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] pointer-events-auto transition-all flex flex-col border border-slate-200 overflow-hidden rounded-t-[3rem] md:rounded-[2rem]
          ${isExpanded ? 'h-full' : 'h-auto'}`}
      >
        {/* Handle bar */}
        <div className="flex flex-col items-center py-4 cursor-pointer shrink-0" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-14 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        <div className="px-6 pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              {isSearchOpen ? (
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="البحث عن تعاونية..."
                    className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 transition-all outline-none text-slate-900 font-cairo text-right"
                    dir="rtl"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                  <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                </div>
              ) : selectedCoop ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0f172a] to-[#334155] text-white rounded-2xl shrink-0 flex items-center justify-center shadow-xl border border-white/10">
                     <Building2 size={32} />
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <h3 className="text-base md:text-xl font-black text-[#0f172a] truncate leading-tight uppercase tracking-tight font-cairo">
                      {coopName}
                    </h3>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase truncate border-r border-slate-200 pr-2 tracking-wide">{sector}</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {commune} <MapPin size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selectedCoop && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-3 rounded-xl transition-all border ${isExpanded ? 'bg-slate-50 text-slate-900 border-slate-200 shadow-inner' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 shadow-sm'}`}
                >
                  {isExpanded ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
                </button>
              )}
              <button onClick={closeEverything} className="p-3 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm">
                <X size={22} />
              </button>
            </div>
          </div>
        </div>

        {selectedCoop && (
          <div className={`overflow-y-auto custom-scrollbar px-6 pb-10 space-y-8 transition-all duration-300 ${isExpanded ? 'opacity-100 flex-1' : 'h-0 opacity-0 overflow-hidden'}`} dir="rtl">
            
            {/* Identification Officielle Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-cairo">
                <ShieldCheck size={18} className="text-blue-900" />
                <span>التعريف الرسمي</span>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f1f5f9] p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 font-cairo tracking-widest">الدائرة</label>
                  <p className="text-sm font-bold text-slate-900 font-cairo">{cercle}</p>
                </div>
                <div className="bg-[#f1f5f9] p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 font-cairo tracking-widest">الدوار</label>
                  <p className="text-sm font-bold text-slate-900 font-cairo">{douar}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 font-cairo tracking-widest">الجماعة الترابية</label>
                  <p className="text-sm font-bold text-slate-900 font-cairo">{commune}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2 font-cairo tracking-widest">مجال النشاط</label>
                  <p className="text-xs font-bold text-slate-800 uppercase leading-relaxed font-cairo">{sector}</p>
                </div>
              </div>
            </div>

            {/* Gouvernance Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-cairo">
                <User size={18} className="text-blue-900" />
                <span>إدارة المؤسسة</span>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>
              <div className="bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50/30 rounded-full -ml-16 -mt-16"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="min-w-0 pl-14 text-right">
                    <span className="text-[9px] font-black text-blue-600 uppercase mb-2 block tracking-widest">الرئيس / المسير</span>
                    <h4 className="text-lg font-black text-[#0f172a] leading-tight uppercase mb-4 font-cairo">{president}</h4>
                    {phone && (
                      <a href={`tel:${phone}`} className="flex items-center justify-end gap-3 text-blue-800 font-black hover:text-blue-900 transition-colors" dir="ltr">
                        <span className="text-lg tracking-widest">{phone}</span>
                        <div className="bg-blue-100 p-2.5 rounded-xl shadow-inner">
                          <Phone size={18} />
                        </div>
                      </a>
                    )}
                  </div>
                  <a 
                    href={gMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-5 bg-[#0f172a] text-white rounded-[1.5rem] hover:bg-black transition-all shadow-2xl active:scale-95 shrink-0 flex items-center justify-center"
                    title="تحديد الموقع"
                  >
                    <Navigation size={24} />
                  </a>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
                  <div className="text-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 font-cairo">الجنس</label>
                    <p className="text-[13px] font-black text-slate-800 font-cairo bg-slate-50 py-1 rounded-lg border border-slate-100">
                      {p?.Genre === 'M' ? 'ذكر' : p?.Genre === 'F' ? 'أنثى' : '---'}
                    </p>
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 font-cairo">تاريخ الميلاد</label>
                    <p className="text-[13px] font-black text-slate-800 font-cairo bg-slate-50 py-1 rounded-lg border border-slate-100">{birthDate}</p>
                  </div>
                  <div className="text-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 font-cairo">المستوى التعليمي</label>
                    <p className="text-[12px] font-black text-slate-800 font-cairo bg-slate-50 py-1 rounded-lg border border-slate-100">{schoolLevel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance & Capacity Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-cairo">
                <CheckCircle2 size={18} className="text-blue-900" />
                <span>مؤشرات القدرة المادية والبشرية</span>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-900 text-white p-5 rounded-2xl text-center shadow-lg transform hover:-translate-y-1 transition-all">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-2 font-cairo tracking-tighter">إجمالي الأعضاء</span>
                  <span className="text-xl font-black">{adherents}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-2 font-cairo tracking-tighter">رأس المال</span>
                  <p className="text-xs font-black text-slate-900 leading-tight">
                    {capital} <br/> <span className="text-[9px] text-blue-600 font-bold uppercase">MAD</span>
                  </p>
                </div>
                <div className="bg-pink-50 p-5 rounded-2xl border border-pink-100 text-center shadow-sm">
                  <span className="text-[9px] font-bold text-pink-500 uppercase block mb-2 font-cairo tracking-tighter">عدد النساء</span>
                  <span className="text-xl font-black text-pink-700">{femmes}</span>
                </div>
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center shadow-sm">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase block mb-2 font-cairo tracking-tighter">عدد الشباب</span>
                  <span className="text-xl font-black text-emerald-700">{jeunes}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-8 text-center border-t border-slate-200">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-900"></div>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] font-cairo">المرصد الإقليمي للتعاونيات - الدريوش 2026</p>
                <div className="w-2 h-2 rounded-full bg-blue-900"></div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">JILIT© Agri Invest Development - Document Officiel</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
