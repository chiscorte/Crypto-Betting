import create from "zustand";

const useGameStore = create((set) => ({
  socket: undefined,
  setSocket: (val) => {
    set({ socket: val });
  },
  players: [],
  setPlayers: (val) => {
    set({ players: val });
  },
  socket: undefined,
  setSocket: (value) => {
    set({ socket: value });
  },
  myEmail: undefined,
  setMyEmail: (val) => {
    set({ myEmail: val });
  },
  user: undefined,
  setUser: (val) => {
    set({ user: val });
  },
  roomNumber: undefined,
  setRoomNumber: (val) => {
    set({ roomNumber: val });
  },
  chips: 0,
  setChips: (val) => {
    set({ chips: val });
  },
}));

export default useGameStore;
