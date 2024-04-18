import React, { createContext, useContext, useEffect, useState } from 'react';
import useRoomManager from './useRoomManager';

const RoomManagerContext = createContext();

export const RoomManagerProvider = ({ children }) => {
  const roomManager = useRoomManager();

  return (
    <RoomManagerContext.Provider value={roomManager}>
      {children}
    </RoomManagerContext.Provider>
  );
};

export const useRoomManagerContext = () => useContext(RoomManagerContext);
