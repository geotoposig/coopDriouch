
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
  Globe,
  CheckCircle2
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
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-[4000] w-full max-w-lg px-4 pb-4 pointer-events-none transition-all duration-500 ${isExpanded ? 'h-[75vh]' : 'h-auto'}`}
    >
      <div 
        className={`bg-white w-full shadow-[0_-15px_50px_-15px_rgba(0,0,0,0.15)] pointer-events-auto transition-all flex flex-col border border-slate-200 overflow-hidden rounded-3xl
          ${isExpanded ? 'h-full' : 'h-auto'}`}
      >
        {/* Handle bar */}
        <div className="flex flex-col items-center py-3 cursor-pointer shrink-0" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-14 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        <div className="px-6 pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              {isSearchOpen ? (
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Rechercher une entité..."
                    className="w-full pl-11 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-500/20 transition-all outline-none text-slate-900"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                  <Search className="absolute left-4 top-3 text-slate-400" size={16} />
                </div>
              ) : selectedCoop ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1e293b] text-white rounded-2xl shrink-0 flex items-center justify-center shadow-sm">
                     <Building2 size={24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-slate-900 truncate leading-tight uppercase tracking-tight">
                      {coopName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{commune}</span>
                      <span className="text-[10px] text-slate-300">|</span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase truncate">{sector}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selectedCoop && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-2 rounded-xl transition-all border ${isExpanded ? 'bg-slate-50 text-slate-900 border-slate-200' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
                >
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>
              )}
              <button onClick={closeEverything} className="p-2 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {selectedCoop && (
          <div className={`overflow-y-auto custom-scrollbar px-6 pb-8 space-y-6 transition-all duration-300 ${isExpanded ? 'opacity-100 flex-1' : 'h-0 opacity-0 overflow-hidden'}`}>
            
            {/* Identification Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <Globe size={14} className="text-slate-700" />
                <span>Identification Officielle</span>
                <div className="flex-1 h-[1px] bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Commune / Cercle</label>
                  <p className="text-xs font-semibold text-slate-800">{commune}</p>
                </div>
                <div className="bg-[#f8fafc] p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Filière d'Activité</label>
                  <p className="text-xs font-semibold text-slate-800 uppercase truncate">{sector}</p>
                </div>
              </div>
            </div>

            {/* Governance Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <User size={14} className="text-slate-700" />
                <span>Gouvernance & Contact</span>
                <div className="flex-1 h-[1px] bg-slate-100"></div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 pr-12">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight uppercase mb-2">{president}</h4>
                    {phone && (
                      <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Phone size={14} className="text-slate-400" />
                        <span className="text-sm tracking-wide">{phone}</span>
                      </div>
                    )}
                  </div>
                  <a 
                    href={gMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="absolute top-4 right-4 p-3 bg-[#1e293b] text-white rounded-2xl hover:bg-[#0f172a] transition-all shadow-lg active:scale-95 shrink-0"
                  >
                    <MapPin size={18} />
                  </a>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-slate-100">
                  <div className="text-center">
                    <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Genre</label>
                    <p className="text-[11px] font-medium text-slate-700">{p?.Genre === 'M' ? 'Homme' : p?.Genre === 'F' ? 'Femme' : '---'}</p>
                  </div>
                  <div className="text-center">
                    <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Naissance</label>
                    <p className="text-[11px] font-medium text-slate-700">{birthDate}</p>
                  </div>
                  <div className="text-center">
                    <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Instruction</label>
                    <p className="text-[11px] font-medium text-slate-700">{schoolLevel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <CheckCircle2 size={14} className="text-slate-700" />
                <span>Indicateurs de Performance</span>
                <div className="flex-1 h-[1px] bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1.5">Membres</span>
                  <span className="text-sm font-bold text-slate-900">{adherents}</span>
                </div>
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1.5">Capital</span>
                  <p className="text-[10px] font-bold text-slate-900 leading-tight">
                    {capital} <br/> <span className="text-[8px] text-slate-400 font-medium">DH</span>
                  </p>
                </div>
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1.5">Femmes</span>
                  <span className="text-sm font-bold text-slate-800">{femmes}</span>
                </div>
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block mb-1.5">Jeunes</span>
                  <span className="text-sm font-bold text-blue-600">{jeunes}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 text-center">
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Document officiel - Observatoire Driouch 2026</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
