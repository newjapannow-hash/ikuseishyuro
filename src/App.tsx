import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Menu, 
  X,
  CreditCard,
  ChevronRight,
  Filter,
  ArrowLeft
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  location: string;
  salary: string;
  type: string;
}

// --- Components ---

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          育
        </div>
        <span className="font-bold text-lg hidden sm:block">外国人育成就労</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <Link to="/" className="text-indigo-600">Job Board</Link>
        <a href="#" className="hover:text-indigo-600 transition-colors">LMS Learning</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Affiliate</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Recruiters</a>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 md:hidden" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          Get Started
        </button>
      </div>
    </div>
  </nav>
);

const BottomNav = () => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 md:hidden">
    <Link to="/" className="flex flex-col items-center gap-1 text-indigo-600">
      <Briefcase size={20} />
      <span className="text-[10px] font-bold">Jobs</span>
    </Link>
    <button className="flex flex-col items-center gap-1 text-slate-400">
      <BookOpen size={20} />
      <span className="text-[10px] font-bold">Learn</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-slate-400">
      <Users size={20} />
      <span className="text-[10px] font-bold">Affiliate</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-slate-400">
      <CreditCard size={20} />
      <span className="text-[10px] font-bold">Wallet</span>
    </button>
  </div>
);

const JobBoard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetch('/api/jobs').then(res => res.json()).then(setJobs);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Find Your Future in Japan
        </h1>
        <p className="text-slate-500">Connecting skilled workers with certified Japanese unions and companies.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search jobs, skills, or locations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            <MapPin size={16} />
            Location
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={16} />
            Visa Type
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={20} />
              Latest Opportunities
            </h2>
            <span className="text-sm text-slate-500">{filteredJobs.length} jobs found</span>
          </div>

          <div className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
            {filteredJobs.map(job => (
              <motion.div 
                key={job.id}
                whileHover={!isMobile ? { y: -4 } : {}}
                onClick={() => navigate(`/job/${job.id}`)}
                className={`bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm transition-all cursor-pointer group ${isMobile ? 'active:scale-[0.98]' : 'hover:shadow-md'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-colors ${!isMobile && 'group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                    <Briefcase size={24} />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                    {job.type}
                  </span>
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-1">{job.title}</h3>
                <p className="text-slate-500 text-sm mb-4">Leading firm in {job.location} area.</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-indigo-600 font-bold">{job.salary}</div>
                  <button className="text-indigo-600 font-semibold flex items-center gap-1 text-sm md:hidden">
                    Apply <ChevronRight size={16} />
                  </button>
                  <button className="hidden md:block bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {!isMobile && (
          <aside className="w-80 space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Affiliate Program</h3>
                <p className="text-indigo-100 text-sm mb-4">Earn lifetime 30% commission for every referral.</p>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 mb-4">
                  <div className="text-xs text-indigo-100 uppercase font-bold tracking-wider mb-1">Your Earnings</div>
                  <div className="text-2xl font-bold">¥124,500</div>
                </div>
                <button className="w-full bg-white text-indigo-600 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                  Invite Friends
                </button>
              </div>
              <TrendingUp className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32" />
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                LMS Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>JLPT N4 Prep</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Vocational Skills</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[20%]" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(jobs => {
        const found = jobs.find((j: Job) => j.id === Number(id));
        setJob(found || null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!job) return <div className="p-20 text-center">Job not found. <Link to="/" className="text-indigo-600 underline">Go back</Link></div>;

  return (
    <main className="max-w-3xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Job Board
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="h-48 bg-indigo-600 relative">
          <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-indigo-600">
            <Briefcase size={40} />
          </div>
        </div>

        <div className="pt-16 px-6 md:px-8 pb-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                {job.type}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={16} /> Full-time</span>
              </div>
            </div>
            <div className="md:text-right">
              <div className="text-2xl font-bold text-indigo-600">{job.salary}</div>
              <div className="text-xs text-slate-400 uppercase font-bold">Monthly Salary</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Visa Type</div>
              <div className="font-bold">{job.type}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Experience</div>
              <div className="font-bold">Entry Level</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Language</div>
              <div className="font-bold">JLPT N4+</div>
            </div>
          </div>

          <div className="space-y-6 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Job Description</h2>
              <p>
                We are looking for dedicated individuals to join our team in {job.location}. 
                As a {job.title}, you will be responsible for maintaining high standards of work 
                while learning advanced Japanese techniques in your field. This position is specifically 
                designed for the {job.type} program, offering a path to long-term residency and 
                skill certification.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Valid passport and eligibility for {job.type} visa.</li>
                <li>Basic Japanese proficiency (JLPT N4 or equivalent preferred).</li>
                <li>Strong work ethic and willingness to learn.</li>
                <li>Physical fitness suitable for the role.</li>
              </ul>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 flex gap-4">
            <button className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Apply Now
            </button>
            <button className="px-6 py-4 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

// --- Main App ---

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <Routes>
          <Route path="/" element={<JobBoard />} />
          <Route path="/job/:id" element={<JobDetails />} />
        </Routes>

        <BottomNav />

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-[60]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed top-0 right-0 bottom-0 w-64 bg-white z-[70] p-6 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-lg">Menu</span>
                  <button onClick={() => setSidebarOpen(false)}><X size={24} /></button>
                </div>
                <div className="flex flex-col gap-6 font-medium text-slate-600">
                  <Link to="/" onClick={() => setSidebarOpen(false)} className="text-indigo-600">Job Board</Link>
                  <a href="#" className="hover:text-indigo-600">LMS Learning</a>
                  <a href="#" className="hover:text-indigo-600">Affiliate</a>
                  <a href="#" className="hover:text-indigo-600">Recruiters</a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
