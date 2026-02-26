import { useState } from 'react';
import { reportRepo } from '../infra/report.repo';
import type { ReportType, ReportResponse } from '../domain/report.types';

export interface AddressComponents {
    street?: string;
    neighborhood?: string;
    city?: string;
}

export const useGeolocationReport = () => {
    const [isReporting, setIsReporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<ReportResponse | null>(null);
    const [pendingReport, setPendingReport] = useState<{ type: ReportType, lat: number, lng: number, address?: AddressComponents } | null>(null);

    const checkGeolocationPermission = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!navigator.permissions) {
                // For older browsers, fallback to trying to get position directly
                resolve(true);
                return;
            }

            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'denied') {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    };

    const getDevicePosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                (err) => reject(err),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    };

    const prepareReport = async (type: ReportType = 'SUPPLY_RESTORED') => {
        if (!('geolocation' in navigator)) {
            setError('Tu navegador o dispositivo no soporta geolocalización, lo cual es requerido para esta función.');
            return;
        }

        setIsReporting(true);
        setError(null);
        setSuccessData(null);
        setPendingReport(null);

        try {
            const hasPermission = await checkGeolocationPermission();
            if (!hasPermission) {
                throw new Error('Permisos de ubicación denegados. Por favor, habilita la geolocalización en las configuraciones de tu navegador para poder enviar reportes precisos.');
            }

            const position = await getDevicePosition();
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            let address: AddressComponents | undefined;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.address) {
                        address = {
                            street: data.address.road || data.address.pedestrian,
                            neighborhood: data.address.suburb || data.address.neighbourhood || data.address.village,
                            city: data.address.city || data.address.town || data.address.municipality || data.address.county
                        };
                    }
                }
            } catch (e) {
                console.warn("Failed to reverse geocode:", e);
            }

            setPendingReport({
                type,
                lat,
                lng,
                address
            });

        } catch (err: any) {
            console.error('Report preparation error:', err);
            setError(err.message || 'Ocurrió un error inesperado al calcular tus coordenadas para el reporte.');
        } finally {
            setIsReporting(false);
        }
    };

    const confirmReport = async () => {
        if (!pendingReport) return;

        setIsReporting(true);
        setError(null);

        try {
            const payload = {
                type: pendingReport.type,
                location: {
                    lat: pendingReport.lat,
                    lng: pendingReport.lng
                }
            };

            const data = await reportRepo.createReport(payload);
            setSuccessData(data);
            setPendingReport(null);

            // Clear success after 5 seconds automatically
            setTimeout(() => {
                setSuccessData(null);
            }, 5000);

        } catch (err: any) {
            console.error('Report submission error:', err);
            setError(err.message || 'Ocurrió un error inesperado al confirmar y enviar el reporte.');
        } finally {
            setIsReporting(false);
        }
    };

    const cancelReport = () => {
        setPendingReport(null);
        setError(null);
    };

    return {
        prepareReport,
        confirmReport,
        cancelReport,
        pendingReport,
        isReporting,
        error,
        successData,
        clearError: () => setError(null),
        clearSuccessData: () => setSuccessData(null)
    };
};
