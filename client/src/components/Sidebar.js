// ============================================================
// Sidebar.js — Panneau latéral avec la liste des utilisateurs
// ============================================================

import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

function Sidebar({ users, room, show, onClose }) {
    const socket = useSocket();
    const [activityLog, setActivityLog] = useState([]);

    // Écouter l'événement activity_log du serveur
    useEffect(() => {
        const handleActivityLog = (event) => {
            setActivityLog((prev) => {
                const updated = [event, ...prev]; // nouveau en premier
                return updated.slice(0, 5);       // garde seulement les 5 derniers
            });
        };

        socket.on("activity_log", handleActivityLog);

        return () => {
            socket.off("activity_log", handleActivityLog);
        };
    }, [socket]);

    return (
        <>
            {show && <div className="sidebarOverlay" onClick={onClose} />}

            <div className={`sidebar ${show ? "open" : ""}`}>
                <div className="sidebarHeader">
                    <h4>#{room}</h4>
                    <button className="closeSidebar" onClick={onClose}>✕</button>
                </div>

                {/* Liste des participants */}
                <div className="sidebarSection">
                    <p className="sidebarLabel">
                        PARTICIPANTS ({users.length})
                    </p>

                    {users.length > 0 ? (
                        users.map((u) => (
                            <div className="userItem" key={u.socketId}>
                                <div className="userAvatar">
                                    {u.username.charAt(0).toUpperCase()}
                                </div>
                                <span>{u.username}</span>
                                <span className="onlineDot" />
                            </div>
                        ))
                    ) : (
                        <p className="noUsers">Aucun utilisateur</p>
                    )}
                </div>

                {/* Historique d'activité */}
                <div className="sidebarSection">
                    <p className="sidebarLabel">ACTIVITÉ RÉCENTE</p>

                    {activityLog.length > 0 ? (
                        activityLog.map((event, index) => (
                            <div className="activityItem" key={index}>
                                <span>
                                    {event.username} {event.action} #{event.room} à {event.time}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="noUsers">Aucune activité récente</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;