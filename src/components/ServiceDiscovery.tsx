import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { SERVICE_CATEGORIES, ALL_SERVICES } from '../data/services';
import { 
  Briefcase, 
  GraduationCap, 
  Tractor, 
  Users, 
  FileBadge, 
  HeartHandshake, 
  Activity, 
  ShieldAlert, 
  Home, 
  CreditCard,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ServiceItem } from '../types';

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  GraduationCap,
  Tractor,
  Users,
  FileBadge,
  HeartHandshake,
  Activity,
  ShieldAlert,
  Home,
  CreditCard,
};

export const ServiceDiscovery: React.FC = () => {
  const { t, language } = useLanguage();
  const { setSelectedServiceModal, openAskModal } = useJourney();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredServices = ALL_SERVICES.filter(service => {
    const matchesCat = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = searchFilter === '' || 
      service.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      service.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
      service.tags.some(tag => tag.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-3">
            <span>{t('services_badge')}</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0B2545] tracking-tight">
            {t('services_heading')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t('services_subheading')}
          </p>
        </div>

        {/* 10 Category Chips Carousel/Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-[#0B2545] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories ({ALL_SERVICES.length}+)
          </button>

          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Layers;
            const isSelected = selectedCategory === cat.id;
            const catName = language === 'hi' ? cat.nameHi : language === 'mr' ? cat.nameMr : cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-[#E05A10]'}`} />
                <span>{catName}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:border-[#0B2545] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B2545]/15 transition">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search services (e.g., FSSAI, Domicile, GST, Subsidy, Kisan)..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedServiceModal(service)}
              className="cursor-pointer bg-white rounded-2xl p-6 border border-slate-200/90 shadow-gov-sm hover:shadow-gov-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {service.level} Portal
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {service.processingTime}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-[#0B2545] group-hover:text-blue-700 transition mb-2">
                  {service.title}
                </h3>

                <div className="text-xs text-slate-500 font-medium mb-3">
                  {service.department}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700">{service.fee}</span>
                <span className="font-bold text-[#E05A10] group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cannot find service bottom callout */}
        <div className="text-center bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-sm text-[#0B2545]">
              Still unsure which specific service applies to your goal?
            </h4>
            <p className="text-xs text-slate-500">
              Tell SWAGAT in your own words and let the Journey Engine figure it out.
            </p>
          </div>

          <button
            onClick={() => openAskModal()}
            className="px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold transition shrink-0"
          >
            Ask SWAGAT Directly
          </button>
        </div>

      </div>
    </section>
  );
};
