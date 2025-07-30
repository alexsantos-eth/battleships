export interface MultiplayerMenuProps {
  onRoomCreated?: (roomId: string) => void;
  onRoomJoined?: (roomId: string) => void;
}
