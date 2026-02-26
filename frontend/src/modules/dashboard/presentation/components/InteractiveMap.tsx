import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, Popup } from 'react-leaflet';
// @ts-ignore
import { EditControl } from 'react-leaflet-draw';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from '@heroui/react';
import { CheckCircle2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useZones } from '../../application/useZones';
import type { Zone } from '../../application/useZones';
import { apiClient } from '../../../../core/api/api.config';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const PACHUCA_CENTER: [number, number] = [20.1011, -98.7591];

const ZonePopup = ({ zone }: { zone: Zone }) => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        apiClient.get(`/reports/zone/${zone.id}`)
            .then((res: any) => {
                if (isMounted) {
                    setReports(res.data);
                    setLoading(false);
                }
            })
            .catch((err: any) => {
                console.error('Error fetching zone reports', err);
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, [zone.id]);

    const restoredCount = reports.filter(r => r.type === 'SUPPLY_RESTORED').length;
    const endedCount = reports.filter(r => r.type === 'SUPPLY_ENDED').length;

    return (
        <div className="p-1 min-w-[200px] font-sans">
            <h3 className="font-bold text-base mb-3 text-gray-800 border-b pb-2">{zone.name}</h3>
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded-md border border-blue-100">
                        <span className="text-blue-700 font-medium text-sm">Llegó el agua</span>
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{restoredCount}</span>
                    </div>
                    <div className="flex justify-between items-center bg-red-50 px-3 py-2 rounded-md border border-red-100">
                        <span className="text-red-700 font-medium text-sm">Se fue el agua</span>
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{endedCount}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 text-right uppercase tracking-wider">
                        Total {reports.length} reportes
                    </div>
                </div>
            )}
        </div>
    );
};

