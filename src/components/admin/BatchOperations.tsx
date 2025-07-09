
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Archive, Edit, CheckSquare, Square } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface BatchOperationsProps {
  items: any[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBatchAction: (action: string, itemIds: string[]) => Promise<void>;
  availableActions: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    requiresConfirmation?: boolean;
  }>;
}

const BatchOperations: React.FC<BatchOperationsProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onBatchAction,
  availableActions
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  };

  const handleBatchAction = async (actionId: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to perform this action.",
        variant: "destructive",
      });
      return;
    }

    const action = availableActions.find(a => a.id === actionId);
    if (!action) return;

    if (action.requiresConfirmation) {
      setConfirmAction(actionId);
      return;
    }

    await executeBatchAction(actionId);
  };

  const executeBatchAction = async (actionId: string) => {
    setIsProcessing(true);
    try {
      await onBatchAction(actionId, selectedItems);
      
      const action = availableActions.find(a => a.id === actionId);
      toast({
        title: "Batch Operation Complete",
        description: `Successfully applied "${action?.label}" to ${selectedItems.length} items.`,
      });
      
      onSelectionChange([]);
    } catch (error) {
      console.error('Batch operation error:', error);
      toast({
        title: "Operation Failed",
        description: "Failed to complete batch operation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const selectedCount = selectedItems.length;
  const totalCount = items.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                className="border-gray-600"
              />
              {isPartiallySelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-electric-cyan rounded-sm" />
                </div>
              )}
            </div>
            <span className="text-sm text-gray-300">
              Select All ({totalCount} items)
            </span>
          </div>
          
          {selectedCount > 0 && (
            <Badge variant="secondary" className="bg-electric-cyan text-dark">
              {selectedCount} selected
            </Badge>
          )}
        </div>

        {/* Batch Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            {availableActions.map(action => (
              <Button
                key={action.id}
                size="sm"
                variant={action.variant || 'outline'}
                onClick={() => handleBatchAction(action.id)}
                disabled={isProcessing}
                className={
                  action.variant === 'destructive' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                }
              >
                {isProcessing ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <span className="mr-2">{action.icon}</span>
                )}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Action</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to apply "{availableActions.find(a => a.id === confirmAction)?.label}" 
              to {selectedCount} selected items? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => executeBatchAction(confirmAction)}
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchOperations;
