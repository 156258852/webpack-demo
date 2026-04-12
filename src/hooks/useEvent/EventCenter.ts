type EventNameType = string | number;

interface EventOptions {
  /** 事件名 */
  name: EventNameType;
  /** 处理函数 */
  handler: (data: any) => void;
  /** 执行次数 */
  exeCount?: number;
}

const allEvent: { [name: string]: EventOptions[] } = {};

function once(options: EventOptions): void {
  addEvent({ ...options, exeCount: 1 });
}

function on(options: EventOptions): void {
  addEvent({ ...options, exeCount: -1 });
}

function addEvent(options: EventOptions): void {
  const { name, handler, exeCount } = options;
  allEvent[name] = allEvent[name] || [];
  const events = allEvent[name];

  for (const event of events) {
    if (event.handler === handler) return;
  }

  events.push({ name, handler, exeCount });
}

function off<T extends (data: any) => void>(name: EventNameType, handler: T): void {
  const events = allEvent[name];
  if (!events) return;

  for (let i = 0; i < events.length; i++) {
    const t = events[i];
    if (t.handler === handler) {
      events.splice(i, 1);
      break;
    }
  }
}

function dispatch(name: EventNameType, data: any = null): void {
  const events = allEvent[name] || [];

  for (const event of events) {
    const { handler } = event;
    handler && handler(data);
  }

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const { exeCount } = e;
    if (exeCount === 1) {
      events.splice(i, 1);
      i--;
    }
  }
}

export {
  on,
  once,
  off,
  dispatch,
};

export type { EventNameType };