export const InteractiveMap = () => {
    const { zones, fetchZones, createZone, isLoading } = useZones();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [pendingLayer, setPendingLayer] = useState<any>(null);
    const [valveName, setValveName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const featureGroupRef = useRef<any>(null);

    // Fetch zones on mount and poll every 15 seconds
    useEffect(() => {
        fetchZones();

        const intervalId = setInterval(() => {
            fetchZones();
        }, 15000); // Poll every 15 seconds

        return () => clearInterval(intervalId);
    }, [fetchZones]);

    // Translate Leaflet-Draw to Spanish
    useEffect(() => {
        if ((L as any).drawLocal) {
            const drawLocal = (L as any).drawLocal;
            drawLocal.draw.toolbar.buttons.polygon = 'Dibujar una zona (polígono)';
            drawLocal.draw.handlers.polygon.tooltip.start = 'Haga clic para empezar a dibujar la zona.';
            drawLocal.draw.handlers.polygon.tooltip.cont = 'Haga clic para continuar dibujando.';
            drawLocal.draw.handlers.polygon.tooltip.end = 'Haga clic en el primer punto para cerrar esta zona.';
            drawLocal.draw.toolbar.actions.title = 'Cancelar dibujo';
            drawLocal.draw.toolbar.actions.text = 'Cancelar';
            drawLocal.draw.toolbar.finish.title = 'Terminar dibujo';
            drawLocal.draw.toolbar.finish.text = 'Finalizar';
            drawLocal.draw.toolbar.undo.title = 'Borrar último punto';
            drawLocal.draw.toolbar.undo.text = 'Deshacer';

            drawLocal.edit.toolbar.actions.save.title = 'Guardar cambios';
            drawLocal.edit.toolbar.actions.save.text = 'Guardar';
            drawLocal.edit.toolbar.actions.cancel.title = 'Cancelar edición';
            drawLocal.edit.toolbar.actions.cancel.text = 'Cancelar';
            drawLocal.edit.toolbar.buttons.edit = 'Editar zonas';
            drawLocal.edit.toolbar.buttons.editDisabled = 'No hay zonas para editar';
            drawLocal.edit.toolbar.buttons.remove = 'Eliminar zonas';
            drawLocal.edit.toolbar.buttons.removeDisabled = 'No hay zonas para eliminar';
            drawLocal.edit.handlers.edit.tooltip.text = 'Arrastre los controles o marcadores para editar la zona.';
            drawLocal.edit.handlers.edit.tooltip.subtext = 'Haga clic en Cancelar para deshacer los cambios.';
            drawLocal.edit.handlers.remove.tooltip.text = 'Haga clic en una zona para eliminarla.';
        }
    }, []);

    const _onCreate = (e: any) => {
        const { layerType, layer } = e;
        console.log('Leaflet Draw Event onCreated triggered', layerType);
        if (layerType === 'polygon') {
            setPendingLayer(layer);
            setValveName('');
            setErrorMsg('');
            console.log('Opening Modal for Valve Name Assignment');
            onOpen(); // Open the modal to ask for Valve Name
        }
    };

    const handleSaveZone = async () => {
        if (!valveName.trim()) {
            setErrorMsg('El nombre de la válvula es obligatorio.');
            return;
        }

        try {
            const geojson = pendingLayer.toGeoJSON().geometry;
            console.log('Sending GeoJSON to API:', JSON.stringify(geojson, null, 2));
            await createZone(valveName, geojson);

            // Remove the manually drawn layer because it will now be rendered by our <GeoJSON> component
            if (featureGroupRef.current) {
                featureGroupRef.current.removeLayer(pendingLayer);
            }
            onClose();
            setPendingLayer(null);

            // Show success message temporarily
            setSuccessMsg(`Zona "${valveName}" guardada exitosamente.`);
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err: any) {
            setErrorMsg(err.message || 'Error al guardar la zona. Intente nuevamente.');
        }
    };

    const handleCancelDraw = () => {
        if (featureGroupRef.current && pendingLayer) {
            featureGroupRef.current.removeLayer(pendingLayer);
        }
        setPendingLayer(null);
        onClose();
    };

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-cyan-500/30 relative z-0 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            {/* Success Alert Banner */}
            {successMsg && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-[#0b101a]/95 border border-cyan-500/50 text-cyan-100 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center gap-3 backdrop-blur-md animate-appearance-in pointer-events-none">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium">{successMsg}</span>
                </div>
            )}

            <MapContainer
                center={PACHUCA_CENTER}
                zoom={13}
                style={{ height: '100%', width: '100%', backgroundColor: '#091524' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Render zones previously saved in the database */}
                {zones.map((zone) => {
                    const isWaterFlowing = zone.status === 'WATER_FLOWING';
                    const fillColor = isWaterFlowing ? '#3b82f6' : '#ef4444'; // Blue / Red

                    return (
                        <GeoJSON
                            key={zone.id + '-' + zone.status} // Force re-render on status change
                            data={zone.polygon}
                            style={{
                                color: fillColor,
                                weight: 2,
                                fillOpacity: 0.35,
                                fillColor: fillColor
                            }}
                        >
                            <Popup>
                                <ZonePopup zone={zone} />
                            </Popup>
                        </GeoJSON>
                    );
                })}

                <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                        position="topright"
                        onCreated={_onCreate}
                        draw={{
                            rectangle: false,
                            circle: false,
                            circlemarker: false,
                            marker: false,
                            polyline: false,
                            polygon: {
                                allowIntersection: false,
                                shapeOptions: {
                                    color: '#22d3ee',
                                    weight: 3,
                                    fillOpacity: 0.3
                                }
                            }
                        }}
                        edit={{
                            edit: false, // Disabling edit/delete temporarily until backend fully supports it
                            remove: false
                        }}
                    />
                </FeatureGroup>
            </MapContainer>

            {/* Map Legend */}
            <div className="absolute bottom-6 right-6 z-[1000] bg-[#0b101a]/90 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.15)] pointer-events-none">
                <h4 className="text-cyan-100 font-semibold mb-3 text-sm tracking-wide">Estado de la Red</h4>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                        <span className="text-gray-300 text-sm">Con Suministro (Agua)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                        <span className="text-gray-300 text-sm">Sin Suministro</span>
                    </div>
                </div>
            </div>

            {/* Valve Name Assignment Modal via Portal to avoid Leaflet SVG class crashes */}
            {typeof document !== 'undefined' && createPortal(
                <Modal
                    isOpen={isOpen}
                    onOpenChange={(open) => !open && handleCancelDraw()}
                    isDismissable={false}
                    hideCloseButton={true}
                    classNames={{
                        wrapper: "z-[99999]",
                        backdrop: "z-[99998] bg-black/50 backdrop-blur-sm",
                        base: "bg-[#0b101a] border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)]",
                        header: "border-b border-cyan-500/20 text-white",
                        body: "py-6 text-white/70",
                        footer: "border-t border-cyan-500/20"
                    }}
                >
                    <ModalContent>
                        {() => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Registrar Nueva Zona</ModalHeader>
                                <ModalBody>
                                    <p className="text-sm">
                                        Ha dibujado un nuevo polígono en el mapa. Por favor, asigne esta zona a una **Válvula de Distribución**.
                                    </p>
                                    <Input
                                        autoFocus
                                        label="Nombre de la Válvula"
                                        placeholder="Ej. Válvula Centro"
                                        variant="bordered"
                                        value={valveName}
                                        onValueChange={setValveName}
                                        isInvalid={!!errorMsg}
                                        errorMessage={errorMsg}
                                        classNames={{
                                            input: "text-white outline-none focus:ring-0",
                                            inputWrapper: "!border-cyan-500/30 data-[hover=true]:!border-cyan-400 group-data-[focus=true]:!border-cyan-400 !outline-none",
                                            label: "text-cyan-300/70"
                                        }}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={handleCancelDraw}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="bg-cyan-500 text-slate-900 font-semibold"
                                        onPress={handleSaveZone}
                                        isLoading={isLoading}
                                    >
                                        Guardar Zona
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>,
                document.body
            )}
        </div>
    );
};
