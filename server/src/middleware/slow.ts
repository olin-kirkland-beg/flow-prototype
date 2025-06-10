const minimumWaitMillis = 200;
const randomWaitMillis = 400;

export default async function slow(req: any, res: any, next: any) {
    const waitMillis = minimumWaitMillis + Math.random() * randomWaitMillis;
    await new Promise((resolve) => setTimeout(resolve, waitMillis));
    next();
}
