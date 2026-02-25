import React, { useState } from 'react';
import type { CreateWaterServicePayload } from '../../domain/water-service.types';
import { PlusCircle, MapPin, Building, Hash, X } from 'lucide-react';

const HIDALGO_CITIES = [
    'Pachuca de Soto',
    'Mineral de la Reforma',
    'Zempoala',
    'Tulancingo',
    'Tizayuca',
    'Ixmiquilpan',
    'Actopan',
    'Huejutla de Reyes',
    'Tepeji del Río',
    'Tula de Allende'
];

interface RegisterServiceFormProps {
    onSubmit: (payload: CreateWaterServicePayload) => Promise<boolean>;
    onClose: () => void;
    isLoading: boolean;
}

export const RegisterServiceForm: React.FC<RegisterServiceFormProps> = ({ onSubmit, onClose, isLoading }) => {
    const [formData, setFormData] = useState<CreateWaterServicePayload>({
        serviceNumber: '',
        street: '',
        neighborhood: '',
        city: 'Pachuca de Soto',
        postalCode: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.postalCode.length !== 5) {
            setError('El código postal debe tener exactamente 5 dígitos.');
            return;
        }

        const success = await onSubmit(formData);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-md p-8 relative rounded-2xl bg-gray-900/80 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden">
                {/* Neon Glow Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
                        <PlusCircle className="w-6 h-6 text-cyan-400" />
                        Vincular Cuenta
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Service Number */}
                    <div className="space-y-1 group">
                        <label className="text-sm font-medium text-gray-300 group-focus-within:text-cyan-400 transition-colors">
                            Número de Servicio
                        </label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                name="serviceNumber"
                                required
                                value={formData.serviceNumber}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono"
                                placeholder="Ej: VDA-12345"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Street */}
                        <div className="space-y-1 group col-span-2">
                            <label className="text-sm font-medium text-gray-300 group-focus-within:text-cyan-400 transition-colors">
                                Calle y Número
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    name="street"
                                    required
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                    placeholder="Circuito Principal 12"
                                />
                            </div>
                        </div>

                        {/* Neighborhood */}
                        <div className="space-y-1 group col-span-2">
                            <label className="text-sm font-medium text-gray-300 group-focus-within:text-cyan-400 transition-colors">
                                Colonia / Fracc.
                            </label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    name="neighborhood"
                                    required
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                    placeholder="Villas del Álamo"
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div className="space-y-1 group">
                            <label className="text-sm font-medium text-gray-300 group-focus-within:text-cyan-400 transition-colors">
                                Municipio
                            </label>
                            <select
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none"
                            >
                                {HIDALGO_CITIES.map(c => (
                                    <option key={c} value={c} className="bg-gray-900 text-white">{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Postal Code */}
                        <div className="space-y-1 group">
                            <label className="text-sm font-medium text-gray-300 group-focus-within:text-cyan-400 transition-colors">
                                C.P.
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                required
                                maxLength={5}
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-gray-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono"
                                placeholder="42000"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 
                            ${isLoading
                                ? 'bg-gray-700 cursor-not-allowed opacity-70'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Vinculando...
                            </div>
                        ) : (
                            'Registrar Servicio'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
