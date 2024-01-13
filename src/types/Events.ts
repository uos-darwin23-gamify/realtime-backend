import { Socket } from "socket.io";

interface CustomEvents {
  'custom event 1': (callback: () => any) => void;
  test: () => void;
}

export interface Events extends Socket<CustomEvents> {}
