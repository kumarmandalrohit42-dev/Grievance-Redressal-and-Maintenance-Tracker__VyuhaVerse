import React, { useState } from 'react';
import { QrCode, Download, Printer, X, MapPin, CheckCircle2 } from 'lucide-react';
import { QRCodeLocation } from '../../types';

export const SAMPLE_QR_LOCATIONS: QRCodeLocation[] = [
  { id: 'qr-1', name: 'Aryabhata Hostel Room 304', buildingId: 'bldg-hostel-a', buildingName: 'Aryabhata Hostel (Block A)', floor: '3rd Floor', roomNumber: '304', qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CAMPUSCARE-HST-A-304' },
  { id: 'qr-2', name: 'Visvesvaraya Lab 202', buildingId: 'bldg-engg', buildingName: 'Visvesvaraya Engineering Block', floor: '2nd Floor', roomNumber: 'Lab 202', qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CAMPUSCARE-ENG-202' },
  { id: 'qr-3', name: 'Central Library Reading Hall 1', buildingId: 'bldg-lib', buildingName: 'Central Knowledge Library', floor: '1st Floor', roomNumber: 'Hall 1', qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CAMPUSCARE-LIB-H1' },
  { id: 'qr-4', name: 'Gargi Hostel Room 210 Washroom', buildingId: 'bldg-hostel-b', buildingName: 'Gargi Girls Hostel (Block B)', floor: '2nd Floor', roomNumber: 'Room 210', qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CAMPUSCARE-HST-B-210' },
];

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation?: (loc: QRCodeLocation) => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [selectedQR, setSelectedQR] = useState<QRCodeLocation>(SAMPLE_QR_LOCATIONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-slate-100">Campus Location QR Code Dispatcher</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Scan or select any official QR code printed in hostels, labs, or washrooms to pre-fill complaint details automatically.
        </p>

        {/* Location Selector Grid */}
        <div className="grid grid-cols-2 gap-2">
          {SAMPLE_QR_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setSelectedQR(loc)}
              className={`p-3 rounded-2xl border text-left text-xs transition ${
                selectedQR.id === loc.id 
                  ? 'bg-brand-600/20 border-brand-500 text-slate-100' 
                  : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <p className="font-bold text-slate-200 truncate">{loc.name}</p>
              <p className="text-[10px] font-mono text-slate-500">{loc.buildingName.split(' ')[0]}</p>
            </button>
          ))}
        </div>

        {/* Selected QR Display */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row items-center gap-4">
          <img src={selectedQR.qrCodeUrl} alt={selectedQR.name} className="w-32 h-32 rounded-xl bg-white p-2 border border-slate-800" />
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold">
              SCANNED LOCATION
            </span>
            <h4 className="text-sm font-bold text-slate-100">{selectedQR.name}</h4>
            <p className="text-xs text-slate-400 font-mono">Building: {selectedQR.buildingName}</p>
            <p className="text-xs text-slate-400 font-mono">Floor: {selectedQR.floor} • Room: {selectedQR.roomNumber}</p>

            {onSelectLocation && (
              <button
                type="button"
                onClick={() => {
                  onSelectLocation(selectedQR);
                  onClose();
                }}
                className="mt-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Auto-Fill Location in Form</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
