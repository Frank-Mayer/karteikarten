export class Vector {
  constructor(public readonly x: number, public readonly y: number) {}

  public add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }
  public sub(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }
  public mul(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }
  public div(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar);
  }
  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  public distanceTo(other: Vector): number {
    return other.sub(this).length();
  }
  public normalize(): Vector {
    return this.div(this.length());
  }
  public dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }
  public cross(other: Vector): number {
    return this.x * other.y - this.y * other.x;
  }
  public angle(): number {
    return Math.atan2(this.y, this.x);
  }
  public rotate(angle: number): Vector {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Vector(this.x * c - this.y * s, this.x * s + this.y * c);
  }
  public lerp(other: Vector, t: number): Vector {
    return this.add(other.sub(this).mul(t));
  }
  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
