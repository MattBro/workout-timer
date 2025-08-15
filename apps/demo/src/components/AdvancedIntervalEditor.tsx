import React, { useState } from 'react';

export interface IntervalBlock {
  id: string;
  name: string;
  intervals: Array<{
    name: string;
    duration: number;
    type: 'work' | 'rest' | 'prep';
  }>;
  rounds: number;
}

interface AdvancedIntervalEditorProps {
  blocks: IntervalBlock[];
  onChange: (blocks: IntervalBlock[]) => void;
}

const PRESET_BLOCKS: IntervalBlock[] = [
  {
    id: 'tabata',
    name: 'Tabata',
    intervals: [
      { name: 'Work', duration: 20, type: 'work' },
      { name: 'Rest', duration: 10, type: 'rest' }
    ],
    rounds: 8
  },
  {
    id: 'hiit',
    name: 'HIIT',
    intervals: [
      { name: 'Sprint', duration: 30, type: 'work' },
      { name: 'Recovery', duration: 30, type: 'rest' }
    ],
    rounds: 10
  },
  {
    id: 'warmup',
    name: 'Warm Up',
    intervals: [
      { name: 'Easy', duration: 60, type: 'prep' },
      { name: 'Moderate', duration: 30, type: 'work' },
      { name: 'Rest', duration: 30, type: 'rest' }
    ],
    rounds: 3
  }
];

