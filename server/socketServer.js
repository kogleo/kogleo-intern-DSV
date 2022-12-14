let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item => 
        item.id === id ? {...item, call} : item
    )
    return newData;
}

const SocketServer = (socket) => {
    console.log('connect socket')
    // Connect - Disconnect

    socket.on('joinUser', user => {
        console.log("users", users)
        users.push({id: user._id, socketId: socket.id, followers: user.followers, username: user.username})
    })

    socket.on('disconnect', () => {
        const data = users.find(user => user.socketId === socket.id)
        if(data){
            const clients = users.filter(user => 
                data.followers.find(item => item._id === user.id)
            )

            if(clients.length > 0){
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
                })
            }

            if(data.call){
                const callUser = users.find(user => user.id === data.call)
                if(callUser){
                    users = EditData(users, callUser.id, null)
                    socket.to(`${callUser.socketId}`).emit('callerDisconnect')
                }
            }
        }

        users = users.filter(user => user.socketId !== socket.id)
    })


    // Likes
    socket.on('favouriteArticle', newArticle => {
        const ids = [...newArticle.author.followers, newArticle.author._id]
        const clients = users.filter(user => ids.includes(user.id))
        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('favouriteToClient', newArticle)
            })
        }
    })

    socket.on('unfavouriteArticle', newArticle => {
        const ids = [...newArticle.author.followers, newArticle.author._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unfavouriteToClient', newArticle)
            })
        }
    })


    // Comments
    socket.on('createComment', newArticle => {
        const ids = [...newArticle.author.followers, newArticle.author._id]
        const clients = users.filter(user => ids.includes(user.id))
        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newArticle)
            })
        }
    })

    socket.on('deleteComment', newArticle => {
        const ids = [...newArticle.author.followers, newArticle.author._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newArticle)
            })
        }
    })


    // Follow
    socket.on('follow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    socket.on('unFollow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })


    // Notification
    socket.on('createNotify', msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id))
        if(clients){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
            })  
        }
    })

    socket.on('removeNotify', msg => {
        const clients = users.filter(user => msg.recipients.includes(user.id))
        if(clients){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)
            }) 
            
        }
        

    })


    // Message
    // socket.on('addMessage', msg => {
    //     const user = users.find(user => user.id === msg.recipient)
    //     user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    // })


    // Check User Online / Offline
    // socket.on('checkUserOnline', data => {
    //     const following = users.filter(user => 
    //         data.following.find(item => item._id === user.id)
    //     )
    //     socket.emit('checkUserOnlineToMe', following)

    //     const clients = users.filter(user => 
    //         data.followers.find(item => item._id === user.id)
    //     )

    //     if(clients.length > 0){
    //         clients.forEach(client => {
    //             socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
    //         })
    //     }

    // })


    // Call User
    // socket.on('callUser', data => {
    //     users = EditData(users, data.sender, data.recipient)
        
    //     const client = users.find(user => user.id === data.recipient)

    //     if(client){
    //         if(client.call){
    //             socket.emit('userBusy', data)
    //             users = EditData(users, data.sender, null)
    //         }else{
    //             users = EditData(users, data.recipient, data.sender)
    //             socket.to(`${client.socketId}`).emit('callUserToClient', data)
    //         }
    //     }
    // })

    // socket.on('endCall', data => {
    //     const client = users.find(user => user.id === data.sender)

    //     if(client){
    //         socket.to(`${client.socketId}`).emit('endCallToClient', data)
    //         users = EditData(users, client.id, null)

    //         if(client.call){
    //             const clientCall = users.find(user => user.id === client.call)
    //             clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

    //             users = EditData(users, client.call, null)
    //         }
    //     }
    // })
}

module.exports = SocketServer