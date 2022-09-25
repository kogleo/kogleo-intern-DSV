export const GLOBALTYPES = {
    AUTH: "AUTH",
    ALERT: "ALERT",
    THEME: 'THEME',
    STATUS: 'STATUS',
    MODAL: 'MODAL',
    SOCKET: 'SOCKET',
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    CALL: 'CALL',
    PEER: 'PEER',
    SET_ISAUTH: 'SET_ISAUTH',
    OPEN_NOTI: 'OPEN_NOTI',
}

export const EditData = (data, id, post) => {
    
    const newData = data.map(item => 
        (item._id === id ? post : item)
    )
    return newData;
}

export const DeleteData = (data, id) => {
    const newData = data.filter(item => item._id !== id)
    return newData;
}