import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  Plus, Target, Scroll, Compass, MessageSquare, Search, Edit2, Star,
  Trash2, Grid3x3, List, Copy, Eye, Calendar, Clock, MapPin, MoreVertical
} from 'lucide-react';
import CreateChartModal from '../components/CreateChartModal';
import DeleteChartModal from '../components/DeleteChartModal';
import EditChartModal from '../components/EditChartModal';
import { useNavigate } from 'react-router-dom';
import { useChartSettings } from '../context/ChartContext';

const ZODIAC_SYMBOLS: Record<number, string> = {
  1: '♈', 2: '♉', 3: '♊', 4: '♋', 5: '♌', 6: '♍',
  7: '♎', 8: '♏', 9: '♐', 10: '♑', 11: '♒', 12: '♓'
};

type ViewMode = 'grid' | 'list';

const MyCharts = () => {
  const navigate = useNavigate();
  const { availableProfiles, isLoadingProfiles, refreshProfiles, switchProfile, deleteChart, updateChart } = useChartSettings();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleSwitch = (chart: any) => {
    switchProfile(chart);
    navigate('/home');
  };

  const handleDelete = (chart: any) => {
    console.log('Delete button clicked for chart:', chart);
    setSelectedChart(chart);
    setIsDeleteModalOpen(true);
    console.log('Modal state set to true');
  };

  const handleEdit = (chart: any) => {
    console.log('Edit button clicked for chart:', chart);
    setSelectedChart(chart);
    setIsEditModalOpen(true);
  };

  const handleDuplicate = async (chart: any) => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate chart:', chart);
  };

  const filteredCharts = availableProfiles.filter(chart => {
    const query = searchQuery.toLowerCase();
    const fullName = `${chart.first_name} ${chart.last_name}`.toLowerCase();
    const location = (chart.location_name || '').toLowerCase();
    return fullName.includes(query) || location.includes(query);
  });

  const getZodiacSign = (chart: any) => {
    // Simple calculation - in real app, use proper astrological calculation
    const month = parseInt(chart.date_str?.split('/')[1] || '1');
    return ZODIAC_SYMBOLS[month] || '♈';
  };

  const EmptyState = () => (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-3xl p-12 text-center shadow-2xl">
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <SparklesIcon className="w-12 h-12 text-yellow-400 animate-pulse" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to Vedic Astrology</h1>
      <p className="text-slate-500 max-w-2xl mx-auto mb-12 text-lg">
        Experience the most precise Vedic astrology calculations. Generate authentic birth
        charts with advanced planetary positions and traditional techniques.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <FeatureCard
          icon={Target}
          title="To-the-Second Precision"
          description="Astronomical accuracy beyond anything seen"
          color="bg-red-500"
        />
        <FeatureCard
          icon={Scroll}
          title="Ancient Text Predictions"
          description="Full breadth of Vedic wisdom & techniques"
          color="bg-purple-600"
        />
        <FeatureCard
          icon={Compass}
          title="Complete Divisionals"
          description="All Varga charts & traditional methods"
          color="bg-slate-500"
        />
        <FeatureCard
          icon={MessageSquare}
          title="Ask & Receive"
          description="Predictions, remedies from sacred texts"
          color="bg-slate-400"
        />
      </div>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center mx-auto shadow-lg shadow-slate-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Your First Chart
      </button>

      <p className="mt-6 text-slate-400 text-sm">
        Join thousands discovering their cosmic blueprint
      </p>
    </div>
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Charts</h1>
          <p className="text-slate-400">
            {isLoadingProfiles ? 'Loading...' : `${availableProfiles.length} chart${availableProfiles.length !== 1 ? 's' : ''}`} • Manage your birth charts
          </p>
        </div>

        {!isLoadingProfiles && availableProfiles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-xl leading-5 bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm shadow-xl backdrop-blur-sm transition-all"
                  placeholder="Search charts by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* View Mode & Add Button */}
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center shadow-lg shadow-purple-500/20 active:scale-95"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chart
                </button>
              </div>
            </div>

            {/* Charts Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCharts.map((chart) => (
                  <ChartCard
                    key={chart.id}
                    chart={chart}
                    zodiacSign={getZodiacSign(chart)}
                    onSwitch={() => handleSwitch(chart)}
                    onEdit={() => handleEdit(chart)}
                    onDelete={() => handleDelete(chart)}
                    onDuplicate={() => handleDuplicate(chart)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden p-2">
                <div className="space-y-1">
                  {filteredCharts.map((chart) => (
                    <ChartListItem
                      key={chart.id}
                      chart={chart}
                      zodiacSign={getZodiacSign(chart)}
                      onSwitch={() => handleSwitch(chart)}
                      onEdit={() => handleEdit(chart)}
                      onDelete={() => handleDelete(chart)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateChartModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onChartCreated={refreshProfiles}
      />

      <DeleteChartModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        chart={selectedChart}
        onConfirmDelete={deleteChart}
      />

      <EditChartModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        chart={selectedChart}
        onSave={updateChart}
      />
    </MainLayout>
  );
};

// Chart Card Component
const ChartCard = ({ chart, zodiacSign, onSwitch, onEdit, onDelete, onDuplicate }: any) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30">
      {/* Default Badge */}
      {chart.is_default && (
        <div className="absolute top-4 right-4">
          <Star className="w-5 h-5 text-amber-400 fill-current" />
        </div>
      )}

      {/* Zodiac Icon */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <span className="text-3xl text-white">{zodiacSign}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white line-clamp-1">
            {chart.first_name} {chart.last_name}
          </h3>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {chart.location_name || 'Unknown'}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Calendar className="w-4 h-4 text-slate-400" />
          {chart.date_str}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock className="w-4 h-4 text-slate-400" />
          {chart.time_str}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Created {new Date(chart.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-slate-700/50">
        <button
          onClick={(e) => { e.stopPropagation(); onSwitch(); }}
          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); console.log('Edit clicked!', chart); onEdit(); }}
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          title="Edit Chart"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); console.log('Delete clicked!', chart); onDelete(); }}
          className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors border border-red-500/20"
          title="Delete Chart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-40 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-20">
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicate(); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Chart List Item Component
const ChartListItem = ({ chart, zodiacSign, onSwitch, onEdit, onDelete }: any) => {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-700/50 transition-all border-b border-slate-700/30 last:border-0 rounded-xl mb-2">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
        <span className="text-2xl text-white">{zodiacSign}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white truncate">
            {chart.first_name} {chart.last_name}
          </h3>
          {chart.is_default && <Star className="w-3 h-3 text-amber-400 fill-current flex-shrink-0" />}
        </div>
        <p className="text-xs text-slate-400 truncate flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {chart.location_name}
        </p>
      </div>

      <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 border-l border-r border-slate-700 px-4 mx-2">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {chart.date_str}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {chart.time_str}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSwitch}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-slate-800/60 transition-all duration-300">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-white font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

export default MyCharts;
