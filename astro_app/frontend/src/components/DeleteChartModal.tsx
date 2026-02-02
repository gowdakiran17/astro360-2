import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    chart: any;
    onConfirmDelete: (chartId: string) => Promise<void>;
}

const DeleteChartModal: React.FC<DeleteChartModalProps> = ({
    isOpen,
    onClose,
    chart,
    onConfirmDelete
}) => {
    const handleDelete = async () => {
        try {
            await onConfirmDelete(chart.id);
            onClose();
        } catch (error) {
            console.error('Failed to delete chart:', error);
        }
    };

    if (!chart) return null;

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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                <AlertTriangle className="w-6 h-6 text-white" />
                                            </div>
                                            <Dialog.Title className="text-lg font-bold text-white">
                                                Delete Chart
                                            </Dialog.Title>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="text-white/80 hover:text-white transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-slate-700 mb-6">
                                        Are you sure you want to delete this chart? This action cannot be undone.
                                    </p>

                                    {/* Chart Details */}
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Name:</span>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {chart.first_name} {chart.last_name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Birth Date:</span>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {chart.date_str}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-500">Location:</span>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {chart.location_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warning */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                                        <p className="text-xs text-amber-800">
                                            ⚠️ All analysis, predictions, and data associated with this chart will be permanently deleted.
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={onClose}
                                            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20"
                                        >
                                            Delete Chart
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DeleteChartModal;
