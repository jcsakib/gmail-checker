import net from 'net';

export async function checkEmail(email) {
  return new Promise((resolve) => {
    const domain = "gmail-smtp-in.l.google.com";
    const port = 25;
    const sender = "test@example.com";
    let result = "Unknown";
    let stage = 0;

    const socket = net.createConnection(port, domain, () => {
      socket.write(`HELO gmail.com\r\n`);
    });

    socket.setEncoding("ascii");
    socket.setTimeout(7000);

    socket.on("data", (data) => {
      if (stage === 0) {
        socket.write(`MAIL FROM:<${sender}>\r\n`);
        stage++;
      } else if (stage === 1) {
        socket.write(`RCPT TO:<${email}>\r\n`);
        stage++;
      } else if (stage === 2) {
        if (data.includes("550")) result = "❌ Invalid or Disabled Gmail";
        else if (data.includes("250")) result = "✅ Valid Gmail";
        else if (data.includes("421")) result = "🔒 Suspended Gmail";
        socket.end();
      }
    });

    socket.on("timeout", () => {
      result = "⚠️ Timeout";
      socket.destroy();
    });

    socket.on("error", () => {
      result = "⛔ Error";
    });

    socket.on("end", () => {
      resolve(result);
    });
  });
}
