import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';
import { ConfirmationDialog as ConfirmationDialogType } from '../types';

interface ConfirmationDialogProps {
  dialog: ConfirmationDialogType;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ dialog }) => {
  if (!dialog.isOpen) return null;

  const getVariantStyles = () => {
    switch (dialog.variant) {
      case 'danger':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-400',
          bgColor: 'bg-red-500/10 border-red-500/20',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          cancelBg: 'bg-primary-700 hover:bg-primary-600'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10 border-yellow-500/20',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          cancelBg: 'bg-primary-700 hover:bg-primary-600'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/20',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          cancelBg: 'bg-primary-700 hover:bg-primary-600'
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/20',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          cancelBg: 'bg-primary-700 hover:bg-primary-600'
        };
    }
  };

  const styles = getVariantStyles();
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <motion.div
          className="bg-primary-900 border border-primary-700 rounded-lg max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="p-6 border-b border-primary-700">
            <div className="flex items-center">
              <div className={`p-3 rounded-full border ${styles.bgColor} mr-4`}>
                <Icon className={`h-6 w-6 ${styles.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{dialog.title}</h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-primary-200">{dialog.message}</p>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-primary-700">
            <div className="flex space-x-3 justify-end">
              <motion.button
                onClick={dialog.onCancel}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${styles.cancelBg}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {dialog.cancelText}
              </motion.button>
              <motion.button
                onClick={dialog.onConfirm}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${styles.confirmBg}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {dialog.confirmText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
