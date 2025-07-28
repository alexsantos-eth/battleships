export interface DebugPanelProps {
  className?: string;
  onClose?: () => void;
}

export interface PanelStyles {
  position: 'fixed';
  background: string;
  color: string;
  padding: string;
  borderRadius: string;
  maxWidth: string;
  maxHeight: string;
  overflow: 'auto';
  zIndex: number;
  fontSize: string;
  boxShadow: string;
  border: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
} 