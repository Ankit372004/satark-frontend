"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import { LeadCard } from '@/components/LeadCard';
import { DetailCanvas } from '@/components/DetailCanvas';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { Search, MapPin, Clock, Filter, Loader2, Plus, Sparkles, Award, EyeOff, MessageSquare, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { LargeSearchBar } from '@/components/LargeSearchBar';
import { COLORS, GRADIENTS, SHADOWS } from '@/lib/theme';

export default function Home() {
  const { t } = useTranslation();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Infinite Scroll State
  const [leads, setLeads] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastLeadElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Reset when filter changes
  useEffect(() => {
    setLeads([]);
    setPage(0);
    setHasMore(true);
  }, [activeTab, debouncedSearch, selectedCategory, selectedJurisdiction]);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads/public-leads`);
        url.searchParams.append('limit', '10');
        url.searchParams.append('offset', (page * 10).toString());

        // Default constraints
        let priorityParam = '';
        let statusParam = '';
        let searchParam = debouncedSearch;
        let sortParam = 'newest';

        // Filter Logic Mapping
        switch (activeTab) {
          case 'all':
            break;
          case 'myfeed':
            sortParam = 'trending';
            // Live feed logic - maybe prioritize recent updates or appeals?
            // Current backend logic for 'Appeal:' search for 'myfeed' was a bit specific.
            // Let's keep it broader or use 'trending'.
            break;
          case 'missing':
            statusParam = 'MISSING';
            break;
          case 'wanted':
            statusParam = 'WANTED';
            break;
          case 'alert':
            statusParam = 'ALERT';
            break;
          case 'appeal':
            searchParam = searchParam || 'Appeal'; // If no user search, filter by Appeal
            break;
          case 'critical':
            priorityParam = 'CRITICAL';
            break;
          case 'rewards':
            priorityParam = 'REWARDS';
            break;
          case 'popular':
            sortParam = 'popular';
            break;
          case 'trending':
            sortParam = 'trending';
            break;
          default:
            // Fallback for custom tabs or if priority is passed directly
            priorityParam = activeTab.toUpperCase();
        }

        if (priorityParam) url.searchParams.append('priority', priorityParam);
        if (statusParam) url.searchParams.append('status', statusParam);
        if (searchParam) url.searchParams.append('search', searchParam);
        url.searchParams.append('sort', sortParam);

        if (selectedCategory) url.searchParams.append('category', selectedCategory);
        if (selectedJurisdiction) url.searchParams.append('jurisdiction', selectedJurisdiction);

        const res = await fetch(url.toString());

        if (!res.ok) {
          console.error(`API Error: ${res.status} ${res.statusText}`);
          setHasMore(false);
          return;
        }

        const data = await res.json();

        // Handle if data is wrapped in an object like { leads: [...] }
        const leadsData = Array.isArray(data) ? data : (data.leads || []);

        if (!Array.isArray(leadsData)) {
          console.error("Expected array but received:", data);
          setHasMore(false);
          return;
        }

        if (leadsData.length < 10) {
          setHasMore(false);
        }

        setLeads(prev => {
          const combined = [...prev, ...leadsData];
          // Unique by ID
          const uniqueLeads = Array.from(new Map(combined.map(item => [item.id, item])).values());

          // Inject mock data enhancements
          return uniqueLeads.map((l: any, idx) => ({
            ...l,
            responseCount: l.responseCount || 0,
            // Pin the first critical or appeal lead in the first page
            isPinned: idx === 0 && page === 0 && (l.priority === 'CRITICAL' || l.title.includes('Appeal')),
            // Use real data or fallbacks if missing (but prefer real)
            reward: l.reward_amount || l.reward || null
          }));
        });
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [page, activeTab, debouncedSearch]);

  // Auto-Scroll for Live Feed
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;

    if (activeTab === 'myfeed') {
      scrollInterval = setInterval(() => {
        // Scroll down slightly if not at the bottom
        if ((window.innerHeight + window.scrollY) < document.body.offsetHeight) {
          window.scrollBy({ top: 1, behavior: 'instant' });
          // 'instant' prevents smooth scroll jitter in intervals
        }
      }, 30); // Speed control: 30ms per 1px
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [activeTab]);

  return (
    <div className="min-vh-100" style={{ background: GRADIENTS.bg }}>
      <Header />

      <main className="container-fluid py-4" style={{ maxWidth: '1800px', margin: '0 auto' }}>
        <div className="row g-4">

          {/* LEFT SIDEBAR - Navigation & Ideas */}
          <div className="col-lg-2 pe-lg-4 border-end-lg-0">
            <LeftSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              activeJurisdiction={selectedJurisdiction}
              onJurisdictionChange={setSelectedJurisdiction}
            />
          </div>

          {/* CENTER FEED - Functionality & Content */}
          <div className="col-lg-7 px-lg-4">

            {/* Create Post / Report Bar (Reddit Style) */}
            {/* Create Post / Report Bar (Reddit Style) - COMMENTED OUT AS PER REQUEST
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-0 shadow-sm mb-4"
              style={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className="rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', background: `linear-gradient(135deg, ${COLORS.navyBlue}, ${COLORS.darkNavy})` }}>
                  <Sparkles size={20} className="text-white" />
                </div>
                <input
                  type="text"
                  readOnly
                  onClick={() => router.push('/report?mode=anonymous')}
                  className="form-control hover-bg-light cursor-pointer"
                  style={{ borderRadius: '8px', backgroundColor: COLORS.surface, borderColor: COLORS.border }}
                  placeholder="Spot something suspicious? Report anonymously..."
                />
                <button
                  onClick={() => router.push('/report?mode=public')}
                  className="btn btn-link text-primary p-2 d-flex align-items-center gap-1 text-decoration-none fw-bold"
                  title="Featured Public Post"
                >
                  <MessageSquare size={20} /> <span className="d-none d-sm-inline">Public Post</span>
                </button>
              </div>
            </motion.div>
            */}

            {/* Search Bar - Prominent */}
            <LargeSearchBar
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
            />

            {/* Filter Bar */}
            <div
              className="d-flex align-items-center justify-content-between mb-4 sticky-top pt-2 pb-3 z-10"
              style={{
                background: 'rgba(241, 245, 249, 0.95)',
                backdropFilter: 'blur(12px)',
                margin: '0 -1rem',
                padding: '0 1rem',
                top: '76px' // Stick below the ~80px header
              }}
            >
              <div className="d-flex align-items-center gap-2 overflow-auto no-scrollbar py-1 w-100 justify-content-start">
                <button
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === 'all' ? 'bg-dark text-white shadow-lg' : 'bg-white text-muted border border-slate-200'}`}
                  onClick={() => setActiveTab('all')}
                  style={{ minWidth: 'fit-content' }}
                >
                  All Intel
                </button>

                <div className="vr opacity-25 mx-1"></div>

                <button
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === 'missing' ? 'bg-info text-white shadow-lg' : 'bg-white text-muted border border-slate-200'}`}
                  onClick={() => setActiveTab('missing')}
                  style={{ minWidth: 'fit-content' }}
                >
                  Missing Persons
                </button>
                <button
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === 'wanted' ? 'bg-danger text-white shadow-lg' : 'bg-white text-muted border border-slate-200'}`}
                  onClick={() => setActiveTab('wanted')}
                  style={{ minWidth: 'fit-content' }}
                >
                  Wanted
                </button>
                <button
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === 'appeal' ? 'bg-indigo text-white shadow-lg' : 'bg-white text-muted border border-slate-200'}`}
                  onClick={() => setActiveTab('appeal')}
                  style={{ backgroundColor: activeTab === 'appeal' ? '#6610f2' : undefined, minWidth: 'fit-content' }}
                >
                  Appeals
                </button>
                <button
                  className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === 'alert' ? 'bg-warning text-dark shadow-lg' : 'bg-white text-muted border border-slate-200'}`}
                  onClick={() => setActiveTab('alert')}
                  style={{ minWidth: 'fit-content' }}
                >
                  <AlertCircle size={14} className="me-2" /> Alerts
                </button>
              </div>

              <div className="d-flex ms-2">
                <button className="btn btn-white rounded-circle shadow-sm border border-slate-200 p-2 text-muted hover-scale">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Pinned / Featured Section Title */}
            {leads.some(l => l.isPinned) && (
              <div className="mb-3 d-flex align-items-center gap-2">
                <div className="px-2 py-1 bg-warning text-dark fw-bold rounded" style={{ fontSize: '10px' }}>★ FEATURED</div>
                <h6 className="mb-0 fw-bold text-muted text-uppercase" style={{ letterSpacing: '1px', fontSize: '11px' }}>OFFICIAL INTELLIGENCE DOSSIER</h6>
              </div>
            )}

            {/* Main Feed Loop */}
            <div className="feed-container d-grid gap-3">
              {leads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  ref={index === leads.length - 1 ? lastLeadElementRef : null}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index < 5 ? index * 0.05 : 0 }}
                >
                  <LeadCard
                    lead={lead}
                    onClick={(l) => setSelectedLead(l)}
                    onReportAnonymously={(l) => router.push(`/report?mode=anonymous&ref=${l.id}&title=${encodeURIComponent(l.title)}`)}
                    onProvideNamedTip={(l) => router.push(`/report?mode=named&ref=${l.id}&title=${encodeURIComponent(l.title)}`)}
                  />
                </motion.div>
              ))}

              {loading && (
                <div className="text-center py-4">
                  <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                </div>
              )}

              {leads.length === 0 && !loading && (
                <div className="text-center py-5">
                  <AlertCircle size={48} className="text-muted mb-3" />
                  <p className="text-muted fw-bold">No intelligence found. Be the first to report.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR - Impact & Stats */}
          <div className="col-lg-3 ps-lg-4 d-none d-lg-block">
            <RightSidebar onLeadSelect={setSelectedLead} />
          </div>

        </div>
      </main >

      <DetailCanvas leadId={selectedLead?.id} onClose={() => setSelectedLead(null)} />
    </div >
  );
}
