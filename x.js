

// pages/api/socket.ts
import { PORT } from "@/config/app"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiRequest, NextApiResponse } from "next"
import type { Server as IOServer } from "socket.io"
import { Server } from "socket.io"

export const config = {
    api: {
        bodyParser: false,
    },
}

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
    server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}
export default function SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (res.socket.server.io) {
        res.status(200).json({ success: true, message: "Socket is already running", socket: `:${PORT + 1}` })
        return
    }

    console.log("Starting Socket.IO server on port:", PORT + 1)
    //@ts-expect-error
    const io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } }).listen(PORT + 1)

    io.on("connect", socket => {
        const _socket = socket
        console.log("socket connect", socket.id)
        _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`)
        socket.on("disconnect", async () => {
            console.log("socket disconnect")
        })
    })

    res.socket.server.io = io
    res.status(201).json({ success: true, message: "Socket is started", socket: `:${PORT + 1}` })
}

导入 "@/config/app" 文件中的 PORT 变量。
导入类型 `NextApiRequest` 和 `NextApiResponse` 来自 "next" 库。
导入类型 `Server` 和 `IOServer` 来自 `socket.io`。
api：{
    bodyParser：false、
}，
// pages/api/socket.ts   页面/api/socket.ts
import 进口 { PORT   港口 } from   从 "@/config/app"   “@/ config /应用程序”
import 进口 type { Server   服务器 as HTTPServer } from   从 "http"
import 进口 type { Socket   套接字 as NetSocket   网络套接字 } from   从 "net"
import 进口 type { NextApiRequest, NextApiResponse   下一个ApiResponse } from   从 "next"   “下一个”
import 进口 type { Server   服务器 as IOServer } from   从 "socket.io"
import 进口 { Server   服务器 } from   从 "socket.io"

export   出口 const 常量 config = {
    api   火灾: {
        bodyParser: false   假,
    },
}

interface 接口 SocketServer   套接字服务器 extends   扩展 HTTPServer {
    io ?: IOServer | undefined   未定义的
}

interface 接口 SocketWithIO   套接字与IO extends   扩展 NetSocket   网络套接字 {
  server   服务器: SocketServer   套接字服务器
}

interface 接口 NextApiResponseWithSocket
下一个API响应与套接字
 extends   扩展 NextApiResponse   下一个ApiResponse {
  socket   套接字: SocketWithIO   套接字与IO
}
export   出口 default   默认的 function 函数 SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket
    `_req：下一个API请求，`res：带有套接字的下一个API响应
) {
    if   如果(res.socket   套接字.server   服务器.io   我) {
        res.status   状态(200).json({
            success   成功: true   真正的, message   消息: "Socket is already running"
“Socket已经在运行了。”
, socket   套接字: `:${PORT + 1}`   ”: ${ 端口1 }' })
    return 返回
    }

  console   控制台.log   日志("Starting Socket.IO server on port:"
“在端口上启动Socket.IO服务器：”
, PORT   港口 + 1)
    //@ts-expect-error
    const 常量 io = new 新 Server   服务器({ path   路径: "/api/socket"   “/ api / 套接字”, addTrailingSlash: false   假, cors: { origin: "*" }
}).listen(PORT + 1)

io.on   在("connect"   “连接”, socket => 套接字 = > {
    const   常量 _socket = socket
    console   控制台.log   日志("socket connect"   “套接字连接”, socket.id)
_socket.broadcast   广播.emit   发出("welcome"   “欢迎”, `Welcome ${_socket.id}`   “欢迎 ${ _socket.id }”)
socket.on   在("disconnect"   “断开”, async   异步() => {
    console   控制台.log   日志("socket disconnect"   “插座断开”)
})
  })

res.socket   套接字.server   服务器.io   我 = io
res.status   状态(201).json({ success   成功: true   真正的, message   消息: "Socket is started"   "Socket已启动", socket   套接字: `:${PORT + 1}` })
}
You can skip the path in config, but addTrailingSlash: false, cors: { origin: "*" } } is needed.There is some bug in Next.js 13 that causes WebSocket not to work, which is why we are creating a separate socket server using listen(PORT + 1).You can use any PORT here.
你可以跳过config中的 path ，但 addTrailingSlash: false, cors: { origin: "*" } } 是必需的。Next.js 13中有一个bug导致WebSocket无法正常工作，因此我们使用 listen(PORT + 1) 创建了一个独立的socket服务器。您可以在此处使用任意端口。

2. Create a Socket.IO Client Instance
2. 创建一个 Socket.IO 客户端实例
In your Next.js component, you can create a Socket.IO client instance like this:
在您的 Next.js 组件中，可以像这样创建一个 Socket.IO 客户端实例：

mport { 
导入来自 "@/config/app" 文件的 "PORT" 变量。
PORT   港口
} from   从 "@/config/app"   “@/ config /应用程序”
import 进口 { Socket   套接字, io } from   从 "socket.io-client"   “socket.io - client”

export   出口 default   默认的 function 函数 socketClient   socket客户端() {
    const 常量 socket = io   我(`:${PORT + 1}`   ”:${ 端口1 } ', { path   路径: "/api/socket"   “/api/套接字”, addTrailingSlash: false   假 })

    socket.on   在("connect"   “连接”, () => {
    console   控制台.log   日志("Connected"   “连接”)
    })

    socket.on   在("disconnect"   “断开”, () => {
    console   控制台.log   日志("Disconnected"   “断开”)
    })

    socket.on   在("connect_error"   “connect_error”, async   异步 err => {
    console   控制台.log   日志(`connect_error due to ${err.message}`
由于${ err.message }错误导致连接失败。
        )
        await 等待 fetch   获取("/api/socket"   “/api/套接字”)
    })

    return 返回 socket
}
At first, we have to start the socket server by calling the / api / socket API.You can call this API manually before starting to use the socket client.We are using a trick here: the first time the socket will not connect because the socket server is not running.This will fire a connection_error event.Then, we will call the /api/socket API in this event.Afterward, the socket client will automatically retry and connect successfully.
    首先，我们需要通过调用 / api / socket  API启动Socket服务器。在开始使用Socket客户端之前，您可以手动调用此API。在这里，我们使用了一个技巧：第一次尝试连接Socket时不会成功，因为Socket服务器尚未启动。这将触发 connection_error 事件。然后，我们在该事件中调用 / api / socket  API。之后，Socket客户端将自动重试并成功连接。

Conclusion 结论
Setting up a Socket.IO server in a Next.js application opens up the possibility of adding real - time features to your web application, such as chat, notifications, and live updates.By following the steps outlined in this article, you’ll have a solid foundation for building interactive and engaging real - time applications.From here, you can expand and customize your Socket.IO - based features to meet your application’s specific requirements.Happy coding!
在Next.js应用程序中搭建Socket.IO服务器，为向您的Web应用程序添加实时功能（如聊天、通知和实时更新）打开了可能性。通过遵循本文中列出的步骤，您将拥有构建交互式和引人入胜的实时应用程序的坚实基础。从这里，您可以扩展和自定义基于Socket.IO的功能以满足应用程序的特定需求。开心编码吧！

Thanks for reading!! 谢谢阅读！
If you have any questions or suggestions regarding this article, feel free to comment down below.
    如果你对本文有任何疑问或建议，欢迎在下面发表评论。