export function AdvancedIntervalEditor({ blocks, onChange }: AdvancedIntervalEditorProps) {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  const addBlock = () => {
    const newBlock: IntervalBlock = {
      id: Date.now().toString(),
      name: `Block ${blocks.length + 1}`,
      intervals: [
        { name: 'Work', duration: 30, type: 'work' },
        { name: 'Rest', duration: 15, type: 'rest' }
      ],
      rounds: 3
    };
    onChange([...blocks, newBlock]);
    setExpandedBlock(newBlock.id);
  };

  const addPresetBlock = (preset: IntervalBlock) => {
    const newBlock = {
      ...preset,
      id: Date.now().toString(),
      name: `${preset.name} ${blocks.filter(b => b.name.startsWith(preset.name)).length + 1}`
    };
    onChange([...blocks, newBlock]);
    setExpandedBlock(newBlock.id);
  };

  const updateBlock = (blockId: string, updates: Partial<IntervalBlock>) => {
    onChange(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (blockId: string) => {
    onChange(blocks.filter(block => block.id !== blockId));
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) {
      return;
    }
    
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const addInterval = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    updateBlock(blockId, {
      intervals: [...block.intervals, { name: 'Work', duration: 30, type: 'work' as const }]
    });
  };

  const updateInterval = (blockId: string, intervalIndex: number, field: string, value: any) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    const newIntervals = [...block.intervals];
    newIntervals[intervalIndex] = { ...newIntervals[intervalIndex], [field]: value };
    updateBlock(blockId, { intervals: newIntervals });
  };

  const deleteInterval = (blockId: string, intervalIndex: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.intervals.length <= 1) return;
    
    updateBlock(blockId, {
      intervals: block.intervals.filter((_, i) => i !== intervalIndex)
    });
  };

  const getTotalDuration = (block: IntervalBlock) => {
    const intervalDuration = block.intervals.reduce((sum, interval) => sum + interval.duration, 0);
    return intervalDuration * block.rounds;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes === 0) return `${secs}s`;
    if (secs === 0) return `${minutes}min`;
    return `${minutes}min ${secs}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-300">Interval Blocks</label>
        <div className="text-xs text-gray-400">
          Total: {formatDuration(blocks.reduce((sum, block) => sum + getTotalDuration(block), 0))}
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {PRESET_BLOCKS.map(preset => (
          <button
            key={preset.id}
            onClick={() => addPresetBlock(preset)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <div className="font-semibold">{preset.name}</div>
            <div className="text-gray-400 text-[10px] sm:text-xs">
              {preset.rounds}x ({preset.intervals.map(i => `${i.duration}s`).join('/')})
            </div>
          </button>
        ))}
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        {blocks.map((block, blockIndex) => (
          <div key={block.id} className="bg-gray-700 rounded-xl shadow-md">
            {/* Block Header */}
            <div 
              className="p-3 cursor-pointer hover:bg-gray-650 transition-colors rounded-t-xl"
              onClick={() => setExpandedBlock(expandedBlock === block.id ? null : block.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg 
                    className={`w-4 h-4 transition-transform ${
                      expandedBlock === block.id ? 'rotate-90' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <input
                    type="text"
                    value={block.name}
                    onChange={(e) => updateBlock(block.id, { name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent font-medium text-xs sm:text-sm outline-none focus:bg-gray-600 px-1 rounded max-w-[100px] sm:max-w-none"
                  />
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {block.rounds}R • {formatDuration(getTotalDuration(block))}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Move buttons */}
                  {blockIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(block.id, 'up');
                      }}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  )}
                  {blockIndex < blocks.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveBlock(block.id, 'down');
                      }}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlock(block.id);
                    }}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Block Details (Expanded) */}
            {expandedBlock === block.id && (
              <div className="p-3 pt-0 border-t border-gray-600">
                {/* Rounds Control */}
                <div className="mb-3">
                  <label className="text-xs text-gray-400 block mb-1">Rounds</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateBlock(block.id, { rounds: Math.max(1, block.rounds - 1) })}
                      className="p-1 px-2 hover:bg-gray-600 rounded shadow-sm active:scale-95"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={block.rounds}
                      onChange={(e) => updateBlock(block.id, { rounds: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-16 text-center bg-gray-800 rounded px-2 py-1 text-sm"
                      min="1"
                    />
                    <button
                      onClick={() => updateBlock(block.id, { rounds: block.rounds + 1 })}
                      className="p-1 px-2 hover:bg-gray-600 rounded shadow-sm active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Intervals */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Intervals</label>
                  {block.intervals.map((interval, intervalIndex) => (
                    <div key={intervalIndex} className="bg-gray-800 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={interval.name}
                          onChange={(e) => updateInterval(block.id, intervalIndex, 'name', e.target.value)}
                          className="bg-gray-900 px-2 py-1 rounded text-xs flex-1"
                        />
                        <select
                          value={interval.type}
                          onChange={(e) => updateInterval(block.id, intervalIndex, 'type', e.target.value)}
                          className="bg-gray-900 px-2 py-1 rounded text-xs"
                        >
                          <option value="work">Work</option>
                          <option value="rest">Rest</option>
                          <option value="prep">Prep</option>
                        </select>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateInterval(block.id, intervalIndex, 'duration', Math.max(1, interval.duration - 5))}
                            className="p-1 text-xs hover:bg-gray-700 rounded"
                          >
                            -5
                          </button>
                          <input
                            type="number"
                            value={interval.duration}
                            onChange={(e) => updateInterval(block.id, intervalIndex, 'duration', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 text-center bg-gray-900 rounded px-1 py-1 text-xs"
                            min="1"
                          />
                          <span className="text-xs text-gray-400">s</span>
                          <button
                            onClick={() => updateInterval(block.id, intervalIndex, 'duration', interval.duration + 5)}
                            className="p-1 text-xs hover:bg-gray-700 rounded"
                          >
                            +5
                          </button>
                        </div>
                        {block.intervals.length > 1 && (
                          <button
                            onClick={() => deleteInterval(block.id, intervalIndex)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addInterval(block.id)}
                    className="w-full p-1 bg-gray-800 hover:bg-gray-700 rounded text-xs font-medium"
                  >
                    + Add Interval
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Block Button */}
      <button
        onClick={addBlock}
        className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
      >
        + Add Custom Block
      </button>
    </div>
  );
}