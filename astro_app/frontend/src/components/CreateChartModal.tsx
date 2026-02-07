import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, User, Save, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import CitySearch from './CitySearch';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface CreateChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChartCreated?: (chart?: any) => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const initialState = {
  firstName: '',
  lastName: '',
  chartFor: 'Myself',
  month: 'January',
  day: '',
  year: '',
  hour: '',
  minute: '',
  amPm: 'AM',
  gender: 'Male',
  location: {
    name: '',
    latitude: 0,
    longitude: 0,
    timezone: ''
  }
};

const CreateChartModal = ({ isOpen, onClose, onChartCreated }: CreateChartModalProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialState);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
      setError(null);
    }
  }, [isOpen]);

  const handleLocationSelect = (loc: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        name: loc.name || 'Selected Location',
        latitude: loc.latitude,
        longitude: loc.longitude,
        timezone: loc.timezone
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const index = months.indexOf(formData.month);
      const monthIndex = index === -1 ? 1 : index + 1;
      const formattedDate = `${String(formData.day).padStart(2, '0')}/${String(monthIndex).padStart(2, '0')}/${formData.year}`;

      let hour = parseInt(formData.hour);
      if (formData.amPm === 'PM' && hour !== 12) hour += 12;
      if (formData.amPm === 'AM' && hour === 12) hour = 0;
      const formattedTime = `${String(hour).padStart(2, '0')}:${String(formData.minute).padStart(2, '0')}`;

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        relation: formData.chartFor,
        date_str: formattedDate,
        time_str: formattedTime,
        timezone_str: formData.location.timezone,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        location_name: formData.location.name
      };

      const response = await api.post('charts/', payload);

      const homePayload = {
        ...payload,
        id: response.data.id,
        date: payload.date_str,
        time: payload.time_str,
        timezone: payload.timezone_str,
        locationName: payload.location_name
      };

      if (onChartCreated) {
        onChartCreated(homePayload);
      }

      onClose();
      navigate('/home', { state: { chartData: homePayload } });

    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.detail || error.message || 'Failed to create chart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        Create New Chart
                      </Dialog.Title>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {error && (
                    <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Section: Basic Info */}
                  <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-200 font-medium mb-4">
                      <User className="w-4 h-4 text-purple-400" />
                      Personal Information
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Relationship</label>
                        <select
                          value={formData.chartFor}
                          onChange={e => setFormData({ ...formData, chartFor: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                        >
                          <option value="Myself">Myself</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={e => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section: Birth Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        Birth Date
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <select
                            value={formData.month}
                            onChange={e => setFormData({ ...formData, month: e.target.value })}
                            className="w-full px-2 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        <input
                          type="number"
                          value={formData.day}
                          onChange={e => setFormData({ ...formData, day: e.target.value })}
                          className="w-full px-2 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                          placeholder="DD"
                        />
                      </div>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={formData.year}
                          onChange={e => setFormData({ ...formData, year: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Year (YYYY)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                        <Clock className="w-3 h-3 text-purple-400" />
                        Birth Time
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={formData.hour}
                          onChange={e => setFormData({ ...formData, hour: e.target.value })}
                          className="w-full px-2 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                          placeholder="HH"
                        />
                        <input
                          type="number"
                          value={formData.minute}
                          onChange={e => setFormData({ ...formData, minute: e.target.value })}
                          className="w-full px-2 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                          placeholder="MM"
                        />
                        <select
                          value={formData.amPm}
                          onChange={e => setFormData({ ...formData, amPm: e.target.value })}
                          className="w-full px-2 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section: Location */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      Birth Location
                    </label>
                    <div className="relative">
                      <CitySearch
                        onSelect={handleLocationSelect}
                        label=""
                        initialValue={formData.location.name}
                        isDark={true}
                      />
                      {formData.location.latitude !== 0 && (
                        <div className="mt-2 flex items-center text-[10px] text-purple-400 font-mono">
                          <MapPin className="w-3 h-3 mr-1" />
                          {formData.location.latitude.toFixed(4)}, {formData.location.longitude.toFixed(4)} ({formData.location.timezone})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <span className="animate-spin">⏳</span> : <Save className="w-4 h-4" />}
                      Create Chart
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateChartModal;
