#!/bin/bash

# TCP 连接测试脚本

echo "🧪 测试 TCP 连接..."
echo ""

# 检查端口 9528 是否被监听
echo "1. 检查 TCP 端口 9528..."
if lsof -i :9528 > /dev/null 2>&1; then
    echo "   ✅ 端口 9528 已被监听"
    lsof -i :9528 | head -3
else
    echo "   ❌ 端口 9528 未被监听"
    echo "   💡 请先启动 PreviewMacApp"
    exit 1
fi

echo ""
echo "2. 测试 TCP 连接..."
echo "   使用 nc (netcat) 测试连接..."

# 测试 TCP 连接（发送一个简单的 ping 请求）
# TCP 协议格式：长度(4字节) + 类型(1字节) + 数据(JSON)
# 这里我们发送一个简单的测试消息

echo '{"type":"GET","path":"/ping","requestId":1,"requestType":"GENERAL"}' > /tmp/tcp_test.json
JSON_SIZE=$(wc -c < /tmp/tcp_test.json | tr -d ' ')
JSON_BYTES=$(cat /tmp/tcp_test.json)

# 构建 TCP 消息：长度(4字节) + 类型(1字节) + JSON数据
# 长度（大端序，4字节）
LEN_B1=$(( ($JSON_SIZE >> 24) & 0xFF ))
LEN_B2=$(( ($JSON_SIZE >> 16) & 0xFF ))
LEN_B3=$(( ($JSON_SIZE >> 8) & 0xFF ))
LEN_B4=$(( $JSON_SIZE & 0xFF ))

echo "   消息长度: $JSON_SIZE 字节"
echo "   发送测试请求..."

# 使用 Python 发送 TCP 消息（更可靠）
python3 << EOF
import socket
import struct
import json

try:
    # 连接 TCP 服务器
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(5)
    sock.connect(('localhost', 9528))
    print("   ✅ TCP 连接成功")
    
    # 构建请求
    request = {
        "type": "GET",
        "path": "/ping",
        "requestId": 1,
        "requestType": "GENERAL"
    }
    json_data = json.dumps(request).encode('utf-8')
    
    # 发送消息：长度(4字节) + 类型(1字节) + 数据
    message = struct.pack('>I', len(json_data))  # 长度（大端序）
    message += bytes([0])  # 类型：REQUEST(0)
    message += json_data
    
    sock.sendall(message)
    print("   ✅ 请求已发送")
    
    # 接收响应
    # 读取长度（4字节）
    length_bytes = sock.recv(4)
    if len(length_bytes) == 4:
        length = struct.unpack('>I', length_bytes)[0]
        print(f"   📥 响应长度: {length} 字节")
        
        # 读取类型（1字节）
        type_byte = sock.recv(1)
        if len(type_byte) == 1:
            msg_type = type_byte[0]
            print(f"   📥 消息类型: {msg_type} (1=RESPONSE)")
            
            # 读取数据
            data = sock.recv(length)
            if len(data) == length:
                response = json.loads(data.decode('utf-8'))
                print(f"   ✅ 收到响应: {response}")
            else:
                print(f"   ⚠️ 数据不完整: 期望 {length} 字节，收到 {len(data)} 字节")
        else:
            print("   ❌ 无法读取消息类型")
    else:
        print("   ❌ 无法读取响应长度")
    
    sock.close()
    print("   ✅ TCP 连接测试完成")
    
except socket.timeout:
    print("   ❌ 连接超时")
except ConnectionRefusedError:
    print("   ❌ 连接被拒绝（服务器未运行）")
except Exception as e:
    print(f"   ❌ 错误: {e}")
EOF

echo ""
echo "✅ 测试完成"

