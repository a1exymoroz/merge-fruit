// Type declarations for matter-js
declare module 'matter-js' {
  export interface IBody {
    id: number
    position: { x: number; y: number }
    angle: number
    velocity?: { x: number; y: number }
  }

  export interface IEngine {
    world: IWorld
  }

  export interface IWorld {
    bodies: IBody[]
    gravity?: { x: number; y: number }
  }

  export class Engine implements IEngine {
    world: IWorld
    static create(): Engine
    static clear(engine: Engine): void
  }

  export class World implements IWorld {
    bodies: IBody[]
    static add(world: IWorld, bodies: IBody | IBody[]): void
    static remove(world: IWorld, bodies: IBody | IBody[]): void
  }

  export class Bodies {
    static circle(x: number, y: number, radius: number, options?: any): IBody
    static rectangle(x: number, y: number, width: number, height: number, options?: any): IBody
  }

  export class Runner {
    static create(): Runner
    static run(runner: Runner, engine: Engine): Runner
    static stop(runner: Runner): void
  }

  export class Events {
    static on(engine: Engine, event: string, callback: (event: any) => void): void
  }

  // Alias for convenience
  export type Body = IBody
}
