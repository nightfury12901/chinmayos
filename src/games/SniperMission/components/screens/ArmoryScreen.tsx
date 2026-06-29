'use client';
import { useState, useEffect } from 'react';
import { CONSTANTS } from '../../constants';
import { SaveSystem } from '../../phaser/systems/SaveSystem';
import { SaveData } from '../../types/SaveData';

interface ArmoryScreenProps {
  onBack: () => void;
}

export function ArmoryScreen({ onBack }: ArmoryScreenProps) {
  const [saveData, setSaveData] = useState<SaveData | null>(null);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('M24');

  useEffect(() => {
    setSaveData(SaveSystem.load());
  }, []);

  if (!saveData) return null;

  const weapons = Object.values(CONSTANTS.WEAPONS);
  const selectedWeapon = CONSTANTS.WEAPONS[selectedWeaponId as keyof typeof CONSTANTS.WEAPONS];
  const isUnlocked = saveData.unlockedWeapons.includes(selectedWeapon.id);
  const isEquipped = saveData.equippedWeapon === selectedWeapon.id;
  const cost = (CONSTANTS.WEAPON_COSTS as any)[selectedWeapon.id] || 9999;
  const canAfford = saveData.credits >= cost;

  const handleAction = () => {
    if (isEquipped) return;
    
    const newSave = { ...saveData };
    if (isUnlocked) {
      newSave.equippedWeapon = selectedWeapon.id;
    } else {
      if (canAfford) {
        newSave.credits -= cost;
        newSave.unlockedWeapons.push(selectedWeapon.id);
        newSave.equippedWeapon = selectedWeapon.id;
      }
    }
    SaveSystem.save(newSave);
    setSaveData(newSave);
  };

  const renderStatBar = (val: number, max: number = 10) => {
    const pct = (val / max) * 100;
    return (
      <div className="w-32 h-2 bg-[#1a2f26]">
        <div className="h-full bg-[#00ee00]" style={{ width: `${Math.min(100, pct)}%` }}></div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c] text-[#00ee00] select-none p-8">
      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#1a2f26] pb-4">
          <div className="text-xl">// ARMORY</div>
          <div className="flex gap-4 items-center">
            <div className="text-[#ffcc00] font-bold">CREDITS: {saveData.credits}</div>
            <button onClick={onBack} className="text-[#888] hover:text-white">_ □ X</button>
          </div>
        </div>

        <div className="flex gap-8 flex-1 h-0">
          
          {/* Weapon List */}
          <div className="w-64 flex flex-col gap-2 overflow-y-auto pr-2">
            {weapons.map(w => {
              const isWUnlocked = saveData.unlockedWeapons.includes(w.id);
              const isSelected = w.id === selectedWeapon.id;
              
              let btnClass = "flex justify-between items-center px-4 py-3 border transition-colors ";
              if (isSelected) {
                btnClass += "bg-[rgba(0,238,0,0.1)] border-[#00ee00] text-[#00ee00]";
              } else {
                btnClass += "border-transparent hover:bg-[#111] text-[#888]";
              }

              const imgKey = `gun_${w.id.toLowerCase().replace('-', '')}.png`;

              return (
                <button key={w.id} onClick={() => setSelectedWeaponId(w.id)} className={btnClass}>
                  <span className="flex items-center gap-3">
                    <img 
                      src={`/assets/sniper/${imgKey}`} 
                      alt={w.name} 
                      className={`h-6 object-contain filter ${isWUnlocked ? 'invert opacity-80' : 'invert opacity-30 grayscale'}`} 
                    /> 
                    {w.name}
                  </span>
                  {!isWUnlocked && <span className="text-xs opacity-50">🔒</span>}
                </button>
              );
            })}
          </div>

          {/* Weapon Details */}
          <div className="flex-1 border border-[#1a2f26] bg-[rgba(10,10,12,0.8)] p-8 flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-5xl font-bold mb-2">{selectedWeapon.name}</h2>
                <div className="text-[#888]">{selectedWeapon.suppressed ? 'SUPPRESSED' : 'LOUD'}</div>
              </div>
            </div>

            {/* Weapon Silhouette */}
            <div className="flex-1 flex items-center justify-center mb-12 border border-[#1a2f26] bg-[#0d0d10] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-[150px] text-[#00ee00] font-black tracking-tighter whitespace-nowrap overflow-hidden">
                {selectedWeapon.name.toUpperCase()}
              </div>
              <img 
                src={`/assets/sniper/gun_${selectedWeapon.id.toLowerCase().replace('-', '')}.png`} 
                alt={selectedWeapon.name} 
                className={`max-w-[90%] max-h-[80%] object-contain z-10 ${isUnlocked ? 'drop-shadow-[0_0_15px_rgba(0,238,0,0.4)]' : 'brightness-0 opacity-50'}`} 
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-[#888]">DAMAGE</span>
                {renderStatBar(selectedWeapon.damage, 10)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888]">SWAY</span>
                {renderStatBar(10 - selectedWeapon.sway * 3, 10)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888]">STABILITY</span>
                {renderStatBar(selectedWeapon.stability, 10)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888]">ZOOM</span>
                {renderStatBar(selectedWeapon.zoom, 10)}
              </div>
              <div className="flex justify-between items-center col-span-2 mt-2">
                <span className="text-[#888]">MAGAZINE</span>
                <div className="flex gap-1">
                  {Array.from({ length: selectedWeapon.mag }).map((_, i) => (
                    <div key={i} className="w-2 h-6 bg-[#00ee00]"></div>
                  ))}
                  <span className="ml-2">{selectedWeapon.mag}/{selectedWeapon.mag}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              {!isUnlocked ? (
                <button 
                  onClick={handleAction}
                  disabled={!canAfford}
                  className={`flex-1 py-3 border font-bold tracking-widest transition-colors ${canAfford ? 'border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00] hover:text-black' : 'border-[#ee2222] text-[#ee2222] cursor-not-allowed opacity-50'}`}
                >
                  UNLOCK ({cost} CR)
                </button>
              ) : isEquipped ? (
                <button disabled className="flex-1 py-3 bg-[#1a2f26] text-[#00ee00] cursor-not-allowed tracking-widest font-bold border border-[#00ee00]">
                  EQUIPPED
                </button>
              ) : (
                <button 
                  onClick={handleAction}
                  className="flex-1 py-3 border border-[#00ee00] text-[#00ee00] hover:bg-[#00ee00] hover:text-black transition-colors font-bold tracking-widest"
                >
                  EQUIP
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
