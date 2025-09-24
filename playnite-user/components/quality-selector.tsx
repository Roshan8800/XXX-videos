import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { DownloadQuality } from '../types/downloads';

interface QualitySelectorProps {
  visible: boolean;
  selectedQuality: DownloadQuality;
  onSelect: (quality: DownloadQuality) => void;
  onClose: () => void;
}

interface QualityOption {
  value: DownloadQuality;
  label: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

export const QualitySelector: React.FC<QualitySelectorProps> = ({
  visible,
  selectedQuality,
  onSelect,
  onClose,
}) => {
  const { colors } = useTheme();

  const qualityOptions: QualityOption[] = [
    {
      value: '4K',
      label: '4K Ultra HD',
      description: 'Best quality, largest file size',
      icon: '4k',
      recommended: false,
    },
    {
      value: 'HD',
      label: 'HD (1080p)',
      description: 'High quality, moderate file size',
      icon: 'hd',
      recommended: true,
    },
    {
      value: 'SD',
      label: 'SD (720p)',
      description: 'Standard quality, smaller file size',
      icon: 'sd',
      recommended: false,
    },
    {
      value: 'Audio Only',
      label: 'Audio Only',
      description: 'Audio only, smallest file size',
      icon: 'audiotrack',
      recommended: false,
    },
  ];

  const getQualityIcon = (quality: DownloadQuality): string => {
    const option = qualityOptions.find(opt => opt.value === quality);
    return option?.icon || 'help';
  };

  const getQualityDescription = (quality: DownloadQuality): string => {
    const option = qualityOptions.find(opt => opt.value === quality);
    return option?.description || '';
  };

  const renderQualityOption = (option: QualityOption) => {
    const isSelected = selectedQuality === option.value;

    return (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.qualityOption,
          isSelected && [styles.selectedQualityOption, { backgroundColor: colors.primaryContainer }],
        ]}
        onPress={() => onSelect(option.value)}
      >
        <View style={styles.qualityOptionContent}>
          <View style={styles.qualityOptionLeft}>
            <Icon
              name={option.icon as any}
              size={24}
              color={isSelected ? colors.onPrimaryContainer : colors.onSurfaceVariant}
            />
            <View style={styles.qualityOptionText}>
              <View style={styles.qualityOptionHeader}>
                <Typography
                  variant="bodyLarge"
                  color={isSelected ? 'onPrimaryContainer' : 'onSurface'}
                >
                  {option.label}
                </Typography>
                {option.recommended && (
                  <View style={[styles.recommendedBadge, { backgroundColor: colors.primary }]}>
                    <Typography variant="labelSmall" color="onPrimary">
                      Recommended
                    </Typography>
                  </View>
                )}
              </View>
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {option.description}
              </Typography>
            </View>
          </View>

          {isSelected && (
            <Icon
              name="check_circle"
              size={20}
              color={colors.onPrimaryContainer}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Card style={styles.modalCard}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Typography variant="titleLarge" color="onSurface">
                Download Quality
              </Typography>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {/* Current Selection Info */}
            <View style={styles.currentSelection}>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                Currently selected:
              </Typography>
              <View style={styles.currentSelectionDisplay}>
                <Icon
                  name={getQualityIcon(selectedQuality) as any}
                  size={20}
                  color={colors.primary}
                />
                <Typography variant="bodyLarge" color="onSurface">
                  {selectedQuality}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  {getQualityDescription(selectedQuality)}
                </Typography>
              </View>
            </View>

            {/* Quality Options */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.optionsList}>
              {qualityOptions.map(renderQualityOption)}
            </ScrollView>

            {/* Info Section */}
            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Icon name="info" size={16} color={colors.onSurfaceVariant} />
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Higher quality uses more storage space and data
                </Typography>
              </View>
              <View style={styles.infoItem}>
                <Icon name="wifi" size={16} color={colors.onSurfaceVariant} />
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Downloads will use cellular data if Wi-Fi is unavailable
                </Typography>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Typography variant="bodyLarge" color="onSurfaceVariant">
                  Cancel
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton, { backgroundColor: colors.primary }]}
                onPress={onClose}
              >
                <Typography variant="bodyLarge" color="onPrimary">
                  Apply
                </Typography>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalCard: {
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    padding: 4,
  },
  currentSelection: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  currentSelectionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(212, 17, 115, 0.1)',
    borderRadius: 8,
  },
  optionsList: {
    maxHeight: 300,
  },
  qualityOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectedQualityOption: {
    backgroundColor: 'rgba(212, 17, 115, 0.1)',
  },
  qualityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qualityOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  qualityOptionText: {
    marginLeft: 12,
    flex: 1,
  },
  qualityOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendedBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  infoSection: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  applyButton: {
    backgroundColor: '#d41173',
  },
});