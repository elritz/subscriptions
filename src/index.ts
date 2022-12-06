import server from "./server/index";

console.log("PID", process.pid);
console.log("PROFILING", process.env.PORT);

export default server;
