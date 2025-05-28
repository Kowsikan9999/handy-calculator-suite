
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface CalculatorHistoryProps {
  history: HistoryEntry[];
  onBack: () => void;
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({
  history,
  onBack,
  onSelect,
  onClear
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card className="bg-black/90 backdrop-blur-lg border-gray-800 p-6 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-orange-500 hover:bg-orange-500/20 rounded-xl p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-white font-bold text-lg">History</h1>
          </div>
          {history.length > 0 && (
            <Button
              onClick={onClear}
              variant="ghost"
              className="text-red-500 hover:bg-red-500/20 rounded-xl p-2"
            >
              <Trash2 size={20} />
            </Button>
          )}
        </div>

        {/* History List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No calculations yet
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="bg-gray-900/50 rounded-xl p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-gray-300 text-sm mb-1">
                      {entry.expression}
                    </div>
                    <div className="text-white text-lg font-medium">
                      = {entry.result}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {formatTime(entry.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default CalculatorHistory;
